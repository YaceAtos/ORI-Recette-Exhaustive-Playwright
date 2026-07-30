# Chips

Selectable filter chip with optional left icon and removable close button. Tonal default, filled when selected.

## Classes

- base: `orion-chip`
- state: `orion-chip--default` | `orion-chip--selected` | `orion-chip--disabled`
- elements:
  - `orion-chip__icon` — left contextual icon (16px)
  - `orion-chip__text` — label text
  - `orion-chip__close` — remove button (right)
  - `orion-chip__close-icon` — close icon (16px)

## Syntax

Minimal:
```html
<div class="orion-chip orion-chip--default">
  <span class="orion-chip__text">Label</span>
</div>
```

With icon:
```html
<div class="orion-chip orion-chip--default">
  <span class="material-symbols-outlined orion-chip__icon" style="font-size:16px;line-height:1;">calendar_today</span>
  <span class="orion-chip__text">Aujourd'hui</span>
</div>
```

Selected:
```html
<div class="orion-chip orion-chip--selected">
  <span class="material-symbols-outlined orion-chip__icon" style="font-size:16px;line-height:1;">person</span>
  <span class="orion-chip__text">Intervenant</span>
</div>
```

Removable:
```html
<div class="orion-chip orion-chip--default">
  <span class="material-symbols-outlined orion-chip__icon" style="font-size:16px;line-height:1;">person</span>
  <span class="orion-chip__text">HENRI, Bernard</span>
  <button class="orion-chip__close" type="button" aria-label="Supprimer">
    <span class="material-symbols-outlined orion-chip__close-icon" style="font-size:16px;line-height:1;">close</span>
  </button>
</div>
```

## Behavior (JS)

Click on close button: fade out + scale down (150ms), then remove from DOM. Click on chip body: toggle `orion-chip--selected` / `orion-chip--default`.

```js
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".orion-chip__close");
  if (closeBtn) {
    const chip = closeBtn.closest(".orion-chip");
    if (chip) {
      chip.style.transition = "opacity 0.15s, transform 0.15s";
      chip.style.opacity = "0";
      chip.style.transform = "scale(0.9)";
      setTimeout(() => chip.remove(), 150);
    }
    return;
  }
  const chip = e.target.closest(".orion-chip");
  if (!chip || chip.classList.contains("orion-chip--disabled")) return;
  chip.classList.toggle("orion-chip--selected");
  chip.classList.toggle("orion-chip--default");
});
```

## Rules

- Always combine base + state class.
- Icon is optional. When present, placed before text.
- Close button is optional. Used for removable chip lists (e.g. selected filters).
- Disabled: add `orion-chip--disabled`. No pointer events, 38% opacity.
- Common icons: `calendar_today`, `person`, `location_on`, `sell`.
