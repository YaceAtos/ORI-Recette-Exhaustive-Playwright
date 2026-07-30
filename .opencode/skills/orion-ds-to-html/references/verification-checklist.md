# DS Verification Checklist

Reference for the verification subagent. Check the generated HTML mockup against every rule below. Report PASS or FAIL per category with specific violations (line numbers, actual values, expected values).

## 1. Colors

Extract every color value from the HTML: `#hex` in inline styles and CSS declarations inside `<style>`.

**Rule:** Every color must exist in `DESIGN.md` (colors section). No invented colors.

**How to check:**
1. Collect all unique hex colors from the file
2. Compare against the full palette in `DESIGN.md`
3. Allow `#000000`, `#ffffff`, `transparent`, `inherit`, `currentColor`
4. Flag any color not in the palette

## 2. Spacing

Extract every pixel value used for spacing properties: `padding`, `margin`, `gap`, `top`, `bottom`, `left`, `right` — in CSS declarations and inline styles.

**Rule:** Values must be on the Figma scale: **0, 2, 4, 6, 8, 12, 14, 16, 18, 20, 24 px**.

**Exceptions (do NOT flag):**
- Values inside component CSS rules (copied from `composants/*.js` or `modeles/*.js` `styles` exports) — these are component-scoped
- Negative values for positioning tricks
- `width`, `height`, `min-*`, `max-*` — dimensions, not spacing

**Only flag:** Hardcoded spacing values in the mockup's own layout CSS or inline styles that are NOT inside a component rule and NOT on the scale.

## 3. Border Radius

Extract every `border-radius` value from CSS and inline styles.

**Rule:**
- `4px` — buttons only (`.btn` classes)
- `6px` — general components (alerts, cards, tags, modals, form fields, model blocks)
- `999px` or `9999px` — pill shapes (chips, badges)
- `8px` — cards in detail-block result cards (exception documented in model)
- `0` — explicitly no rounding (allowed)

**Exceptions:** Values inside component/model CSS copied from `.js` files are component-scoped.

## 4. Typography

**Rules:**
- Font family: only `Inter` (and `sans-serif` fallback)
- Font weight: only `400` (regular) and `500` (medium)
- Font size: only `12px`, `14px`, `16px`, `18px`, `20px`
- Line height: only `16px`, `20px`, `24px`

**Check:** Inline styles and CSS declarations. Flag any value outside these scales.

## 5. Component compliance

### 5a. Class existence

1. Identify all component CSS class prefixes used in the HTML body. Key prefixes to look for:
   - Atomic: `.btn`, `.alert`, `.tag`, `.modal`, `.ff` (form-field), `.sbar` (search-bar), `.tab`, `.chip`, `.pagination`, `.tooltip`, `.breadcrumb`, `.sidebar`, `.planning-card`, `.result-card`, `.row-item`, `.btn-icon`, `.seg`, `.datepicker`, `.drag`
   - Models: `.dt` (data-table), `.db` (detail-block), `.drw` (drawer), `.modal-list` or `.ml` (modal-list)
2. For each component/model, read the corresponding `.js` file's `styles` export
3. Verify every class used in HTML exists as a CSS selector in that `styles` export

**Flag:** Any class used in HTML that has no matching selector in the corresponding `.js` `styles`.

### 5b. No component recreation

Scan for elements that look like a component rebuilt from scratch instead of using the DS classes:
- A colored div with icon + text but no `.alert` class
- A `<button>` styled manually but no `.btn` class
- A table built from raw `<table>` without `.dt__*` classes when a data-table model exists
- A side panel without `.drw` classes when a drawer model applies

Flag as **WARNING**, not FAIL.

### 5c. Mandatory component usage

Check that DS components are used wherever applicable:
- Buttons → `.btn` + type + size
- Status badges → `.tag` + color variant
- Form inputs → `.ff` with floating label
- Alerts/feedback → `.alert` + type
- Search → `.sbar`

**Flag as WARNING** if a UI element is built manually when an equivalent component exists.

## 6. Model compliance

### 6a. Model identification

Identify which models (if any) are used in the mockup by looking for their class prefixes (`.dt__*`, `.db__*`, `.drw__*`, `.ml__*`).

### 6b. Model structure

For each model used, read `references/modeles/INDEX.md` and verify:
- The structure matches the documented variant (simple vs arborescent for data-table, champs texte vs result cards for detail-block, etc.)
- Dependencies listed in the model's "Dépendances composants" section are also included
- The model is used in the correct context (e.g. `modal-list` only inside modals, `data-table` only on list pages)

### 6c. No example data leakage

Verify that no example data from the model files appears in the generated mockup:
- No example person names (Marie Dupont, Jean Martin, etc.)
- No example dates from model demos
- No example tags/categories copied verbatim from model variants

**Flag:** Any content that appears to be copied from a model's `render()` example rather than adapted to the real context.

## 7. Structure

### 7a. HTML template

Verify the file follows the required template:
- `<!DOCTYPE html>` present
- `<html lang="fr">`
- Meta charset UTF-8
- Meta viewport
- Title ends with `— Orion`
- Google Fonts link for Inter (400;500)
- Google Fonts link for Material Symbols Outlined
- `<style>` block present (no Tailwind CDN — this project does NOT use Tailwind)
- `<body>` has base font and color styles

### 7b. CSS completeness

For every component/model class identified in check 5a:
- Verify its CSS (from the `.js` `styles` export) is present in the `<style>` block
- Verify dependent component CSS is also present (e.g. if `data-table` uses `tag`, check `.tag` CSS is included)

**Flag:** Missing component or model CSS.

### 7c. No external dependencies

The only allowed external references:
- `https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap`
- `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0`

**Flag:** Any other `<link>`, `<script src>`, `@import`, or `fetch()` call.

### 7d. JS placement

All `<script>` blocks must be at the end of `<body>`, not in `<head>`.

## 8. Accessibility

- Every `<img>` has an `alt` attribute
- Every `<button>` has visible text content or `aria-label`
- Interactive elements are not wrapped in non-interactive elements that break tab order
- Heading hierarchy: no skipped levels (`<h1>` → `<h3>` with no `<h2>`)
- Form inputs have associated `<label>` elements
- Color is not the sole means of conveying information (error states also have icons or text)

## 9. UX Guidelines

- **Icons:** All icons use `<span class="material-symbols-outlined">` with `font-variation-settings` set
- **Tooltips:** Every icon-only button (`button-icon`) MUST have a tooltip on hover/focus with a short action label (300-500ms delay)
- **Transitions:** Interactive elements have `transition` with short duration (100-200ms)
- **Primary CTA:** Max 1 `.btn--filled` per visible screen zone
- **State layers:** Interactive elements have hover/focus states in their component CSS
- **French content:** All user-facing text in French. CSS class names and HTML attributes in English
- **Model context:** Models are used in their documented context (data-table on list pages, modal-list in modals only, etc.)
- **Drawer buttons:** Buttons in content = primary first (left). Buttons in footer = primary last (right).
- **Row navigation:** A table row navigates to exactly ONE destination. Never chain table -> drawer -> detail page.
- **Deletion:** Delete button only visible with permissions. Uses confirmation modal (SM). If dependencies exist, informational modal listing blockers.
- **Loading:** Page load = top progress bar. Table data = centered spinner. Modal save = 500ms delayed bar above buttons. Buttons = disabled + cursor:wait.
- **Edit mode:** Sticky bar bottom-center. Non-editable zones get 40% white overlay + disabled buttons. Editable zone gets 2px outline stroke. Badge counter tracks modifications.

## Report Format

```
## DS Compliance Report — {filename}

### Summary: X/9 checks passed

### 1. Colors — PASS | FAIL
Details...

### 2. Spacing — PASS | FAIL
Details...

### 3. Border Radius — PASS | FAIL
Details...

### 4. Typography — PASS | FAIL
Details...

### 5. Component Compliance — PASS | FAIL | WARNING
Details...

### 6. Model Compliance — PASS | FAIL | WARNING
Details...

### 7. Structure — PASS | FAIL
Details...

### 8. Accessibility — PASS | FAIL | WARNING
Details...

### 9. UX Guidelines — PASS | FAIL | WARNING
Details...

### Violations to fix (if any)
Numbered list of actionable fixes, most critical first.
```
