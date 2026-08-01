import { jsPDF } from 'jspdf';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

const outPath = process.argv[2] || '/opt/cursor/artifacts/NovaSpace_Large_Print_Sample.pdf';

const doc = new jsPDF();
let y = 28;

doc.setFont('Helvetica', 'bold');
doc.setFontSize(32);
doc.setTextColor(15, 23, 42);
doc.text('NovaSpace', 14, y);
y += 14;

doc.setFontSize(20);
doc.text('Large-Print Sample Report', 14, y);
y += 12;

doc.setFont('Helvetica', 'normal');
doc.setFontSize(14);
doc.setTextColor(71, 85, 105);
doc.text(`Generated on ${new Date().toLocaleString()}`, 14, y);
y += 10;
doc.text('Reporting Period: Sample print preview', 14, y);
y += 16;

doc.setDrawColor(226, 232, 240);
doc.setLineWidth(0.5);
doc.line(14, y, 196, y);
y += 14;

doc.setFont('Helvetica', 'bold');
doc.setFontSize(18);
doc.setTextColor(15, 23, 42);
doc.text('SUMMARY', 14, y);
y += 12;

doc.setFont('Helvetica', 'normal');
doc.setFontSize(15);
const lines = [
  'Total Bookings: 42',
  'Total Revenue: 125,000 EGP',
  'Instapay: 48,000 EGP',
  'Cash: 32,500 EGP',
  'Card / POS: 36,000 EGP',
  'NovaPoints: 8,500 EGP',
];

for (const line of lines) {
  doc.text(line, 14, y);
  y += 10;
}

y += 8;
doc.setFont('Helvetica', 'bold');
doc.setFontSize(18);
doc.text('PRINT NOTES', 14, y);
y += 12;

doc.setFont('Helvetica', 'normal');
doc.setFontSize(15);
const notes = doc.splitTextToSize(
  'This sample uses enlarged title (32pt), section (18pt), and body (15pt) text so reports stay readable when printed. Exported analytics PDFs in the app now use the same larger sizing.',
  180
);
doc.text(notes, 14, y);

mkdirSync(dirname(outPath), { recursive: true });
const buf = Buffer.from(doc.output('arraybuffer'));
writeFileSync(outPath, buf);
console.log(`Wrote ${outPath} (${buf.length} bytes)`);
