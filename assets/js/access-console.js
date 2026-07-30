(() => {
  const labels = {
    "warning": ["Initial warning", "/y/file/warning"],
    "lost-reel": ["Lost reel report", "/y/file/lost-reel"],
    "restricted-vector": ["Restricted vector file", "/y/file/restricted-vector"],
    "two-moons": ["Astronomical evidence", "/y/file/two-moons"],
    "program": ["Recovered program", "/y/file/program"],
    "carcosa": ["Welcome to Carcosa", "/y/file/carcosa"],
    "observer-intake": ["Observer Intake File", "/y/file/observer-intake"],
    "team-deployment": ["Initial Team Deployment Brief", "/y/file/team-deployment"],
    "yukon-exposure": ["Yukon Exposure Report", "/y/file/yukon-exposure"],
    "field-transmission": ["Recovered Field Transmission", "/y/file/field-transmission"],
    "vector-appendix": ["Vector Analysis Appendix", "/y/file/vector-appendix"],
    "static-protocols": ["Static Protocols", "/y/file/static-protocols"]
  };

  const renderFiles = (files) => {
    const section = document.querySelector("[data-access-files]");
    const list = document.querySelector("[data-access-file-list]");
    list.replaceChildren();
    files.forEach((slug) => {
      const item = labels[slug];
      if (!item) return;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = item[1];
      a.textContent = item[0];
      li.append(a);
      list.append(li);
    });
    section.hidden = list.children.length === 0;
  };

  async function init() {
    const status = document.querySelector("[data-access-status]");
    const personalPanel = document.querySelector("[data-issued-panel]");
    const personalCodes = document.querySelector("[data-issued-codes]");
    const globalPanel = document.querySelector("[data-global-panel]");
    const globalSlots = document.querySelector("[data-global-slots]");
    const form = document.querySelector("[data-code-form]");
    const input = document.querySelector("[data-code-input]");
    const error = document.querySelector("[data-code-error]");

    try {
      const response = await fetch("/api/arg/state");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to verify encounter history.");

      if (!data.accessConsoleUnlocked) {
        status.textContent = `ACCESS DENIED // PERSONAL THRESHOLD 5 OR GLOBAL PHASE 25 REQUIRED // PERSONAL: ${data.personalCount}`;
        return;
      }

      status.textContent = `ACCESS GRANTED // PERSONAL: ${data.personalCount} // GLOBAL: ${data.globalConfirmedCount}`;
      form.hidden = false;

      personalCodes.replaceChildren();
      (data.issuedCodes || []).forEach((record) => {
        const li = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = `${record.threshold} INCURSIONS`;
        const code = document.createElement("strong");
        code.textContent = record.code;
        li.append(label, code);
        personalCodes.append(li);
      });
      personalPanel.hidden = personalCodes.children.length === 0;

      globalSlots.replaceChildren();
      (data.globalCodeSlots || []).forEach((record) => {
        const li = document.createElement("li");
        const label = document.createElement("span");
        label.textContent = `GLOBAL PHASE ${record.phase}`;
        const received = document.createElement("strong");
        received.textContent = "ACCESS STRING RECEIVED IN REPORT";
        received.title = record.title;
        li.append(label, received);
        globalSlots.append(li);
      });
      globalPanel.hidden = globalSlots.children.length === 0;

      renderFiles(data.unlockedFiles || []);

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.textContent = "";
        const code = input.value.trim();
        if (!code) return;
        const codeResponse = await fetch("/api/arg/code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });
        const result = await codeResponse.json().catch(() => ({}));
        if (!codeResponse.ok) {
          error.textContent = result.error || "ACCESS STRING REJECTED";
          return;
        }
        location.assign(result.redirect);
      });
    } catch (err) {
      error.textContent = err instanceof Error ? err.message : "Unable to verify encounter history.";
    }
  }

  init();
})();
