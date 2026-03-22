import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runWarRoom, writeDemoArtifacts } from "./core/engine.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const defaultScenario = path.join(projectRoot, "scenarios", "bridge-outage.json");
const scenarioPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : defaultScenario;

async function main() {
  const raw = await fs.readFile(scenarioPath, "utf8");
  const scenario = JSON.parse(raw);
  const report = runWarRoom(scenario);
  const result = await writeDemoArtifacts(report, path.join(projectRoot, "output"));

  console.log("OpenServ War Room demo complete");
  console.log(`Incident: ${report.incidentId}`);
  console.log(`Severity: ${report.severity.toUpperCase()}`);
  console.log(`Output: ${result.outputDir}`);
  for (const file of result.files) {
    console.log(`- ${path.relative(projectRoot, file)}`);
  }
}

main().catch((error) => {
  console.error("Demo failed:", error);
  process.exitCode = 1;
});
