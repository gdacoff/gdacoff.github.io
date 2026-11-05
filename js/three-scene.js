/* Cinematic royal citadel scene: obsidian king, crimson sigil, full-page embers. */
(function () {
  'use strict';

  function initScene() {
    const canvas = document.getElementById('geass-canvas');
    if (!canvas || typeof THREE === 'undefined') {
      window.addEventListener('load', initScene, { once: true });
      return;
    }

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

    scene.add(new THREE.AmbientLight(0x2a1a44, 0.75));

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(-4, 6, 6);
    scene.add(keyLight);

    const crimsonRim = new THREE.DirectionalLight(0xff003c, 3.5);
    crimsonRim.position.set(6, 2, 3);
    scene.add(crimsonRim);

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

    const centerpiece = new THREE.Group();
    scene.add(centerpiece);

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

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.95, 2.4, 6, 1, false), obsidianMat);
    crown.position.y = 0.2;
    kingGroup.add(crown);

    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.1, 6), obsidianMat);
    spike.position.y = 1.95;
    kingGroup.add(spike);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.35, 6), obsidianMat);
    base.position.y = -1.15;
    kingGroup.add(base);

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xff003c,
      emissive: 0xff003c,
      emissiveIntensity: 1.8,
      roughness: 0.3,
      metalness: 0.1
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), coreMat);
    core.position.y = 0.35;
    kingGroup.add(core);

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

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x1a0d33, transparent: true, opacity: 0.35, depthWrite: false })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -6.5;
    scene.add(floor);

    const MONOLITH_COUNT = isCoarse ? 14 : 28;
    const MONOLITH_Y_TOP = 15;
    const MONOLITH_Y_BOTTOM = -45;
    const MONOLITH_Y_SPAN = MONOLITH_Y_TOP - MONOLITH_Y_BOTTOM;
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
      const geo = i % 2 === 0
        ? new THREE.IcosahedronGeometry(0.35 + Math.random() * 0.5, 0)
        : new THREE.OctahedronGeometry(0.4 + Math.random() * 0.55, 0);
      const mesh = new THREE.Mesh(geo, monolithMat);
      mesh.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        i % 3 === 0 ? monolithEdgeViolet : monolithEdgeCrimson
      ));
      mesh.position.set(
        (Math.random() - 0.5) * 34,
        MONOLITH_Y_BOTTOM + Math.random() * MONOLITH_Y_SPAN,
        (Math.random() - 0.5) * 26 - 6
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.userData = {
        spinX: (Math.random() - 0.5) * 0.25,
        spinY: (Math.random() - 0.5) * 0.25,
        drift: 0.05 + Math.random() * 0.12,
        seed: Math.random() * Math.PI * 2,
        baseX: mesh.position.x
      };
      scene.add(mesh);
      monoliths.push(mesh);
    }

    const EMBER_COUNT = isCoarse ? 700 : 1400;
    const EMBER_Y_TOP = 15;
    const EMBER_Y_BOTTOM = -45;
    const EMBER_Y_SPAN = EMBER_Y_TOP - EMBER_Y_BOTTOM;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(EMBER_COUNT * 3);
    const emberSeed = new Float32Array(EMBER_COUNT);
    const emberSpeed = new Float32Array(EMBER_COUNT);
    const emberColor = new Float32Array(EMBER_COUNT * 3);

    const crimson = new THREE.Color(0xff003c);
    const violet = new THREE.Color(0x8b5cf6);
    const gold = new THREE.Color(0xf59e0b);
    const tmpColor = new THREE.Color();

    for (let i = 0; i < EMBER_COUNT; i++) {
      const i3 = i * 3;
      emberPos[i3] = (Math.random() - 0.5) * 40;
      emberPos[i3 + 1] = EMBER_Y_BOTTOM + Math.random() * EMBER_Y_SPAN;
      emberPos[i3 + 2] = (Math.random() - 0.5) * 30 - 5;
      emberSeed[i] = Math.random() * Math.PI * 2;
      emberSpeed[i] = 0.15 + Math.random() * 0.5;
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

    let isDesktop = window.innerWidth >= 1024;
    let scrollProgress = 0;
    let smoothScrollProgress = 0;
    const cameraTarget = new THREE.Vector3(0, 0.2, 0);

    function layout() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      isDesktop = w >= 1024;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (isDesktop) {
        centerpiece.position.set(2.9, -0.3, 0);
        centerpiece.scale.setScalar(0.72);
      } else {
        centerpiece.position.set(0, -1.6, 0);
        centerpiece.scale.setScalar(0.78);
      }
    }

    layout();

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

    function computeScrollProgress() {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return Math.min(1, Math.max(0, window.scrollY / max));
    }

    window.addEventListener('scroll', function () {
      scrollProgress = computeScrollProgress();
    }, { passive: true });

    window.__geassSetScrollProgress = function (p) {
      scrollProgress = Math.min(1, Math.max(0, p));
    };

    window.addEventListener('resize', layout, { passive: true });

    const clock = new THREE.Clock();
    let running = true;

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      smoothScrollProgress += (scrollProgress - smoothScrollProgress) * 0.08;

      pointerX += (targetPX - pointerX) * 0.06;
      pointerY += (targetPY - pointerY) * 0.06;

      camera.position.x = pointerX * 0.6;
      camera.position.y = 0.4 - smoothScrollProgress * 15.0 + pointerY * 0.35;
      camera.position.z = 9 - smoothScrollProgress * 1.5;
      cameraTarget.set(0, 0.2 - smoothScrollProgress * 15.0, 0);
      camera.lookAt(cameraTarget);

      kingGroup.rotation.y = t * 0.18;
      kingGroup.position.y = Math.sin(t * 0.6) * 0.12;
      core.rotation.x = t * 0.9;
      core.rotation.y = t * 1.2;
      halo.scale.setScalar(1 + Math.sin(t * 1.6) * 0.08);

      sigilGroup.rotation.y = -t * 0.35;
      sigilGroup.position.y = 3.1 + Math.sin(t * 0.8) * 0.15;
      sigilRing.rotation.z = t * 0.5;
      sigilInner.rotation.z = -t * 0.8;
      sigilCore.rotation.x = t * 1.4;
      sigilCore.rotation.y = t * 1.1;

      orbitGroup.rotation.y = t * 0.22;
      orbit1.rotation.z = t * 0.4;
      orbit2.rotation.z = -t * 0.3;

      for (let i = 0; i < monoliths.length; i++) {
        const m = monoliths[i];
        const u = m.userData;
        m.rotation.x += u.spinX * dt;
        m.rotation.y += u.spinY * dt;
        m.position.x = u.baseX + Math.sin(t * u.drift + u.seed) * 0.6;
      }

      const posAttr = emberGeo.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < EMBER_COUNT; i++) {
        const i3 = i * 3;
        arr[i3 + 1] += emberSpeed[i] * dt * 0.6;
        if (arr[i3 + 1] > EMBER_Y_TOP) arr[i3 + 1] = EMBER_Y_BOTTOM;
        arr[i3] += Math.sin(t * 0.4 + emberSeed[i]) * dt * 0.15;
      }
      posAttr.needsUpdate = true;

      emberMat.opacity = 0.7 + Math.sin(t * 0.9) * 0.15;

      renderer.render(scene, camera);
    }

    animate();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        running = false;
      } else if (!running) {
        running = true;
        clock.getDelta();
        animate();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScene);
  } else {
    initScene();
  }
})();
