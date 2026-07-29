import {
  GLOBAL_FILES,
  deniedPage,
  getCounts,
  getEffectiveGlobalPhase,
  getVisitor,
  html,
  pageShell
} from "../../_lib/arg.js";

const FILES = {
  "situation-report-01": {
    title: "Situation Report 01",
    eyebrow: "GLOBAL FILE // 025",
    body: `
      <h1 class="file-title">Situation Report 01</h1>
      <div class="redaction-block">
        <p>REPORTS ORIGINATE FROM UNCONNECTED OBSERVERS.</p>
        <p>ALL SUBJECTS REPEAT THE SAME PHRASE:</p>
        <p class="report-emphasis">“HAVE YOU SEEN IT?”</p>
        <p>NO COMMON TRANSMISSION SOURCE HAS BEEN IDENTIFIED.</p>
      </div>`
  },
  "situation-report-02": {
    title: "Situation Report 02",
    eyebrow: "GLOBAL FILE // 050",
    body: `
      <h1 class="file-title">Situation Report 02</h1>
      <div class="redaction-block">
        <p>WE BELIEVE THE INDIVIDUALS EXPOSED TO THE VECTOR MAY BECOME VECTORS THEMSELVES.</p>
        <p>WE ARE SENDING IN AN EXPENDABLE TEAM.</p>
      </div>`
  },
  "situation-report-03": {
    title: "Situation Report 03",
    eyebrow: "GLOBAL FILE // 100",
    body: `
      <h1 class="file-title">Situation Report 03</h1>
      <div class="redaction-block">
        <p>ONE MEMBER OF THE TEAM HAS JOINED THE VICTIMS.</p>
        <p>TWO ARE LOST.</p>
        <p>REQUESTING BACKUP.</p>
      </div>`
  },
  "field-notice": {
    title: "Field Notice",
    eyebrow: "GLOBAL FILE // 250",
    body: `
      <h1 class="file-title">Field Notice</h1>
      <div class="protocol-list">
        <p>DO NOT ASK SUBJECTS WHAT THEY HAVE SEEN.</p>
        <p>DO NOT REPRODUCE UNIDENTIFIED SYMBOLS.</p>
        <p>DO NOT VIEW RECOVERED MATERIAL ALONE.</p>
        <p>REPORT ALL SECONDARY TRANSMISSION IMMEDIATELY.</p>
      </div>`
  },
  "vector-analysis": {
    title: "Vector Analysis",
    eyebrow: "GLOBAL FILE // 500",
    body: `
      <h1 class="file-title">Vector Analysis</h1>
      <div class="redaction-block">
        <p>THE INCURSION DOES NOT REQUIRE A SINGLE PHYSICAL SOURCE.</p>
        <p>EACH EXPOSED OBSERVER MAY BECOME A NEW TRANSMISSION POINT.</p>
      </div>`
  },
  "network-propagation": {
    title: "Network Propagation Report",
    eyebrow: "GLOBAL FILE // 1000",
    body: `
      <h1 class="file-title">Network Propagation Report</h1>
      <p class="hashtag-hint" aria-label="hashtag">#</p>
      <div class="acrostic-report">
        <p><strong>E</strong>XPOSURE REPORTS NOW EXTEND BEYOND THE ATLANTA INCIDENT.</p>
        <p><strong>G</strong>LOBAL NETWORK TRAFFIC CONTAINS RECURRING COPIES OF THE IMAGE.</p>
        <p><strong>N</strong>O ORIGINAL UPLOAD OR CENTRAL DISTRIBUTOR HAS BEEN IDENTIFIED.</p>
        <p><strong>K</strong>NOWN OBSERVERS ARE SEEKING AND SHARING RELATED MATERIAL.</p>
        <p><strong>I</strong>NFECTION MAY OCCUR THROUGH COPIED OR ALTERED IMAGES.</p>
        <p><strong>Y</strong>IELD ALL RECOVERED ONLINE MATERIAL FOR IMMEDIATE REVIEW.</p>
      </div>`
  },
  "containment-failure": {
    title: "Containment Failure Notice",
    eyebrow: "GLOBAL FILE // 1000",
    body: `
      <h1 class="file-title">Containment Failure Notice</h1>
      <div class="redaction-block">
        <p>THE SIGNAL IS NOW PROPAGATING INDEPENDENTLY.</p>
        <p>OBSERVERS ARE SEEKING ADDITIONAL MATERIAL WITHOUT PROMPTING.</p>
        <p>SUBJECTS MAY NOT RECOGNIZE THEIR OWN ROLE IN THE SPREAD.</p>
      </div>`
  },
  "static-protocols": {
    title: "Static Protocols",
    eyebrow: "GLOBAL FILE // 2500",
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
  const metadata = GLOBAL_FILES.find((item) => item.slug === slug);
  const file = FILES[slug];
  if (!db || !metadata || !file) return html(deniedPage(), 404);

  const visitor = getVisitor(context.request);
  const counts = await getCounts(db, visitor.id);
  const phase = await getEffectiveGlobalPhase(db, counts.global);
  if (phase.id < metadata.phase) return html(deniedPage(), 403);

  return html(pageShell(file));
}
