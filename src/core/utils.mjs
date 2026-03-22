import crypto from "node:crypto";

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function severityFromScore(score) {
  if (score >= 10) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}

export function scoreIncident(scenario) {
  let score = 0;

  if ((scenario.fundsAtRiskUSD || 0) >= 1000000) score += 4;
  if ((scenario.fundsAtRiskUSD || 0) >= 5000000) score += 2;

  if (scenario.userImpact && /paused|loss|drain|delayed|stuck/i.test(scenario.userImpact)) {
    score += 2;
  }

  if (scenario.incidentType && /exploit|bridge|oracle|sequencer|governance/i.test(scenario.incidentType)) {
    score += 2;
  }

  score += Math.min((scenario.symptoms || []).length, 3);

  return score;
}

export function makeIncidentId(scenario) {
  const seed = [
    scenario.protocol,
    scenario.network,
    scenario.incidentType,
    scenario.reportedAt || new Date().toISOString()
  ].join("|");

  return `wr-${crypto.createHash("sha256").update(seed).digest("hex").slice(0, 10)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function dedupe(items) {
  return [...new Set((items || []).filter(Boolean))];
}

export function money(amount) {
  const value = Number(amount || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function compactLines(lines) {
  return lines.filter(Boolean).join("\n");
}

export function formatChecklist(items) {
  return (items || []).map((item) => `- [ ] ${item}`).join("\n");
}

export function formatBullets(items) {
  return (items || []).map((item) => `- ${item}`).join("\n");
}
