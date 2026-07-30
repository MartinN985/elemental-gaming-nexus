(() => {
  const fileMeta = {
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

  const specialMeta = {
    1: ["Source image 0001", "/y/special/0001"],
    2: ["Filter instruction I", "/y/special/0002"],
    3: ["Filter instruction II", "/y/special/0003"],
    4: ["Filter instruction III", "/y/special/0004"],
    5: ["Filter instruction IV", "/y/special/0005"],
    404: ["Removed record", "/y/404/"],
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

  const shuffleWord = (word) => {
    const letters = word.split("");
    for (let index = letters.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [letters[index], letters[swap]] = [letters[swap], letters[index]];
    }
    const result = letters.join("");
    return result === word ? shuffleWord(word) : result;
  };

  const addScrambleBehavior = (span, word) => {
    let tick = 0;
    const update = () => {
      tick += 1;
      span.textContent = tick % 7 === 0 ? word : shuffleWord(word);
    };
    update();
    window.setInterval(update, 620);
  };

  const appendDecoratedText = (element, text, phaseId) => {
    const effects = [];
    if (phaseId === 1) effects.push({ word: "OBSERVER", className: "code-emphasis" });
    if (phaseId === 3) effects.push({ word: "IMAGE", className: "glitch-word" });
    if (phaseId === 4) effects.push({ word: "UNSTABLE", className: "scramble-word", scramble: true });

    const effect = effects.find((candidate) => text.includes(candidate.word));
    if (!effect) {
      element.textContent = text;
      return;
    }

    const start = text.indexOf(effect.word);
    element.append(document.createTextNode(text.slice(0, start)));
    const span = document.createElement("strong");
    span.className = effect.className;
    span.textContent = effect.word;
    span.setAttribute("aria-label", effect.word);
    element.append(span);
    element.append(document.createTextNode(text.slice(start + effect.word.length)));
    if (effect.scramble) addScrambleBehavior(span, effect.word);
  };

  const applyPhase = (root, phase) => {
    const phaseId = Number(phase.id || 0);
    root.dataset.globalPhase = String(phaseId);
    document.querySelector("[data-phase-status]").textContent = phase.status || "ACTIVE";

    const vectorLine = document.querySelector("[data-vector-line]");
    if (phaseId === 5) {
      vectorLine.replaceChildren(document.createTextNode("VECTOR: "));
      const backward = document.createElement("strong");
      backward.className = "backward-word";
      backward.textContent = "NOITAVRESBO";
      backward.setAttribute("aria-label", "OBSERVATION");
      vectorLine.append(backward);
    } else {
      vectorLine.textContent = `VECTOR: ${phase.vector || "UNKNOWN"}`;
    }

    document.querySelector("[data-incident-question]").textContent = phase.question || "WHAT COULD THIS BE REFERRING TO?";
    document.querySelector("[data-phase-footer]").textContent = phase.footer || "SIGNAL CLASSIFICATION // UNRESOLVED";

    const bulletin = document.querySelector("[data-phase-bulletin]");
    const name = document.querySelector("[data-phase-name]");
    const lines = document.querySelector("[data-phase-lines]");
    lines.replaceChildren();
    name.textContent = phase.name || "INCIDENT UPDATE";
    (phase.bulletin || []).forEach((text) => {
      const p = document.createElement("p");
      appendDecoratedText(p, text, phaseId);
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

      (data.encounteredSpecials || []).forEach((number) => {
        const item = specialMeta[number];
        if (item) addMaterial(list, item[0], item[1], "special");
      });

      (data.unlockedFiles || []).forEach((slug) => {
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
