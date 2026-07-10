# AGENTS.md – matilde-portfolio

Regeln für KI-Agenten (Antigravity, Claude Code o. ä.), die in diesem Repository arbeiten.

## Projektkontext

Statische Portfolio-Website für die Berlin-basierte Künstlerin **Matilde Cánepa González**
(Malerei, Skulptur, Cyanotypie). Reine digitale Visitenkarte – **kein Shop** (Verkauf läuft
extern über Saatchi Art und Artmajeur).

- **Domain:** `https://matilde-art-studio.com/` (ohne `www.`)
- **Stack:** statisches HTML5/CSS3/Vanilla JS – **kein Framework, kein Build-Prozess**
- **Hosting:** GitHub Pages + Cloudflare CDN
- **Kontaktformular:** Formspree (Endpoint `xbdwngae`)
- **Struktur:** 11 HTML-Seiten + eine gemeinsame `style.css`
- **Sprache:** Alle Inhalte auf Englisch, `lang="en"` ist auf allen Seiten korrekt und beabsichtigt – nicht "korrigieren"

## Arbeitsweise – strikt einzuhalten

1. **Erst analysieren, dann vorschlagen, erst nach expliziter Bestätigung umsetzen.**
   Keine Änderungen an Dateien vornehmen, ohne den Plan vorher in Textform darzulegen
   und eine klare Zustimmung (z. B. „Ja") abzuwarten – auch bei kleinen Fixes.
2. **Eine logische Änderung nach der anderen.** Nicht mehrere unabhängige Anpassungen
   in einem Rutsch bündeln, ohne dass jede einzeln nachvollziehbar/prüfbar ist.
3. **Scope vor Umsetzung klären:** Welche Datei(en) sind betroffen? Nur Desktop oder auch
   Mobile-Ansicht? Bei CSS-Änderungen: welche Seiten teilen sich die betroffene Klasse?
4. Vor jedem Deploy: Mockup/Vorschau bereitstellen, wenn Layout betroffen ist.

## Technische Constraints (kritisch – niemals ignorieren)

- **CRLF-Erhalt:** `paintings.html` und `cyanotype.html` enthalten CRLF-Zeilenumbrüche und
  teils `\r\r`-Artefakte (Ursprung: BlueGriffon-Editor). Diese müssen **byte-exakt** erhalten
  bleiben. Beim Bearbeiten mit Python: Dateien mit `newline=''` öffnen, niemals mit
  automatischer Zeilenumbruch-Konvertierung speichern.
- **Case-Sensitivity:** GitHub Pages ist case-sensitiv. Dateinamen in HTML (Bilder, Fonts,
  Skripte) müssen exakt mit den tatsächlichen Dateinamen übereinstimmen – auch bei
  Groß-/Kleinschreibung (Fonts liegen z. B. konsequent in Kleinbuchstaben in `/fonts/`).
- **Keine Frameworks/Build-Tools einführen.** Reines HTML/CSS/Vanilla JS beibehalten.
- **DSGVO-Konformität wahren:**
  - Fonts bleiben self-hosted (kein Nachladen von Google Fonts o. ä. CDNs)
  - Kein Google Tag Manager, keine Tracking-Skripte über Cloudflare Web Analytics hinaus
  - Mailto-Adressen werden zur Laufzeit per JS zusammengesetzt, nicht im Klartext im Quellcode
- **Bildrechte:** Schutz via CSS (`pointer-events: none; user-select: none`) – nicht entfernen.
- **OG/Twitter-Bilder bleiben JPG** (nicht WebP), da Social-Media-Crawler WebP unzuverlässig
  unterstützen.
- **`sameAs`-Liste konsistent halten** (Instagram, Facebook, Saatchi Art, Artmajeur, YouTube) –
  wird identisch in `about.html`, `contact.html` und `index.html` verwendet.

## CSS-Architektur

- Globale, seitenübergreifende Klassen leben in `style.css`.
- Seitenspezifische Anpassungen laufen über `body.page-*`-Scoping – niemals Inline-Styles
  in HTML einführen, wenn sich das Problem sauber in `style.css` lösen lässt.
- **Vor jeder `style.css`-Änderung prüfen**, welche Seiten die betroffene Klasse nutzen –
  Änderungen propagieren automatisch auf alle Seiten, die die Klasse teilen.

## Editorial-Standards

- Menschlicher, persönlicher, poetischer Ton – kein Marketing-/Werbe-Sprech.
- Durchgehend Ich-Perspektive (Matilde spricht selbst).
- **Matilde trifft die finalen Entscheidungen über ihre eigenen Texte.** Der Agent
  formuliert Vorschläge, ersetzt aber keine bestehenden, freigegebenen Texte eigenmächtig.
- UK-Schreibweisen auf der Paintings-Seite ("colour", "fibres") ggf. beabsichtigt – vor
  Vereinheitlichung auf US-Englisch nachfragen, nicht automatisch "korrigieren".

## Vor jedem Commit/Deploy

1. Sicherstellen, dass keine ungeklärte Divergenz oder Stash-Reste im Repo vorliegen.
2. Nach jedem Push: Cloudflare-Cache leeren (Standard-Deploy-Schritt dieses Projekts).
3. Bei Bildern: WebP-Konvertierung über Squoosh (Qualität 80–85, Effort 6 bei verlustbehaftet;
   Qualität 90 bei transparenzerhaltenden Bildern) – außer bei OG/Twitter-Bildern (siehe oben).

## Bekannte offene Punkte (Stand: aktuell)

- Sculptures-Thumbnail #10 hat nur generischen Alt-Text
- `cyanotype.html`-Title könnte "Berlin" ergänzen
- QA offen: `:focus-visible` auf Contact-Formular-Submit-Button, `robots.txt`-Review,
  `theme-color`-Meta-Tag-Verifizierung über alle 10 HTML-Dateien
- Wikidata-Eintrag für Matilde in Arbeit (separates Vorhaben, nicht Teil des Codebestands)
