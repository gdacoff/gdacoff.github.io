const fs = require('fs');
const files = ['index.html', 'css/base.css', 'css/components.css', 'js/main.js', 'js/three-scene.js'];
let ok = true;
for (const f of files) {
  if (!fs.existsSync(f)) { console.error('MISSING ' + f); ok = false; }
}
const html = fs.readFileSync('index.html', 'utf8');
const refs = ['css/base.css', 'css/components.css', 'js/main.js', 'js/three-scene.js', 'three.min.js'];
for (const r of refs) {
  if (!html.includes(r)) { console.error('HTML MISSING REF ' + r); ok = false; }
}
const ids = ['geass-canvas', 'project-grid', 'platform-grid', 'tech-grid', 'typing-target', 'sound-toggle', 'nav-toggle', 'primary-nav', 'site-header', 'technologies'];
for (const id of ids) {
  if (!html.includes('id="' + id + '"')) { console.error('HTML MISSING ID ' + id); ok = false; }
}
if (!ok) process.exit(1);
console.log('ALL OK');
