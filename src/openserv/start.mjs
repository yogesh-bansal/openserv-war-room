import { run } from "@openserv-labs/sdk";
import { createCommanderAgent } from "./commander-agent.mjs";
import { createSpecialistAgent } from "./specialist-agent.mjs";

export async function startOpenServRuntime() {
  const role = process.env.AGENT_ROLE || "commander";
  const agent = role === "commander" ? createCommanderAgent() : createSpecialistAgent(role);
  const { stop } = await run(agent);
  return { stop, role };
}
