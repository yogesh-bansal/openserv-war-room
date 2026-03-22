const report = window.sampleReport;

function formatFunds(value) {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  }

  return "n/a";
}

function getMessages(data) {
  return data.communications?.messages || data.updates || {};
}

function getActions(data) {
  if (Array.isArray(data.runbook?.actions)) {
    return data.runbook.actions.map((item) => `${item.owner} by ${item.deadline}: ${item.task}`);
  }

  return data.actions || [];
}

function getTimeline(data) {
  return data.postmortem?.timeline || data.timeline || [];
}

document.getElementById("title").textContent = report.title;
document.getElementById("severity").textContent = report.severity;
document.getElementById("funds").textContent = formatFunds(report.fundsAtRiskUSD);
document.getElementById("summary").textContent = report.summary;
const messages = getMessages(report);
document.getElementById("public-update").textContent = messages.public || "No public message generated.";
document.getElementById("partner-update").textContent = messages.partners || "No partner message generated.";
document.getElementById("internal-update").textContent = messages.internal || "No internal message generated.";

const workstreams = document.getElementById("workstreams");
report.workstreams.forEach((item) => {
  const card = document.createElement("section");
  card.className = "workstream";
  card.innerHTML = `
    <header>
      <strong>${item.role}</strong>
      <span class="status">${item.status || "done"}</span>
    </header>
    <div>${item.outcome}</div>
  `;
  workstreams.appendChild(card);
});

const actions = document.getElementById("actions");
getActions(report).forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  actions.appendChild(li);
});

const timeline = document.getElementById("timeline");
getTimeline(report).forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  timeline.appendChild(li);
});
