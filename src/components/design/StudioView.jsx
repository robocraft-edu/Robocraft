import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { unitShape, groupSoup, ungroup } from '@/lib/design/shapes';
import { decalCanvas } from '@/lib/design/decals';
import { partMaterial, shapeMaterial, kidGeometry, smoothUnit, studioLook } from '@/components/design/realism';

const DEG = Math.PI / 180;

function disposeTree(root) {
  root?.traverse?.(o => { if (!o.userData?.sharedGeo) o.geometry?.dispose?.(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose?.()); });
}

/** A board's printed top face: a textured plane laid flat on the part. */
function decalMesh(kid) {
  const canvas = decalCanvas(kid.decal);
  if (!canvas) return null;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({
    map: tex, roughness: 0.65, metalness: 0.05, transparent: true, polygonOffset: true, polygonOffsetFactor: -2,
  }));
  m.rotation.order = 'YXZ';
  m.renderOrder = 1;
  return m;
}

function applyDecalTransform(mesh, k) {
  const [w, d, h] = k.size;
  mesh.position.set(k.pos[0], k.pos[1] + h + 0.03, k.pos[2]);
  mesh.rotation.set(-Math.PI / 2, (k.rot?.[1] || 0) * DEG, 0);
  mesh.scale.set(w, d, 1);
}

/** Place a part's coloured sub-parts in world space for the given transform. */
function layoutAssembly(rec, obj) {
  const kids = ungroup(obj);
  kids.forEach((k, i) => {
    const m = rec.assembly.children[i];
    if (!m) return;
    if (k.decal) applyDecalTransform(m, k); else applyTransform(m, k);
  });
}

function geometryFor(obj) {
  const base = obj.type === 'group' ? groupSoup(obj) : unitShape(obj.type);
  const pos = new Float32Array(base.length);
  for (let i = 0; i < base.length; i += 3) { pos[i] = base[i]; pos[i + 1] = base[i + 1] - 0.5; pos[i + 2] = base[i + 2]; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

function holeTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d');
  x.fillStyle = '#cbd5e1'; x.fillRect(0, 0, 64, 64);
  x.strokeStyle = '#64748b'; x.lineWidth = 6;
  for (let i = -64; i < 128; i += 16) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 64, 64); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}

/** Read a live transform back off a mesh (the gizmo writes into the mesh). */
function readTransform(mesh, obj) {
  const size = [Math.abs(mesh.scale.x), Math.abs(mesh.scale.z), Math.abs(mesh.scale.y)];
  const e = new THREE.Euler().setFromQuaternion(mesh.quaternion, 'YZX');
  return {
    ...obj,
    size,
    rot: [e.x / DEG, e.y / DEG, e.z / DEG],
    pos: [mesh.position.x, mesh.position.y - size[2] / 2, mesh.position.z],
  };
}

function applyTransform(mesh, obj) {
  const [w, d, h] = obj.size;
  const m = obj.mirror || [1, 1, 1];
  mesh.position.set(obj.pos[0], obj.pos[1] + h / 2, obj.pos[2]);
  mesh.rotation.set((obj.rot?.[0] || 0) * DEG, (obj.rot?.[1] || 0) * DEG, (obj.rot?.[2] || 0) * DEG, 'YZX');
  mesh.scale.set(w * m[0], h * m[1], d * m[2]);
}

/**
 * Tinkercad-style 3-D workplane.
 * props: objects, selected (array of ids), mode ('translate'|'rotate'|'scale'), snap (mm),
 *        onPick(id|null, additive), onTransform(id, {pos, rot, size}), view (counter-based command)
 */
export default function StudioView({ objects, selected, mode, snap, onPick, onTransform, viewCmd, additive, height = '100%' }) {
  const mountRef = useRef(null);
  const ctx = useRef({});
  const props = useRef({});
  props.current = { onPick, onTransform, snap, additive, objects };

  // ── one-time scene setup ──
  useEffect(() => {
    const mount = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'none';
    const scene = new THREE.Scene();
    const isDark = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const THEME = { light: { bg: 0xeef2f7, plane: 0xdbeafe, grid: 0x60a5fa, grid2: 0x93c5fd, fine: 0xbfdbfe }, dark: { bg: 0x0a0f1c, plane: 0x12213d, grid: 0x2563eb, grid2: 0x1e3a8a, fine: 0x1e40af } };
    let theme = THEME[isDark() ? 'dark' : 'light'];
    scene.background = new THREE.Color(theme.bg);
    const camera = new THREE.PerspectiveCamera(40, 1, 1, 5000);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true; orbit.target.set(0, 0, 0); orbit.maxPolarAngle = Math.PI * 0.95;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 0.7));
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(150, 300, 200); scene.add(sun);
    const back = new THREE.DirectionalLight(0xffffff, 0.5); back.position.set(-200, 100, -150); scene.add(back);
    const undoLook = studioLook(renderer, scene, { sun });

    // workplane 200×200 mm, 10 mm grid like Tinkercad
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshBasicMaterial({ color: theme.plane, transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
    plane.rotation.x = -Math.PI / 2; plane.position.y = -0.05; scene.add(plane);
    const grid = new THREE.GridHelper(200, 20, theme.grid, theme.grid2); grid.position.y = 0.01; scene.add(grid);
    const fine = new THREE.GridHelper(200, 200, theme.fine, theme.fine); fine.material.transparent = true; fine.material.opacity = 0.35; scene.add(fine);
    // follow the app's light/dark setting
    const applyTheme = () => {
      theme = THEME[isDark() ? 'dark' : 'light'];
      scene.background.setHex(theme.bg);
      plane.material.color.setHex(theme.plane);
      grid.material.color?.setHex?.(theme.grid);
      fine.material.color?.setHex?.(theme.fine);
    };
    const themeWatch = new MutationObserver(applyTheme);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const axes = new THREE.AxesHelper(30); axes.position.set(-100, 0.1, 100); scene.add(axes);

    const tc = new TransformControls(camera, renderer.domElement);
    const helper = tc.getHelper ? tc.getHelper() : tc;
    scene.add(helper);
    tc.setRotationSnap(15 * DEG);
    tc.addEventListener('dragging-changed', (e) => {
      orbit.enabled = !e.value;
      if (!e.value && tc.object) {
        const m = tc.object, id = m.userData.id;
        const obj = props.current.objects.find(o => o.id === id);
        if (!obj) return;
        const s = props.current.snap || 1;
        const r = (v, step) => Math.round(v / step) * step;
        const mir = obj.mirror || [1, 1, 1];
        const size = [Math.max(0.5, r(Math.abs(m.scale.x), s > 1 ? 1 : 0.5)), Math.max(0.5, r(Math.abs(m.scale.z), s > 1 ? 1 : 0.5)), Math.max(0.5, r(Math.abs(m.scale.y), s > 1 ? 1 : 0.5))];
        const e2 = new THREE.Euler().setFromQuaternion(m.quaternion, 'YZX');
        const rot = [e2.x, e2.y, e2.z].map(v => Math.round((v / DEG) * 10) / 10);
        const pos = [r(m.position.x, s), Math.round((m.position.y - size[2] / 2) * 10) / 10, r(m.position.z, s)];
        void mir;
        props.current.onTransform(id, { pos, rot, size });
      }
    });

    const meshes = new Map();
    const holeTex = holeTexture();
    const selBox = new THREE.Box3Helper(new THREE.Box3(), 0x0ea5e9); selBox.visible = false; scene.add(selBox);

    const resize = () => {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(mount);

    // tap to select
    const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
    let down = null;
    const onDown = (e) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; };
    const onUp = (e) => {
      if (!down || tc.dragging) { down = null; return; }
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (moved > 6) return;
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects([...meshes.values()].map(x => x.mesh), false);
      // solids before holes when both are hit at a similar depth
      const hit = hits[0];
      props.current.onPick(hit ? hit.object.userData.id : null, props.current.additive || e.shiftKey);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (tc.dragging && tc.object) {
        const r = meshes.get(tc.object.userData.id);
        if (r?.isAssembly) layoutAssembly(r, readTransform(tc.object, tc.object.userData.obj));
      }
      orbit.update(); renderer.render(scene, camera);
    };
    loop();

    // frame everything on the workplane (or the whole plane when it is empty)
    const fit = () => {
      const box = new THREE.Box3();
      meshes.forEach(({ mesh, assembly }) => box.expandByObject(assembly || mesh));
      const empty = box.isEmpty();
      const c = empty ? new THREE.Vector3(0, 0, 0) : box.getCenter(new THREE.Vector3());
      const size = empty ? 120 : Math.max(20, box.getSize(new THREE.Vector3()).length());
      const d = size / (2 * Math.tan((camera.fov * Math.PI) / 360)) * 1.5;
      orbit.target.copy(c);
      camera.position.copy(c).add(new THREE.Vector3(0.55, 0.62, 0.78).multiplyScalar(d));
      orbit.update();
    };
    fit();

    ctx.current = { renderer, scene, camera, orbit, tc, meshes, holeTex, selBox, fit };
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); themeWatch.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      tc.detach(); tc.dispose?.(); orbit.dispose();
      meshes.forEach(({ mesh, assembly }) => { disposeTree(mesh); disposeTree(assembly); });
      undoLook(); holeTex.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  // ── sync meshes with objects ──
  useEffect(() => {
    const { scene, meshes, holeTex } = ctx.current;
    if (!scene) return;
    const ids = new Set(objects.map(o => o.id));
    for (const [id, rec] of meshes) {
      if (!ids.has(id)) { scene.remove(rec.mesh); disposeTree(rec.mesh); if (rec.assembly) { scene.remove(rec.assembly); disposeTree(rec.assembly); } meshes.delete(id); }
    }
    for (const obj of objects) {
      let rec = meshes.get(obj.id);
      // A library part keeps every colour: an invisible proxy carries the object's
      // transform (so the gizmo works) and the coloured sub-parts follow it.
      if (obj.type === 'group') {
        if (!rec || !rec.isAssembly || rec.geoKey !== obj.children) {
          if (rec) { scene.remove(rec.mesh); scene.remove(rec.assembly); disposeTree(rec.mesh); disposeTree(rec.assembly); }
          const proxy = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
          proxy.userData.id = obj.id; proxy.renderOrder = 0;
          scene.add(proxy);
          const assembly = new THREE.Group();
          for (const k of ungroup(obj)) {
            if (k.decal) {
              const dm = decalMesh(k);
              if (dm) { dm.userData.id = obj.id; assembly.add(dm); continue; }
              assembly.add(new THREE.Object3D()); // keep indices aligned with ungroup()
              continue;
            }
            const mat = k.hole
              ? new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.95 })
              : partMaterial(k, obj.color);
            const m = new THREE.Mesh(k.hole ? geometryFor(k) : kidGeometry(k), mat);
            if (k.hole) m.visible = false; // a part's screw holes only matter when it is cut into a design
            m.castShadow = !k.hole; m.receiveShadow = !k.hole;
            m.userData.sharedGeo = !k.hole;
            m.userData.id = obj.id;
            assembly.add(m);
          }
          scene.add(assembly);
          rec = { mesh: proxy, assembly, isAssembly: true, geoKey: obj.children, hole: obj.hole };
          meshes.set(obj.id, rec);
        }
        const dragging = ctx.current.tc.dragging && ctx.current.tc.object === rec.mesh;
        if (!dragging) applyTransform(rec.mesh, obj);
        layoutAssembly(rec, dragging ? readTransform(rec.mesh, obj) : obj);
        rec.assembly.children.forEach(m => { if (!m.material) return; m.material.opacity = obj.hole ? 0.45 : 1; m.material.transparent = !!obj.hole || !!m.material.map || m.material.transmission > 0; });
        rec.mesh.userData.obj = obj;
        continue;
      }
      const geoKey = obj.type;
      if (!rec || rec.geoKey !== geoKey || rec.hole !== obj.hole) {
        if (rec) { scene.remove(rec.mesh); if (!rec.mesh.userData.sharedGeo) rec.mesh.geometry.dispose(); rec.mesh.material.dispose(); }
        const mat = obj.hole
          ? new THREE.MeshStandardMaterial({ color: 0xffffff, map: holeTex, transparent: true, opacity: 0.55, depthWrite: false, roughness: 0.8 })
          : shapeMaterial(obj.color || '#ef4444');
        const mesh = new THREE.Mesh(obj.hole ? geometryFor(obj) : smoothUnit(obj.type), mat);
        mesh.castShadow = !obj.hole; mesh.receiveShadow = !obj.hole;
        mesh.userData.sharedGeo = !obj.hole;
        mesh.userData.id = obj.id;
        mesh.renderOrder = obj.hole ? 2 : 1;
        scene.add(mesh);
        rec = { mesh, geoKey, hole: obj.hole };
        meshes.set(obj.id, rec);
      }
      if (!obj.hole) rec.mesh.material.color.set(obj.color || '#ef4444');
      // don't fight the gizmo while it is being dragged
      if (!(ctx.current.tc.dragging && ctx.current.tc.object === rec.mesh)) applyTransform(rec.mesh, obj);
      rec.mesh.userData.obj = obj;
    }
    if (!ctx.current.framed && objects.length) { ctx.current.framed = true; ctx.current.fit?.(); }
    if (!objects.length) ctx.current.framed = false;
  }, [objects]);

  // ── selection + gizmo ──
  useEffect(() => {
    const { tc, meshes, selBox } = ctx.current;
    if (!tc) return;
    const one = selected.length === 1 ? meshes.get(selected[0]) : null;
    if (one) { tc.attach(one.mesh); tc.setMode(mode); } else tc.detach();
    meshes.forEach(({ mesh, assembly }, id) => {
      const on = selected.includes(id);
      if (mesh.material?.emissive) mesh.material.emissive.setHex(on ? 0x0c4a6e : 0x000000);
      // parts keep their real colours when selected — only a gentle tint
      assembly?.children.forEach(c => { if (c.material?.emissive) c.material.emissiveIntensity = on ? 0.22 : 0; });
    });
    if (selected.length) {
      const box = new THREE.Box3();
      selected.forEach(id => { const r = meshes.get(id); if (r) box.expandByObject(r.assembly || r.mesh); });
      selBox.box.copy(box); selBox.visible = true;
    } else selBox.visible = false;
  }, [selected, mode, objects]);

  useEffect(() => {
    const { tc } = ctx.current;
    if (tc) tc.setTranslationSnap(snap || null);
  }, [snap]);

  // camera commands: { name, n }
  useEffect(() => {
    if (!viewCmd) return;
    const { camera, orbit } = ctx.current;
    const t = orbit.target;
    const d = Math.max(50, camera.position.distanceTo(t)); // keep the current zoom level
    if (viewCmd.name === 'home') ctx.current.fit?.();
    if (viewCmd.name === 'top') { camera.position.set(t.x, d, t.z + 0.01); }
    if (viewCmd.name === 'front') { camera.position.set(t.x, t.y + 20, t.z + d); }
    if (viewCmd.name === 'side') { camera.position.set(t.x + d, t.y + 20, t.z); }
    if (viewCmd.name === 'zoomin') camera.position.lerp(t, 0.3);
    if (viewCmd.name === 'zoomout') camera.position.sub(t).multiplyScalar(1.4).add(t);
    orbit.update();
  }, [viewCmd]);

  return <div ref={mountRef} className="w-full h-full" style={{ height }} />;
}
