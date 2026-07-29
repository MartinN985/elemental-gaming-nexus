import {
  FILE_REQUIREMENTS,
  deniedPage,
  getCounts,
  getVisitor,
  html,
  pageShell
} from "../../_lib/arg.js";

const FILES = {
  "warning": {
    title: "Compromise warning",
    eyebrow: "PERSONAL FILE // 005",
    body: `<h1 class="file-title compact-title">You may be compromised.</h1><p class="file-copy">Do not assume the phrase originated outside your own thoughts.</p>`
  },
  "lost-reel": {
    title: "Lost reel report",
    eyebrow: "RESTRICTED MEDIA FILE // 010",
    body: `
      <h1 class="file-title">The last screening</h1>
      <dl class="case-grid">
        <div><dt>FORMAT</dt><dd>16 mm short film</dd></div>
        <div><dt>RUNTIME</dt><dd>08:16</dd></div>
        <div><dt>PROVENANCE</dt><dd>Unknown</dd></div>
        <div><dt>STATUS</dt><dd>Missing</dd></div>
      </dl>
      <div class="redaction-block">
        <p>The film was screened once for a private audience. Every confirmed person who saw it is dead.</p>
        <p>No two deaths were assigned the same cause. The final death occurred sixty-one days after the screening.</p>
        <p>Surviving projection notes describe an additional figure appearing in the final shot. The figure was not present on the source reel before projection.</p>
      </div>`
  },
  "restricted-vector": {
    title: "Restricted vector file",
    eyebrow: "TARGETING FILE // 025",
    body: `
      <h1 class="file-title">Vector classification</h1>
      <p class="stamp">ACTIVE VECTOR</p>
      <div class="redaction-block">
        <p>Your encounter pattern now satisfies incursion-propagation criteria.</p>
        <p>You are no longer classified as an observer. You are a vector for the incursion.</p>
        <p>Your browser identifier has been added to the active target list.</p>
      </div>
      <p class="terminal-line">DO NOT CONTACT OTHER LISTED TARGETS.</p>`
  },
  "two-moons": {
    title: "Astronomical evidence",
    eyebrow: "OBSERVATION FILE // 050",
    body: `
      <h1 class="file-title">Lunar discrepancy</h1>
      <p class="file-copy">The second object was not visible when the photograph was taken.</p>
      <figure class="evidence-frame wide-evidence">
        <img src="/assets/images/arg/two-moons.png" alt="Night sky showing two moons">
        <figcaption>ATLANTA OBSERVATION // TIME UNCONFIRMED</figcaption>
      </figure>
`
  },
  "program": {
    title: "Recovered program",
    eyebrow: "BROADALBIN ARCHIVE",
    body: `
      <article class="program-sheet">
        <p class="program-small">ONE PERFORMANCE ONLY</p>
        <h1>THE PLAY</h1>
        <p class="program-place">THE BROADALBIN</p>
        <div class="program-rule"></div>
        <p>THE STRANGER</p>
        <p>THE WITNESS</p>
        <p>THE QUEEN</p>
        <p>THE AUDIENCE</p>
        <div class="program-rule"></div>
        <p>ACT I // RECOGNITION</p>
        <p>ACT II // <span class="redacted-inline">REMOVED</span></p>
        <p class="program-small">NO ONE IS ADMITTED AFTER THE SECOND BELL.</p>
      </article>`
  },
  "carcosa": {
    title: "Welcome to Carcosa",
    eyebrow: "PERSONAL FILE // 100",
    body: `
      <div class="carcosa-page">
        <p class="carcosa-overline">OBSERVATION THRESHOLD EXCEEDED</p>
        <h1>Welcome to Carcosa.</h1>
        <p>The city has recognized you.</p>
        <p>Location is no longer reliable.</p>
      </div>`
  }
};

export async function onRequestGet(context) {
  const db = context.env.ARG_DB;
  const slug = String(context.params.slug || "");
  const requirement = FILE_REQUIREMENTS[slug];
  const file = FILES[slug];
  if (!db || !requirement || !file) return html(deniedPage(), 404);

  const visitor = getVisitor(context.request);
  if (visitor.isNew) return html(deniedPage(), 403);
  const counts = await getCounts(db, visitor.id);
  if (counts.personal < requirement.threshold) return html(deniedPage(), 403);

  if (requirement.type === "code") {
    const unlocked = await db.prepare(
      `SELECT 1 AS found FROM arg_code_unlocks
       WHERE visitor_id = ?1 AND file_slug = ?2`
    ).bind(visitor.id, slug).first();
    if (!unlocked) return html(deniedPage(), 403);
  }

  return html(pageShell(file));
}
