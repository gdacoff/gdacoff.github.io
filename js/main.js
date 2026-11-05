/* UI logic: data rendering, typing, tilt, nav, sound. */
(function () {
  'use strict';

  const PROJECTS = [
    { title: 'KilllTheFrizz', status: 'beta', statusLabel: 'Beta', type: 'Tech Mod', desc: 'Server-side performance optimization mod for Minecraft 1.21.1. Intelligent entity sleeping, villager AI throttling, collision optimization.', tags: ['Java', 'NeoForge', 'Server Optimization', 'Performance'], url: 'https://github.com/gdacoff/KilllTheFrizz' },
    { title: 'LucasMod', status: 'dev', statusLabel: 'In Development', type: 'Commercial Mod', desc: 'Private commission featuring urban development, city management mechanics, and custom gameplay loops.', tags: ['Java', 'Minecraft', 'Commercial'], url: 'https://github.com/gdacoff/LucasMod' },
    { title: 'x1.5.9_delta', status: 'dev', statusLabel: 'In Development', type: 'Horror Mod', desc: 'Atmospheric retro horror mod creating an intense environment of vulnerability and psychological tension.', tags: ['Java', 'Fabric / Forge', 'Atmospheric Horror'], url: 'https://github.com/gdacoff/x1.5.9_delta' },
    { title: 'alpha_deprecated', status: 'done', statusLabel: 'Completed', type: 'Horror Mod', desc: 'Conceptual retro horror mod based on leaked 2009 alpha core mechanics.', tags: ['Minecraft', 'Retro Horror', 'Legacy Archive'], url: 'https://github.com/gdacoff/Alpha_Deprecated' },
    { title: 'SearchGitKillerApp', status: 'dev', statusLabel: 'In Development', type: 'Desktop Tool', desc: 'High-performance desktop search application for finding GitHub repositories based on rough natural descriptions without exact names.', tags: ['Rust', 'Desktop', 'Search Engine'], url: 'https://github.com/gdacoff/SearchGitKillerApp' },
    { title: 'SearchGitKiller', status: 'post', statusLabel: 'Postponed', type: 'Web Tool', desc: 'Web portal for discovering GitHub projects using heuristic natural language queries.', tags: ['JavaScript', 'Web', 'GitHub API'], url: 'https://github.com/gdacoff/SearchGitKiller' }
  ];

  const PLATFORMS = [
    { name: 'GitHub', desc: 'Source code & open repositories', url: 'https://github.com/gdacoff', brand: '#c9d1d9', icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' },
    { name: 'Discord', desc: 'Direct command & community', url: 'https://discord.com/users/846024512611942401', brand: '#5865f2', icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' },
    { name: 'Modrinth', desc: 'Minecraft mods & releases', url: 'https://modrinth.com/user/gdacoff', brand: '#1bd96a', icon: 'M12.252 2c-5.514 0-9.986 4.472-9.986 9.986 0 2.454.887 4.704 2.365 6.452.17-.306.402-.577.683-.804l2.802-2.26a3.834 3.834 0 0 1 1.53-.745 3.854 3.854 0 0 1 1.884.095l.138.046c.553.187 1.043.518 1.417.957l2.13 2.502a1.92 1.92 0 0 0 1.46.678h.034a1.92 1.92 0 0 0 1.458-.678l3.14-3.69a9.92 9.92 0 0 0 1.93-5.539C22.238 6.472 17.766 2 12.252 2zm-4.78 4.757a1.92 1.92 0 1 1 0 3.84 1.92 1.92 0 0 1 0-3.84zm9.56 0a1.92 1.92 0 1 1 0 3.84 1.92 1.92 0 0 1 0-3.84z' },
    { name: 'CurseForge', desc: 'Mod releases & project downloads', url: 'https://www.curseforge.com/members/gdacoff/projects', brand: '#f16436', icon: 'M4 4h16v16H4z M8 8h8v8H8z' },
    { name: 'TikTok', desc: 'Dev logs & mod showcases', url: 'https://tiktok.com/@gdacoff', brand: '#25f4ee', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
    { name: 'Telegram', desc: 'Direct messages & dev channel', url: 'https://t.me/gdacoff', brand: '#229ED9', icon: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.828.922z' },
    { name: 'SpigotMC', desc: 'Server plugins & community', url: 'https://www.spigotmc.org/members/killerzero_11.2632826/', brand: '#ed8106', icon: 'M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z' },
    { name: 'BuiltByBit', desc: 'Commercial plugins & services', url: 'https://builtbybit.com/members/gdacoff.952782/', brand: '#4f8ef7', icon: 'M4 4h10a4 4 0 010 8H4z M4 12h12a4 4 0 010 8H4z' },
    { name: 'YouTube', desc: 'Video showcases & overviews', url: 'https://www.youtube.com/@gdacoff0', brand: '#ff0000', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }
  ];

  const TECHNOLOGIES = [
    { name: 'Java', cat: 'Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Go', cat: 'Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    { name: 'Rust', cat: 'Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg' },
    { name: 'Python', cat: 'Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'JavaScript', cat: 'Languages', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Minecraft Forge', cat: 'Modding', logo: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/cube.svg', tint: '#ed8106' },
    { name: 'NeoForge', cat: 'Modding', logo: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/fire.svg', tint: '#ff003c' },
    { name: 'Fabric', cat: 'Modding', logo: 'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/svgs/solid/scroll.svg', tint: '#25f4ee' },
    { name: 'HTML5', cat: 'Web', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', cat: 'Web', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'IntelliJ IDEA', cat: 'Tooling', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg' },
    { name: 'VS Code', cat: 'Tooling', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Gradle', cat: 'Tooling', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gradle/gradle-original.svg' },
    { name: 'Git', cat: 'Tooling', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' }
  ];

  const TYPING_TEXT = 'Java Developer & Mod Creator | Turning ideas into reality | All hail Lelouch!';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(function (p) {
      return '<article class="project-card glass" data-tilt>' +
        '<div class="card-top"><h3 class="card-title">' + esc(p.title) + '</h3>' +
        '<span class="badge badge--' + p.status + '">' + esc(p.statusLabel) + '</span></div>' +
        '<span class="card-type">' + esc(p.type) + '</span>' +
        '<p class="card-desc">' + esc(p.desc) + '</p>' +
        '<div class="card-tags">' + p.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + '</div>' +
        '<a class="card-link" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">View Repository <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
        '</article>';
    }).join('');
  }

  function renderPlatforms() {
    const grid = document.getElementById('platform-grid');
    if (!grid) return;
    grid.innerHTML = PLATFORMS.map(function (p) {
      return '<a class="platform-card glass" data-tilt href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer" style="--brand:' + esc(p.brand) + '">' +
        '<span class="platform-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + esc(p.icon) + '" fill="currentColor"/></svg></span>' +
        '<span class="platform-meta"><span class="platform-name">' + esc(p.name) + '</span>' +
        '<span class="platform-desc">' + esc(p.desc) + '</span></span></a>';
    }).join('');
  }

  function renderTechnologies() {
    const grid = document.getElementById('tech-grid');
    if (!grid) return;
    grid.innerHTML = TECHNOLOGIES.map(function (t) {
      const tintStyle = t.tint ? ' style="filter:drop-shadow(0 4px 10px rgba(0,0,0,.6)) drop-shadow(0 0 8px ' + esc(t.tint) + ')"' : '';
      return '<div class="tech-card glass" data-tilt>' +
        '<img class="tech-logo" src="' + esc(t.logo) + '" alt="' + esc(t.name) + ' logo" loading="lazy" decoding="async" width="52" height="52"' + tintStyle + ' />' +
        '<h3 class="tech-name">' + esc(t.name) + '</h3>' +
        '<span class="tech-cat-badge">' + esc(t.cat) + '</span>' +
        '</div>';
    }).join('');
  }

  function initTyping() {
    const target = document.getElementById('typing-target');
    if (!target) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.textContent = TYPING_TEXT;
      return;
    }
    let i = 0;
    function step() {
      if (i <= TYPING_TEXT.length) {
        target.textContent = TYPING_TEXT.slice(0, i);
        i++;
        setTimeout(step, 38);
      }
    }
    step();
  }

  function initTilt() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = document.querySelectorAll('[data-tilt]');
    const MAX = 14;
    cards.forEach(function (card) {
      let raf = 0;
      let lastX = 0, lastY = 0;
      function apply() {
        raf = 0;
        const r = card.getBoundingClientRect();
        const px = Math.min(1, Math.max(0, (lastX - r.left) / r.width));
        const py = Math.min(1, Math.max(0, (lastY - r.top) / r.height));
        const rx = (0.5 - py) * MAX;
        const ry = (px - 0.5) * MAX;
        card.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-4px) translateZ(8px)';
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.setProperty('--glare', (0.35 + 0.55 * (1 - Math.abs(px - 0.5) * 2) * (1 - Math.abs(py - 0.5) * 2)).toFixed(2));
      }
      card.addEventListener('pointermove', function (e) {
        lastX = e.clientX;
        lastY = e.clientY;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      card.addEventListener('pointerleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        card.style.transform = '';
        card.style.setProperty('--glare', '0');
      });
    });
  }

  function initNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('primary-nav');
    const header = document.getElementById('site-header');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        nav.classList.toggle('is-open', !open);
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          toggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('is-open');
        });
      });
    }
    if (header) {
      const onScroll = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  function initSound() {
    const btn = document.getElementById('sound-toggle');
    if (!btn) return;
    let ctx = null;
    let on = false;

    function start() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.04;
      master.connect(ctx.destination);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 55;
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 82.5;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 3;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      osc1.connect(master);
      osc2.connect(master);
      osc1.start();
      osc2.start();
      lfo.start();
    }

    function chime() {
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(880, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.4);
    }

    btn.addEventListener('click', function () {
      on = !on;
      btn.setAttribute('aria-pressed', String(on));
      const label = btn.querySelector('.sound-label');
      if (label) label.textContent = on ? 'Sound ON' : 'Sound OFF';
      if (on) {
        if (!ctx) start();
        else if (ctx.state === 'suspended') ctx.resume();
        chime();
      } else if (ctx && ctx.state === 'running') {
        ctx.suspend();
      }
    });
  }

  function init() {
    renderProjects();
    renderPlatforms();
    renderTechnologies();
    initTyping();
    initTilt();
    initNav();
    initSound();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
