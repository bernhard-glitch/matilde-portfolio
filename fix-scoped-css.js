const fs = require("fs");
const path = require("path");

const cssPath = path.join(__dirname, "style.css");
const src = fs.readFileSync(cssPath, "utf8");
const lines = src.split(/\r?\n/);

let currentScope = "";
const out = [];

function prefixSelectorList(selector, scope) {
  return selector
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

for (const line of lines) {
  const marker = line.match(/^\/\* ===== .* \((page-[a-z0-9-]+)\) ===== \*\/$/);
  if (marker) {
    currentScope = `body.${marker[1]}`;
    out.push(line);
    continue;
  }

  if (/^body\.page-[a-z0-9-]+\s*\/\*/.test(line.trim())) {
    continue;
  }

  const t = line.trim();
  if (!currentScope || t === "" || t.startsWith("/*") || t.startsWith("@") || t.startsWith("}")) {
    out.push(line);
    continue;
  }

  const brace = line.indexOf("{");
  if (brace === -1) {
    out.push(line);
    continue;
  }

  const selectorPart = line.slice(0, brace).trim();
  const rest = line.slice(brace);
  if (selectorPart.startsWith(currentScope)) {
    out.push(line);
    continue;
  }

  const prefixed = prefixSelectorList(selectorPart, currentScope);
  const indent = line.match(/^\s*/)[0];
  out.push(`${indent}${prefixed} ${rest}`);
}

fs.writeFileSync(cssPath, out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n", "utf8");
console.log("Scoped CSS repair complete.");
