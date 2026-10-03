(() => {
  const button = document.querySelector("[data-menu-button]");
  const menu = document.querySelector("[data-menu]");

  if (button && menu) {
    const closeMenu = () => {
      menu.dataset.open = "false";
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", () => {
      const open = menu.dataset.open === "true";
      menu.dataset.open = open ? "false" : "true";
      button.setAttribute("aria-expanded", String(!open));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeMenu();
    });
  }

  document.querySelectorAll("[data-tabs]").forEach((root) => {
    const tabs = [...root.querySelectorAll("[data-tab]")];
    const panels = [...root.querySelectorAll("[data-panel]")];
    if (!tabs.length) return;

    tabs[0].parentElement.setAttribute("role", "tablist");
    tabs.forEach((tab) => {
      tab.setAttribute("role", "tab");
      tab.id = `tab-${tab.dataset.tab}`;
      tab.setAttribute("aria-controls", tab.dataset.tab);
    });
    panels.forEach((panel) => {
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("tabindex", "0");
      panel.setAttribute("aria-labelledby", `tab-${panel.dataset.panel}`);
    });

    const select = (name, focus) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.tab === name;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active && focus) tab.focus();
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== name;
      });
    };

    const activate = (tab, focus) => {
      select(tab.dataset.tab, focus);
      history.replaceState(null, "", `#${tab.dataset.tab}`);
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        activate(tab);
      });
      tab.addEventListener("keydown", (event) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        activate(tabs[(index + step + tabs.length) % tabs.length], true);
      });
    });

    const fromHash = () => {
      const match = tabs.find((tab) => tab.dataset.tab === location.hash.slice(1));
      select(match ? match.dataset.tab : tabs[0].dataset.tab);
      if (match) root.closest("section").scrollIntoView();
    };

    root.dataset.tabsReady = "true";
    fromHash();
    window.addEventListener("hashchange", fromHash);
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
