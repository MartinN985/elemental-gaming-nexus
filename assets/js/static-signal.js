(() => {
  const node = document.querySelector("[data-static-number]");
  if (!node) return;

  // The clue is always present. Its pixels remain frozen while the surrounding
  // static moves, so the numerals emerge only when the viewer watches closely.
  node.textContent = "616";
})();
