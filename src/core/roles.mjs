import {
  dedupe,
  formatBullets,
  formatChecklist,
  money,
  scoreIncident,
  severityFromScore
} from "./utils.mjs";

export function runTriage(scenario) {
  const severityScore = scoreIncident(scenario);
  const severity = severityFromScore(severityScore);
  const firstMoves = dedupe([
    ...(scenario.proposedActions || []).slice(0, 3),
    "freeze non-essential changes until containment is confirmed",
    "start evidence capture and preserve all relevant logs"
  ]).slice(0, 5);

  return {
    agent: "triage",
    severity,
    severityScore,
    clock: severity === "critical" ? "minutes" : "under one hour",
    blastRadius: {
      userImpact: scenario.userImpact,
      fundsAtRiskUSD: scenario.fundsAtRiskUSD,
      affectedContracts: scenario.affectedContracts || []
    },
    firstMoves,
    summary: `Classified as ${severity.toUpperCase()} based on user disruption, funds at risk, and the incident profile. First objective is containment before message expansion.`
  };
}

export function runForensics(scenario) {
  const hypotheses = dedupe([
    scenario.likelyRootCause,
    "a recent contract or signer configuration change widened acceptance criteria unexpectedly",
    "monitoring may have captured a partial failure before a wider exploit path was exercised"
  ]).slice(0, 3);
  const leadHypothesis = hypotheses[0].replace(/[.]+$/g, "");

  const evidenceGaps = [
    "confirm whether suspicious withdrawals settled or remained pending",
    "compare current signer quorum against the last known safe deployment",
    "verify whether any relayer retries bypassed expected pause conditions"
  ];

  return {
    agent: "forensics",
    hypotheses,
    affectedContracts: scenario.affectedContracts || [],
    evidenceGaps,
    summary: `Initial forensic posture centers on ${leadHypothesis}. Contract-level review should prioritize signer validation and any rollback path.`
  };
}

export function runCommunications(scenario, triage) {
  const statusPhrase = triage.severity === "critical" ? "a critical incident" : "an active incident";
  const nextUpdateEta = triage.severity === "critical" ? "15 minutes" : "30 minutes";

  const publicUpdate = [
    `We are investigating ${statusPhrase} affecting ${scenario.protocol} on ${scenario.network}.`,
    `Current impact: ${scenario.userImpact}`,
    "As a precaution, affected flows have been paused while the team validates system integrity.",
    `Next update within ${nextUpdateEta}.`
  ].join(" ");

  const partnerUpdate = [
    `${scenario.protocol} incident classification: ${triage.severity.toUpperCase()}.`,
    `Affected contracts: ${(scenario.affectedContracts || []).join(", ") || "under review"}.`,
    "Please halt dependent automation until we confirm the signer path is safe."
  ].join(" ");

  const internalUpdate = [
    `Severity: ${triage.severity.toUpperCase()} (${triage.severityScore}/12)`,
    `Funds at risk: ${money(scenario.fundsAtRiskUSD)}`,
    "Comms discipline: one canonical timeline, one status owner, one evidence owner."
  ].join(" | ");

  return {
    agent: "communications",
    nextUpdateEta,
    messages: {
      public: publicUpdate,
      partners: partnerUpdate,
      internal: internalUpdate
    },
    summary: "Drafted three message layers so the team does not improvise under pressure."
  };
}

export function runRunbook(scenario, triage, forensics) {
  const actions = [
    {
      owner: "incident-commander",
      deadline: "immediate",
      task: "declare incident channel, freeze unrelated deploys, confirm severity"
    },
    {
      owner: "forensics",
      deadline: "15 minutes",
      task: "diff verifier logic, reconcile suspicious transfers, preserve traces"
    },
    {
      owner: "comms",
      deadline: "15 minutes",
      task: "publish initial user-safe update and prepare partner briefing"
    },
    {
      owner: "protocol-engineering",
      deadline: "30 minutes",
      task: "validate rollback or patched pause path before restoration"
    }
  ];

  if (triage.severity === "critical") {
    actions.push({
      owner: "leadership",
      deadline: "30 minutes",
      task: "decide whether to extend pause window and engage external responders"
    });
  }

  return {
    agent: "runbook",
    actions,
    operatorChecklist: [
      "confirm the exact incident start time",
      "capture transaction hashes and monitoring screenshots",
      "name one owner for every external message",
      "log every hypothesis separately from verified facts",
      `close evidence gaps: ${forensics.evidenceGaps[0]}`
    ],
    summary: "Converted the incident into owned work instead of an unstructured coordination thread.",
    renderedChecklist: formatChecklist([
      "Contain user-facing risk",
      "Validate the signer and verifier state",
      "Publish a safe public update",
      "Prepare rollback or patch path",
      "Start postmortem evidence capture"
    ])
  };
}

export function runPostmortem(scenario, triage, forensics, runbook) {
  const cleanUserImpact = scenario.userImpact.replace(/[.]+$/g, "");
  const prevention = [
    "add deployment diff checks for signer quorum changes",
    "require simulated malformed-signature tests before verifier upgrades",
    "create a pre-approved incident comms template for bridge pauses",
    "attach post-incident runbooks to the next production readiness review"
  ];

  const timeline = [
    `${scenario.reportedAt || "T0"} incident detected via ${scenario.detectionChannels?.[0] || "monitoring"}`,
    "T+05m containment discussion opened and on-call owners assigned",
    "T+15m first user-safe status update prepared",
    "T+30m signer and contract diff review underway",
    "T+60m restoration or longer pause decision prepared for leadership"
  ];

  return {
    agent: "postmortem",
    executiveSummary: `${scenario.protocol} experienced a ${triage.severity} ${scenario.incidentType}. User impact centered on ${cleanUserImpact.toLowerCase()}.`,
    timeline,
    rootCauseCandidates: forensics.hypotheses,
    prevention,
    followUps: runbook.actions.map((item) => `${item.owner}: ${item.task}`),
    summary: "Started the closure document early so the team captures facts while they are still fresh.",
    renderedTimeline: formatBullets(timeline)
  };
}
