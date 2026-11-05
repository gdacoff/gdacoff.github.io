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
    { name: 'Modrinth', desc: 'Minecraft mods and updates', url: 'https://modrinth.com/user/gdacoff', brand: '#1bd96a', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 3a4 4 0 100 8 4 4 0 000-8z' },
    { name: 'CurseForge', desc: 'Mod releases and downloads', url: 'https://www.curseforge.com/members/gdacoff/projects', brand: '#f16436', icon: 'M4 4h16v16H4z M8 8h8v8H8z' },
    { name: 'GitHub', desc: 'Source code and repositories', url: 'https://github.com/gdacoff', brand: '#c9d1d9', icon: 'M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z' },
    { name: 'TikTok', desc: 'Dev logs and mod teasers', url: 'https://tiktok.com/@gdacoff', brand: '#25f4ee', icon: 'M16 3v10.5a4.5 4.5 0 11-4.5-4.5M16 3c.5 2.5 2 4 4.5 4.5' },
    { name: 'SpigotMC', desc: 'Server plugins and community', url: 'https://www.spigotmc.org/members/killerzero_11.2632826/', brand: '#ed8106', icon: 'M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z' },
    { name: 'BuiltByBit', desc: 'Commercial plugins and services', url: 'https://builtbybit.com/members/gdacoff.952782/', brand: '#4f8ef7', icon: 'M4 4h10a4 4 0 010 8H4z M4 12h12a4 4 0 010 8H4z' },
    { name: 'YouTube', desc: 'Video showcases and overviews', url: 'https://www.youtube.com/@gdacoff0', brand: '#ff0000', icon: 'M22 8a3 3 0 00-2-2c-2-.5-8-.5-8-.5s-6 0-8 .5a3 3 0 00-2 2 31 31 0 000 8 3 3 0 002 2c2 .5 8 .5 8 .5s6 0 8-.5a3 3 0 002-2 31 31 0 000-8zM10 15V9l5 3z' }
  ];

  const ARSENAL = [
    { cat: 'Core Languages', items: ['Java', 'Go', 'Rust', 'Python'] },
    { cat: 'Game Engine & Modding', items: ['Minecraft Forge', 'NeoForge', 'Fabric', 'Spigot / Paper API'] },
    { cat: 'Web & Frontend', items: ['JavaScript (ES6+)', 'HTML5', 'CSS3 / Modern Layouts', 'Three.js / WebGL'] },
    { cat: 'Ecosystem & Tools', items: ['IntelliJ IDEA', 'VS Code', 'Gradle', 'Git', 'GitHub Actions'] }
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

  function renderArsenal() {
    const grid = document.getElementById('arsenal-grid');
    if (!grid) return;
    grid.innerHTML = ARSENAL.map(function (g) {
      return '<div class="arsenal-cat glass"><h3>' + esc(g.cat) + '</h3><div class="arsenal-list">' +
        g.items.map(function (i) { return '<span class="arsenal-badge">' + esc(i) + '</span>'; }).join('') +
        '</div></div>';
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
    const cards = document.querySelectorAll('[data-tilt]');
    const MAX = 8;
    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * MAX;
        const ry = (px - 0.5) * MAX;
        card.style.transform = 'perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateY(-3px)';
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
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
    renderArsenal();
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
