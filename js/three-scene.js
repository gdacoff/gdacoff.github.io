/* Geass volumetric scene. */
(function () {
  'use strict';
  let canvas;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const CRIMSON = 0xff003c, VIOLET = 0x8b5cf6, GOLD = 0xf59e0b, OBSIDIAN = 0x0a0614;
  let renderer, scene, camera, clock;
  let kingGroup, sigilGroup, coreGlow, horizon, horizonGeo, horizonBase;
  let monoliths, particleSystem, particleGeo, particleBase;
  let cursorLight, orbitLight, rimLight, ambientLight;
  let running = false;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const pointerWorld = new THREE.Vector3(0, 0, 0);
  const scroll = { y: 0, target: 0, progress: 0 };
  const pulses = [];
  const cameraBase = new THREE.Vector3(0, 0.4, 9);
  const cameraTarget = new THREE.Vector3(0, 0, 0);

  function init() {
    canvas = document.getElementById('geass-canvas');
    if (!canvas || typeof THREE === 'undefined') {
      window.addEventListener('load', init, { once: true });
      return;
    }
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = !isCoarse;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d071e, 0.02);
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.copy(cameraBase);
    clock = new THREE.Clock();
    buildLights();
    buildKing();
    buildSigil();
    buildHorizon();
    buildMonoliths();
    buildParticles();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    onScroll();
    running = true;
    animate();
  }

  function buildLights() {
    ambientLight = new THREE.AmbientLight(0x4c2482, 1.4);
    scene.add(ambientLight);
    cursorLight = new THREE.PointLight(CRIMSON, 5.0, 35, 2);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);
    orbitLight = new THREE.PointLight(0xa855f7, 4.2, 35, 2);
    orbitLight.position.set(-6, 2, -6);
    scene.add(orbitLight);
    rimLight = new THREE.DirectionalLight(0xff003c, 2.2);
    rimLight.position.set(6, 8, 4);
    scene.add(rimLight);
    const goldRim = new THREE.DirectionalLight(GOLD, 1.2);
    goldRim.position.set(-5, -4, 5);
    scene.add(goldRim);
  }

  function buildKing() {
    kingGroup = new THREE.Group();
    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: OBSIDIAN, roughness: 0.12, metalness: 0.75,
      clearcoat: 1.0, clearcoatRoughness: 0.06, reflectivity: 1.0, envMapIntensity: 1.2
    });
    const geassMat = new THREE.MeshStandardMaterial({
      color: 0x1a0a1f, roughness: 0.25, metalness: 0.6,
      emissive: CRIMSON, emissiveIntensity: 1.4
    });
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.18, 8), obsidianMat);
    base1.position.y = -1.6; kingGroup.add(base1);
    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.0, 0.16, 8), obsidianMat);
    base2.position.y = -1.42; kingGroup.add(base2);
    const base3 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.82, 0.14, 8), geassMat);
    base3.position.y = -1.26; kingGroup.add(base3);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.62, 1.5, 8), obsidianMat);
    body.position.y = -0.42; kingGroup.add(body);
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.5, 0.16, 8), geassMat);
    collar.position.y = 0.42; kingGroup.add(collar);
    const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.22, 8), obsidianMat);
    crownBase.position.y = 0.62; kingGroup.add(crownBase);
    const spikeGeo = new THREE.ConeGeometry(0.09, 0.42, 4);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const spike = new THREE.Mesh(spikeGeo, geassMat);
      spike.position.set(Math.cos(a) * 0.42, 0.94, Math.sin(a) * 0.42);
      kingGroup.add(spike);
    }
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), obsidianMat);
    crossV.position.y = 1.35; kingGroup.add(crossV);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 0.1), obsidianMat);
    crossH.position.y = 1.42; kingGroup.add(crossH);
    coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 20, 20),
      new THREE.MeshBasicMaterial({ color: CRIMSON, transparent: true, opacity: 0.95 })
    );
    coreGlow.position.y = 0.78; kingGroup.add(coreGlow);
    const coreHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 20, 20),
      new THREE.MeshBasicMaterial({ color: CRIMSON, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    coreHalo.position.y = 0.78; kingGroup.add(coreHalo);
    const coreHalo2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 20, 20),
      new THREE.MeshBasicMaterial({ color: CRIMSON, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    coreHalo2.position.y = 0.78; kingGroup.add(coreHalo2);
    kingGroup.userData.coreHalo = coreHalo;
    kingGroup.userData.coreHalo2 = coreHalo2;
    kingGroup.position.set(0, 0.2, 0);
    scene.add(kingGroup);
  }

  function buildSigil() {
    sigilGroup = new THREE.Group();
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.2);
    shape.lineTo(0.35, 0.4);
    shape.lineTo(1.1, 0.55);
    shape.lineTo(0.55, 0.05);
    shape.lineTo(1.3, -0.35);
    shape.lineTo(0.5, -0.35);
    shape.lineTo(0.35, -1.1);
    shape.lineTo(0, -0.55);
    shape.lineTo(-0.35, -1.1);
    shape.lineTo(-0.5, -0.35);
    shape.lineTo(-1.3, -0.35);
    shape.lineTo(-0.55, 0.05);
    shape.lineTo(-1.1, 0.55);
    shape.lineTo(-0.35, 0.4);
    shape.closePath();
    const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.2, bevelEnabled: true, bevelThickness: 0.04,
      bevelSize: 0.04, bevelSegments: 2, curveSegments: 4
    });
    extrudeGeo.center();
    const sigilMat = new THREE.MeshStandardMaterial({
      color: 0x1a0a1f, roughness: 0.3, metalness: 0.7,
      emissive: CRIMSON, emissiveIntensity: 1.2
    });
    const sigil = new THREE.Mesh(extrudeGeo, sigilMat);
    sigil.scale.setScalar(1.35);
    sigilGroup.add(sigil);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x1a0a1f, roughness: 0.2, metalness: 0.9,
      emissive: 0xa855f7, emissiveIntensity: 1.3
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.035, 8, 96), ringMat);
    ring1.rotation.x = Math.PI / 2.2;
    sigilGroup.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.025, 8, 96), ringMat);
    ring2.rotation.x = Math.PI / 1.7;
    ring2.rotation.y = Math.PI / 4;
    sigilGroup.add(ring2);
    sigilGroup.userData = { sigil, ring1, ring2 };
    sigilGroup.position.set(0, 0.2, -0.6);
    scene.add(sigilGroup);
  }

  function buildHorizon() {
    const segs = isCoarse ? 30 : 50;
    horizonGeo = new THREE.PlaneGeometry(80, 80, segs, segs);
    horizonGeo.rotateX(-Math.PI / 2);
    horizonBase = new Float32Array(horizonGeo.attributes.position.array.length);
    horizonBase.set(horizonGeo.attributes.position.array);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2e1065, emissive: 0x7c3aed, emissiveIntensity: 0.85,
      roughness: 0.6, metalness: 0.4, wireframe: true,
      transparent: true, opacity: 0.75, fog: true
    });
    horizon = new THREE.Mesh(horizonGeo, mat);
    horizon.position.y = -3.2;
    scene.add(horizon);
  }

  function buildMonoliths() {
    monoliths = new THREE.Group();
    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: OBSIDIAN, roughness: 0.2, metalness: 0.9,
      clearcoat: 0.8, clearcoatRoughness: 0.15
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xff003c, transparent: true, opacity: 0.85 });
    const edgeMatV = new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.85 });
    const geos = [
      new THREE.DodecahedronGeometry(0.5),
      new THREE.IcosahedronGeometry(0.45),
      new THREE.OctahedronGeometry(0.55),
      new THREE.BoxGeometry(0.6, 0.9, 0.6),
      new THREE.TetrahedronGeometry(0.6)
    ];
    const count = isCoarse ? 18 : 34;
    for (let i = 0; i < count; i++) {
      const geo = geos[i % geos.length];
      const mesh = new THREE.Mesh(geo, obsidianMat);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), i % 3 === 0 ? edgeMatV : edgeMat);
      mesh.add(edges);
      const radius = 4 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const z = -18 + Math.random() * 20;
      mesh.position.set(Math.cos(theta) * radius, -8 + Math.random() * 14, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.scale.setScalar(0.6 + Math.random() * 1.2);
      mesh.userData = {
        spin: new THREE.Vector3((Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35),
        drift: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
        amp: 0.3 + Math.random() * 0.5
      };
      monoliths.add(mesh);
    }
    scene.add(monoliths);
  }

  function makeGlowTexture() {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.25)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  function buildParticles() {
    const count = isCoarse ? 900 : 1900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cCrimson = new THREE.Color(0xff003c);
    const cViolet = new THREE.Color(0x8b5cf6);
    const cVioletLight = new THREE.Color(0xc084fc);
    const cGold = new THREE.Color(0xf59e0b);
    const cGoldLight = new THREE.Color(0xfbbf24);
    const tmpColor = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 18;
      const y = (Math.random() - 0.5) * 16 - 1;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = -25 + Math.random() * 30;
      const r = Math.random();
      if (r < 0.45) tmpColor.copy(cCrimson);
      else if (r < 0.85) tmpColor.copy(Math.random() < 0.5 ? cViolet : cVioletLight);
      else tmpColor.copy(Math.random() < 0.5 ? cGold : cGoldLight);
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }
    particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleBase = new Float32Array(positions);
    const mat = new THREE.PointsMaterial({
      size: isCoarse ? 0.32 : 0.28,
      map: makeGlowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    particleSystem = new THREE.Points(particleGeo, mat);
    scene.add(particleSystem);
  }

  function onResize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  function onPointerMove(e) {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scroll.target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  function onVisibility() {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      clock.getDelta();
      animate();
    }
  }

  function onPointerDown(e) {
    if (!scene) return;
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    const v = new THREE.Vector3(x, y, 0.5).unproject(camera);
    v.sub(camera.position).normalize();
    const dist = -camera.position.z / v.z;
    const hit = camera.position.clone().add(v.multiplyScalar(dist));
    spawnShockwave(hit);
  }

  function spawnShockwave(pos) {
    const geo = new THREE.TorusGeometry(0.3, 0.05, 8, 48);
    const mat = new THREE.MeshBasicMaterial({
      color: CRIMSON, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false
    });
    const torus = new THREE.Mesh(geo, mat);
    torus.position.copy(pos);
    torus.lookAt(camera.position);
    scene.add(torus);
    pulses.push({ mesh: torus, life: 0, maxLife: 1.1 });

    const sparkCount = isCoarse ? 60 : 120;
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = pos.x;
      sparkPos[i * 3 + 1] = pos.y;
      sparkPos[i * 3 + 2] = pos.z;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 2 + Math.random() * 4;
      sparkVel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      sparkVel[i * 3 + 1] = Math.cos(phi) * speed;
      sparkVel[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: CRIMSON, size: 0.12, map: makeGlowTexture(),
      transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);
    pulses.push({ mesh: sparks, life: 0, maxLife: 1.4, vel: sparkVel, isSparks: true });
  }

  function updatePulses(dt) {
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.life += dt;
      const k = p.life / p.maxLife;
      if (k >= 1) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        pulses.splice(i, 1);
        continue;
      }
      if (p.isSparks) {
        const arr = p.mesh.geometry.attributes.position.array;
        const vel = p.vel;
        for (let j = 0; j < arr.length; j += 3) {
          arr[j] += vel[j] * dt;
          arr[j + 1] += vel[j + 1] * dt;
          arr[j + 2] += vel[j + 2] * dt;
          vel[j] *= 0.96;
          vel[j + 1] = vel[j + 1] * 0.96 - 2.5 * dt;
          vel[j + 2] *= 0.96;
        }
        p.mesh.geometry.attributes.position.needsUpdate = true;
        p.mesh.material.opacity = 1 - k;
      } else {
        const s = 1 + k * 8;
        p.mesh.scale.setScalar(s);
        p.mesh.material.opacity = 0.9 * (1 - k);
      }
    }
  }

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    scroll.progress += (scroll.target - scroll.progress) * 0.06;

    pointerWorld.set(pointer.x * 8, pointer.y * 5, 4);
    cursorLight.position.lerp(pointerWorld, 0.12);

    orbitLight.position.x = Math.cos(t * 0.4) * 8;
    orbitLight.position.z = Math.sin(t * 0.4) * 8 - 4;
    orbitLight.position.y = 2 + Math.sin(t * 0.6) * 1.5;

    const baseOffsetX = window.innerWidth >= 992 ? 2.2 : 0;
    if (kingGroup) {
      kingGroup.rotation.y = t * 0.25 + pointer.x * 0.4;
      kingGroup.position.y = (window.innerWidth >= 992 ? 0.2 : 0.35) + Math.sin(t * 0.8) * 0.08;
      kingGroup.position.x = baseOffsetX + pointer.x * 0.3;
      const pulse = 0.8 + Math.sin(t * 2.2) * 0.35;
      coreGlow.material.opacity = 0.7 + Math.sin(t * 2.2) * 0.25;
      coreGlow.scale.setScalar(1 + Math.sin(t * 2.2) * 0.15);
      const halo = kingGroup.userData.coreHalo;
      if (halo) {
        halo.scale.setScalar(1 + Math.sin(t * 2.2) * 0.3);
        halo.material.opacity = 0.5 + Math.sin(t * 2.2) * 0.25;
      }
      const halo2 = kingGroup.userData.coreHalo2;
      if (halo2) {
        halo2.scale.setScalar(1 + Math.sin(t * 1.6 + 1) * 0.35);
        halo2.material.opacity = 0.28 + Math.sin(t * 1.6 + 1) * 0.15;
      }
      kingGroup.rotation.z = Math.sin(t * 0.5) * 0.03;
    }

    if (sigilGroup) {
      sigilGroup.position.x = baseOffsetX;
      sigilGroup.rotation.z = t * 0.15;
      sigilGroup.userData.ring1.rotation.z = t * 0.4;
      sigilGroup.userData.ring2.rotation.z = -t * 0.3;
      sigilGroup.userData.sigil.rotation.y = Math.sin(t * 0.4) * 0.3;
    }

    if (horizonGeo) {
      const arr = horizonGeo.attributes.position.array;
      const base = horizonBase;
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i];
        const z = base[i + 2];
        arr[i + 1] = Math.sin(x * 0.3 + t) * Math.cos(z * 0.3 + t) * 0.6;
      }
      horizonGeo.attributes.position.needsUpdate = true;
    }

    if (monoliths) {
      for (let i = 0; i < monoliths.children.length; i++) {
        const m = monoliths.children[i];
        const u = m.userData;
        m.rotation.x += u.spin.x * dt;
        m.rotation.y += u.spin.y * dt;
        m.rotation.z += u.spin.z * dt;
        m.position.y = u.baseY + Math.sin(t * 0.6 + u.drift) * u.amp;
      }
    }

    if (particleSystem) {
      particleSystem.rotation.y = t * 0.05;
      particleSystem.position.y = Math.sin(t * 0.3) * 0.4 - scroll.progress * 2.5;
      particleSystem.material.opacity = 0.85 + Math.sin(t * 1.4) * 0.1;
    }

    const camX = pointer.x * 0.8 + Math.sin(scroll.progress * Math.PI) * 1.5;
    const camY = 0.4 + pointer.y * 0.4 + scroll.progress * 2.4;
    const camZ = 9 - scroll.progress * 3.2;
    camera.position.x += (camX - camera.position.x) * 0.05;
    camera.position.y += (camY - camera.position.y) * 0.05;
    camera.position.z += (camZ - camera.position.z) * 0.05;
    cameraTarget.set(0, scroll.progress * 1.2, 0);
    camera.lookAt(cameraTarget);

    if (monoliths) {
      monoliths.position.y = -scroll.progress * 3.5;
    }

    updatePulses(dt);
    renderer.render(scene, camera);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
