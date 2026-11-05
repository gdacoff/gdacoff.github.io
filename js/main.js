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
    { name: 'Modrinth', desc: 'Mod releases & project downloads', url: 'https://modrinth.com/user/gdacoff', brand: '#1bd96a', icon: 'M12.252 2c-5.514 0-9.986 4.472-9.986 9.986 0 2.454.887 4.704 2.365 6.452.17-.306.402-.577.683-.804l2.802-2.26a3.834 3.834 0 0 1 1.53-.745 3.854 3.854 0 0 1 1.884.095l.138.046c.553.187 1.043.518 1.417.957l2.13 2.502a1.92 1.92 0 0 0 1.46.678h.034a1.92 1.92 0 0 0 1.458-.678l3.14-3.69a9.92 9.92 0 0 0 1.93-5.539C22.238 6.472 17.766 2 12.252 2zm-4.78 4.757a1.92 1.92 0 1 1 0 3.84 1.92 1.92 0 0 1 0-3.84zm9.56 0a1.92 1.92 0 1 1 0 3.84 1.92 1.92 0 0 1 0-3.84z' },
    { name: 'CurseForge', desc: 'Mod releases & project downloads', url: 'https://www.curseforge.com/members/gdacoff/projects', brand: '#f16436', icon: 'M12 2 2 7v10l10 5 10-5V7L12 2zm0 2.3 7.5 3.75L12 11.8 4.5 8.05 12 4.3zM4 9.6l7 3.5v6.6l-7-3.5V9.6zm9 10.1v-6.6l7-3.5v6.6l-7 3.5z' },
    { name: 'TikTok', desc: 'Dev logs & mod showcases', url: 'https://tiktok.com/@gdacoff', brand: '#25f4ee', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
    { name: 'Discord', desc: 'Direct command & community', url: 'https://discord.com/users/846024512611942401', brand: '#5865f2', icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z' },
    { name: 'Telegram', desc: 'Direct messages & dev channel', url: 'https://t.me/gdacoff', brand: '#229ED9', icon: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.828.922z' },
    { name: 'SpigotMC', desc: 'Server plugins & community', url: 'https://www.spigotmc.org/members/killerzero_11.2632826/', brand: '#ed8106', icon: 'M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z' },
    { name: 'BuiltByBit', desc: 'Commercial plugins & services', url: 'https://builtbybit.com/members/gdacoff.952782/', brand: '#4f8ef7', icon: 'M4 4h10a4 4 0 010 8H4z M4 12h12a4 4 0 010 8H4z' },
    { name: 'YouTube', desc: 'Video showcases & overviews', url: 'https://www.youtube.com/@gdacoff0', brand: '#ff0000', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }
  ];
  const TECHNOLOGIES = [
    { name: 'Java', cat: 'Languages', svg: 'java' },
    { name: 'Go', cat: 'Languages', svg: 'go' },
    { name: 'Rust', cat: 'Languages', svg: 'rust' },
    { name: 'Python', cat: 'Languages', svg: 'python' },
    { name: 'JavaScript', cat: 'Languages', svg: 'javascript' },
    { name: 'Minecraft Forge', cat: 'Modding', svg: 'forge' },
    { name: 'NeoForge', cat: 'Modding', svg: 'neoforge' },
    { name: 'Fabric', cat: 'Modding', svg: 'fabric' },
    { name: 'HTML5', cat: 'Web', svg: 'html5' },
    { name: 'CSS3', cat: 'Web', svg: 'css3' },
    { name: 'IntelliJ IDEA', cat: 'Tooling', svg: 'intellij' },
    { name: 'VS Code', cat: 'Tooling', svg: 'vscode' },
    { name: 'Gradle', cat: 'Tooling', svg: 'gradle' },
    { name: 'Git', cat: 'Tooling', svg: 'git' }
  ];
  const TECH_SVGS = {
    java: '<svg viewBox="0 0 24 24"><path fill="#f89820" d="M8.5 17.5s-.8.5.6.6c1.7.2 2.6.2 4.5-.2 0 0 .5.3 1.2.6-4.2 1.8-9.5-.1-6.3-1zM7.9 15.1s-.9.7.5.8c1.9.2 3.4.2 6-.2 0 0 .4.4.9.6-5.3 1.6-11.2.1-7.4-1.2z"/><path fill="#ea2d2e" d="M13.4 10.9c1.1 1.3-.3 2.4-.3 2.4s2.8-1.4 1.5-3.2c-1.2-1.7-2.1-2.5 2.8-5.4 0 0-7.7 1.9-4 6.2z"/><path fill="#f89820" d="M18.9 19.4s.6.5-.7.9c-2.5.8-10.6 1-12.8 0-.8-.4.7-.8 1.2-.9.5-.1.8-.1.8-.1-.9-.6-5.8 1.2-2.5 1.8 9 1.4 16.4-.6 14-1.7zM9.6 12.9s-4.1 1-1.5 1.3c1.1.2 3.3.1 5.4-.1 1.7-.1 3.4-.4 3.4-.4s-.6.3-1 .5c-4.1 1.1-12.1.6-9.8-.5 1.9-.9 3.5-.8 3.5-.8zM16.3 16.4c4.2-2.2 2.3-4.3.9-4 0 0-.3.1-.4.2 0 0 .7-.2 1 .5.3.7-.7 1.6-2.5 2.6-1.7 1-3.9 1.9-3.9 1.9s.1.1.5.1c2.9-.1 4.4-.9 4.4-.9z"/></svg>',
    go: '<svg viewBox="0 0 24 24"><path fill="#00add8" d="M2.6 9.4c-.1 0-.1-.1-.1-.2l.1-.2h3.6c.2 0 .3.1.3.2l-.1.2c0 .1-.2.2-.3.2H2.6zm-1.5 1.4c-.1 0-.1-.1-.1-.2l.1-.2h4.7c.2 0 .3.1.3.2l-.1.2c0 .1-.2.2-.3.2H1.1zm2.4 1.4c-.1 0-.1-.1-.1-.2l.1-.2h4.2c.2 0 .3.1.3.2l-.1.2c0 .1-.2.2-.3.2H3.5z"/><path fill="#00add8" d="M14.7 8.9c-1.3 0-2.2.7-2.5 1.9h3.9c0-1.2-.6-1.9-1.4-1.9zm-2.6 3.1c0 1.3.8 2 2.1 2 .9 0 1.6-.4 1.9-1.1h1.6c-.4 1.6-1.7 2.5-3.6 2.5-2.3 0-3.8-1.5-3.8-3.8 0-2.3 1.5-3.8 3.8-3.8 2.3 0 3.7 1.5 3.7 3.8v.4h-5.7zm8.4-3.1c-1.3 0-2.2.7-2.5 1.9h3.9c0-1.2-.6-1.9-1.4-1.9zm-2.6 3.1c0 1.3.8 2 2.1 2 .9 0 1.6-.4 1.9-1.1h1.6c-.4 1.6-1.7 2.5-3.6 2.5-2.3 0-3.8-1.5-3.8-3.8 0-2.3 1.5-3.8 3.8-3.8 2.3 0 3.7 1.5 3.7 3.8v.4h-5.7z"/></svg>',
    rust: '<svg viewBox="0 0 24 24"><path fill="#dea584" d="M12 1.5 13.6 4l2.9-.3.9 2.8 2.7 1.1-.6 2.9 1.9 2.2-1.9 2.2.6 2.9-2.7 1.1-.9 2.8-2.9-.3L12 22.5 10.4 20l-2.9.3-.9-2.8-2.7-1.1.6-2.9L2.6 11.3l1.9-2.2-.6-2.9 2.7-1.1.9-2.8 2.9.3L12 1.5zm0 3.6a6.9 6.9 0 1 0 0 13.8 6.9 6.9 0 0 0 0-13.8zm0 2.4a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z"/></svg>',
    python: '<svg viewBox="0 0 24 24"><path fill="#3776ab" d="M11.9 1.5c-1.9 0-3.4.2-4.5.5-1.1.3-1.8.9-2.1 1.7-.3.8-.4 1.8-.4 3v2.2h6.9v.8H3.6c-1.2 0-2.1.4-2.7 1.2-.6.8-.9 1.9-.9 3.3 0 1.4.3 2.5.9 3.3.6.8 1.5 1.2 2.7 1.2h1.7v-2.4c0-1.3.4-2.3 1.1-3.1.7-.8 1.7-1.2 2.9-1.2h4.6c1.1 0 2-.4 2.7-1.1.7-.7 1-1.6 1-2.7V3.7c0-1.1-.4-2-1.2-2.6-.8-.6-1.9-.9-3.3-.9l-1.2.1zm-2.5 1.7c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"/><path fill="#ffd43b" d="M12.1 22.5c1.9 0 3.4-.2 4.5-.5 1.1-.3 1.8-.9 2.1-1.7.3-.8.4-1.8.4-3v-2.2h-6.9v-.8h8.2c1.2 0 2.1-.4 2.7-1.2.6-.8.9-1.9.9-3.3 0-1.4-.3-2.5-.9-3.3-.6-.8-1.5-1.2-2.7-1.2h-1.7v2.4c0 1.3-.4 2.3-1.1 3.1-.7.8-1.7 1.2-2.9 1.2h-4.6c-1.1 0-2 .4-2.7 1.1-.7.7-1 1.6-1 2.7v4.9c0 1.1.4 2 1.2 2.6.8.6 1.9.9 3.3.9l1.2-.1zm2.5-1.7c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"/></svg>',
    javascript: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="2" fill="#f7df1e"/><path fill="#000" d="M6.7 18.4l1.8-1.1c.3.6.7 1.1 1.4 1.1.7 0 1.1-.3 1.1-1.3v-7.2h2.2v7.3c0 2.3-1.3 3.3-3.3 3.3-1.8 0-2.8-.9-3.2-2.1zm7.8-.2l1.8-1c.5.8 1.1 1.4 2.3 1.4 1 0 1.6-.5 1.6-1.2 0-.8-.6-1.1-1.7-1.6l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3 3.4-3 1.5 0 2.5.5 3.3 1.9l-1.8 1.2c-.4-.7-.8-1-1.5-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.5 1.5l.6.3c2 .9 3.1 1.7 3.1 3.7 0 2.1-1.6 3.2-3.8 3.2-2.1 0-3.5-1-4.1-2.4z"/></svg>',
    forge: '<svg viewBox="0 0 24 24"><path fill="#ed8106" d="M3 20h18l-2-4H5l-2 4zm2-6h14l-2-4H7l-2 4zm2-6h10l-2-4H9L7 8z"/></svg>',
    neoforge: '<svg viewBox="0 0 24 24"><path fill="#ff003c" d="M12 2c-1 3-3 5-3 8 0 2 1 3 1 5 0 1-1 2-1 3 0 2 2 4 3 4s3-2 3-4c0-1-1-2-1-3 0-2 1-3 1-5 0-3-2-5-3-8z"/><path fill="#ffd700" d="M12 8c-.5 1.5-1.5 2.5-1.5 4 0 1 .5 1.5.5 2.5 0 .5-.5 1-.5 1.5 0 1 1 2 1.5 2s1.5-1 1.5-2c0-.5-.5-1-.5-1.5 0-1 .5-1.5.5-2.5 0-1.5-1-2.5-1.5-4z"/></svg>',
    fabric: '<svg viewBox="0 0 24 24"><path fill="#25f4ee" d="M4 4h16v3H7v3h10v3H7v3h13v3H4V4z"/></svg>',
    html5: '<svg viewBox="0 0 24 24"><path fill="#e34f26" d="M3 2l1.6 18L12 22l7.4-2L21 2H3zm14.5 5.5H8.4l.2 2.5h8.7l-.7 7.5-4.6 1.3-4.6-1.3-.3-3.5h2.3l.2 1.8 2.4.7 2.4-.7.3-3.3H6.9L6.4 4.5h11.4l-.3 3z"/></svg>',
    css3: '<svg viewBox="0 0 24 24"><path fill="#1572b6" d="M3 2l1.6 18L12 22l7.4-2L21 2H3zm14.5 5.5H8.4l.2 2.5h8.7l-.7 7.5-4.6 1.3-4.6-1.3-.3-3.5h2.3l.2 1.8 2.4.7 2.4-.7.3-3.3H6.9L6.4 4.5h11.4l-.3 3z"/></svg>',
    intellij: '<svg viewBox="0 0 24 24"><rect width="24" height="24" rx="3" fill="#000"/><path fill="#fc801d" d="M2 2h9v9H2z"/><path fill="#087cfa" d="M13 2h9v9h-9z"/><path fill="#fe2857" d="M2 13h9v9H2z"/><path fill="#3bea36" d="M13 13h9v9h-9z"/><path fill="#fff" d="M6 6h2v6H6zM10 6h1.5v6H10z"/></svg>',
    vscode: '<svg viewBox="0 0 24 24"><path fill="#007acc" d="M17.5 2L8 11.5 3.5 8 2 8.7v6.6L3.5 16 8 12.5 17.5 22 22 20V4l-4.5-2zM17 7v10l-6-5 6-5z"/></svg>',
    gradle: '<svg viewBox="0 0 24 24"><path fill="#02303a" d="M22 4c-1 0-2 1-2 2 0 1.5-1 3-2.5 3.5C15 10 12 10 10 12c-1 1-1.5 2.5-1.5 4 0 2-1.5 3.5-3.5 3.5S1.5 18 1.5 16 3 12.5 5 12.5c.5 0 1 .1 1.5.3C7 10 9.5 8 12.5 8c2 0 3.5-1 4-2.5.5-1.5 2-2.5 3.5-2.5 1 0 2 .4 2 1z"/><circle cx="5" cy="16" r="2" fill="#fff"/></svg>',
    git: '<svg viewBox="0 0 24 24"><path fill="#f05032" d="M23.5 11.1L12.9.5c-.7-.7-1.8-.7-2.4 0L8.2 2.8l3 3c.7-.2 1.6 0 2.1.6.6.6.8 1.4.6 2.1l2.9 2.9c.7-.2 1.5 0 2.1.6.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.6-.6-.8-1.5-.6-2.2l-2.7-2.7v7.1c.2.1.4.2.5.4.8.8.8 2.1 0 2.9-.8.8-2.1.8-2.9 0-.8-.8-.8-2.1 0-2.9.2-.2.4-.3.6-.4V9.4c-.2-.1-.4-.2-.6-.4-.6-.6-.8-1.5-.6-2.2L7.1 3.9.5 10.5c-.7.7-.7 1.8 0 2.4l10.6 10.6c.7.7 1.8.7 2.4 0l10-10c.7-.7.7-1.8 0-2.4z"/></svg>'
  };
  const TYPING_TEXT = 'Java Developer & Mod Creator | Turning ideas into reality | All hail Lelouch!';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(function (p, index) {
      const featured = index === 0 ? ' project-card--featured' : '';
      return '<article class="project-card glass reveal-card' + featured + '" data-tilt style="--i:' + index + '">' +
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
    grid.innerHTML = PLATFORMS.map(function (p, index) {
      return '<a class="platform-card glass reveal-card" data-tilt href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer" style="--brand:' + esc(p.brand) + ';--i:' + index + '">' +
        '<span class="platform-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + esc(p.icon) + '" fill="currentColor"/></svg></span>' +
        '<span class="platform-meta"><span class="platform-name">' + esc(p.name) + '</span>' +
        '<span class="platform-desc">' + esc(p.desc) + '</span></span></a>';
    }).join('');
  }

  function renderTechnologies() {
    const grid = document.getElementById('tech-grid');
    if (!grid) return;
    grid.innerHTML = TECHNOLOGIES.map(function (t, index) {
      const svg = TECH_SVGS[t.svg] || '';
      return '<div class="tech-card glass reveal-card" data-tilt style="--i:' + index + '">' +
        '<span class="tech-logo" aria-hidden="true">' + svg + '</span>' +
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
    const ALPHA = 0.16;
    cards.forEach(function (card) {
      let raf = 0;
      let lastX = 0, lastY = 0;
      let hovering = false;
      const cur = { px: 0.5, py: 0.5, rx: 0, ry: 0, glare: 0 };
      const tgt = { px: 0.5, py: 0.5, rx: 0, ry: 0, glare: 0 };
      function tick() {
        cur.px += (tgt.px - cur.px) * ALPHA;
        cur.py += (tgt.py - cur.py) * ALPHA;
        cur.rx += (tgt.rx - cur.rx) * ALPHA;
        cur.ry += (tgt.ry - cur.ry) * ALPHA;
        cur.glare += (tgt.glare - cur.glare) * ALPHA;
        card.style.transform = 'perspective(1000px) rotateX(' + cur.rx.toFixed(2) + 'deg) rotateY(' + cur.ry.toFixed(2) + 'deg) translateY(' + (hovering ? -4 : 0) + 'px) translateZ(' + (hovering ? 8 : 0) + 'px)';
        card.style.setProperty('--mx', (cur.px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (cur.py * 100).toFixed(1) + '%');
        card.style.setProperty('--glare', cur.glare.toFixed(2));
        const settled = Math.abs(tgt.rx - cur.rx) < 0.02 && Math.abs(tgt.ry - cur.ry) < 0.02 &&
          Math.abs(tgt.px - cur.px) < 0.001 && Math.abs(tgt.py - cur.py) < 0.001 &&
          Math.abs(tgt.glare - cur.glare) < 0.005;
        if (settled && !hovering) {
          raf = 0;
          card.style.transform = '';
          card.style.setProperty('--glare', '0');
          return;
        }
        raf = requestAnimationFrame(tick);
      }
      function ensure() {
        if (!raf) raf = requestAnimationFrame(tick);
      }
      card.addEventListener('pointermove', function (e) {
        hovering = true;
        lastX = e.clientX;
        lastY = e.clientY;
        const r = card.getBoundingClientRect();
        tgt.px = Math.min(1, Math.max(0, (lastX - r.left) / r.width));
        tgt.py = Math.min(1, Math.max(0, (lastY - r.top) / r.height));
        tgt.rx = (0.5 - tgt.py) * MAX;
        tgt.ry = (tgt.px - 0.5) * MAX;
        tgt.glare = 0.35 + 0.55 * (1 - Math.abs(tgt.px - 0.5) * 2) * (1 - Math.abs(tgt.py - 0.5) * 2);
        ensure();
      });
      card.addEventListener('pointerleave', function () {
        hovering = false;
        tgt.px = 0.5;
        tgt.py = 0.5;
        tgt.rx = 0;
        tgt.ry = 0;
        tgt.glare = 0;
        ensure();
      });
    });
  }

  function initReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.reveal-mask, .reveal-rule, .reveal-card, .section');
    if (reduce || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { observer.observe(el); });
    const hero = document.querySelectorAll('.hero .reveal-mask, .hero .reveal-rule');
    setTimeout(function () {
      hero.forEach(function (el) { el.classList.add('is-revealed'); });
    }, 100);
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

  function initMomentumScroll() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduce || isCoarse) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let raf = 0;
    let animating = false;

    function maxScroll() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function pushProgress() {
      if (typeof window.__geassSetScrollProgress === 'function') {
        const max = Math.max(1, maxScroll());
        window.__geassSetScrollProgress(currentY / max);
      }
    }

    function tick() {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.5) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        pushProgress();
        animating = false;
        raf = 0;
        return;
      }
      currentY += diff * 0.085;
      window.scrollTo(0, currentY);
      pushProgress();
      raf = requestAnimationFrame(tick);
    }

    function ensure() {
      if (!animating) {
        animating = true;
        raf = requestAnimationFrame(tick);
      }
    }

    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      targetY = Math.min(maxScroll(), Math.max(0, targetY + delta));
      ensure();
    }, { passive: false });

    // Sync target when user scrolls via keyboard, scrollbar, or programmatic scroll
    window.addEventListener('scroll', function () {
      if (!animating) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    }, { passive: true });

    // Smooth anchor navigation
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const header = document.getElementById('site-header');
        const offset = header ? header.offsetHeight + 12 : 0;
        const rect = target.getBoundingClientRect();
        const dest = Math.min(maxScroll(), Math.max(0, window.scrollY + rect.top - offset));
        targetY = dest;
        ensure();
        if (history.replaceState) history.replaceState(null, '', href);
      });
    });

    window.addEventListener('resize', function () {
      targetY = Math.min(maxScroll(), targetY);
      currentY = Math.min(maxScroll(), currentY);
    }, { passive: true });
  }

  function init() {
    renderProjects();
    renderPlatforms();
    renderTechnologies();
    initTyping();
    initReveal();
    initTilt();
    initNav();
    initSound();
    initMomentumScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
