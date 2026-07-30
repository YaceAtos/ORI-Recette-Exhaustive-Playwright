# Result Card

Search result card with avatar initials, multi-column info, tags, action buttons on hover. Used for people/contract search results.

## Classes

- base: `orion-rc`
- state: `orion-rc--disabled` (38% opacity, no interaction)
- elements:
  - `orion-rc__checkbox` — optional checkbox container (20×40px)
  - `orion-rc__checkbox-box` — the 16×16 checkbox
  - `orion-rc__checkbox-box--checked` — checked state (blue bg + checkmark)
  - `orion-rc__avatar` — circle with initials (46×46px, blue bg)
  - `orion-rc__body` — main content area (flex column)
  - `orion-rc__header` — name row + actions
  - `orion-rc__header-left` — name + code + status tag
  - `orion-rc__name` — person name (16px/500)
  - `orion-rc__code` — employee code (14px/400, grey)
  - `orion-rc__actions` — hover-only action buttons container
  - `orion-rc__action-btn` — 36×36 icon button
  - `orion-rc__action-btn--tonal` — blue bg action
  - `orion-rc__action-btn--outlined` — bordered action
  - `orion-rc__infos` — multi-column info area (gap 32px)
  - `orion-rc__info-col` — info column
  - `orion-rc__info-col--flex` — flexible-width column
  - `orion-rc__info-row` — icon + text info line
  - `orion-rc__info-icon` — 16×16 icon in info row
  - `orion-rc__info-text` — text in info row (14px/400, grey)
  - `orion-rc__tag` — inline tag (24px height, 12px text)
  - `orion-rc__tag-icon` — 16×16 icon inside tag
  - `orion-rc__tags` — tags row container
  - `orion-rc__link` — blue underline link (14px)
  - `orion-rc__link--sm` — smaller link variant (12px)
  - `orion-rc__note-sep` — horizontal separator before note
  - `orion-rc__note` — note text (14px/400)

## Variant Table

| Feature | Default | With address/link/note | With checkbox | Disabled |
|---------|---------|----------------------|---------------|----------|
| Avatar | Yes | Yes | Yes | Yes |
| Actions on hover | Yes | No | Yes | No |
| Address row | No | Yes | No | No |
| Link | No | Yes | No | No |
| Note | No | Yes | No | No |
| Checkbox | No | No | Yes | No |

## Syntax

### Default (with hover actions)

```html
<div class="orion-rc">
  <div class="orion-rc__avatar">PN</div>
  <div class="orion-rc__body">
    <div class="orion-rc__header">
      <div class="orion-rc__header-left">
        <span class="orion-rc__name">Jean DUPONT</span>
        <span class="orion-rc__code">EMP2025-0147</span>
        <span class="orion-rc__tag" style="background:#e8fdef;color:#017437;">
          <span class="orion-rc__tag-icon"><!-- status SVG --></span>Actif
        </span>
      </div>
      <div class="orion-rc__actions">
        <button class="orion-rc__action-btn orion-rc__action-btn--tonal" title="Voir"><!-- eye SVG --></button>
        <button class="orion-rc__action-btn orion-rc__action-btn--outlined" title="Éditer"><!-- edit SVG --></button>
        <button class="orion-rc__action-btn orion-rc__action-btn--outlined" title="Supprimer"><!-- delete SVG --></button>
      </div>
    </div>
    <div class="orion-rc__infos">
      <div class="orion-rc__info-col">
        <div class="orion-rc__info-row">
          <span class="orion-rc__info-icon"><!-- work SVG --></span>
          <span class="orion-rc__info-text">Nom du poste</span>
        </div>
        <div class="orion-rc__info-row">
          <span class="orion-rc__info-icon"><!-- mail SVG --></span>
          <span class="orion-rc__info-text">prenom.nom@gmail.com</span>
        </div>
        <div class="orion-rc__info-row">
          <span class="orion-rc__info-icon"><!-- phone SVG --></span>
          <span class="orion-rc__info-text">+33 6 12 34 56 78</span>
        </div>
      </div>
      <div class="orion-rc__info-col orion-rc__info-col--flex">
        <div class="orion-rc__info-row">
          <span class="orion-rc__info-icon"><!-- mail SVG --></span>
          <span class="orion-rc__info-text">prenom.nom@gmail.com</span>
        </div>
        <div class="orion-rc__info-row">
          <span class="orion-rc__info-icon"><!-- home SVG --></span>
          <span class="orion-rc__info-text">agence A · agence B · agence C</span>
          <a href="#" class="orion-rc__link orion-rc__link--sm">+3 autres</a>
        </div>
      </div>
    </div>
    <div class="orion-rc__tags">
      <span class="orion-rc__tag" style="background:#e6e8eb;color:#1d2024;">
        <span class="orion-rc__tag-icon"><!-- activity SVG --></span>Garde d'enfants
      </span>
      <span class="orion-rc__tag" style="background:#e6e8eb;color:#1d2024;">+3</span>
    </div>
  </div>
</div>
```

### With Checkbox

```html
<div class="orion-rc">
  <div class="orion-rc__checkbox"><div class="orion-rc__checkbox-box"></div></div>
  <div class="orion-rc__avatar">PN</div>
  <div class="orion-rc__body"><!-- same as above --></div>
</div>
```

## Behavior (JS)

Checkbox toggle on click.

```js
document.addEventListener("click", (e) => {
  const box = e.target.closest(".orion-rc__checkbox-box");
  if (box) box.classList.toggle("orion-rc__checkbox-box--checked");
});
```

## Rules

- Card width: 871px. Pad: 14px 24px. Border: 1px solid #dee2e9. Radius: 8px.
- Hover: shadow 0 2px 4px rgba(0,0,0,0.08) + 4% dark overlay via `::after`.
- Actions appear only on hover (display:none → display:flex).
- Disabled: 38% opacity, pointer-events:none, no hover effect.
- Tag colors are set inline: neutral (#e6e8eb/#1d2024), success (#e8fdef/#017437).
- Icons inside info rows and tags use inline SVGs (16×16), not Material Symbols.
- Avatar: 46×46px circle, bg #ccdcff, text #0c3289, font-weight 700.
