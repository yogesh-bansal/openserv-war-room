# Northstar Bridge signature validation exploit

- Incident ID: `wr-50b1139bff`
- Severity: **CRITICAL** (11/12)
- Network: Base
- Funds at risk: $2,400,000

## Situation

Outbound transfers started failing after a verifier hotfix, while two suspicious withdrawals were flagged by monitoring.

## Triage

Classified as CRITICAL based on user disruption, funds at risk, and the incident profile. First objective is containment before message expansion.

### Immediate Actions

- pause withdrawals
- verify signer set diff
- reconcile suspicious transactions
- freeze non-essential changes until containment is confirmed
- start evidence capture and preserve all relevant logs

## Forensics

Primary hypothesis: A verifier contract update appears to have accepted malformed signatures under a narrow edge case.

### Evidence Gaps

- confirm whether suspicious withdrawals settled or remained pending
- compare current signer quorum against the last known safe deployment
- verify whether any relayer retries bypassed expected pause conditions

## Runbook

- [ ] Contain user-facing risk
- [ ] Validate the signer and verifier state
- [ ] Publish a safe public update
- [ ] Prepare rollback or patch path
- [ ] Start postmortem evidence capture

## Operator Assignments

- incident-commander by immediate: declare incident channel, freeze unrelated deploys, confirm severity
- forensics by 15 minutes: diff verifier logic, reconcile suspicious transfers, preserve traces
- comms by 15 minutes: publish initial user-safe update and prepare partner briefing
- protocol-engineering by 30 minutes: validate rollback or patched pause path before restoration
- leadership by 30 minutes: decide whether to extend pause window and engage external responders
