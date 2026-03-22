import fs from "node:fs/promises";
import path from "node:path";
import {
  compactLines,
  formatBullets,
  makeIncidentId,
  money,
  nowIso,
  slugify
} from "./utils.mjs";
import {
  runCommunications,
  runForensics,
  runPostmortem,
  runRunbook,
  runTriage
} from "./roles.mjs";

export function runWarRoom(scenario) {
  const incidentId = makeIncidentId(scenario);
  const triage = runTriage(scenario);
  const forensics = runForensics(scenario);
  const communications = runCommunications(scenario, triage);
  const runbook = runRunbook(scenario, triage, forensics);
  const postmortem = runPostmortem(scenario, triage, forensics, runbook);

  const workstreams = [
    {
      role: "triage",
      status: "done",
      outcome: triage.summary
    },
    {
      role: "forensics",
      status: "done",
      outcome: forensics.summary
    },
    {
      role: "communications",
      status: "done",
      outcome: communications.summary
    },
    {
      role: "runbook",
      status: "done",
      outcome: runbook.summary
    },
    {
      role: "postmortem",
      status: "done",
      outcome: postmortem.summary
    }
  ];

  return {
    incidentId,
    createdAt: nowIso(),
    title: `${scenario.protocol} ${scenario.incidentType}`,
    protocol: scenario.protocol,
    network: scenario.network,
    summary: scenario.summary,
    severity: triage.severity,
    severityScore: triage.severityScore,
    fundsAtRiskUSD: scenario.fundsAtRiskUSD,
    workstreams,
    intake: scenario,
    triage,
    forensics,
    communications,
    runbook,
    postmortem
  };
}

export function renderBriefingMarkdown(report) {
  return compactLines([
    `# ${report.title}`,
    "",
    `- Incident ID: \`${report.incidentId}\``,
    `- Severity: **${report.severity.toUpperCase()}** (${report.severityScore}/12)`,
    `- Network: ${report.network}`,
    `- Funds at risk: ${money(report.fundsAtRiskUSD)}`,
    "",
    "## Situation",
    "",
    report.summary,
    "",
    "## Triage",
    "",
    report.triage.summary,
    "",
    "### Immediate Actions",
    "",
    formatBullets(report.triage.firstMoves),
    "",
    "## Forensics",
    "",
    `Primary hypothesis: ${report.forensics.hypotheses[0]}`,
    "",
    "### Evidence Gaps",
    "",
    formatBullets(report.forensics.evidenceGaps),
    "",
    "## Runbook",
    "",
    report.runbook.renderedChecklist,
    "",
    "## Operator Assignments",
    "",
    formatBullets(report.runbook.actions.map((item) => `${item.owner} by ${item.deadline}: ${item.task}`))
  ]);
}

export function renderStatusUpdateMarkdown(report) {
  return compactLines([
    `# ${report.protocol} Incident Update`,
    "",
    `Severity: **${report.severity.toUpperCase()}**`,
    "",
    "## Public Draft",
    "",
    report.communications.messages.public,
    "",
    "## Partner Draft",
    "",
    report.communications.messages.partners,
    "",
    "## Internal Update",
    "",
    report.communications.messages.internal,
    "",
    `Next update target: ${report.communications.nextUpdateEta}`
  ]);
}

export function renderPostmortemMarkdown(report) {
  return compactLines([
    `# Postmortem Draft — ${report.protocol}`,
    "",
    postmortemLead(report),
    "",
    "## Executive Summary",
    "",
    report.postmortem.executiveSummary,
    "",
    "## Timeline",
    "",
    report.postmortem.renderedTimeline,
    "",
    "## Root Cause Candidates",
    "",
    formatBullets(report.postmortem.rootCauseCandidates),
    "",
    "## Prevention Work",
    "",
    formatBullets(report.postmortem.prevention),
    "",
    "## Follow-Ups",
    "",
    formatBullets(report.postmortem.followUps)
  ]);
}

function postmortemLead(report) {
  return `Incident \`${report.incidentId}\` was tracked as a ${report.severity} ${report.intake.incidentType} affecting ${report.protocol} on ${report.network}.`;
}

export async function writeDemoArtifacts(report, directoryRoot) {
  const outputDir = path.join(directoryRoot, slugify(report.incidentId));
  await fs.mkdir(outputDir, { recursive: true });

  const reportJsonPath = path.join(outputDir, "report.json");
  const briefingPath = path.join(outputDir, "briefing.md");
  const updatePath = path.join(outputDir, "status-update.md");
  const postmortemPath = path.join(outputDir, "postmortem.md");

  await fs.writeFile(reportJsonPath, JSON.stringify(report, null, 2));
  await fs.writeFile(briefingPath, renderBriefingMarkdown(report));
  await fs.writeFile(updatePath, renderStatusUpdateMarkdown(report));
  await fs.writeFile(postmortemPath, renderPostmortemMarkdown(report));

  return {
    outputDir,
    files: [reportJsonPath, briefingPath, updatePath, postmortemPath]
  };
}
