const fs = require("fs");
const path = require("path");

const root = __dirname;
const cssPath = path.join(root, "style.css");
const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith(".html")).sort();

function slugFromFile(file) {
  return "page-" + file.replace(/\.html$/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function addBodyClass(html, cls) {
  return html.replace(/<body([^>]*)>/i, (m, attrs) => {
    if (/class\s*=\s*"/i.test(attrs)) {
      return `<body${attrs.replace(/class\s*=\s*"([^"]*)"/i, (cm, v) => {
        const merged = `${v} ${cls}`.trim().replace(/\s+/g, " ");
        return `class="${merged}"`;
      })}>`;
    }
    return `<body${attrs} class="${cls}">`;
  });
}

function findMatchingBrace(str, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < str.length; i++) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function prefixSelectors(selectorText, scope) {
  return selectorText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((sel) => {
      if (sel.startsWith(scope)) return sel;
      if (/^body\b/.test(sel)) return sel.replace(/^body\b/, scope);
      if (sel.startsWith(":root")) return sel;
      return `${scope} ${sel}`;
    })
    .join(", ");
}

function scopeCss(css, scope) {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open === -1) {
      out += css.slice(i);
      break;
    }
    const head = css.slice(i, open).trimEnd();
    const close = findMatchingBrace(css, open);
    if (close === -1) {
      out += css.slice(i);
      break;
    }
    const inner = css.slice(open + 1, close);

    const headTrim = head.trim();
    if (headTrim.startsWith("@media") || headTrim.startsWith("@supports")) {
      out += `${headTrim} {\n${scopeCss(inner, scope)}\n}\n`;
    } else if (headTrim.startsWith("@keyframes") || headTrim.startsWith("@font-face")) {
      out += `${headTrim} {${inner}}\n`;
    } else if (headTrim.length > 0) {
      const prefixed = prefixSelectors(headTrim, scope);
      out += `${prefixed} {${inner}}\n`;
    }
    i = close + 1;
  }
  return out;
}

const source = fs.readFileSync(cssPath, "utf8");
const markerRe = /\/\* ===== ([^*]+) ===== \*\//g;
const markers = [...source.matchAll(markerRe)];

const sections = [];
for (let idx = 0; idx < markers.length; idx++) {
  const file = markers[idx][1].trim();
  const start = markers[idx].index + markers[idx][0].length;
  const end = idx + 1 < markers.length ? markers[idx + 1].index : source.length;
  const css = source.slice(start, end).trim();
  sections.push({ file, css });
}

const shared = `/* Global shared base */\nbody {\n  font-family: 'Inter', sans-serif;\n  margin: 0;\n  padding: 0;\n  background-color: #ffffff;\n  color: #18181b;\n}\n\nh1, h2, h3, .serif {\n  font-family: 'Playfair Display', serif;\n}\n\nheader {\n  padding: 16px 20px;\n  text-align: center;\n  position: sticky;\n  top: 0;\n  background: rgba(255, 255, 255, 0.95);\n  backdrop-filter: blur(10px);\n  z-index: 100;\n  border-bottom: 2px solid #ebebe8;\n}\n\n.logo {\n  font-size: 24px;\n  letter-spacing: 0.3em;\n  text-transform: uppercase;\n  font-weight: 300;\n  margin-bottom: 8px;\n  text-decoration: none;\n  color: #18181b;\n  display: block;\n}\n\nnav a {\n  text-decoration: none;\n  margin: 0 10px;\n  text-transform: uppercase;\n  font-size: 10px;\n  letter-spacing: 0.15em;\n  font-weight: bold;\n  color: #18181b;\n  padding: 10px;\n}\n\nnav a:hover {\n  color: #a1a1aa;\n}\n\nfooter {\n  border-top: 2px solid #ebebe8;\n  text-align: center;\n  padding: 40px 20px;\n  margin-top: 60px;\n}\n\nfooter p {\n  font-size: 11px;\n  color: #a1a1aa;\n  letter-spacing: 0.1em;\n}\n\nfooter a {\n  color: #18181b;\n  text-decoration: none;\n  margin: 0 5px;\n}\n`;

let out = "/* Deduplicated stylesheet */\n\n" + shared + "\n";

for (const { file, css } of sections) {
  const cls = slugFromFile(file);
  const stripped = css
    .replace(/^\s*body\s*\{[^}]*\}\s*$/gim, "")
    .replace(/^\s*h1,\s*h2,\s*h3,\s*\.serif\s*\{[^}]*\}\s*$/gim, "")
    .replace(/^\s*header\s*\{[^}]*\}\s*$/gim, "")
    .replace(/^\s*\.logo\s*\{[^}]*\}\s*$/gim, "")
    .replace(/^\s*nav a\s*\{[^}]*\}\s*$/gim, "")
    .replace(/^\s*nav a:hover\s*\{[^}]*\}\s*$/gim, "")
    .replace(/^\s*footer\s*\{[^}]*\}\s*$/gim, "")
    .replace(/^\s*footer p\s*\{[^}]*\}\s*$/gim, "")
    .replace(/^\s*footer a\s*\{[^}]*\}\s*$/gim, "")
    .trim();

  out += `/* ===== ${file} (${cls}) ===== */\n`;
  out += `${scopeCss(stripped, `body.${cls}`)}\n`;
}

fs.writeFileSync(cssPath, out.trimEnd() + "\n", "utf8");

for (const file of htmlFiles) {
  const full = path.join(root, file);
  const cls = slugFromFile(file);
  const html = fs.readFileSync(full, "utf8");
  const updated = addBodyClass(html, cls);
  fs.writeFileSync(full, updated, "utf8");
}

console.log(`Dedup complete for ${sections.length} sections and ${htmlFiles.length} HTML files.`);
