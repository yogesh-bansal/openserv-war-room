# OpenServ War Room

**Multi-agent incident command for crypto protocols.**

OpenServ War Room turns protocol chaos into a coordinated response. When a sequencer outage, oracle drift, bridge exploit, or governance misconfiguration hits, the system opens a live incident room, assigns specialist agents, drafts stakeholder updates, and produces a postmortem package that teams can actually act on.

This is not another generic research assistant. It is an operations product: a multi-agent control surface for protocol incidents where coordination, message discipline, and execution speed matter more than one more summary paragraph.

## Track Alignment

### Primary: Ship Something Real with OpenServ

Track UUID: `9bd8b3fde4d0458698d618daf496d1c7`

Why it fits:

| Track requirement | How OpenServ War Room fits |
|---|---|
| Useful AI-powered product or service | It is a concrete incident-response product for protocols, DAOs, bridges, and DeFi teams |
| Meaningful multi-agent behavior | Commander, Triage, Forensics, Communications, Runbook, and Postmortem agents each own a specific workstream |
| Agents coordinate and perform useful work | The system converts one incident intake into assignments, updates, artifacts, and recovery plans |
| OpenServ is core infrastructure | The runtime is built around OpenServ custom agents, OpenServ local tunnel development, task logs, and workspace file uploads |
| OpenServ primitives are used meaningfully | Custom agents are first-class; workspace secrets and integrations are the intended path for production notifications and external actions |

### Secondary: Best OpenServ Build Story

Track UUID: `a73320342ae74465b8e71e5336442dc3`

Why it fits:

- The repo includes a full [`conversationLog.md`](./conversationLog.md) written as a clean build narrative.
- The project has a clear story arc: alert intake, role assignment, communications discipline, and postmortem closure.
- The architecture was intentionally designed around OpenServ's multi-agent model rather than wrapped after the fact.

### Secondary: Synthesis Open Track

Track UUID: `fdb76d08812b43f6a5f454744b66f590`

Why it fits:

- It is an agentic operations product with concrete utility.
- It demonstrates coordination, workflow generation, and practical AI service design.

## Problem

When a protocol incident starts, the first hour is usually lost to fragmentation:

- one person is investigating contracts
- another person is drafting a public message from scratch
- leadership wants severity and blast-radius estimates
- partners need a tailored explanation
- nobody is sure what is done, what is assumed, and what still needs verification

Most teams improvise in chat threads and scattered docs. The result is slow triage, inconsistent messaging, duplicated work, and weak postmortems.

## Solution

OpenServ War Room creates a structured incident room the moment an event is reported.

It assigns six specialist roles:

1. **Commander**: opens the room, sets severity, and stitches outputs into one operating picture.
2. **Triage Agent**: identifies the incident class, user impact, time sensitivity, and first containment actions.
3. **Forensics Agent**: builds a contract- and signal-aware hypothesis set.
4. **Communications Agent**: drafts audience-specific updates for users, partners, and internal stakeholders.
5. **Runbook Agent**: turns the situation into explicit actions, owners, and deadlines.
6. **Postmortem Agent**: prepares the closure package while the incident is still fresh.

The result is a working incident packet instead of an unstructured pile of notes.

## What Is Shipped

- A reusable incident workflow engine in [`src/core/engine.mjs`](./src/core/engine.mjs)
- Specialist role logic in [`src/core/roles.mjs`](./src/core/roles.mjs)
- A local no-secrets demo path in [`src/demo.mjs`](./src/demo.mjs)
- An OpenServ-native runtime in [`src/openserv/start.mjs`](./src/openserv/start.mjs)
- A deployable commander agent in [`src/openserv/commander-agent.mjs`](./src/openserv/commander-agent.mjs)
- Deployable specialist agents in [`src/openserv/specialist-agent.mjs`](./src/openserv/specialist-agent.mjs)
- Submission metadata template in [`submission.template.json`](./submission.template.json)
- Evaluator-facing build log in [`conversationLog.md`](./conversationLog.md)

## Architecture

```text
Incident intake
     |
     v
+----------------------+
| Commander Agent      |
| - opens war room     |
| - sets severity      |
| - coordinates roles  |
+----------+-----------+
           |
           +-------------------+-------------------+-------------------+-------------------+
           |                   |                   |                   |                   |
           v                   v                   v                   v                   v
+----------------+   +----------------+   +----------------+   +----------------+   +----------------+
| Triage Agent   |   | Forensics      |   | Communications |   | Runbook Agent  |   | Postmortem     |
| impact + clock |   | hypotheses     |   | stakeholder    |   | actions +      |   | closure pack   |
| containment    |   | contracts      |   | updates        |   | owners         |   |                |
+----------------+   +----------------+   +----------------+   +----------------+   +----------------+
           \___________________________ outputs merged by commander ___________________________/
                                                |
                                                v
                              briefings, task logs, uploads, status updates
```

## Why OpenServ Is Load-Bearing

This repo is built to map directly to OpenServ's custom agent runtime:

- `run(agent)` is the intended local development path.
- Each role can run as its own custom OpenServ agent.
- The commander uses OpenServ task logs to expose progress inside a workspace.
- Artifact upload paths map cleanly to workspace files.
- Secrets stay in OpenServ workspace secrets, not in code or prompts.
- Optional integrations such as Slack, Twitter/X, or Notion are meant to be invoked through OpenServ integrations rather than hardcoded API tokens.

Without OpenServ, this becomes a disconnected script. With OpenServ, it becomes a multi-agent operating product.

## Demo Scenario

The included scenario is a bridge incident on Base:

- protocol: `Northstar Bridge`
- incident type: `signature validation exploit`
- user impact: withdrawals paused, outbound transfers at risk
- funds at risk: `$2.4M`

Run the local demo:

```bash
npm install
npm run demo
```

Or specify a scenario file:

```bash
node src/demo.mjs ./scenarios/bridge-outage.json
```

The demo writes:

- `output/<incident-id>/report.json`
- `output/<incident-id>/briefing.md`
- `output/<incident-id>/status-update.md`
- `output/<incident-id>/postmortem.md`

Prebuilt sample artifacts are also included in [`examples/`](./examples), and a static visual preview lives in [`web/index.html`](./web/index.html).

## OpenServ Runtime

To run the custom agent locally with OpenServ's tunnel-based flow:

```bash
cp .env.example .env
npm install
npm run agent
```

This repo currently targets `@openserv-labs/sdk` `^2.0.0` as declared in [`package.json`](./package.json).

Environment notes:

- `OPENSERV_API_KEY` is required for the OpenServ runtime.
- `AGENT_ROLE=commander` starts the coordinating agent.
- `AGENT_ROLE=triage|forensics|communications|runbook|postmortem` starts a specialist agent instead.
- `DISABLE_TUNNEL=true` is appropriate for deployed environments where OpenServ can reach the public agent endpoint directly.

## Security

The submission is intentionally clean:

- no API keys are committed
- `.env` is ignored
- `.env.example` contains placeholders only
- optional notifications are modeled as OpenServ integrations, not raw secrets in code
- the local demo path works without any keys

If this is submitted live, keep any actual keys inside OpenServ workspace secrets or deployment environment variables only.

## Repo Structure

```text
openserv-war-room/
├── .env.example
├── .gitignore
├── agent.json
├── conversationLog.md
├── examples/
│   ├── bridge-outage-briefing.md
│   ├── bridge-outage-postmortem.md
│   ├── bridge-outage-report.json
│   └── bridge-outage-status-update.md
├── package.json
├── README.md
├── submission.template.json
├── scenarios/
│   └── bridge-outage.json
└── src/
    ├── core/
    │   ├── engine.mjs
    │   ├── roles.mjs
    │   └── utils.mjs
    ├── demo.mjs
    ├── index.mjs
    └── openserv/
        ├── commander-agent.mjs
        ├── specialist-agent.mjs
        └── start.mjs
└── web/
    ├── app.js
    ├── index.html
    ├── sample-report.js
    └── styles.css
```

## Honest Scope

What is implemented:

- a structured multi-agent workflow
- OpenServ custom agent entrypoints
- local reproducible outputs
- evaluator-friendly submission metadata

What is not claimed:

- no live ERC-8004 registration is included in this repo
- no production alert integrations are hardwired
- no actual protocol keys or notification credentials are present

That tradeoff is deliberate. The repo stays honest, portable, and safe while still demonstrating a strong OpenServ-native product.
