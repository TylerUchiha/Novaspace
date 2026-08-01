/**
 * Generate large-text NovaSpace business cards for print.
 * Standard card: 3.5" × 2" at 300 DPI = 1050 × 600 px
 */
import puppeteer from 'puppeteer';
import { jsPDF } from 'jspdf';
import { mkdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import { join } from 'path';

const OUT_DIR = process.argv[2] || '/opt/cursor/artifacts';
const CARD_W = 1050; // 3.5in @ 300dpi
const CARD_H = 600;  // 2in @ 300dpi

const cardCss = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=DM+Sans:opsz,wght@9..40,500;9..40,700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0f172a; }
  .card {
    width: ${CARD_W}px;
    height: ${CARD_H}px;
    position: relative;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    color: #0f172a;
  }
  .front {
    background:
      radial-gradient(ellipse 80% 70% at 100% 0%, rgba(37,99,235,0.35), transparent 55%),
      radial-gradient(ellipse 60% 80% at 0% 100%, rgba(14,165,233,0.18), transparent 50%),
      linear-gradient(135deg, #f8fafc 0%, #e2e8f0 48%, #dbeafe 100%);
  }
  .back {
    background:
      radial-gradient(ellipse 70% 60% at 0% 0%, rgba(56,189,248,0.25), transparent 50%),
      radial-gradient(ellipse 80% 70% at 100% 100%, rgba(37,99,235,0.45), transparent 55%),
      linear-gradient(160deg, #0b1220 0%, #0f172a 45%, #1e3a8a 100%);
    color: #f8fafc;
  }
  .accent-bar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 18px;
    background: linear-gradient(180deg, #2563eb, #0ea5e9);
  }
  .front .content {
    padding: 40px 48px 40px 64px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .brand {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: 72px;
    letter-spacing: -0.045em;
    line-height: 0.92;
    color: #0f172a;
  }
  .brand span { color: #2563eb; }
  .tagline {
    margin-top: 14px;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #334155;
  }
  .person { margin-top: auto; }
  .name {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 52px;
    letter-spacing: -0.03em;
    line-height: 1.05;
  }
  .role {
    margin-top: 10px;
    font-size: 28px;
    font-weight: 700;
    color: #1d4ed8;
  }
  .grid-dot {
    position: absolute;
    inset: 0;
    opacity: 0.12;
    background-image: radial-gradient(#1e293b 1.5px, transparent 1.5px);
    background-size: 22px 22px;
    pointer-events: none;
  }
  .back .content {
    padding: 40px 48px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 26px;
    position: relative;
    z-index: 1;
  }
  .back .brand-sm {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 800;
    font-size: 48px;
    letter-spacing: -0.03em;
  }
  .back .brand-sm span { color: #38bdf8; }
  .contact-row {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .contact-item {
    display: flex;
    align-items: baseline;
    gap: 16px;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .contact-label {
    width: 110px;
    flex-shrink: 0;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #7dd3fc;
  }
  .footer-note {
    margin-top: 4px;
    font-size: 22px;
    font-weight: 600;
    color: #e2e8f0;
  }
`;

const frontHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${cardCss}</style></head>
<body><div class="card front">
  <div class="grid-dot"></div>
  <div class="accent-bar"></div>
  <div class="content">
    <div>
      <div class="brand">Nova<span>Space</span></div>
      <div class="tagline">Coworking · Worldwide</div>
    </div>
    <div class="person">
      <div class="name">Ahmed Selim</div>
      <div class="role">Founder & Owner</div>
    </div>
  </div>
</div></body></html>`;

const backHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${cardCss}</style></head>
<body><div class="card back">
  <div class="grid-dot" style="opacity:0.08"></div>
  <div class="content">
    <div class="brand-sm">Nova<span>Space</span></div>
    <div class="contact-row">
      <div class="contact-item"><span class="contact-label">Email</span>support@novaspace.ai</div>
      <div class="contact-item"><span class="contact-label">Phone</span>+1 (800) 555-NOVA</div>
      <div class="contact-item"><span class="contact-label">Web</span>novaspace.ai</div>
    </div>
    <div class="footer-note">Designed for modern professionals</div>
  </div>
</div></body></html>`;

async function renderCard(browser, html, outPath) {
  const page = await browser.newPage();
  await page.setViewport({ width: CARD_W, height: CARD_H, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // Wait for fonts
  await page.evaluateHandle('document.fonts.ready');
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: outPath, type: 'png', omitBackground: false });
  await page.close();
}

function toDataUrl(pngPath) {
  return `data:image/png;base64,${readFileSync(pngPath).toString('base64')}`;
}

function buildPdf(frontPng, backPng, outPath) {
  // PDF in inches: 3.5 x 2
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [3.5, 2],
  });
  doc.addImage(toDataUrl(frontPng), 'PNG', 0, 0, 3.5, 2);
  doc.addPage([3.5, 2], 'landscape');
  doc.addImage(toDataUrl(backPng), 'PNG', 0, 0, 3.5, 2);
  writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')));
}

function buildPrintSheet(frontPng, backPng, outPath) {
  // US Letter sheet with two cards (front + back) for easy printing
  const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
  const marginX = (8.5 - 3.5) / 2;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('NovaSpace Business Card — Large Print', marginX, 0.7);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Front  ·  Cut to 3.5 × 2 in  ·  300 DPI', marginX, 0.95);
  doc.addImage(toDataUrl(frontPng), 'PNG', marginX, 1.2, 3.5, 2);
  doc.setDrawColor(180);
  doc.rect(marginX, 1.2, 3.5, 2);
  doc.text('Back', marginX, 3.55);
  doc.addImage(toDataUrl(backPng), 'PNG', marginX, 3.7, 3.5, 2);
  doc.rect(marginX, 3.7, 3.5, 2);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text('Text sized larger for print readability. Print at 100% scale, no fit-to-page.', marginX, 6.1);
  writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')));
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(join(OUT_DIR, 'screenshots'), { recursive: true });
mkdirSync(join(process.cwd(), 'assets', 'business-card'), { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const frontArt = join(OUT_DIR, 'NovaSpace_Business_Card_Front.png');
const backArt = join(OUT_DIR, 'NovaSpace_Business_Card_Back.png');
const preview = join(OUT_DIR, 'screenshots', 'business-card-preview.png');
const pdfCard = join(OUT_DIR, 'NovaSpace_Business_Card_Large_Print.pdf');
const pdfSheet = join(OUT_DIR, 'NovaSpace_Business_Card_Print_Sheet.pdf');

await renderCard(browser, frontHtml, frontArt);
await renderCard(browser, backHtml, backArt);

// Side-by-side preview
const previewHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#0f172a;display:flex;gap:28px;padding:36px;align-items:center;justify-content:center}
  img{width:525px;height:300px;border-radius:10px;box-shadow:0 20px 50px rgba(0,0,0,.45)}
</style></head><body>
  <img src="file://${frontArt}" />
  <img src="file://${backArt}" />
</body></html>`;
const previewPage = await browser.newPage();
await previewPage.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });
await previewPage.goto(`data:text/html,${encodeURIComponent(previewHtml)}`, { waitUntil: 'networkidle0' });
// Use setContent with embedded images via base64 instead for reliability
await previewPage.close();

const frontB64 = (await import('fs')).readFileSync(frontArt).toString('base64');
const backB64 = (await import('fs')).readFileSync(backArt).toString('base64');
const previewPage2 = await browser.newPage();
await previewPage2.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });
await previewPage2.setContent(`<!DOCTYPE html><html><body style="margin:0;background:#0f172a;display:flex;gap:28px;padding:36px;align-items:center;justify-content:center">
<img style="width:525px;height:300px;border-radius:10px;box-shadow:0 20px 50px rgba(0,0,0,.45)" src="data:image/png;base64,${frontB64}"/>
<img style="width:525px;height:300px;border-radius:10px;box-shadow:0 20px 50px rgba(0,0,0,.45)" src="data:image/png;base64,${backB64}"/>
</body></html>`, { waitUntil: 'networkidle0' });
await previewPage2.screenshot({ path: preview, type: 'png' });
await previewPage2.close();

await browser.close();

buildPdf(frontArt, backArt, pdfCard);
buildPrintSheet(frontArt, backArt, pdfSheet);

// Also copy into repo assets for the PR
const repoDir = join(process.cwd(), 'assets', 'business-card');
for (const src of [frontArt, backArt, pdfCard, pdfSheet]) {
  copyFileSync(src, join(repoDir, src.split('/').pop()));
}

console.log('Generated:');
for (const p of [frontArt, backArt, pdfCard, pdfSheet, preview]) {
  console.log(' -', p);
}
