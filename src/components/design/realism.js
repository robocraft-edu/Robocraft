// Makes library parts look like the real components: physically based
// materials (metal, gold pins, glossy PCB, rubber, translucent plastic),
// smooth round surfaces, softly bevelled box edges, studio reflections and
// soft shadows. Display only: the STL export and hole maths are unchanged.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeVertices, toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { unitShape } from '@/lib/design/shapes';

// ── materials ──
const SILVER = new Set(['#b9c0ca', '#9aa4b2', '#cbd5e1', '#e2e8f0', '#cfd6df', '#d1d5db']);
const GOLD = new Set(['#c8a94b', '#d4a017']);

const PRESET = {
  pcb: { roughness: 0.38, metalness: 0.05, clearcoat: 0.9, clearcoatRoughness: 0.25 },
  metal: { roughness: 0.28, metalness: 0.95 },
  brushed: { roughness: 0.45, metalness: 0.85 },
  gold: { color: '#d4af37', roughness: 0.22, metalness: 1 },
  rubber: { roughness: 0.92, metalness: 0, sheen: 0.4, sheenRoughness: 0.8 },
  plastic: { roughness: 0.42, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4 },
  matte: { roughness: 0.75, metalness: 0 },
  glossy: { roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12 },
  translucent: { roughness: 0.25, metalness: 0, transmission: 0.45, thickness: 4, clearcoat: 0.6, ior: 1.45 },
  glass: { roughness: 0.08, metalness: 0, transmission: 0.6, thickness: 3, clearcoat: 1, ior: 1.5 },
  ceramic: { roughness: 0.35, metalness: 0, clearcoat: 0.5 },
};

export function guessMat(kid) {
  if (kid.mat) return kid.mat;
  const c = String(kid.color || '').toLowerCase();
  if (GOLD.has(c)) return 'gold';
  if (SILVER.has(c)) return 'metal';
  if (kid.type === 'box' && kid.size?.[2] <= 1.7 && kid.size?.[0] > 15 && kid.size?.[1] > 15) return 'pcb';
  return 'plastic';
}

export function partMaterial(kid, fallbackColor) {
  const preset = PRESET[guessMat(kid)] || PRESET.plastic;
  const m = new THREE.MeshPhysicalMaterial({ color: kid.color || fallbackColor || '#ef4444', envMapIntensity: 1, ...preset });
  if (preset.transmission) m.transparent = true;
  return m;
}

/** Material for a plain user shape (Tinkercad block): nicer plastic, same colour. */
export function shapeMaterial(color) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.38, metalness: 0, clearcoat: 0.4, clearcoatRoughness: 0.35 });
}

// ── geometry ──
const ROUND = new Set(['cylinder', 'sphere', 'cone', 'dome', 'tube', 'torus', 'hex']);
const SMOOTH = {};
/** The unit shape (centred, y −0.5…0.5) with smooth normals on curved faces and sharp edges kept. */
export function smoothUnit(type) {
  if (SMOOTH[type]) return SMOOTH[type];
  const base = unitShape(type);
  const pos = new Float32Array(base.length);
  for (let i = 0; i < base.length; i += 3) { pos[i] = base[i]; pos[i + 1] = base[i + 1] - 0.5; pos[i + 2] = base[i + 2]; }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (ROUND.has(type)) { g = toCreasedNormals(mergeVertices(g, 1e-5), (type === 'hex' ? 25 : 40) * Math.PI / 180); }
  else g.computeVertexNormals();
  SMOOTH[type] = g;
  return g;
}

const ROUNDED = new Map();
/**
 * A box with softly rounded edges, built at its real size (mm) and then
 * normalised to a unit cube, so the usual size-scaling restores it exactly.
 */
function roundedUnitBox(w, h, d) {
  const key = `${w.toFixed(2)}|${h.toFixed(2)}|${d.toFixed(2)}`;
  if (ROUNDED.has(key)) return ROUNDED.get(key);
  const r = Math.min(0.6, Math.min(w, h, d) * 0.18);
  const g = new RoundedBoxGeometry(w, h, d, 2, r);
  const p = g.attributes.position, n = g.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    p.setXYZ(i, p.getX(i) / w, p.getY(i) / h, p.getZ(i) / d);
    // normals transform by the inverse transpose of the scale: multiply by size
    const nx = n.getX(i) * w, ny = n.getY(i) * h, nz = n.getZ(i) * d, L = Math.hypot(nx, ny, nz) || 1;
    n.setXYZ(i, nx / L, ny / L, nz / L);
  }
  if (ROUNDED.size > 600) ROUNDED.clear();
  ROUNDED.set(key, g);
  return g;
}

/** Geometry for one sub-part of a library part. */
export function kidGeometry(kid) {
  const [w, d, h] = kid.size;
  if (kid.type === 'box' && !kid.hole && Math.min(w, d, h) >= 0.9) return roundedUnitBox(w, h, d);
  return smoothUnit(kid.type);
}

// ── lighting ──
/** Studio reflections, filmic tone mapping and a soft contact shadow. Returns a dispose(). */
export function studioLook(renderer, scene, { sun }) {
  // Neutral keeps the real component colours (ACES washes reds and yellows out).
  renderer.toneMapping = THREE.NeutralToneMapping ?? THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  if (sun) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const c = sun.shadow.camera; c.left = -160; c.right = 160; c.top = 160; c.bottom = -160; c.near = 10; c.far = 900;
    sun.shadow.radius = 4; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.4;
  }
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShadowMaterial({ opacity: 0.18 }));
  catcher.rotation.x = -Math.PI / 2; catcher.position.y = 0.02; catcher.receiveShadow = true;
  scene.add(catcher);
  return () => { env.dispose(); pmrem.dispose(); scene.remove(catcher); catcher.geometry.dispose(); catcher.material.dispose(); };
}
