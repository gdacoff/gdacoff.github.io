const fs = require('fs');

let ok = true;
function fail(msg) { console.error('FAIL: ' + msg); ok = false; }

const files = ['index.html', 'css/base.css', 'css/components.css', 'js/main.js', 'js/three-scene.js'];
for (const f of files) {
  if (!fs.existsSync(f)) fail('missing file ' + f);
}

const html = fs.readFileSync('index.html', 'utf8');
const main = fs.readFileSync('js/main.js', 'utf8');

// Relative asset references only (no leading slash, no absolute URLs for local assets)
const refs = ['css/base.css', 'css/components.css', 'js/main.js', 'js/three-scene.js'];
for (const r of refs) {
  if (!html.includes(r)) fail('html missing ref ' + r);
  if (html.includes('href="/' + r) || html.includes('src="/' + r)) fail('absolute path for ' + r);
}

// Required DOM ids
const ids = ['geass-canvas', 'project-grid', 'platform-grid', 'tech-grid', 'typing-target', 'sound-toggle', 'nav-toggle', 'primary-nav', 'site-header', 'technologies', 'projects', 'platforms', 'about'];
for (const id of ids) {
  if (!html.includes('id="' + id + '"')) fail('html missing id ' + id);
}

// Hero copy
const heroChecks = [
  'ROYAL BRITANNIA',
  'KILLERZERO',
  'gdacoff',
  'Lelouch vi Britannia',
  'Explore Projects',
  'Direct Command',
  '\u265b'
];
for (const h of heroChecks) {
  if (!html.includes(h)) fail('hero missing: ' + h);
}

// Footer
if (!html.includes("If the king doesn't move")) fail('footer quote missing');
if (!html.includes('Built with Three.js')) fail('footer credit missing');

// Nav links
for (const n of ['About', 'Projects', 'Platforms', 'Technologies']) {
  if (!html.includes('>' + n + '<')) fail('nav link missing: ' + n);
}

// GEASS ONLINE status
if (!html.includes('GEASS ONLINE')) fail('status pill missing');

// PLATFORMS: exactly 9, all required names + urls
const platformNames = ['GitHub', 'Modrinth', 'CurseForge', 'TikTok', 'Discord', 'Telegram', 'SpigotMC', 'BuiltByBit', 'YouTube'];
const platformUrls = [
  'https://github.com/gdacoff',
  'https://modrinth.com/user/gdacoff',
  'https://www.curseforge.com/members/gdacoff/projects',
  'https://tiktok.com/@gdacoff',
  'https://discord.com/users/846024512611942401',
  'https://t.me/gdacoff',
  'https://www.spigotmc.org/members/killerzero_11.2632826/',
  'https://builtbybit.com/members/gdacoff.952782/',
  'https://www.youtube.com/@gdacoff0'
];
const platformBlock = main.slice(main.indexOf('const PLATFORMS'), main.indexOf('const TECHNOLOGIES'));
const platformCount = (platformBlock.match(/name:\s*'/g) || []).length;
if (platformCount !== 9) fail('PLATFORMS count expected 9, got ' + platformCount);
for (const n of platformNames) {
  if (!platformBlock.includes("name: '" + n + "'")) fail('platform missing: ' + n);
}
for (const u of platformUrls) {
  if (!platformBlock.includes(u)) fail('platform url missing: ' + u);
}

// TECHNOLOGIES: exactly 14, 4 categories
const techBlock = main.slice(main.indexOf('const TECHNOLOGIES'), main.indexOf('const TYPING_TEXT'));
const techCount = (techBlock.match(/name:\s*'/g) || []).length;
if (techCount !== 14) fail('TECHNOLOGIES count expected 14, got ' + techCount);
const techNames = ['Java', 'Go', 'Rust', 'Python', 'JavaScript', 'Minecraft Forge', 'NeoForge', 'Fabric', 'HTML5', 'CSS3', 'IntelliJ IDEA', 'VS Code', 'Gradle', 'Git'];
for (const n of techNames) {
  if (!techBlock.includes("name: '" + n + "'")) fail('tech missing: ' + n);
}
for (const c of ['Languages', 'Modding', 'Web', 'Tooling']) {
  if (!techBlock.includes("cat: '" + c + "'")) fail('tech category missing: ' + c);
}

// PROJECTS: exactly 6
const projectBlock = main.slice(main.indexOf('const PROJECTS'), main.indexOf('const PLATFORMS'));
const projectCount = (projectBlock.match(/title:\s*'/g) || []).length;
if (projectCount !== 6) fail('PROJECTS count expected 6, got ' + projectCount);
const projectTitles = ['KilllTheFrizz', 'LucasMod', 'x1.5.9_delta', 'alpha_deprecated', 'SearchGitKillerApp', 'SearchGitKiller'];
for (const t of projectTitles) {
  if (!projectBlock.includes("title: '" + t + "'")) fail('project missing: ' + t);
}
for (const s of ['beta', 'dev', 'done', 'post']) {
  if (!projectBlock.includes("status: '" + s + "'")) fail('project status missing: ' + s);
}

// Stat card Platforms = 9
if (!/stat-num">9<\/span>\s*<span class="stat-label">Platforms/.test(html)) {
  fail('stat card Platforms should be 9');
}

if (!ok) process.exit(1);
console.log('ALL OK');
