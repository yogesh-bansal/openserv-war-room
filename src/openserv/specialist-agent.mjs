import { Agent } from "@openserv-labs/sdk";
import { z } from "zod";
import {
  runCommunications,
  runForensics,
  runPostmortem,
  runRunbook,
  runTriage
} from "../core/roles.mjs";

const baseScenarioSchema = z.object({
  protocol: z.string(),
  network: z.string(),
  incidentType: z.string(),
  summary: z.string(),
  reportedAt: z.string().optional(),
  userImpact: z.string(),
  fundsAtRiskUSD: z.number().nonnegative(),
  likelyRootCause: z.string(),
  symptoms: z.array(z.string()).default([]),
  detectionChannels: z.array(z.string()).default([]),
  affectedContracts: z.array(z.string()).default([]),
  stakeholders: z.array(z.string()).default([]),
  proposedActions: z.array(z.string()).default([])
});

const specialistConfig = {
  triage: {
    capability: "handle_triage",
    description: "Assess incident severity, blast radius, and immediate containment priorities.",
    prompt:
      "You are the Triage Agent in OpenServ War Room. Prioritize speed, claim discipline, and blast-radius assessment.",
    execute: (scenario) => runTriage(scenario)
  },
  forensics: {
    capability: "handle_forensics",
    description: "Build incident hypotheses, evidence gaps, and affected-contract analysis.",
    prompt:
      "You are the Forensics Agent in OpenServ War Room. Focus on hypotheses, evidence quality, and contract-level reasoning.",
    execute: (scenario) => runForensics(scenario)
  },
  communications: {
    capability: "handle_communications",
    description: "Draft structured communications for users, partners, and internal stakeholders.",
    prompt:
      "You are the Communications Agent in OpenServ War Room. Write concise, safe, confidence-calibrated updates.",
    execute: (scenario) => {
      const triage = runTriage(scenario);
      return runCommunications(scenario, triage);
    }
  },
  runbook: {
    capability: "handle_runbook",
    description: "Generate an explicit response runbook with owners, deadlines, and checklists.",
    prompt:
      "You are the Runbook Agent in OpenServ War Room. Convert ambiguity into owned action items.",
    execute: (scenario) => {
      const triage = runTriage(scenario);
      const forensics = runForensics(scenario);
      return runRunbook(scenario, triage, forensics);
    }
  },
  postmortem: {
    capability: "handle_postmortem",
    description: "Prepare a closure packet with timeline, root-cause candidates, and prevention work.",
    prompt:
      "You are the Postmortem Agent in OpenServ War Room. Capture facts early and separate evidence from assumption.",
    execute: (scenario) => {
      const triage = runTriage(scenario);
      const forensics = runForensics(scenario);
      const runbook = runRunbook(scenario, triage, forensics);
      return runPostmortem(scenario, triage, forensics, runbook);
    }
  }
};

export function createSpecialistAgent(role) {
  const config = specialistConfig[role];
  if (!config) {
    throw new Error(`Unsupported specialist role: ${role}`);
  }

  const agent = new Agent({
    systemPrompt: config.prompt,
    apiKey: process.env.OPENSERV_API_KEY
  });

  agent.addCapability({
    name: config.capability,
    description: config.description,
    inputSchema: baseScenarioSchema,
    async run({ args, action }) {
      const result = config.execute(args);

      if (action?.task && action?.workspace) {
        await this.addLogToTask({
          workspaceId: action.workspace.id,
          taskId: action.task.id,
          severity: "info",
          type: "text",
          body: `${role} workstream completed for ${args.protocol}.`
        });
      }

      return JSON.stringify(result, null, 2);
    }
  });

  return agent;
}
