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

  document.querySelectorAll("[data-scrollspy]").forEach((nav) => {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const sections = links
      .map((link) => document.getElementById(link.hash.slice(1)))
      .filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const visible = new Set();
    const mark = () => {
      const current = sections.find((section) => visible.has(section)) || null;
      links.forEach((link) => {
        if (current && link.hash === `#${current.id}`) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      mark();
    }, { rootMargin: "-160px 0px -55% 0px" });

    sections.forEach((section) => observer.observe(section));
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
