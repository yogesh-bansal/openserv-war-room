# Conversation Log — OpenServ War Room

## Day 1 — Picking the Right Product

**Human:** We need something for OpenServ, but I do not want another generic "agent that researches things" project. It has to feel like a real product, not sponsor paint on a familiar pattern.

**AI:** Then the project should live in operations, not in content generation. OpenServ is strongest when multiple agents each own a role in a workflow. A good fit is a protocol incident command system: one intake opens a war room, and specialist agents handle triage, forensics, communications, and postmortem work.

**Human:** Why incident response instead of a trading copilot or launch assistant?

**AI:** Two reasons. First, it is more distinctive. A lot of agentic crypto submissions drift toward research, trading, or launch automation. Incident command is rarer and easier to remember. Second, it is a better OpenServ story. OpenServ's value is not "one smart answer." It is multi-agent coordination inside a working process.

**Human:** That sounds right. What should the product actually output?

**AI:** A complete incident packet:

1. severity classification
2. blast-radius summary
3. first containment actions
4. audience-specific updates
5. owned runbook tasks
6. postmortem draft that starts during the incident, not after it

That makes the submission much more concrete.

## Day 1 — Matching the Track Requirements

**Human:** Let's verify that this actually fits the live track before we write code.

**AI:** The OpenServ track specifically asks for a useful AI-powered product or service using OpenServ to power meaningful multi-agent behavior. It explicitly calls out multi-agent workflows, custom agents, x402-native services, ERC-8004-powered identity, and agentic DeFi as examples. It also says OpenServ does not need to provide every primitive, but it must be clearly load-bearing.

**Human:** So the repo should not just mention OpenServ. It should be built around it.

**AI:** Exactly. The architecture should be "commander plus specialists" with OpenServ custom agents as the intended runtime. The repo can also include a local demo path so the project is easy to inspect without secrets.

**Human:** We should also target the build story prize if we can.

**AI:** Then the conversation log needs to be clean and useful, not filler. It should explain the product decisions, the tradeoffs, and why the project exists.

## Day 1 — Shaping the Product

**Human:** Walk me through the agent roles.

**AI:** Proposed role split:

- **Commander**: opens the war room and merges outputs
- **Triage Agent**: assesses severity and immediate impact
- **Forensics Agent**: tracks hypotheses and evidence gaps
- **Communications Agent**: writes public, partner, and internal updates
- **Runbook Agent**: converts the situation into owned tasks
- **Postmortem Agent**: starts the closure packet immediately

Each role should have a narrow responsibility so the project looks like a true multi-agent system, not one big agent pretending to have submodules.

**Human:** I like that. It also feels different from most hackathon agents.

**AI:** That difference matters. If a judge or an LLM sees four submissions from the same team, they should not think "same idea, different branding." This one should read as protocol operations infrastructure.

## Day 1 — Implementation Strategy

**Human:** Should we build a UI first?

**AI:** Not first. The evaluator is going to read the repository. The highest-leverage move is a strong workflow engine, a clean README, and a runtime that clearly maps to OpenServ. A flashy interface with weak internals would score worse than a strong code-and-doc package.

**Human:** How do we keep it honest while still looking polished?

**AI:** Split the repo into two paths:

1. **Core engine**: pure JavaScript functions that transform an incident scenario into structured outputs
2. **OpenServ runtime**: actual custom agent entrypoints using `@openserv-labs/sdk`

That way we can ship a reproducible demo without any private keys, and still show exactly how the project runs on OpenServ.

## Day 1 — Reading the Platform Docs

**Human:** What do we need from the submission docs?

**AI:** The submission requirements are clear:

- the project needs a strong `conversationLog`
- the repo must be open source
- the submission payload needs `name`, `description`, `problemStatement`, `trackUUIDs`, `conversationLog`, and `submissionMetadata`
- secrets must never be committed

We should include a `submission.template.json` in the folder so the final handoff is easy and the repo visibly satisfies the platform's shape.

**Human:** Good. Add the live track UUIDs too.

**AI:** Yes. That makes the repo submission-ready instead of just concept-ready.

## Day 1 — Building the Core Engine

**Human:** How should the engine think about severity?

**AI:** Use a deterministic scoring model. This repo should not depend on external model calls just to demonstrate basic incident handling. Severity can be computed from funds at risk, user impact, incident class, and symptom count. That keeps the demo local, reproducible, and easy to judge.

**Human:** And the outputs?

**AI:** Three evaluator-friendly artifacts:

- `briefing.md`
- `status-update.md`
- `postmortem.md`

Plus a structured `report.json` that contains the full war room state.

**Human:** So even without running on OpenServ, the project still looks complete.

**AI:** Exactly. The local demo proves the product shape. The OpenServ runtime proves sponsor fit.

## Day 1 — OpenServ Runtime Decisions

**Human:** What should the runtime actually do inside OpenServ?

**AI:** The commander capability should:

1. accept a scenario payload
2. run the full workflow
3. write task logs into the workspace
4. upload the generated markdown artifacts into workspace files
5. return a structured summary

The specialist agents should also be runnable separately so this looks like a real multi-agent workspace, not just one endpoint.

**Human:** That's stronger than putting everything in one capability.

**AI:** Yes. It makes the submission easier to believe.

## Day 1 — Security Hygiene

**Human:** We need to be careful about secrets. I do not want another repo that leaks keys or looks sloppy.

**AI:** Then the repo should have:

- `.env.example` with placeholders only
- `.gitignore` covering `.env`, `node_modules`, and `output`
- no raw credentials in docs, code, or examples
- all optional integrations modeled as OpenServ workspace integrations or environment variables

The README should say that clearly because evaluators notice operational discipline.

## Day 1 — Writing the README

**Human:** The README needs to score well with an LLM judge.

**AI:** Then it should optimize for three things:

1. **clarity**: what it is and why it matters
2. **fit**: why OpenServ is core, not incidental
3. **scope honesty**: what is shipped versus what is future work

I want the first paragraph to immediately signal that this is an operations product for protocol incidents, not another copilot.

**Human:** And include the exact track mapping.

**AI:** Yes. Primary OpenServ, secondary OpenServ Build Story, secondary Open Track. The UUIDs should be in the repo.

## Day 1 — Final Packaging

**Human:** What makes this repository submission-grade rather than just "good enough"?

**AI:** A few things:

- the build log reads like a real design process
- the submission template removes ambiguity at publish time
- the code is split cleanly between product logic and platform runtime
- the folder contains no secrets
- the project is clearly distinct from the common research/trading agent cluster

**Human:** That is the right bar. Ship it.

**AI:** Shipped as `openserv-war-room`, with a local demo path, OpenServ-native runtime files, submission metadata template, live track UUIDs, and a clean evaluator-facing narrative.
