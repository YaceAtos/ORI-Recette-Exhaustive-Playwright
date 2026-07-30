---
slug: orion-ds-to-html
title: Generateur de prototypes HTML depuis le design system Orion
title_en: Orion Design System to HTML Prototype Generator
description: >-
  Genere des maquettes HTML standalone pixel-accurate a partir du design system
  Orion. Utiliser quand l'utilisateur demande de creer un ecran, une maquette,
  un prototype, une page ou un element UI — notamment avec les termes
  'maquette', 'ecran', 'prototype', 'page', 'vue', 'creer un ecran', 'genere une
  maquette'. Traduit les tokens Figma et specs composants en fichiers HTML
  autonomes.
description_en: >-
  Generates pixel-accurate standalone HTML mockups from the Orion design system.
  Use when the user asks to create a screen, mockup, prototype, page, or UI
  element — especially with terms like 'mockup', 'screen', 'prototype', 'page',
  'view', 'create a screen', 'generate a mockup'. Translates Figma DS tokens and
  component specs into self-contained HTML files.
type: skill
version: 1.2.0
category: prototyping
tags:
  - design-system
  - html
  - prototype
  - maquette
  - figma
  - ui
  - mockup
  - orion
  - studio-design-nantes
author: nahuel-vp
icon: PenTool
roles:
  - dev
  - ux
  - po
verified: false
securityAudit:
  gen: false
  socket: false
  snyk: false
---
# Orion DS → HTML

Generate standalone HTML mockups that follow the Orion design system.

## Purpose and scope

This skill governs **all interactions** with the user. Every request — whether it starts with a prompt, a description, a Figma link, or a discussion — has one and only one goal: producing an HTML mockup file.

**Output is always an HTML file.** Never produce code snippets, explanations, documentation, or React/Angular components unless explicitly asked. The deliverable is always a .html file saved in maquettes/.

**The conversation exists to:** discuss what goes on the screen, clarify interactions and content, then generate. Nothing else.

## Reference structure

All references live in references/ next to this file:

```
references/
  DESIGN.md                     # Design tokens (colors, typography, spacing, radii)
  ux-patterns/                  # App-level UX patterns (split for context efficiency)
    INDEX.md                    # Sommaire + icones — TOUJOURS charge
    navigation.md               # Drawer vs page detail, clic ligne, boutons drawer
    modales.md                  # Pop-ups, 3 tailles, boutons footer
    tableaux.md                 # Multi-elements, filtres persistants
    tooltip.md                  # Regle tooltip obligatoire
    mode-edition.md             # Sticky bar, overlay, tracking, validation
    loading-snackbar.md         # Progress bar, spinner, snackbar, alertes inline
    deletion.md                 # Flux suppression tableau/fiche
    formulaires.md              # Niveaux obligation, asterisques, patterns champs
    time-slots.md               # Plages horaires, expansion panels
    data-masking.md             # Masquage donnees sensibles
    historique.md               # Tableau historique
  verification-checklist.md     # Compliance checklist for the verification subagent
  composants/                   # 22 atomic components (source of truth)
    INDEX.md                    # Component catalog — quand utiliser quoi
    alert.js, button.js, tag.js, ...
  modeles/                      # Reusable layout blocks (larger than components)
    INDEX.md                    # Model catalog + full specs
    data-table.js
    detail-block.js
    drawer.js
    modal-list.js
    expansion-panel.js
    pages/
      page-detail.js
```

## Quick start

1. Read **[references/DESIGN.md](references/DESIGN.md)** — tokens (colors, typography, spacing, radii)
2. Read **[references/ux-patterns/INDEX.md](references/ux-patterns/INDEX.md)** — UX patterns + icones
3. Read **[references/composants/INDEX.md](references/composants/INDEX.md)** — identify which components the screen needs
4. Read **[references/modeles/INDEX.md](references/modeles/INDEX.md)** — identify which models apply
5. Read the relevant .js files (models + components) — each exports styles, variants, script
6. Load relevant UX pattern files if needed (consult the INDEX.md table)
7. Clarify with the user (see section below), then generate

## Context loading

Load in this order — never load everything at once.

### Always load

1. **[references/DESIGN.md](references/DESIGN.md)** — design tokens
2. **[references/ux-patterns/INDEX.md](references/ux-patterns/INDEX.md)** — UX patterns sommaire + icones
3. **[references/composants/INDEX.md](references/composants/INDEX.md)** — component catalog (quand utiliser quoi)
4. **[references/modeles/INDEX.md](references/modeles/INDEX.md)** — model catalog

### On demand — UX patterns (load only what's relevant)

4. **references/ux-patterns/{name}.md** — consult the INDEX.md table to decide which files to load based on the mockup content. Examples:
   - Page with a data-table → load navigation.md + tableaux.md
   - Modal creation form → load modales.md + formulaires.md
   - Page detail with edit mode → load navigation.md + mode-edition.md
   - Page with deletion action → load deletion.md

### On demand — Components & Models

5. **references/modeles/{name}.js** — for each applicable model
6. **references/composants/{name}.js** — for each atomic component needed

Each .js file exports:
- styles — full CSS string → copy into <style>
- variants — [{ label, render() }] → use render() HTML as structural reference
- script (optional) — JS behavior → copy into <script>

## Components — mandatory usage

**Always check if a component exists before writing any UI element from scratch.**

Available atomic components: alert, breadcrumb, button, button-icon, chips, datepicker, drag-drop, expansion-panel, form-field, modal, pagination, planning-card, planning-card-period, result-card, row-item, search-bar, segmented-control, sidebar, sidebar-item, tabs, tag, tooltip

Rules:
- **Always use** the component's classes from its styles export. Never recreate a component from scratch with custom CSS.
- **Always copy** the styles CSS into the mockup's <style> block for every component used.
- If the component has a script export, copy it into <script> too.
- Use variants[n].render() HTML patterns as structural reference for markup — but **adapt the content** (labels, data, icons) to the real screen context.

## Models — use whenever applicable

Models are reusable layout blocks that combine multiple components for a common functional pattern. **Always prefer a model over building a zone from scratch.**

Read references/modeles/INDEX.md first to identify which models apply. Available models:

| Model | When to use |
|---|---|
| data-table.js | Any list/table screen (interventions, intervenants, factures...) |
| detail-block.js | Any detail/fiche screen with value+label sections or related item cards |
| drawer.js | Any side panel for consulting details without leaving the page |
| modal-list.js | Modals where the user adds/removes multiple items of the same entity |
| expansion-panel.js | Collapsible zones (filters, optional sections) |
| pages/page-detail.js | Full detail page layout |

**Important — models contain example data, not real data:**
When using a model, take its **structure, CSS classes, and behavior** — not its content. Replace all example labels, values, tags, column names, and icons with those relevant to the current screen. Never copy example data (e.g. "Marie Dupont", "Garde d'enfants", "15/04/2026") into the generated mockup.

## Page anatomy — mandatory on every page

Every generated page screen must include these zones. Never omit them unless explicitly asked.

### Sidebar de navigation
Always present. Use references/modeles/pages/page-detail.js as the structural base. The sidebar contains the app navigation — keep it collapsed (icon-only mode) unless the context requires it expanded.

### Header
Always present. Contains at minimum: a search bar (left) and a user profile zone (right). Use the header pattern from page-detail.js.

### Page title
Always present. Use the .pd-section-title class from page-detail.js (18px, bold, #1d2024, padding 20px 24px 0). This is the only valid title form on a page — never use a raw <h1> with custom styles.

### Breadcrumb — conditional
- **Niveau 1** (page tableau, dashboard, liste principale) : **no breadcrumb**. These are top-level pages with nothing before them in the navigation.
- **Niveau 2+** (fiche détail, sous-page, formulaire plein écran) : **breadcrumb required**, using the breadcrumb component.

---

## Language — non-technical users

The users of Orion are not designers. Apply these rules in all communication and in the generated content:

- **No design jargon** in questions or descriptions — never say "composant", "variant", "token", "BEM", "modèle", "layout", "grid", "padding", "border-radius", etc. unless the user explicitly uses these terms first.
- Ask about **functional content and behaviors**, not visual structure: say "qu'est-ce qu'on peut faire sur une ligne ?" not "quelles actions dans la colonne actions ?".
- Describe screens in **user/business terms**: "liste des intervenants", "fiche d'un intervenant", "formulaire de création", not "data-table with drawer".
- **In the generated HTML**, all visible text must be in French and use realistic business language.

---

## Tags — always use the component

Whenever a status, category, or label needs to be displayed as a badge/pill, **always use the tag component** (composants/tag.js). Never build a custom pill from scratch.

**Always include an icon** with the tag (size 16px for tag--sm, 20px for tag--lg) unless explicitly asked not to. Use a Material Symbol that matches the semantic.

Choose the color variant that matches the semantic:
- tag--success — actif, validé, confirmé → icon: check_circle
- tag--error — inactif, refusé, annulé → icon: cancel
- tag--warning — en attente, en cours, attention → icon: warning
- tag--info — informatif, label neutre → icon: info
- tag--neutral — défaut, sans sémantique forte → icon: label
- tag--brand — label Orion spécifique → icon: star

---

## Table screens — always include a search bar

On any page that displays a table or list (data-table.js), a search bar is **always present** above the table. Use the search-bar component (composants/search-bar.js).

- If the search scope is not specified, the search applies to the **first 3 columns** by default.
- Place the search bar in the table's toolbar zone, above the column headers.

---

## Clarification — mandatory before generating

### New version (v1, v2, v3...)

A new screen or major rework. **Always ask 4–12 clarifying questions** before generating. Scale with the prompt's vagueness.

Ask questions in **plain business language** (see Language section above). Cover:
- Contenu : quelles informations afficher ? quels champs ?
- Actions : que peut faire l'utilisateur sur cette page ?
- États : que se passe-t-il s'il n'y a rien à afficher ?
- Navigation : d'où vient-on ? où va-t-on en cliquant ?
- Périmètre : une seule vue ou plusieurs onglets ? pagination ?

- **Prompt vague** → **8–12 questions**
- **Prompt détaillé** (contenu, actions, données décrits) → **4–5 questions** sur les trous restants

### Correction (v1.1, v1.2...)

Fixing, adjusting, adding an element. **Ask 2–5 quick questions** to confirm scope and expected behavior before applying.

**Format:** all questions in a single message. Never start generating until answers are received.

## Rules

- **Standalone files.** All CSS in <style>, all JS in <script>, all markup inline. No imports, no external references. Template:

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Screen Name] — Orion</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0" rel="stylesheet">
  <style>
    /* Paste styles from each composants/{name}.js used */
    /* Paste styles from each modeles/{name}.js used */
  </style>
</head>
<body style="font-family: 'Inter', sans-serif; color: #1d2024; background: #fff;">
  <!-- Screen content -->
  <script>
    /* Paste script exports from components/models that have JS behavior */
  </script>
</body>
</html>
```

- **No Tailwind.** All styling comes from component/model CSS + manual layout CSS. No CDN, no utility classes.
- **Icons: Material Symbols Outlined.** Sizes: 16px (in buttons), 20px (standalone), 24px (nav).
- **Zone by zone.** Don't generate the full screen in one shot — build zone by zone.
- **Immutable mockups.** Never modify an existing file — create a new version (v2.html).
- **Flag gaps.** If a screen needs something no component/model supports, flag it explicitly — don't improvise.
- **Respond in French.** Technical terms (class names, CSS) stay in English. HTML content in French.

### Output

- Save path: maquettes/{screen-name}/{screen-name}_v1.html
- Name by screen and version: planning_v1.html, detail-collaborateur_v1.html
- Subfolder per screen when multiple versions exist

## References

- **[references/ux-patterns/INDEX.md](references/ux-patterns/INDEX.md)** — UX patterns index (sommaire + icones, toujours charge) + fichiers detailles a la demande
- **[references/verification-checklist.md](references/verification-checklist.md)** — DS compliance checklist for the verification subagent

## Verification (post-generation)

After completing a mockup, **always** launch a verification subagent before delivering. Do not skip.

### How to verify

Use the **Task tool** with subagent_type "general":

```
You are a design system compliance checker for the Orion DS. Verify that the generated HTML mockup strictly follows design system tokens, component rules, model usage, structural requirements, accessibility standards, and UX guidelines.

Read these files in order:
1. {SKILL_DIR}/references/verification-checklist.md — full checklist (9 categories)
2. {SKILL_DIR}/references/DESIGN.md — allowed token values
3. {SKILL_DIR}/references/modeles/INDEX.md — model catalog and rules
4. {PATH_TO_GENERATED_HTML} — the mockup to verify

Then:
1. Identify all component CSS classes used in the HTML (look for prefixes like .btn, .alert, .tag, .modal, .ff, .dt, .db, .drw, etc.)
2. For each component, read {SKILL_DIR}/references/composants/{component}.js and verify class existence against the styles export
3. Identify any model patterns (data-table, detail-block, drawer, modal-list) and verify they match model specs
4. Run every check in the checklist
5. Produce a structured compliance report

Be strict on tokens, structure, and component usage. Be pragmatic on accessibility/UX — flag clear violations only.

Return ONLY the compliance report. No preamble.
```

Replace {SKILL_DIR} with the skill's actual path and {PATH_TO_GENERATED_HTML} with the mockup path.

### After verification

- **All checks PASS:** Deliver the mockup.
- **Any FAIL:** Fix violations, re-run verification. Repeat until all pass.
- **WARNING only:** Deliver and mention warnings to the user. Warnings are informational, not blocking.
