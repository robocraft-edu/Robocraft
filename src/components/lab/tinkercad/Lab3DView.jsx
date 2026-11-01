import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getDef } from '@/lib/lab/labComponents';
import { buildPart3D, disposeGroup } from '@/lib/lab/parts3d';

// One pixel of the 2-D workbench = one world unit; a real millimetre of part is
// drawn K units long, so every part keeps its true proportions to the others.
const K = 3.2;

const COLORS = { power: 0xef4444, plus: 0xef4444, ground: 0x1f2937, minus: 0x1f2937, analog: 0x22c55e, pwm: 0xf97316, data: 0xa78bfa };

function wireHex(w, components) {
  const typeOf = (end) => {
    const c = components.find(x => x.id === end.compId);
    return c && getDef(c.type)?.pins.find(p => p.id === end.pinId)?.type;
  };
  for (const t of [typeOf(w.from), typeOf(w.to)]) if (t && COLORS[t] && (t === 'power' || t === 'plus')) return COLORS[t];
  for (const t of [typeOf(w.from), typeOf(w.to)]) if (t && COLORS[t]) return COLORS[t];
  return 0x38bdf8;
}

/**
 * The same circuit as the 2-D workbench, seen as real parts on a table.
 * Read-only: students build in 2-D, then orbit around the result in 3-D.
 */
export default function Lab3DView({ components, wires, simState }) {
  const hostRef = useRef(null);
  const simRef = useRef(simState);
  const liveRef = useRef({ parts: [] });
  const sceneRef = useRef(null);

  useEffect(() => { simRef.current = simState; }, [simState]);

  // renderer, camera, controls, lights — once
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x0b1220);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none';
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b1220, 1800, 4200);
    scene.add(new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.15));
    const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(300, 700, 400); scene.add(sun);
    const rim = new THREE.DirectionalLight(0x7dd3fc, 0.7); rim.position.set(-400, 300, -300); scene.add(rim);
    const table = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.MeshStandardMaterial({ color: 0x1a2438, roughness: 0.95 }));
    table.rotation.x = -Math.PI / 2; table.position.y = -0.5; scene.add(table);
    const grid = new THREE.GridHelper(3000, 60, 0x2b3a57, 0x1e2a42); grid.position.y = -0.3; scene.add(grid);
    const camera = new THREE.PerspectiveCamera(42, 1, 5, 9000);
    camera.position.set(300, 420, 560);
    camera.far = 12000; camera.updateProjectionMatrix();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 20; controls.maxDistance = 3500;
    controls.target.set(300, 0, 200);
    sceneRef.current = { scene, camera, controls };

    const resize = () => {
      const w = host.clientWidth || 1, h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(host);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const s = simRef.current || {};
      for (const { part, id } of liveRef.current.parts) part.update({ ...s, ...(s.comp && s.comp[id]) });
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); controls.dispose();
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, []);

  // parts and wires — rebuilt when the circuit changes
  const fitKey = useRef('');
  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return undefined;
    const root = new THREE.Group();
    const parts = [];
    const byId = {};
    const box = new THREE.Box3();

    for (const comp of components) {
      const def = getDef(comp.type);
      if (!def) continue;
      const part = buildPart3D(comp.type, def);
      part.group.scale.setScalar(K);
      part.group.position.set(comp.x + def.w / 2, 0, comp.y + def.h / 2);
      part.group.rotation.y = -((comp.rot || 0) * Math.PI) / 180;
      root.add(part.group);
      parts.push({ part, id: comp.id });
      byId[comp.id] = { part, def, comp };
    }
    root.updateMatrixWorld(true);

    for (const w of wires) {
      const a = byId[w.from.compId], b = byId[w.to.compId];
      if (!a || !b) continue;
      const pa = a.part.pins[w.from.pinId], pb = b.part.pins[w.to.pinId];
      if (!pa || !pb) continue;
      const A = a.part.group.localToWorld(pa.clone()), B = b.part.group.localToWorld(pb.clone());
      const span = A.distanceTo(B);
      const lift = 28 + span * 0.18;
      const m1 = A.clone().lerp(B, 0.25); m1.y = Math.max(A.y, B.y) + lift;
      const m2 = A.clone().lerp(B, 0.75); m2.y = Math.max(A.y, B.y) + lift;
      const up = (P) => P.clone().add(new THREE.Vector3(0, 10, 0));
      const curve = new THREE.CatmullRomCurve3([A, up(A), m1, m2, up(B), B], false, 'catmullrom', 0.3);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 36, 2.1, 8, false),
        new THREE.MeshStandardMaterial({ color: wireHex(w, components), roughness: 0.45 }),
      );
      root.add(tube);
    }
    ctx.scene.add(root);
    liveRef.current = { parts };

    // frame the circuit the first time, and whenever parts are added or removed
    const key = components.map(c => c.id).join(',');
    if (key !== fitKey.current) {
      fitKey.current = key;
      box.makeEmpty();
      parts.forEach(({ part }) => box.expandByObject(part.group));
      if (!box.isEmpty()) {
        const sph = box.getBoundingSphere(new THREE.Sphere());
        const fov = (ctx.camera.fov * Math.PI) / 180;
        const dist = Math.max(120, (sph.radius / Math.sin(fov / 2)) * 1.15);
        const dir = new THREE.Vector3(0.45, 0.75, 0.9).normalize();
        ctx.controls.target.copy(sph.center);
        ctx.camera.position.copy(sph.center).addScaledVector(dir, dist);
      }
    }
    // keep pin world positions available to the debugger and tests
    return () => {
      ctx.scene.remove(root);
      disposeGroup(root);
      liveRef.current = { parts: [] };
    };
  }, [components, wires]);

  return (
    <div className="absolute inset-0" data-testid="lab-3d">
      <div ref={hostRef} className="absolute inset-0" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 px-2.5 py-1.5 rounded-lg glass text-[10px] font-bold text-cyan-300 pointer-events-none whitespace-nowrap">
        Drag to orbit · pinch or scroll to zoom · build in 2D
      </div>
    </div>
  );
}
