# Sidebar Item

Navigation item for the sidebar. 2 hierarchy levels, multiple states, icon-only mode for collapsed sidebar.

## Classes

- base: `orion-si`
- level: `orion-si--level-2` (child item, lighter selected bg)
- state: `orion-si--selected` | `orion-si--hover` | `orion-si--focus` | `orion-si--disabled`
- mode: `orion-si--icon-only` (40×40, collapsed sidebar)
- elements:
  - `orion-si__item` — inner container (padding 8px 12px, radius 6px)
  - `orion-si__content` — flex column for label row + description
  - `orion-si__label-row` — horizontal row: label-left + trailing icon/tag
  - `orion-si__label-left` — leading icon + label text
  - `orion-si__label` — item text (14px/400, #1d2024)
  - `orion-si__icon` — 16×16 icon container
  - `orion-si__icon--leading` — left icon (color #1d2024)
  - `orion-si__icon--trailing` — right icon (color #48546d, e.g. chevron)
  - `orion-si__tag` — green status badge (24px height, #e8fdef bg)
  - `orion-si__tag-icon` — check icon in tag (#16a34a)
  - `orion-si__description` — secondary text (14px/400, #48546d)

## State Table

| State | Background | Label weight | Overlay |
|-------|-----------|-------------|---------|
| Default | #ffffff | 400 | none |
| Hover | — | — | ::after 8% #1d2024 |
| Focus | — | — | ::after 10% #1d2024 |
| Selected (L1) | #ccdcff | 700 | none |
| Selected (L2) | #eaf0ff | 500 | none |
| Disabled | — | — | 38% opacity, cursor:not-allowed |
| Icon-only | 40×40 centered | — | — |

## Syntax

### Level 1 — Default with tag

```html
<div class="orion-si">
  <div class="orion-si__item">
    <div class="orion-si__content">
      <div class="orion-si__label-row">
        <div class="orion-si__label-left">
          <span class="orion-si__icon orion-si__icon--leading"><!-- icon SVG --></span>
          <span class="orion-si__label">Condition de travail</span>
        </div>
        <span class="orion-si__tag"><span class="orion-si__tag-icon"><!-- check SVG --></span></span>
      </div>
    </div>
  </div>
</div>
```

### Level 1 — Selected with description

```html
<div class="orion-si orion-si--selected">
  <div class="orion-si__item">
    <div class="orion-si__content">
      <div class="orion-si__label-row">
        <div class="orion-si__label-left">
          <span class="orion-si__icon orion-si__icon--leading"><!-- icon SVG --></span>
          <span class="orion-si__label">Condition de travail</span>
        </div>
      </div>
      <p class="orion-si__description">Renseignez les allergies, phobies ou contre-indications médicales.</p>
    </div>
  </div>
</div>
```

### Level 2 — Selected

```html
<div class="orion-si orion-si--level-2 orion-si--selected">
  <div class="orion-si__item">
    <div class="orion-si__content">
      <div class="orion-si__label-row">
        <div class="orion-si__label-left">
          <span class="orion-si__icon orion-si__icon--leading"><!-- icon SVG --></span>
          <span class="orion-si__label">Condition de travail</span>
        </div>
      </div>
      <p class="orion-si__description">Description text.</p>
    </div>
  </div>
</div>
```

### With trailing icon (chevron)

```html
<div class="orion-si">
  <div class="orion-si__item">
    <div class="orion-si__content">
      <div class="orion-si__label-row">
        <div class="orion-si__label-left">
          <span class="orion-si__icon orion-si__icon--leading"><!-- icon SVG --></span>
          <span class="orion-si__label">Condition de travail</span>
        </div>
        <span class="orion-si__icon orion-si__icon--trailing"><!-- chevron SVG --></span>
      </div>
    </div>
  </div>
</div>
```

### Icon-only (collapsed sidebar)

```html
<div class="orion-si orion-si--icon-only">
  <div class="orion-si__item">
    <span class="orion-si__icon orion-si__icon--leading"><!-- icon SVG --></span>
  </div>
</div>
```

## Rules

- Width: 229px (full), 40×40px (icon-only).
- Tag is hidden when item is selected.
- Description is hidden in icon-only mode.
- Disabled tag: bg #fafafa, border 1px solid #e7e8e9, icon color #9ca3af.
- Leading icon uses inline SVGs (16×16), not Material Symbols.
- No JS behavior — states are CSS-only, toggled by the parent sidebar component.
