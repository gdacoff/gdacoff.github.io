/* Geass WebGL scene: interactive sigil core, drifting shards, click pulse. */
(function () {
  'use strict';

  const canvas = document.getElementById('geass-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;

  const CRIMSON = 0xff003c;
  const VIOLET = 0x8b5cf6;

  let renderer, scene, camera, core, shards, particleSystem, clock;
  let rafId = null;
  let running = false;

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const pulses = [];

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06030b, 0.045);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    clock = new THREE.Clock();

    buildCore();
    buildShards();
    buildParticles();

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    running = true;
    animate();
  }

  function buildCore() {
    const group = new THREE.Group();

    const ringGeo = new THREE.TorusGeometry(2.1, 0.02, 8, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: CRIMSON, transparent: true, opacity: 0.55 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.012, 8, 120), new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.4 }));
    ring2.rotation.x = Math.PI / 2.4;
    group.add(ring2);

    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.015, 8, 100), new THREE.MeshBasicMaterial({ color: CRIMSON, transparent: true, opacity: 0.35 }));
    ring3.rotation.y = Math.PI / 3;
    group.add(ring3);

    const eyeGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const eyeMat = new THREE.MeshBasicMaterial({ color: CRIMSON, wireframe: true, transparent: true, opacity: 0.85 });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    group.add(eye);

    const glowGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const glowMat = new THREE.MeshBasicMaterial({ color: CRIMSON, transparent: true, opacity: 0.9 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    const halo = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 24), new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.08 }));
    group.add(halo);

    group.position.set(0, 0, 0);
    core = group;
    core.userData = { ring, ring2, ring3, eye, glow, halo };
    scene.add(core);
  }

  function buildShards() {
    shards = new THREE.Group();
    const geos = [
      new THREE.TetrahedronGeometry(0.28),
      new THREE.OctahedronGeometry(0.3),
      new THREE.IcosahedronGeometry(0.26),
      new THREE.BoxGeometry(0.34, 0.34, 0.34)
    ];
    const count = isCoarse ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const geo = geos[i % geos.length];
      const mat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? VIOLET : CRIMSON,
        wireframe: true,
        transparent: true,
        opacity: 0.25 + Math.random() * 0.35
      });
      const mesh = new THREE.Mesh(geo, mat);
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      mesh.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) * 0.6,
        radius * Math.cos(phi) - 2
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.userData = {
        spin: new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4),
        drift: Math.random() * Math.PI * 2,
        baseY: mesh.position.y
      };
      shards.add(mesh);
    }
    scene.add(shards);
  }

  function buildParticles() {
    const count = isCoarse ? 400 : 900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c1 = new THREE.Color(CRIMSON);
    const c2 = new THREE.Color(VIOLET);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
      const c = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    particleSystem = new THREE.Points(geo, mat);
    scene.add(particleSystem);
  }

  function emitPulse() {
    if (!scene) return;
    const count = isCoarse ? 60 : 140;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.06 + Math.random() * 0.12;
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: CRIMSON,
      size: 0.12,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geo, mat);
    points.position.copy(core ? core.position : new THREE.Vector3());
    scene.add(points);
    pulses.push({ points, velocities, life: 0, maxLife: 1.6 });
  }

  function onPointerMove(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function onPointerDown() {
    emitPulse();
  }

  function onResize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  function onVisibility() {
    if (document.hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!running) {
      running = true;
      clock.getDelta();
      animate();
    }
  }

  function animate() {
    if (!running) return;
    rafId = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    if (core) {
      core.rotation.y = t * 0.15 + pointer.x * 0.4;
      core.rotation.x = pointer.y * 0.25;
      const u = core.userData;
      u.ring.rotation.z = t * 0.4;
      u.ring2.rotation.z = -t * 0.3;
      u.ring3.rotation.x = t * 0.5;
      u.eye.rotation.y = t * 0.6;
      u.eye.rotation.x = t * 0.3;
      const pulse = 1 + Math.sin(t * 2.2) * 0.06;
      u.glow.scale.setScalar(pulse);
      u.halo.scale.setScalar(1 + Math.sin(t * 1.4) * 0.1);
    }

    if (shards) {
      for (let i = 0; i < shards.children.length; i++) {
        const m = shards.children[i];
        const d = m.userData;
        m.rotation.x += d.spin.x * dt;
        m.rotation.y += d.spin.y * dt;
        m.rotation.z += d.spin.z * dt;
        m.position.y = d.baseY + Math.sin(t * 0.5 + d.drift) * 0.4;
      }
      shards.rotation.y = pointer.x * 0.15;
      shards.rotation.x = pointer.y * 0.1;
    }

    if (particleSystem) {
      particleSystem.rotation.y = t * 0.02 + pointer.x * 0.1;
    }

    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.life += dt;
      const pos = p.points.geometry.attributes.position.array;
      for (let j = 0; j < pos.length; j += 3) {
        pos[j] += p.velocities[j];
        pos[j + 1] += p.velocities[j + 1];
        pos[j + 2] += p.velocities[j + 2];
      }
      p.points.geometry.attributes.position.needsUpdate = true;
      p.points.material.opacity = Math.max(0, 1 - p.life / p.maxLife);
      if (p.life >= p.maxLife) {
        scene.remove(p.points);
        p.points.geometry.dispose();
        p.points.material.dispose();
        pulses.splice(i, 1);
      }
    }

    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    init();
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    renderer.render(scene, camera);
  } else {
    init();
  }

  window.GeassScene = { pulse: emitPulse };
})();
