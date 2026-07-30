import {
  FILE_REQUIREMENTS,
  deniedPage,
  getCounts,
  getEffectiveGlobalPhase,
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
      </figure>`
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
  },
  "observer-intake": {
    title: "Observer Intake File",
    eyebrow: "GLOBAL ACCESS FILE // 025",
    body: `
      <h1 class="file-title">Observer Intake File</h1>
      <dl class="case-grid">
        <div><dt>OBSERVER STATUS</dt><dd>Unverified</dd></div>
        <div><dt>INCIDENT STATUS</dt><dd>Active</dd></div>
      </dl>
      <div class="redaction-block">
        <p>YOU HAVE ACCESSED MATERIAL ASSOCIATED WITH AN ACTIVE INCURSION.</p>
        <p>CONTINUED OBSERVATION MAY PUT YOU AT RISK.</p>
        <p class="report-emphasis">RECOMMEND RUNNING.</p>
      </div>`
  },
  "team-deployment": {
    title: "Initial Team Deployment Brief",
    eyebrow: "GLOBAL ACCESS FILE // 050",
    body: `
      <h1 class="file-title">Initial Team Deployment Brief</h1>
      <dl class="case-grid">
        <div><dt>TEAM SIZE</dt><dd>Five</dd></div>
        <div><dt>STATUS</dt><dd>Deployed</dd></div>
        <div><dt>OBJECTIVE</dt><dd>Identify the transmission vector</dd></div>
        <div><dt>LAST CONFIRMED LOCATION</dt><dd><a class="westin-link" href="/y/404/">WESTIN</a></dd></div>
      </dl>`
  },
  "yukon-exposure": {
    title: "Yukon Exposure Report",
    eyebrow: "GLOBAL ACCESS FILE // 100",
    body: `
      <h1 class="file-title">Exposure Report // Yukon</h1>
      <p class="file-copy">YUKON HAS BEEN EXPOSED. DOCUMENTING THE EFFECTS:</p>
      <ol class="exposure-list">
        <li>HE ASKED US ALL IF WE HAVE SEEN IT.</li>
        <li>REMOVING HIM FROM THE LOCATION OF EXPOSURE HAS NOT HELPED.</li>
        <li>HE IS TRYING TO WRITE SOMETHING IN THE WALLS.</li>
        <li>HAVE YOU SEEN IT?</li>
      </ol>`
  },
  "field-transmission": {
    title: "Recovered Field Transmission",
    eyebrow: "GLOBAL ACCESS FILE // 250",
    body: `
      <h1 class="file-title">Recovered Field Transmission // Partial</h1>
      <div class="transmission-log">
        <p><strong>TEAM LEAD:</strong><br>DO NOT LOOK DIRECTLY AT IT.</p>
        <p><strong>UNKNOWN:</strong><br>IT IS NOT ON THE WALL.</p>
        <p><strong>TEAM LEAD:</strong><br>THEN WHERE IS IT?</p>
        <p><strong>TEAM LEAD:</strong><br>IT WAS JUST THERE. IT CAN'T MOVE.</p>
        <p>YAMAHA SCRATCHED IT INTO THE WALL.</p>
        <p class="terminal-line">[TRANSMISSION LOST]</p>
      </div>`
  },
  "vector-appendix": {
    title: "Vector Analysis Appendix",
    eyebrow: "GLOBAL ACCESS FILE // 500",
    body: `
      <h1 class="file-title">Vector Analysis Appendix</h1>
      <div class="redaction-block">
        <p>PHYSICAL PRESENCE DOES NOT MATTER.</p>
        <p>COPIES APPEAR TO TRIGGER THE SAME EFFECTS.</p>
        <p>TEAM 1 IS NO LONGER RESPONDING. SENDING ADDITIONAL BACKUP.</p>
        <p>IF YOU ARE SEEING THIS AND STILL HAVE SOUND MIND, DO NOT ASK ABOUT IT.</p>
      </div>`
  },
  "static-protocols": {
    title: "Static Protocols",
    eyebrow: "GLOBAL ACCESS FILE // 2500",
    body: `
      <h1 class="file-title">Static Protocols</h1>
      <div class="protocol-list terminal-blackout">
        <p>ALL RECOVERED COPIES ARE MARKED FOR IMMEDIATE DESTRUCTION.</p>
        <p>ALL CONFIRMED VECTORS ARE MARKED FOR REMOVAL.</p>
        <p class="final-protocol">ALL INFECTED MUST GO.</p>
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
  if ((requirement.type === "count" || requirement.type === "code") && counts.personal < requirement.threshold) {
    return html(deniedPage(), 403);
  }

  if (requirement.type === "global-code") {
    const phase = await getEffectiveGlobalPhase(db, counts.global);
    if (phase.id < requirement.phase) return html(deniedPage(), 403);
  }

  if (requirement.type === "code" || requirement.type === "global-code") {
    const unlocked = await db.prepare(
      `SELECT 1 AS found FROM arg_code_unlocks
       WHERE visitor_id = ?1 AND file_slug = ?2`
    ).bind(visitor.id, slug).first();
    if (!unlocked) return html(deniedPage(), 403);
  }

  return html(pageShell(file));
}
