// Shareable score card: draws a PNG on a canvas (no libraries) that students can
// send to friends, a class group or their teacher.
import { downloadFile, canShareFiles } from '@/lib/platform';

const W = 1080, H = 1080;

function rounded(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

/**
 * card: { title, subtitle, value, outOf, percent, stats: [[label, value]], footer, name }
 * Returns a Blob (image/png).
 */
export async function drawScoreCard(card) {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  // background
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#061021'); bg.addColorStop(0.55, '#0b2545'); bg.addColorStop(1, '#07172e');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  // glow blobs
  for (const [x, y, r, col] of [[180, 180, 320, 'rgba(34,211,238,0.22)'], [900, 950, 360, 'rgba(59,130,246,0.22)'], [950, 180, 240, 'rgba(168,85,247,0.16)']]) {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  // card panel
  g.fillStyle = 'rgba(255,255,255,0.05)';
  rounded(g, 70, 70, W - 140, H - 140, 56); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.14)'; g.lineWidth = 3; g.stroke();

  const centre = (text, y, size, color, weight = '700', font = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif') => {
    g.fillStyle = color; g.font = `${weight} ${size}px ${font}`; g.textAlign = 'center';
    g.fillText(text, W / 2, y);
  };

  centre('ROBOCRAFT', 182, 40, '#22d3ee', '800');
  centre('Robotics · AI · Python', 226, 26, 'rgba(255,255,255,0.55)', '500');

  // title
  g.textAlign = 'center';
  const titleSize = card.title.length > 28 ? 46 : 56;
  centre(card.title, 346, titleSize, '#ffffff', '800');
  if (card.subtitle) centre(card.subtitle, 396, 28, 'rgba(255,255,255,0.6)', '500');

  // ring
  const cx = W / 2, cy = 620, R = 148;
  const pct = Math.max(0, Math.min(100, card.percent ?? 0));
  g.lineWidth = 26; g.lineCap = 'round';
  g.strokeStyle = 'rgba(255,255,255,0.12)';
  g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
  const ring = g.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  const good = pct >= 80 ? ['#34d399', '#22d3ee'] : pct >= 50 ? ['#22d3ee', '#3b82f6'] : ['#fb923c', '#f472b6'];
  ring.addColorStop(0, good[0]); ring.addColorStop(1, good[1]);
  g.strokeStyle = ring;
  g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + (pct / 100) * Math.PI * 2); g.stroke();
  centre(card.value, cy + 6, 86, '#ffffff', '800');
  if (card.outOf) centre(card.outOf, cy + 54, 30, 'rgba(255,255,255,0.6)', '600');

  // stats row
  const stats = (card.stats || []).slice(0, 3);
  if (stats.length) {
    const boxW = 250, gap = 24, total = stats.length * boxW + (stats.length - 1) * gap;
    let x = (W - total) / 2;
    for (const [label, value] of stats) {
      g.fillStyle = 'rgba(255,255,255,0.07)'; rounded(g, x, 830, boxW, 110, 24); g.fill();
      g.textAlign = 'center';
      g.fillStyle = '#ffffff'; g.font = '800 40px system-ui, sans-serif'; g.fillText(String(value), x + boxW / 2, 882);
      g.fillStyle = 'rgba(255,255,255,0.55)'; g.font = '500 22px system-ui, sans-serif'; g.fillText(String(label), x + boxW / 2, 916);
      x += boxW + gap;
    }
  }

  centre(card.footer || 'Learn robotics. Build robots. Control them.', 1000, 26, 'rgba(255,255,255,0.5)', '500');
  if (card.name) { g.textAlign = 'left'; g.fillStyle = 'rgba(255,255,255,0.65)'; g.font = '600 26px system-ui, sans-serif'; g.fillText(card.name, 110, 182); }

  return new Promise(res => c.toBlob(b => res(b), 'image/png'));
}

/** Share the card with the system share sheet, or download it. */
export async function shareScoreCard(card) {
  const blob = await drawScoreCard(card);
  const name = `robocraft-${(card.title || 'score').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
  const file = new File([blob], name, { type: 'image/png' });
  const text = `${card.title} — ${card.value}${card.outOf ? ' ' + card.outOf : ''} on RoboCraft`;
  if (canShareFiles && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], text }); return 'shared'; }
    catch (e) { if (e?.name === 'AbortError') return 'cancelled'; }
  }
  await downloadFile(blob, name, 'image/png');
  return 'downloaded';
}
