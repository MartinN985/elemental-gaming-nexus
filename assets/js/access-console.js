(() => {
  const labels = {
    "warning": ["Initial warning", "/y/file/warning"],
    "lost-reel": ["Lost reel report", "/y/file/lost-reel"],
    "restricted-vector": ["Restricted vector file", "/y/file/restricted-vector"],
    "two-moons": ["Astronomical evidence", "/y/file/two-moons"],
    "program": ["Recovered program", "/y/file/program"],
    "carcosa": ["Welcome to Carcosa", "/y/file/carcosa"]
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
    const panel = document.querySelector("[data-issued-panel]");
    const codes = document.querySelector("[data-issued-codes]");
    const form = document.querySelector("[data-code-form]");
    const input = document.querySelector("[data-code-input]");
    const error = document.querySelector("[data-code-error]");

    try {
      const response = await fetch("/api/arg/state");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to verify encounter history.");

      if (!data.accessConsoleUnlocked) {
        status.textContent = `ACCESS DENIED // 5 DISTINCT INCURSIONS REQUIRED // CURRENT: ${data.personalCount}`;
        return;
      }

      status.textContent = `ACCESS GRANTED // ${data.personalCount} DISTINCT INCURSIONS CONFIRMED`;
      form.hidden = false;
      panel.hidden = false;
      codes.replaceChildren();
      data.issuedCodes.forEach((record) => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${record.threshold} INCURSIONS</span><strong>${record.code}</strong>`;
        codes.append(li);
      });
      renderFiles(data.unlockedFiles);

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
