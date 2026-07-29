(() => {
  const form = document.querySelector("[data-admin-form]");
  if (!form) return;

  const input = document.querySelector("[data-admin-key]");
  const error = document.querySelector("[data-admin-error]");
  const results = document.querySelector("[data-admin-results]");
  const phaseForm = document.querySelector("[data-phase-form]");
  const phaseSelect = document.querySelector("[data-phase-select]");
  const phaseStatus = document.querySelector("[data-phase-status]");
  let loadedKey = "";

  const fillRows = (selector, rows, fields) => {
    const body = document.querySelector(selector);
    body.replaceChildren();
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      fields.forEach((field) => {
        const td = document.createElement("td");
        td.textContent = field === "ribbon_no" ? String(row[field]).padStart(4, "0") : (row[field] ?? "");
        tr.append(td);
      });
      body.append(tr);
    });
  };

  const renderPhase = (phase) => {
    phaseSelect.value = phase.override === null ? "automatic" : String(phase.override);
    const overrideText = phase.override === null ? "AUTOMATIC" : `OVERRIDE ${phase.override}`;
    phaseStatus.textContent = `EFFECTIVE PHASE ${phase.effective} // ${phase.name} // ${overrideText} // AUTOMATIC PHASE ${phase.automatic}`;
  };

  async function loadStats() {
    const response = await fetch("/api/arg/stats", {
      headers: { Authorization: `Bearer ${loadedKey}` }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Unable to load statistics.");

    document.querySelector("[data-stat-visitors]").textContent = data.uniqueBrowsers.toLocaleString();
    document.querySelector("[data-stat-global]").textContent = data.globalConfirmedCount.toLocaleString();
    document.querySelector("[data-stat-raw]").textContent = data.totalRawScans.toLocaleString();
    document.querySelector("[data-stat-ribbons]").textContent = data.ribbonsEncountered.toLocaleString();
    fillRows("[data-special-body]", data.specialRibbons, ["ribbon_no", "unique_browsers", "raw_scans"]);
    fillRows("[data-recent-body]", data.recentRibbons, ["ribbon_no", "unique_browsers", "raw_scans", "last_seen"]);
    renderPhase(data.globalPhase);
    results.hidden = false;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    results.hidden = true;
    loadedKey = input.value.trim();
    try {
      await loadStats();
    } catch (err) {
      error.textContent = err instanceof Error ? err.message : "Unable to load statistics.";
    }
  });

  phaseForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    try {
      const response = await fetch("/api/arg/admin-phase", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loadedKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phase: phaseSelect.value })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to change phase.");
      await loadStats();
    } catch (err) {
      error.textContent = err instanceof Error ? err.message : "Unable to change phase.";
    }
  });
})();
