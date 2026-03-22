import { Agent } from "@openserv-labs/sdk";
import { z } from "zod";
import {
  renderBriefingMarkdown,
  renderPostmortemMarkdown,
  renderStatusUpdateMarkdown,
  runWarRoom
} from "../core/engine.mjs";

const scenarioSchema = z.object({
  protocol: z.string().describe("Protocol or product name"),
  network: z.string().describe("Affected network"),
  incidentType: z.string().describe("Type of incident"),
  summary: z.string().describe("Short description of what is happening"),
  reportedAt: z.string().optional().describe("Timestamp when the incident was reported"),
  userImpact: z.string().describe("Observed user-facing impact"),
  fundsAtRiskUSD: z.number().nonnegative().describe("Estimated funds at risk in USD"),
  likelyRootCause: z.string().describe("Best current root-cause hypothesis"),
  symptoms: z.array(z.string()).default([]).describe("Concrete signals or symptoms"),
  detectionChannels: z.array(z.string()).default([]).describe("Where the alert came from"),
  affectedContracts: z.array(z.string()).default([]).describe("Likely affected contracts or systems"),
  stakeholders: z.array(z.string()).default([]).describe("Groups that need updates"),
  proposedActions: z.array(z.string()).default([]).describe("Containment or recovery actions already proposed")
});

export function createCommanderAgent() {
  const agent = new Agent({
    systemPrompt:
      "You are OpenServ War Room, a protocol incident commander. Open a structured war room, coordinate specialist workstreams, keep claims disciplined, and produce operational artifacts teams can use immediately.",
    apiKey: process.env.OPENSERV_API_KEY
  });

  agent.addCapability({
    name: "open_war_room",
    description:
      "Open a new incident war room. Coordinates triage, forensics, communications, runbook, and postmortem work into a single incident packet.",
    inputSchema: scenarioSchema,
    async run({ args, action }) {
      const report = runWarRoom(args);
      const briefing = renderBriefingMarkdown(report);
      const statusUpdate = renderStatusUpdateMarkdown(report);
      const postmortem = renderPostmortemMarkdown(report);

      if (action?.task && action?.workspace) {
        await this.updateTaskStatus({
          workspaceId: action.workspace.id,
          taskId: action.task.id,
          status: "in-progress"
        });

        await this.addLogToTask({
          workspaceId: action.workspace.id,
          taskId: action.task.id,
          severity: "info",
          type: "text",
          body: `Opened incident ${report.incidentId} at severity ${report.severity.toUpperCase()}.`
        });

        await this.addLogToTask({
          workspaceId: action.workspace.id,
          taskId: action.task.id,
          severity: "info",
          type: "text",
          body: `Specialist workstreams completed: ${report.workstreams.map((item) => item.role).join(", ")}`
        });

        await this.uploadFile({
          workspaceId: action.workspace.id,
          path: `war-room/${report.incidentId}/briefing.md`,
          file: briefing,
          taskIds: [action.task.id]
        });

        await this.uploadFile({
          workspaceId: action.workspace.id,
          path: `war-room/${report.incidentId}/status-update.md`,
          file: statusUpdate,
          taskIds: [action.task.id]
        });

        await this.uploadFile({
          workspaceId: action.workspace.id,
          path: `war-room/${report.incidentId}/postmortem.md`,
          file: postmortem,
          taskIds: [action.task.id]
        });
      }

      return JSON.stringify(
        {
          incidentId: report.incidentId,
          severity: report.severity,
          title: report.title,
          workstreams: report.workstreams,
          nextUpdateEta: report.communications.nextUpdateEta
        },
        null,
        2
      );
    }
  });

  agent.addCapability({
    name: "draft_update",
    description: "Draft a clean stakeholder update for an active protocol incident.",
    inputSchema: z.object({
      protocol: z.string(),
      audience: z.enum(["public", "partners", "internal"]),
      severity: z.enum(["low", "medium", "high", "critical"]),
      userImpact: z.string(),
      nextUpdateEta: z.string()
    }),
    async run({ args }) {
      return [
        `${args.protocol} incident update for ${args.audience}:`,
        `Severity: ${args.severity.toUpperCase()}.`,
        `Current impact: ${args.userImpact}`,
        `Next update target: ${args.nextUpdateEta}.`
      ].join(" ");
    }
  });

  return agent;
}
