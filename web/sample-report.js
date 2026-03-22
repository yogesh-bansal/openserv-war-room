window.sampleReport = {
  title: "Northstar Bridge signature validation exploit",
  severity: "CRITICAL",
  fundsAtRiskUSD: 2400000,
  summary:
    "Outbound transfers started failing after a verifier hotfix while suspicious withdrawals were flagged by monitoring.",
  workstreams: [
    {
      role: "Triage",
      status: "done",
      outcome: "Critical classification, bridge pause, and incident clock started."
    },
    {
      role: "Forensics",
      status: "done",
      outcome: "Verifier update isolated as the leading hypothesis with evidence gaps queued."
    },
    {
      role: "Communications",
      status: "done",
      outcome: "Public, partner, and internal drafts aligned to one canonical message."
    },
    {
      role: "Runbook",
      status: "done",
      outcome: "Containment, engineering, and leadership tasks assigned with deadlines."
    },
    {
      role: "Postmortem",
      status: "done",
      outcome: "Timeline and prevention work opened before facts go stale."
    }
  ],
  communications: {
    nextUpdateEta: "15 minutes",
    messages: {
      public:
        "We are investigating a critical incident affecting Northstar Bridge on Base. Withdrawals are paused while the team validates system integrity. Next update within 15 minutes.",
      partners:
        "Incident classification is CRITICAL. Please halt dependent automation until we confirm the signer path is safe.",
      internal:
        "Severity CRITICAL, funds at risk $2.4M, and one owner has been assigned for timeline, evidence, and external messaging."
    }
  },
  runbook: {
    actions: [
      {
        owner: "incident-commander",
        deadline: "immediate",
        task: "Pause withdrawals and freeze unrelated deploys."
      },
      {
        owner: "forensics",
        deadline: "15 minutes",
        task: "Diff verifier logic against last known safe release."
      },
      {
        owner: "forensics",
        deadline: "15 minutes",
        task: "Reconcile suspicious transfers and preserve traces."
      },
      {
        owner: "communications",
        deadline: "15 minutes",
        task: "Publish a user-safe incident update within 15 minutes."
      },
      {
        owner: "protocol-engineering",
        deadline: "30 minutes",
        task: "Validate rollback or patched restoration path."
      }
    ]
  },
  postmortem: {
    timeline: [
      "09:12 UTC: monitoring alert fired for validator mismatch.",
      "09:17 UTC: incident room opened and commander assigned.",
      "09:27 UTC: first public-safe draft prepared.",
      "09:41 UTC: verifier diff review started.",
      "10:05 UTC: rollback decision package prepared for leadership."
    ]
  }
};
