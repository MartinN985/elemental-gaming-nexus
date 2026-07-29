import {
  deniedPage,
  escapeHtml,
  getVisitor,
  html,
  pageShell,
  requireEncounter
} from "../../_lib/arg.js";

const PAGES = {
  1: {
    title: "Source image 0001",
    eyebrow: "PRIMARY CARRIER // 0001",
    body: `
      <h1 class="file-title">Source image</h1>
      <p class="file-copy">The photograph has been altered in transmission. Preserve the original file. Copies lose information.</p>
      <figure class="evidence-frame">
        <img src="/assets/images/arg/source-0001-transmission.png" alt="Pending King in Yellow source photograph">
        <figcaption>IMAGE 0001 // TRANSMISSION COPY</figcaption>
      </figure>
      <div class="arg-actions">
        <a class="arg-button" href="/assets/images/arg/source-0001-transmission.png" download="source-0001-transmission.png">Download image</a>
      </div>
`
  },
  2: {
    title: "Carrier instruction 0002",
    eyebrow: "CARRIER SIGNAL // 0002",
    body: `<h1 class="file-title">Filter instruction I</h1><p class="filter-clue">SIGNAL CALIBRATION PENDING.</p>`
  },
  3: {
    title: "Carrier instruction 0003",
    eyebrow: "CARRIER SIGNAL // 0003",
    body: `<h1 class="file-title">Filter instruction II</h1><p class="filter-clue">SIGNAL CALIBRATION PENDING.</p>`
  },
  4: {
    title: "Carrier instruction 0004",
    eyebrow: "CARRIER SIGNAL // 0004",
    body: `<h1 class="file-title">Filter instruction III</h1><p class="filter-clue">SIGNAL CALIBRATION PENDING.</p>`
  },
  5: {
    title: "Carrier instruction 0005",
    eyebrow: "CARRIER SIGNAL // 0005",
    body: `<h1 class="file-title">Filter instruction IV</h1><p class="filter-clue">SIGNAL CALIBRATION PENDING.</p>`
  },
  2500: {
    title: "Atlanta incident status update",
    eyebrow: "INCIDENT STATUS UPDATE // 2500",
    body: `
      <h1 class="file-title">Atlanta Incident</h1>
      <dl class="case-grid status-grid">
        <div><dt>LOCATION</dt><dd>Atlanta, Georgia</dd></div>
        <div><dt>EVENT</dt><dd>Dragon Con</dd></div>
        <div><dt>KNOWN EXPOSURE WINDOW</dt><dd>September 3–7, 2026</dd></div>
        <div><dt>ACTIVE SPREAD</dt><dd>Not detected</dd></div>
        <div><dt>PROPAGATION STATUS</dt><dd>Passive</dd></div>
        <div><dt>GLOBAL RISK LEVEL</dt><dd>High</dd></div>
      </dl>
      <div class="redaction-block">
        <p>NO SIGNS OF FURTHER ACTIVE SPREAD HAVE BEEN DETECTED.</p>
        <p>SPREAD HAS BECOME PASSIVE.</p>
        <p>MONITORING WILL CONTINUE FOR FURTHER RISK.</p>
        <p>RESPONSE TEAMS HAVE BEEN DISPATCHED TO ATLANTA FOR CONTAINMENT AND CLEANUP OPERATIONS.</p>
      </div>`
  }
};

function removedRecordPage() {
  const cipher = "46 46 46 . 14 41 14 42 14 23 25 12 41 34 12 42 24 23 34 23 14 51 21 22 . 31 16 42 / 15 / 26 45 16 12 32";
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>404 | Elemental Gaming Nexus</title><style>
html,body{min-height:100%;margin:0}body{display:grid;place-items:center;background:#fff;color:#171717;font-family:Arial,Helvetica,sans-serif}.box{width:min(680px,calc(100% - 40px));padding:70px 0;text-align:center}.code{font-size:clamp(5rem,18vw,11rem);font-weight:800;line-height:.8;letter-spacing:-.08em}.box h1{margin:30px 0 10px;font-size:1.45rem}.box p{color:#666}.home{display:inline-block;margin-top:20px;color:#171717}.cipher{position:fixed;right:8px;bottom:5px;left:8px;overflow-wrap:anywhere;color:#e7e7e7;text-align:center;font:9px/1.2 monospace;letter-spacing:.06em;user-select:text}@media(max-width:500px){.cipher{font-size:7px}}</style></head>
<body><main class="box"><div class="code">404</div><h1>Page not found</h1><p>The requested page may have moved or no longer exists.</p><a class="home" href="/">Return home</a></main><div class="cipher" aria-label="unindexed footer data">${escapeHtml(cipher)}</div></body></html>`;
}

export async function onRequestGet(context) {
  const db = context.env.ARG_DB;
  if (!db) return html(deniedPage(), 503);
  const numberText = String(context.params.number || "").replace(/\D/g, "");
  const number = Number(numberText);
  if (![1,2,3,4,5,404,2500].includes(number)) return html(deniedPage(), 404);

  const visitor = getVisitor(context.request);
  if (visitor.isNew || !(await requireEncounter(db, visitor.id, number))) {
    return html(deniedPage(), 404);
  }

  if (number === 404) return html(removedRecordPage(), 404);
  const page = PAGES[number];
  return html(pageShell(page));
}
