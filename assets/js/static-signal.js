(() => {
  const node = document.querySelector("[data-static-number]");
  if (!node) return;

  const states = [
    { visible: false, strength: "", min: 1500, max: 3200 },
    { visible: true, strength: "trace", min: 220, max: 480 },
    { visible: false, strength: "", min: 500, max: 1400 },
    { visible: true, strength: "faint", min: 500, max: 950 },
    { visible: false, strength: "", min: 900, max: 2200 },
    { visible: true, strength: "clear", min: 900, max: 1700 },
    { visible: false, strength: "", min: 1800, max: 3600 }
  ];

  let index = 0;
  node.textContent = "616";

  const tick = () => {
    const state = states[index % states.length];
    node.dataset.visible = state.visible ? "true" : "false";
    node.dataset.strength = state.strength;
    index += 1;
    const delay = state.min + Math.random() * (state.max - state.min);
    window.setTimeout(tick, delay);
  };

  window.setTimeout(tick, 1200 + Math.random() * 1800);
})();
