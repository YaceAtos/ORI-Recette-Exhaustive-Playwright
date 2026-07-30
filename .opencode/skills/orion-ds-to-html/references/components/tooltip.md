# Tooltip

Contextual popup. Small: simple text bubble on hover. Large: panel with header, row list, tags, and close button on click.

## Classes

- base: `orion-tt`
- variant: `orion-tt--small` | `orion-tt--large`
- elements:
  - `orion-tt__text` — small tooltip text
  - `orion-tt__header` — large header bar
  - `orion-tt__title` — header title
  - `orion-tt__close` — close button
  - `orion-tt__close-icon` — close SVG (22px)
  - `orion-tt__content` — body with rows
  - `orion-tt__row` — single row (label + optional tag)
  - `orion-tt__row-label` — row text
  - `orion-tt__tag` — inline tag badge
  - `orion-tt__tag-icon` — tag icon (16px)
  - `orion-tt__tag-text` — tag label
- trigger: `orion-tt-trigger`, `orion-tt-trigger__btn`, `orion-tt-popup`, `orion-tt-popup--hover`, `orion-tt-popup--click`, `orion-tt-popup--open`

## Syntax

Small (hover):
```html
<div class="orion-tt-trigger">
  <button class="orion-tt-trigger__btn" type="button" aria-label="Info">
    <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">info</span>
  </button>
  <div class="orion-tt-popup orion-tt-popup--hover">
    <div class="orion-tt orion-tt--small">
      <span class="orion-tt__text">Aide contextuelle</span>
    </div>
  </div>
</div>
```

Large (click):
```html
<div class="orion-tt-trigger">
  <button class="orion-tt-trigger__btn orion-tt-trigger__btn--click" type="button" aria-label="Voir la liste">
    <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">info</span>
  </button>
  <div class="orion-tt-popup orion-tt-popup--click">
    <div class="orion-tt orion-tt--large">
      <div class="orion-tt__header">
        <span class="orion-tt__title">Zones de couvertures</span>
        <button class="orion-tt__close" type="button" aria-label="Fermer"><!-- close SVG --></button>
      </div>
      <div class="orion-tt__content">
        <div class="orion-tt__row">
          <span class="orion-tt__row-label">Nom du libelle</span>
          <span class="orion-tt__tag">
            <span class="material-symbols-outlined orion-tt__tag-icon" style="font-size:16px;line-height:1;">home_work</span>
            <span class="orion-tt__tag-text">Label du tag</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Behavior (JS)

Small: shown on hover via CSS (no JS needed). Large: toggle on trigger click, close on close button or outside click.

```js
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".orion-tt__close");
  if (closeBtn) {
    const popup = closeBtn.closest(".orion-tt-popup");
    if (popup) popup.classList.remove("orion-tt-popup--open");
    return;
  }
  const triggerBtn = e.target.closest(".orion-tt-trigger__btn--click");
  if (triggerBtn) {
    const trigger = triggerBtn.closest(".orion-tt-trigger");
    const popup = trigger?.querySelector(".orion-tt-popup--click");
    if (popup) {
      document.querySelectorAll(".orion-tt-popup--open").forEach(p => {
        if (p !== popup) p.classList.remove("orion-tt-popup--open");
      });
      popup.classList.toggle("orion-tt-popup--open");
    }
    return;
  }
  if (!e.target.closest(".orion-tt-popup")) {
    document.querySelectorAll(".orion-tt-popup--open").forEach(p => p.classList.remove("orion-tt-popup--open"));
  }
});
```

## Rules

- Small tooltip: pure CSS hover, no JS. Use for simple text hints.
- Large tooltip: JS click toggle. Use for structured content (lists, tags).
- Large width is fixed at 287px.
- Close icon uses inline SVG (22×22), not Material Symbols.
- Tags use `#e0e7ff` background, `#150792` text/icon color.
- Only one large tooltip can be open at a time (others close automatically).
