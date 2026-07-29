import { html, normalizeToken } from "../_lib/arg.js";

export function onRequestGet(context) {
  const token = normalizeToken(context.params.token);
  if (!token) {
    return html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Signal rejected</title><link rel="stylesheet" href="/assets/css/yellow-sign-v3.css?v=2"></head><body><main class="arg-shell"><section class="arg-panel"><p class="arg-kicker">SIGNAL REJECTED</p><h1 class="file-title">Unrecognized incursion point</h1><p class="file-copy">The signature is damaged, fabricated, or incomplete.</p></section></main></body></html>`, 404);
  }

  const safeToken = JSON.stringify(token);
  return html(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <title>Confirming signal</title>
  <link rel="stylesheet" href="/assets/css/yellow-sign-v3.css?v=2">
</head>
<body>
  <main class="arg-shell"><section class="arg-panel scan-panel">
    <p class="arg-kicker">SIGNAL ACQUISITION</p>
    <h1 class="file-title">Incursion point detected</h1>
    <p class="file-copy" id="scan-status">Checking signature integrity.</p>
    <div class="scan-pulse" aria-hidden="true"></div>
    <noscript><p class="arg-error">JavaScript is required to record this encounter.</p></noscript>
  </section></main>
  <script>
  (() => {
    const status = document.getElementById("scan-status");
    fetch("/api/arg/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: ${safeToken} })
    })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The signal could not be recorded.");
      status.textContent = data.newEncounter ? "New encounter confirmed." : "Known encounter confirmed.";
      setTimeout(() => location.replace(data.redirect || "/y/"), 420);
    })
    .catch((error) => {
      status.textContent = error.message || "The signal could not be recorded.";
      status.classList.add("arg-error");
    });
  })();
  </script>
</body>
</html>`);
}
