/* Cinematic royal citadel scene: obsidian king, crimson sigil, full-page embers. */
(function () {
  'use strict';

  const canvas = document.getElementById('geass-canvas');
  if (!canvas || !window.THREE) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06030b, 0.055);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0.4, 9);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // ---- Lighting: royal volumetric ----
  scene.add(new THREE.AmbientLight(0x2a1a44, 0.75));

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(-4, 6, 6);
  scene.add(keyLight);

  // Razor-sharp crimson rim from the right
  const crimsonRim = new THREE.DirectionalLight(0xff003c, 3.5);
  crimsonRim.position.set(6, 2, 3);
  scene.add(crimsonRim);

  // Royal violet key from the left
  const violetKey = new THREE.DirectionalLight(0x8b5cf6, 2.8);
  violetKey.position.set(-6, 3, 4);
  scene.add(violetKey);

  const crimsonPoint = new THREE.PointLight(0xff003c, 5.5, 22, 2);
  crimsonPoint.position.set(3.5, 1.5, 3);
  scene.add(crimsonPoint);

  const violetFill = new THREE.PointLight(0x8b5cf6, 3.2, 20, 2);
  violetFill.position.set(-3, -1, 2);
  scene.add(violetFill);

  const backGlow = new THREE.PointLight(0xff003c, 2.4, 18, 2);
  backGlow.position.set(0, 2, -4);
  scene.add(backGlow);

  // ---- Royal centerpiece group (King + Sigil + rings) ----
  const centerpiece = new THREE.Group();
  scene.add(centerpiece);

  // Obsidian King: stylized faceted monolith crown
  const obsidianMat = new THREE.MeshPhysicalMaterial({
    color: 0x06030c,
    roughness: 0.06,
    metalness: 0.92,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    reflectivity: 1.0,
    envMapIntensity: 1.4
  });

  const kingGroup = new THREE.Group();
  centerpiece.add(kingGroup);

  // Crown body: tapered octahedron-ish monolith
  const crownGeo = new THREE.CylinderGeometry(0.55, 0.95, 2.4, 6, 1, false);
  const crown = new THREE.Mesh(crownGeo, obsidianMat);
  crown.position.y = 0.2;
  kingGroup.add(crown);

  // Crown top spike
  const spikeGeo = new THREE.ConeGeometry(0.55, 1.1, 6);
  const spike = new THREE.Mesh(spikeGeo, obsidianMat);
  spike.position.y = 1.95;
  kingGroup.add(spike);

  // Base plinth
  const baseGeo = new THREE.CylinderGeometry(1.05, 1.15, 0.35, 6);
  const base = new THREE.Mesh(baseGeo, obsidianMat);
  base.position.y = -1.15;
  kingGroup.add(base);

  // Crimson core (glowing energy inside the crown)
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xff003c,
    emissive: 0xff003c,
    emissiveIntensity: 1.8,
    roughness: 0.3,
    metalness: 0.1
  });
  const coreGeo = new THREE.IcosahedronGeometry(0.42, 1);
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.y = 0.35;
  kingGroup.add(core);

  // Additive halo around core
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xff003c,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 24), haloMat);
  halo.position.y = 0.35;
  kingGroup.add(halo);

  // Sigil: floating crimson ring emblem above the crown
  const sigilGroup = new THREE.Group();
  sigilGroup.position.y = 3.1;
  centerpiece.add(sigilGroup);

  const sigilRingMat = new THREE.MeshBasicMaterial({
    color: 0xff003c,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sigilRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.035, 12, 64), sigilRingMat);
  sigilGroup.add(sigilRing);

  const sigilInner = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 10, 48), sigilRingMat.clone());
  sigilInner.material.opacity = 0.6;
  sigilGroup.add(sigilInner);

  const sigilCore = new THREE.Mesh(new THREE.IcosahedronGeometry(0.14, 0), coreMat.clone());
  sigilGroup.add(sigilCore);

  // Contained orbital rings around the centerpiece (tight, not full-screen)
  const orbitGroup = new THREE.Group();
  centerpiece.add(orbitGroup);

  const orbitMat = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const orbit1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 8, 80), orbitMat);
  orbit1.rotation.x = Math.PI * 0.42;
  orbitGroup.add(orbit1);

  const orbit2Mat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const orbit2 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 8, 80), orbit2Mat);
  orbit2.rotation.x = Math.PI * 0.55;
  orbit2.rotation.z = Math.PI * 0.15;
  orbitGroup.add(orbit2);

  // ---- Distant citadel floor (subtle, low, fogged) ----
  const floorGeo = new THREE.PlaneGeometry(60, 60, 1, 1);
  const floorMat = new THREE.MeshBasicMaterial({
    color: 0x1a0d33,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -6.5;
  scene.add(floor);

  // ---- Floating obsidian monoliths with wireframe edge highlights ----
  const MONOLITH_COUNT = isCoarse ? 14 : 28;
  const monoliths = [];
  const monolithEdgeCrimson = new THREE.LineBasicMaterial({ color: 0xff003c, transparent: true, opacity: 0.55 });
  const monolithEdgeViolet = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.55 });
  const monolithMat = new THREE.MeshPhysicalMaterial({
    color: 0x06030c,
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1
  });

  for (let i = 0; i < MONOLITH_COUNT; i++) {
    const useIco = i % 2 === 0;
    const geo = useIco
      ? new THREE.IcosahedronGeometry(0.35 + Math.random() * 0.5, 0)
      : new THREE.OctahedronGeometry(0.4 + Math.random() * 0.55, 0);
    const mesh = new THREE.Mesh(geo, monolithMat);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      i % 3 === 0 ? monolithEdgeViolet : monolithEdgeCrimson
    );
    mesh.add(edges);
    mesh.position.set(
      (Math.random() - 0.5) * 34,
      -35 + Math.random() * 55,
      (Math.random() - 0.5) * 26 - 6
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.userData = {
      spinX: (Math.random() - 0.5) * 0.25,
      spinY: (Math.random() - 0.5) * 0.25,
      drift: 0.05 + Math.random() * 0.12,
      seed: Math.random() * Math.PI * 2
    };
    scene.add(mesh);
    monoliths.push(mesh);
  }

  // ---- Full-page floating embers & obsidian shards ----
  const EMBER_COUNT = isCoarse ? 700 : 1400;
  const emberGeo = new THREE.BufferGeometry();
  const emberPos = new Float32Array(EMBER_COUNT * 3);
  const emberSeed = new Float32Array(EMBER_COUNT);
  const emberSpeed = new Float32Array(EMBER_COUNT);
  const emberSize = new Float32Array(EMBER_COUNT);
  const emberColor = new Float32Array(EMBER_COUNT * 3);

  const crimson = new THREE.Color(0xff003c);
  const violet = new THREE.Color(0x8b5cf6);
  const gold = new THREE.Color(0xf59e0b);
  const tmpColor = new THREE.Color();

  for (let i = 0; i < EMBER_COUNT; i++) {
    const i3 = i * 3;
    emberPos[i3] = (Math.random() - 0.5) * 40;
    emberPos[i3 + 1] = -35 + Math.random() * 70;
    emberPos[i3 + 2] = (Math.random() - 0.5) * 30 - 5;
    emberSeed[i] = Math.random() * Math.PI * 2;
    emberSpeed[i] = 0.15 + Math.random() * 0.5;
    emberSize[i] = 0.4 + Math.random() * 1.6;
    const r = Math.random();
    if (r < 0.55) tmpColor.copy(crimson);
    else if (r < 0.9) tmpColor.copy(violet);
    else tmpColor.copy(gold);
    emberColor[i3] = tmpColor.r;
    emberColor[i3 + 1] = tmpColor.g;
    emberColor[i3 + 2] = tmpColor.b;
  }

  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
  emberGeo.setAttribute('color', new THREE.BufferAttribute(emberColor, 3));
  emberGeo.setAttribute('aSize', new THREE.BufferAttribute(emberSize, 1));

  const emberMat = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const embers = new THREE.Points(emberGeo, emberMat);
  scene.add(embers);

  // ---- Responsive layout ----
  let isDesktop = window.innerWidth >= 1024;
  let scrollProgress = 0;
  const cameraTarget = new THREE.Vector3(0, 0.2, 0);

  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    isDesktop = w >= 1024;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);

    if (isDesktop) {
      // Framed inside the right .hero-visual HUD
      centerpiece.position.set(2.9, -0.3, 0);
      centerpiece.scale.setScalar(0.72);
      camera.position.set(0, 0.4, 9);
      camera.lookAt(0, 0.2, 0);
    } else {
      // Stacked: model centered, camera raised so text sits above
      centerpiece.position.set(0, -1.6, 0);
      centerpiece.scale.setScalar(0.78);
      camera.position.set(0, 1.2, 10);
      camera.lookAt(0, -0.6, 0);
    }
  }

  layout();

  // ---- Pointer parallax ----
  let pointerX = 0;
  let pointerY = 0;
  let targetPX = 0;
  let targetPY = 0;

  if (!isCoarse && !reduce) {
    window.addEventListener('pointermove', function (e) {
      targetPX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  // ---- Scroll: embers drift through full page height ----
  window.addEventListener('scroll', function () {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollProgress = Math.min(1, Math.max(0, window.scrollY / max));
  }, { passive: true });

  window.addEventListener('resize', layout, { passive: true });

  // ---- Animation loop ----
  const clock = new THREE.Clock();
  let rafId = 0;
  let running = true;

  function animate() {
    if (!running) return;
    rafId = requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    pointerX += (targetPX - pointerX) * 0.05;
    pointerY += (targetPY - pointerY) * 0.05;

    // King slow rotation + subtle bob
    kingGroup.rotation.y = t * 0.18;
    kingGroup.position.y = Math.sin(t * 0.7) * 0.08;

    // Core pulse
    const pulse = 1.6 + Math.sin(t * 2.2) * 0.4;
    coreMat.emissiveIntensity = pulse;
    halo.scale.setScalar(1 + Math.sin(t * 2.2) * 0.08);
    haloMat.opacity = 0.22 + Math.sin(t * 2.2) * 0.08;

    // Sigil spin
    sigilGroup.rotation.y = -t * 0.5;
    sigilGroup.rotation.z = Math.sin(t * 0.4) * 0.15;
    sigilInner.rotation.z = t * 0.8;
    sigilCore.rotation.x = t * 0.9;
    sigilCore.rotation.y = t * 0.6;

    // Counter-rotating orbital rings
    orbit1.rotation.z = t * 0.12;
    orbit2.rotation.z = -t * 0.09;

    // Floating monoliths drift + rotate
    for (let m = 0; m < monoliths.length; m++) {
      const mo = monoliths[m];
      const ud = mo.userData;
      mo.rotation.x += ud.spinX * 0.016;
      mo.rotation.y += ud.spinY * 0.016;
      mo.position.y += ud.drift * 0.016;
      if (mo.position.y > 20) mo.position.y = -35;
      mo.position.x += Math.sin(t * 0.2 + ud.seed) * 0.004;
    }

    // Parallax on centerpiece
    centerpiece.rotation.y = pointerX * 0.18;
    centerpiece.rotation.x = pointerY * 0.1;

    // Embers drift upward + scroll offset
    const pos = emberGeo.attributes.position.array;
    const scrollShift = scrollProgress * 24;
    for (let i = 0; i < EMBER_COUNT; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += emberSpeed[i] * 0.016;
      if (pos[i3 + 1] > 35) pos[i3 + 1] = -35;
      pos[i3] += Math.sin(t * 0.3 + emberSeed[i]) * 0.002;
    }
    emberGeo.attributes.position.needsUpdate = true;
    embers.position.y = scrollShift * 0.4;

    // Camera travels down the page on scroll so the 3D scene follows content
    camera.position.x = pointerX * 0.25;
    camera.position.y = 0.4 + pointerY * 0.15 - scrollProgress * 12.0;
    cameraTarget.set(0, 0.4 - scrollProgress * 12.0, 0);
    camera.lookAt(cameraTarget);

    renderer.render(scene, camera);
  }

  // Pause when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else if (!running) {
      running = true;
      clock.getDelta();
      animate();
    }
  });

  if (reduce) {
    // Static single frame for reduced motion
    renderer.render(scene, camera);
  } else {
    animate();
  }
})();
