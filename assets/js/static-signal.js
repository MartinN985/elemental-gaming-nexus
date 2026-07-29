(() => {
  const node = document.querySelector("[data-static-number]");
  if (!node) return;
  const sequence = ["", "6", "", "1", "", "6", "", "616", "", "616"];
  let index = 0;
  const tick = () => {
    node.textContent = sequence[index % sequence.length];
    node.dataset.visible = node.textContent ? "true" : "false";
    index += 1;
    const delay = node.textContent === "616" ? 1500 + Math.random() * 1500 : 380 + Math.random() * 900;
    setTimeout(tick, delay);
  };
  setTimeout(tick, 900 + Math.random() * 900);
})();
