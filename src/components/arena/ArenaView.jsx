import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ROBOT, ROBOT_PINS } from '@/lib/arena/world';
import { buildPart3D } from '@/lib/lab/parts3d';

const PX = 4; // texture pixels per cm
// Cheap phones: skip shadows and render a little softer so the simulation stays smooth.
const LOW_END = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) <= 4;

function floorTexture(map) {
  const [W, H] = map.size;
  const c = document.createElement('canvas');
  c.width = Math.min(2048, W * PX); c.height = Math.min(2048, H * PX);
  const sx = c.width / W, sy = c.height / H;
  const g = c.getContext('2d');
  const toPx = (x, y) => [(x + W / 2) * sx, (H / 2 - y) * sy];
  g.fillStyle = map.floor === 'white' ? '#f4f5f7' : map.floor === 'table' ? '#20232b' : '#cfd4dc';
  g.fillRect(0, 0, c.width, c.height);
  if (map.floor !== 'table') {
    g.strokeStyle = 'rgba(0,0,0,0.06)'; g.lineWidth = 1;
    for (let x = -W / 2; x <= W / 2; x += 20) { const [px] = toPx(x, 0); g.beginPath(); g.moveTo(px, 0); g.lineTo(px, c.height); g.stroke(); }
    for (let y = -H / 2; y <= H / 2; y += 20) { const [, py] = toPx(0, y); g.beginPath(); g.moveTo(0, py); g.lineTo(c.width, py); g.stroke(); }
  }
  if (map.goal) {
    const [gx, gy] = toPx(map.goal.x, map.goal.y + map.goal.h);
    g.fillStyle = 'rgba(34,197,94,0.35)'; g.fillRect(gx, gy, map.goal.w * sx, map.goal.h * sy);
    g.strokeStyle = '#16a34a'; g.lineWidth = 3; g.strokeRect(gx, gy, map.goal.w * sx, map.goal.h * sy);
    g.fillStyle = '#15803d'; g.font = `bold ${Math.round(8 * sx)}px sans-serif`; g.fillText('GOAL', gx + 6, gy + 10 * sy);
  }
  if (map.line) {
    g.strokeStyle = '#111'; g.lineWidth = map.line.width * sx; g.lineJoin = 'round'; g.lineCap = 'round';
    g.beginPath();
    map.line.pts.forEach(([x, y], i) => { const [px, py] = toPx(x, y); i ? g.lineTo(px, py) : g.moveTo(px, py); });
    if (map.line.closed) g.closePath();
    g.stroke();
    // start mark
    const [sx0, sy0] = toPx(map.line.pts[0][0], map.line.pts[0][1]);
    g.fillStyle = '#ef4444'; g.beginPath(); g.arc(sx0, sy0, 3 * sx, 0, Math.PI * 2); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// A real part (modelled in millimetres) standing on the chassis; the arena works in cm.
function place(g, type, x, z, rotY = 0, y = 3.8) {
  const part = buildPart3D(type);
  part.group.scale.setScalar(0.1);
  part.group.position.set(x, y, z);
  part.group.rotation.y = rotY;
  g.add(part.group);
  return part;
}

function makeRobot(custom) {
  const g = new THREE.Group();
  const kinds = custom?.parts || [];
  const blue = new THREE.MeshStandardMaterial({ color: /^#[0-9a-f]{6}$/i.test(custom?.color || '') ? custom.color : 0x0ea5e9, roughness: 0.5, metalness: 0.1 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(ROBOT.length, 1.2, ROBOT.width), blue);
  chassis.position.y = 3.2; g.add(chassis);
  place(g, 'arduino_uno', -1.5, 0);
  place(g, 'battery', -5.5, 1.5);
  const wheels = [];
  for (const [x, z] of [[4.5, 7], [4.5, -7], [-4.5, 7], [-4.5, -7]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 2, 20), dark);
    w.rotation.x = Math.PI / 2; w.position.set(x, 3.2, z); g.add(w); wheels.push(w);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 2.1, 10), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    hub.rotation.x = Math.PI / 2; hub.position.copy(w.position); g.add(hub); wheels.push(hub);
  }
  // ultrasonic sensor on the nose, eyes facing forward
  place(g, 'ultrasonic', ROBOT.length / 2 - 1.1, 0, Math.PI / 2, 3.5);
  // IR sensors under the front
  const irMat = [];
  for (const z of [3.5, -3.5]) {
    const m = new THREE.MeshStandardMaterial({ color: 0x111827, emissive: 0x000000 });
    const ir = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), m); ir.position.set(ROBOT.length / 2 - 0.6, 2.2, z); g.add(ir); irMat.push(m);
  }
  const ledPart = place(g, 'led', 2.5, 2.5);
  // the sim drives `ledMat.emissive.setHex(...)`; hand it to the real LED
  const ledMat = { emissive: { setHex: (h) => ledPart.update({ ledOn: h !== 0, brightness: 1 }) } };
  // Parts a student chose in "Build your own robot" show up on the body.
  let arm = null;
  if (kinds.includes('servo')) {
    const sv = buildPart3D('servo', undefined);
    sv.group.remove(sv.horn); // the arm below is the horn
    sv.group.scale.setScalar(0.1); sv.group.position.set(4.0, 3.8, 0); g.add(sv.group);
    arm = new THREE.Group(); arm.position.set(3.45, 6.8, 0); g.add(arm);
    const link = new THREE.Mesh(new THREE.BoxGeometry(11, 1.2, 1.6), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    link.position.set(5, 0, 0); arm.add(link);
    for (const z of [-1.6, 1.6]) {
      const claw = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1, 0.6), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      claw.position.set(10.5, 0, z); arm.add(claw);
    }
  }
  let buzzMat = null;
  if (kinds.includes('buzzer')) {
    const bzPart = place(g, 'buzzer', -1, -2.2);
    buzzMat = { emissive: { setHex: (h) => bzPart.update({ buzzerOn: h !== 0 }) } };
  }
  if (kinds.includes('line_array')) {
    for (const z of [2.5, 0, -2.5]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(1, 0.7, 1), new THREE.MeshStandardMaterial({ color: 0x7c3aed })); s.position.set(ROBOT.length / 2 - 0.5, 2, z); g.add(s);
    }
  }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return { group: g, wheels, irMat, ledMat, arm, buzzMat };
}

function makeBin() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(14, 12, 34, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0x16a34a, side: THREE.DoubleSide, roughness: 0.6 }));
  body.position.y = 17; g.add(body);
  const base = new THREE.Mesh(new THREE.CircleGeometry(12, 28), new THREE.MeshStandardMaterial({ color: 0x14532d })); base.rotation.x = -Math.PI / 2; base.position.y = 0.2; g.add(base);
  const hinge = new THREE.Group(); hinge.position.set(-14, 34, 0); g.add(hinge);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 14.5, 1.5, 28), new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 }));
  lid.position.set(14, 0.75, 0); hinge.add(lid);
  // sensor on the front
  for (const z of [1.5, -1.5]) {
    const eye = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1.2, 14), new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.6 }));
    eye.rotation.z = Math.PI / 2; eye.position.set(14.6, 29, z); g.add(eye);
  }
  const hand = new THREE.Group();
  const palm = new THREE.Mesh(new THREE.BoxGeometry(3, 9, 8), new THREE.MeshStandardMaterial({ color: 0xf2c8a0, roughness: 0.8 }));
  palm.position.y = 0; hand.add(palm);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 30, 12), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
  arm.rotation.z = Math.PI / 2; arm.position.x = 16; hand.add(arm);
  hand.position.set(60, 29, 0); g.add(hand);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return { group: g, hinge, hand };
}

/** 3-D view of an ArenaBoard. `boardRef.current` is read every frame. */
export default function ArenaView({ boardRef, cameraMode = 'chase', height = 320 }) {
  const mountRef = useRef(null);
  const camModeRef = useRef(cameraMode);
  camModeRef.current = cameraMode;

  useEffect(() => {
    const mount = mountRef.current;
    const b0 = boardRef.current;
    if (!mount || !b0) return;
    const map = b0.map;
    const [W, H] = map.size;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(LOW_END ? 1.5 : 2, window.devicePixelRatio || 1));
    renderer.shadowMap.enabled = !LOW_END;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    scene.fog = new THREE.Fog(0x0b1220, 500, 1200);
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 3000);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.maxPolarAngle = Math.PI / 2.1; controls.minDistance = 40; controls.maxDistance = 800;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.4));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(-120, 260, 140); sun.castShadow = !LOW_END;
    sun.shadow.mapSize.set(LOW_END ? 512 : 1024, LOW_END ? 512 : 1024);
    Object.assign(sun.shadow.camera, { left: -W, right: W, top: H, bottom: -H, near: 10, far: 800 });
    scene.add(sun);

    const tableH = map.table ? 60 : 0;
    // floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ map: floorTexture(map), roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    if (map.table) {
      floor.position.y = 0;
      const T = map.table;
      const top = new THREE.Mesh(new THREE.BoxGeometry(T.w, 3, T.h), new THREE.MeshStandardMaterial({ color: 0xc08a52, roughness: 0.7 }));
      top.position.set(T.x + T.w / 2, tableH - 1.5, -(T.y + T.h / 2)); top.receiveShadow = true; scene.add(top);
      for (const [dx, dz] of [[4, 4], [T.w - 4, 4], [4, T.h - 4], [T.w - 4, T.h - 4]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(4, tableH - 3, 4), new THREE.MeshStandardMaterial({ color: 0x7c4a1e }));
        leg.position.set(T.x + dx, (tableH - 3) / 2, -(T.y + dz)); scene.add(leg);
      }
    }
    // obstacles and walls
    const solids = new THREE.Group(); scene.add(solids);
    const obMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
    for (const o of map.obstacles || []) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(o.w, 14, o.h), obMat);
      m.position.set(o.x + o.w / 2, 7, -(o.y + o.h / 2)); m.castShadow = true; m.receiveShadow = true; solids.add(m);
    }
    if (map.walls) {
      for (const [x, z, w, d] of [[0, H / 2 + 5, W + 20, 10], [0, -H / 2 - 5, W + 20, 10], [-W / 2 - 5, 0, 10, H], [W / 2 + 5, 0, 10, H]]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, 10, d), wallMat); m.position.set(x, 5, -z); m.receiveShadow = true; solids.add(m);
      }
    }

    let robot = null, bin = null;
    if (map.bin) { bin = makeBin(); scene.add(bin.group); }
    else { robot = makeRobot(map.custom); scene.add(robot.group); }

    // trail
    const trailGeo = new THREE.BufferGeometry();
    const trailPos = new Float32Array(600 * 3);
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.7 }));
    scene.add(trail);

    // initial camera
    if (map.bin) { camera.position.set(90, 70, 90); controls.target.set(10, 20, 0); }
    else { camera.position.set(0, Math.max(W, H) * 0.9 + tableH, Math.max(W, H) * 0.55); controls.target.set(0, tableH, 0); }

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(mount);

    let raf, fallY = 0, spin = 0;
    const camPos = new THREE.Vector3(), camTarget = new THREE.Vector3();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const b = boardRef.current;
      if (b && robot) {
        const r = b.robot;
        const baseY = map.table ? tableH : 0;
        if (r.fallen) fallY = Math.min(baseY, fallY + 4); else fallY = 0;
        robot.group.position.set(r.x, baseY - fallY, -r.y);
        robot.group.rotation.set(r.fallen ? 0.6 : 0, r.a, 0);
        spin = r.distance / 3.2;
        robot.wheels.forEach((w) => { w.rotation.y = spin; });
        robot.irMat.forEach((m, i) => { const on = b.digitalRead(i === 0 ? ROBOT_PINS.IR_LEFT : ROBOT_PINS.IR_RIGHT); m.emissive.setHex(on ? 0x000000 : 0xef4444); });
        robot.ledMat.emissive.setHex(b.out[ROBOT_PINS.LED] ? 0xff2020 : 0x000000);
        if (robot.arm) robot.arm.rotation.y = (((b.servo?.[ROBOT_PINS.SERVO] ?? 90) - 90) * Math.PI) / 180;
        if (robot.buzzMat) robot.buzzMat.emissive.setHex(b.tones && Object.keys(b.tones).some(k => b.tones[k]) ? 0x22d3ee : 0x000000);
        const n = Math.min(b.trail.length, 600);
        for (let i = 0; i < n; i++) { const p = b.trail[b.trail.length - n + i]; trailPos[i * 3] = p[0]; trailPos[i * 3 + 1] = baseY + 0.3; trailPos[i * 3 + 2] = -p[1]; }
        trailGeo.setDrawRange(0, n); trailGeo.attributes.position.needsUpdate = true;
        if (camModeRef.current === 'chase') {
          camTarget.set(r.x, baseY + 4, -r.y);
          camPos.set(r.x - Math.cos(r.a) * 70, baseY + 55, -r.y + Math.sin(r.a) * 70);
          camera.position.lerp(camPos, 0.08);
          controls.target.lerp(camTarget, 0.15);
        }
      }
      if (b && bin) {
        bin.hinge.rotation.z = (b.lid || 0) * Math.PI / 180;
        bin.hand.position.x = 14 + (b.hand ?? 70);
      }
      controls.enabled = camModeRef.current !== 'chase' || !robot;
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); controls.dispose();
      scene.traverse(o => { if (o.isMesh) { o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : [m]).forEach(x => { x.map?.dispose(); x.dispose(); }); } });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [boardRef.current?.map]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={mountRef} className="w-full rounded-2xl overflow-hidden bg-[#0b1220] on-dark touch-none" style={{ height }} />;
}
