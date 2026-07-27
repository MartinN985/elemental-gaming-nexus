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

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
