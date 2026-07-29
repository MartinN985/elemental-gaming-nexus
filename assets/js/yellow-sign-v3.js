(() => {
  const fileMeta = {
    "warning": ["Initial warning", "/y/file/warning"],
    "lost-reel": ["Lost reel report", "/y/file/lost-reel"],
    "restricted-vector": ["Restricted vector file", "/y/file/restricted-vector"],
    "two-moons": ["Astronomical evidence", "/y/file/two-moons"],
    "program": ["Recovered program", "/y/file/program"],
    "carcosa": ["Welcome to Carcosa", "/y/file/carcosa"]
  };

  const specialMeta = {
    1: ["Source image 0001", "/y/special/0001"],
    2: ["Filter instruction I", "/y/special/0002"],
    3: ["Filter instruction II", "/y/special/0003"],
    4: ["Filter instruction III", "/y/special/0004"],
    5: ["Filter instruction IV", "/y/special/0005"],
    404: ["Removed record", "/y/special/0404"],
    616: ["Correction index 616", "/y/616/"],
    2500: ["Atlanta incident status update", "/y/special/2500"]
  };

  const addMaterial = (list, label, href, type = "") => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    if (type) a.dataset.materialType = type;
    li.append(a);
    list.append(li);
  };

  const applyPhase = (root, phase) => {
    root.dataset.globalPhase = String(phase.id ?? 0);
    document.querySelector("[data-phase-status]").textContent = phase.status || "ACTIVE";
    document.querySelector("[data-vector-line]").textContent = `VECTOR: ${phase.vector || "UNKNOWN"}`;
    document.querySelector("[data-incident-question]").textContent = phase.question || "WHAT COULD THIS BE REFERRING TO?";
    document.querySelector("[data-phase-footer]").textContent = phase.footer || "SIGNAL CLASSIFICATION // UNRESOLVED";

    const bulletin = document.querySelector("[data-phase-bulletin]");
    const name = document.querySelector("[data-phase-name]");
    const lines = document.querySelector("[data-phase-lines]");
    lines.replaceChildren();
    name.textContent = phase.name || "INCIDENT UPDATE";
    (phase.bulletin || []).forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      lines.append(p);
    });
    bulletin.hidden = lines.children.length === 0;
  };

  async function init() {
    const root = document.querySelector("[data-arg-root]");
    if (!root) return;
    const error = document.querySelector("[data-state-error]");

    try {
      const response = await fetch("/api/arg/state", { headers: { Accept: "application/json" } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to open the incident record.");

      document.querySelector("[data-personal-count]").textContent = data.personalCount.toLocaleString();
      document.querySelector("[data-global-count]").textContent = data.globalConfirmedCount.toLocaleString();
      applyPhase(root, data.globalPhase || {});

      const next = document.querySelector("[data-next-threshold]");
      const bar = document.querySelector("[data-progress-bar]");
      const thresholds = [0, 5, 10, 25, 50, 100];
      const upper = data.nextThreshold;
      if (upper) {
        const lower = [...thresholds].reverse().find((value) => value <= data.personalCount) || 0;
        const pct = Math.max(0, Math.min(100, ((data.personalCount - lower) / (upper - lower)) * 100));
        next.textContent = `NEXT THRESHOLD // ${upper}`;
        bar.style.width = `${pct}%`;
      } else {
        next.textContent = "THRESHOLD COMPLETE";
        bar.style.width = "100%";
      }

      const access = document.querySelector("[data-access-link]");
      access.hidden = !data.accessConsoleUnlocked;

      const list = document.querySelector("[data-materials-list]");
      const empty = document.querySelector("[data-materials-empty]");
      list.replaceChildren();

      (data.unlockedGlobalFiles || []).forEach((record) => {
        addMaterial(list, `GLOBAL // ${record.title}`, `/y/global/${record.slug}`, "global");
      });

      data.encounteredSpecials.forEach((number) => {
        const item = specialMeta[number];
        if (item) addMaterial(list, item[0], item[1], "special");
      });

      data.unlockedFiles.forEach((slug) => {
        const item = fileMeta[slug];
        if (item) addMaterial(list, item[0], item[1], "personal");
      });

      empty.hidden = list.children.length > 0;
    } catch (err) {
      error.textContent = err instanceof Error ? err.message : "Unable to open the incident record.";
    }
  }

  init();
})();
