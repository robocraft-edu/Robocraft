// Practical file (internal assessment) as a printable PDF, CISCE layout:
// cover → certificate → index → for each program: question, algorithm, program,
// variable description table, output, and a teacher's signature line.
import { downloadFile } from '@/lib/platform';
import { pdfSafe } from '@/lib/exam/paperPdf';

export async function buildPracticalPdf(details, items) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 50;
  let y = M;
  const ensure = (h) => { if (y + h > H - M) { doc.addPage(); y = M; border(); } };
  const border = () => { doc.setDrawColor(60); doc.setLineWidth(0.8); doc.rect(24, 24, W - 48, H - 48); };
  const text = (t, { size = 11, bold = false, font = 'helvetica', indent = 0, gap = 4, align, color = [20, 20, 30] } = {}) => {
    doc.setFont(font, bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(pdfSafe(t), W - 2 * M - indent);
    for (const ln of lines) {
      ensure(size + gap);
      if (align === 'center') doc.text(ln, W / 2, y, { align: 'center' }); else doc.text(ln, M + indent, y);
      y += size + gap;
    }
  };
  const heading = (t) => { ensure(44); y += 8; text(t, { size: 12, bold: true, color: [15, 60, 120], gap: 2 }); doc.setDrawColor(15, 60, 120); doc.line(M, y - 1, M + 60, y - 1); y += 11; };
  const code = (src) => {
    doc.setFont('courier', 'normal'); doc.setFontSize(8.6);
    const lines = pdfSafe(src).replace(/\t/g, '  ').split('\n');
    for (const raw of lines) {
      const wrapped = doc.splitTextToSize(raw || ' ', W - 2 * M - 16);
      for (const ln of wrapped) {
        ensure(11);
        doc.setFillColor(245, 246, 248); doc.rect(M, y - 8.5, W - 2 * M, 11, 'F');
        doc.setTextColor(30, 30, 40); doc.text(ln, M + 8, y);
        y += 11;
      }
    }
    y += 4;
  };
  const table = (cols, rows, widths) => {
    const x0 = M, rowH = (cells) => Math.max(...cells.map((c, i) => doc.splitTextToSize(pdfSafe(c), widths[i] - 8).length)) * 11 + 8;
    const drawRow = (cells, head) => {
      doc.setFont('helvetica', head ? 'bold' : 'normal'); doc.setFontSize(9.5);
      const h = rowH(cells);
      ensure(h);
      let x = x0;
      cells.forEach((c, i) => {
        if (head) { doc.setFillColor(225, 232, 245); doc.rect(x, y - 10, widths[i], h, 'F'); }
        doc.setDrawColor(120); doc.rect(x, y - 10, widths[i], h);
        doc.setTextColor(20, 20, 30);
        doc.text(doc.splitTextToSize(pdfSafe(c), widths[i] - 8), x + 4, y + 1);
        x += widths[i];
      });
      y += h;
    };
    drawRow(cols, true);
    rows.forEach(r => drawRow(r, false));
    y += 8;
  };

  const d = details;
  // ── cover ──
  border();
  y = 150;
  text(d.school || 'School', { size: 22, bold: true, align: 'center', color: [15, 60, 120] });
  y += 6; text(d.subject || 'Robotics and Artificial Intelligence', { size: 15, align: 'center' });
  y += 30; text('PRACTICAL FILE', { size: 30, bold: true, align: 'center' });
  y += 6; text(`Session ${d.session || ''}`, { size: 13, align: 'center' });
  y += 70;
  [['Name', d.name], ['Class & Section', `${d.className || ''} ${d.section ? '- ' + d.section : ''}`], ['Roll No.', d.roll], ['UID / Index No.', d.uid], ['Submitted to', d.teacher]].forEach(([k, v]) => {
    if (!v || !String(v).trim()) return;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.text(`${k}:`, W / 2 - 120, y);
    doc.setFont('helvetica', 'normal'); doc.text(pdfSafe(v), W / 2 - 10, y); y += 24;
  });

  // ── certificate ──
  doc.addPage(); border(); y = 130;
  text('CERTIFICATE', { size: 22, bold: true, align: 'center' });
  y += 30;
  text(`This is to certify that ${d.name || '__________'} of class ${d.className || '____'}${d.section ? ' ' + d.section : ''}, Roll No. ${d.roll || '____'}, has satisfactorily completed the practical work in ${d.subject || 'Robotics and Artificial Intelligence'} as prescribed by the Council for the Indian School Certificate Examinations (CISCE) during the academic session ${d.session || '________'}.`, { size: 12.5, gap: 8 });
  y = H - 170;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(11);
  doc.line(M, y, M + 150, y); doc.line(W - M - 150, y, W - M, y);
  y += 14; doc.text('Internal Examiner', M, y); doc.text('External Examiner', W - M - 150, y);
  y += 40; doc.line(W / 2 - 75, y, W / 2 + 75, y); y += 14; doc.text('Principal / School Stamp', W / 2, y, { align: 'center' });

  // ── acknowledgement ──
  doc.addPage(); border(); y = 120;
  text('ACKNOWLEDGEMENT', { size: 20, bold: true, align: 'center' });
  y += 24;
  text(d.ack || `I would like to express my sincere gratitude to my teacher ${d.teacher || ''} for the guidance and support throughout this practical work, and to my principal for providing the laboratory facilities. I also thank my parents and friends for their encouragement.`, { size: 12, gap: 8 });
  y += 30; text(d.name || '', { size: 12, bold: true });

  const pageOf = [];

  // ── programs ──
  items.forEach((it, i) => {
    doc.addPage(); border(); y = M + 6;
    pageOf[i] = doc.getNumberOfPages();
    text(`Program ${i + 1}`, { size: 10, color: [100, 100, 110] });
    text(it.title, { size: 15, bold: true });
    heading('Question');
    text(it.question, { size: 11, gap: 5 });
    if (it.algorithm?.length) {
      heading('Algorithm');
      it.algorithm.forEach((s, k) => text(`Step ${k + 1}: ${s}`, { size: 10.5, indent: 6 }));
    }
    heading(it.kind === 'arduino' ? 'Program (Arduino sketch)' : 'Program');
    code(it.code);
    if (it.vdt?.length) {
      heading('Variable Description Table');
      const w = W - 2 * M;
      table(['Variable', 'Data type', 'Description'], it.vdt.map(r => [r.name, r.type || '-', r.description || '-']), [w * 0.22, w * 0.22, w * 0.56]);
    }
    heading('Output');
    if (it.input) text(`Input given: ${it.input.replace(/\n/g, ', ')}`, { size: 10, color: [90, 90, 100] });
    code(it.output || '(Run the program in the app to record its output.)');
    ensure(50); y += 26;
    doc.setDrawColor(120); doc.line(W - M - 140, y, W - M, y);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.text("Teacher's signature", W - M - 140, y + 12);
  });

  // ── index: drawn last (so page numbers are known), then moved after the acknowledgement ──
  const before = doc.getNumberOfPages();
  doc.addPage(); border(); y = M + 10;
  text('INDEX', { size: 18, bold: true, align: 'center' }); y += 10;
  const est = Math.ceil((items.length + 1) / 30); // index pages (≈30 rows per page)
  table(['No.', 'Program', 'Page', 'Date', 'Sign'], items.map((it, i) => [String(i + 1), it.title, String(pageOf[i] + est), it.date || '', '']), [36, W - 2 * M - 36 - 50 - 80 - 70, 50, 80, 70]);
  const idxPages = doc.getNumberOfPages() - before;
  for (let k = 0; k < idxPages; k++) doc.movePage(before + 1 + k, 4 + k);

  // page numbers
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(120);
    doc.text(d.name ? `${pdfSafe(d.name)} - Practical File` : 'Practical File', M, H - 32);
    doc.text(String(p), W - M, H - 32, { align: 'right' });
    doc.setFontSize(7); doc.setTextColor(150); doc.text('Made with RoboCraft by Aryan', W / 2, H - 32, { align: 'center' });
  }
  return doc;
}

export async function downloadPracticalPdf(details, items) {
  const doc = await buildPracticalPdf(details, items);
  const name = `Practical_File_${(details.name || 'student').replace(/[^\w]+/g, '_')}.pdf`;
  return downloadFile(doc.output('blob'), name, 'application/pdf');
}
