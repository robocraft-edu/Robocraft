// Printable practice paper and answer key (jsPDF, works offline).
import { downloadFile } from '@/lib/platform';
import { toPlainText } from '@/components/lesson/RichText';

// The built-in PDF font only has basic Latin characters — swap the rest.
export function pdfSafe(s) {
  return String(s ?? '')
    .replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, '-').replace(/…/g, '...')
    .replace(/→/g, '->').replace(/←/g, '<-').replace(/↔/g, '<->').replace(/⇒/g, '=>')
    .replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/≠/g, '!=').replace(/≈/g, '~').replace(/±/g, '+/-')
    .replace(/×/g, 'x').replace(/÷/g, '/').replace(/·/g, '.').replace(/√/g, 'sqrt').replace(/∑|Σ/g, 'Sum ')
    .replace(/θ/g, 'theta').replace(/φ/g, 'phi').replace(/α/g, 'alpha').replace(/τ/g, 'tau').replace(/µ|μ/g, 'u').replace(/Ω/g, 'ohm').replace(/π/g, 'pi')
    .replace(/°/g, ' deg').replace(/⊕/g, ' XOR ')
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, d => '0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(d)])
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, d => '^' + '0123456789'['⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(d)])
    .replace(/̅/g, "'").normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[✓✔]/g, 'Yes').replace(/[✗✘]/g, 'No').replace(/•/g, '-')
    // Deliberate: jsPDF's built-in fonts only cover Latin-1, so anything
    // outside printable ASCII is dropped rather than printed as tofu.
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7E\n]/g, '');
}

async function makeWriter() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 46;
  let y = M;
  const ensure = h => { if (y + h > H - M) { doc.addPage(); y = M; } };
  const text = (t, { size = 10, bold = false, indent = 0, color = [25, 25, 35], gap = 3, align } = {}) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(pdfSafe(t), W - 2 * M - indent);
    for (const ln of lines) {
      ensure(size + gap);
      if (align === 'center') doc.text(ln, W / 2, y, { align: 'center' }); else doc.text(ln, M + indent, y);
      y += size + gap;
    }
  };
  const rule = () => { ensure(10); doc.setDrawColor(180); doc.line(M, y, W - M, y); y += 12; };
  const space = (h = 6) => { y += h; };
  return { doc, text, rule, space };
}

function header(w, paper, title) {
  const p = paper.pattern;
  w.text(`${p.board} - ${p.title}`, { size: 15, bold: true, align: 'center' });
  w.text(title, { size: 11, bold: true, align: 'center', color: [0, 110, 150] });
  w.text(`RoboCraft practice paper #${paper.paperNo}  |  Maximum marks: ${p.total}  |  Time: ${p.minutes / 60} hours`, { size: 9, align: 'center', color: [90, 90, 100] });
  w.rule();
}

export async function downloadPaperPdf(paper, withAnswers = false) {
  const w = await makeWriter();
  const p = paper.pattern;
  header(w, paper, withAnswers ? 'ANSWER KEY & MARKING GUIDE' : 'QUESTION PAPER');
  if (!withAnswers) {
    w.text('General instructions:', { bold: true, size: 10 });
    w.text(`- Section A is compulsory. Attempt any ${p.B.attempt} questions from Section B.`, { size: 9 });
    w.text('- The intended marks for questions or parts of questions are given in brackets [ ].', { size: 9 });
    w.text('- Draw neat, labelled diagrams wherever needed. Write programs with comments.', { size: 9 });
    w.space(8);
  }
  w.text(`SECTION A  (${p.A.mcq + p.A.short * p.A.shortMarks} marks) - Attempt all questions`, { bold: true, size: 11 });
  w.text('Question 1 - Choose the correct option:', { bold: true, size: 10 });
  paper.sectionA.mcqs.forEach((q, i) => {
    w.text(`(${i + 1}) ${q.q}  [1]`, { size: 9.5, indent: 8 });
    if (!withAnswers) w.text(q.options.map((o, k) => `(${'abcd'[k] || k + 1}) ${o}`).join('    '), { size: 9, indent: 24, color: [60, 60, 70] });
    else w.text(`Answer: (${'abcd'[q.answer]}) ${q.options[q.answer]}${q.explanation ? ' - ' + q.explanation : ''}`, { size: 9, indent: 24, color: [0, 120, 80] });
  });
  w.space(6);
  w.text(`Question 2 - Answer briefly (${p.A.shortMarks} marks each):`, { bold: true, size: 10 });
  paper.sectionA.shorts.forEach((q, i) => {
    w.text(`(${i + 1}) ${q.q}  [${p.A.shortMarks}]`, { size: 9.5, indent: 8 });
    if (withAnswers) w.text(toPlainText(q.a), { size: 9, indent: 24, color: [0, 120, 80] });
  });
  w.space(10);
  w.text(`SECTION B  (${p.B.attempt * p.B.parts * p.B.partMarks} marks) - Attempt any ${p.B.attempt} questions`, { bold: true, size: 11 });
  paper.sectionB.forEach((b, bi) => {
    w.space(4);
    w.text(`Question ${bi + 3}  (${b.unit})`, { bold: true, size: 10 });
    b.parts.forEach((q, pi) => {
      w.text(`(${'abc'[pi]}) ${q.q}  [${p.B.partMarks}]`, { size: 9.5, indent: 8 });
      if (withAnswers) w.text(toPlainText(q.a), { size: 9, indent: 24, color: [0, 120, 80] });
    });
  });
  w.space(10);
  w.text('Practice paper made by RoboCraft (made & licensed by Aryan) from your syllabus chapters. Check your school\'s latest specimen paper for the official format.', { size: 8, color: [120, 120, 130] });
  const name = `RoboCraft_${paper.classId}_Paper${paper.paperNo}${withAnswers ? '_AnswerKey' : ''}.pdf`;
  await downloadFile(w.doc.output('blob'), name, 'application/pdf');
}
