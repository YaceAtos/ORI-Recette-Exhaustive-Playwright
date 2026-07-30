# Alert

Contextual feedback banner. 4 types, optional action links and close button.

## Classes

- base: `orion-alert`
- type: `orion-alert--info` | `orion-alert--warning` | `orion-alert--error` | `orion-alert--success`
- elements:
  - `orion-alert__body` — icon + text wrapper
  - `orion-alert__icon` — left status icon (20px)
  - `orion-alert__text` — message text
  - `orion-alert__actions` — action links wrapper
  - `orion-alert__link` — individual action link
  - `orion-alert__close` — close button
  - `orion-alert__close-icon` — close icon (16px)

## Icons per Type

| Type | Material Symbol |
|------|----------------|
| info | `info` |
| warning | `warning` |
| error | `error` |
| success | `check_circle` |

## Syntax

Minimal:
```html
<div class="orion-alert orion-alert--info">
  <div class="orion-alert__body">
    <span class="material-symbols-outlined orion-alert__icon" style="font-size:20px;line-height:1;">info</span>
    <span class="orion-alert__text">Informations supplementaires requises pour contrat.</span>
  </div>
</div>
```

With action links:
```html
<div class="orion-alert orion-alert--warning">
  <div class="orion-alert__body">
    <span class="material-symbols-outlined orion-alert__icon" style="font-size:20px;line-height:1;">warning</span>
    <span class="orion-alert__text">Contrat expire depuis le 15/04/2026.</span>
  </div>
  <div class="orion-alert__actions">
    <a class="orion-alert__link" href="#">Renouveler</a>
    <a class="orion-alert__link" href="#">Voir le contrat</a>
  </div>
</div>
```

With close button:
```html
<div class="orion-alert orion-alert--error">
  <div class="orion-alert__body">
    <span class="material-symbols-outlined orion-alert__icon" style="font-size:20px;line-height:1;">error</span>
    <span class="orion-alert__text">Intervention non couverte par l'APA.</span>
  </div>
  <button class="orion-alert__close" type="button" aria-label="Fermer">
    <span class="material-symbols-outlined orion-alert__close-icon" style="font-size:16px;line-height:1;">close</span>
  </button>
</div>
```

Complete (actions + close):
```html
<div class="orion-alert orion-alert--success">
  <div class="orion-alert__body">
    <span class="material-symbols-outlined orion-alert__icon" style="font-size:20px;line-height:1;">check_circle</span>
    <span class="orion-alert__text">Contrat enregistre avec succes.</span>
  </div>
  <div class="orion-alert__actions">
    <a class="orion-alert__link" href="#">Voir le detail</a>
  </div>
  <button class="orion-alert__close" type="button" aria-label="Fermer">
    <span class="material-symbols-outlined orion-alert__close-icon" style="font-size:16px;line-height:1;">close</span>
  </button>
</div>
```

## Behavior (JS)

Close button click: fade out (opacity 0, translateY -4px, 150ms transition), then remove from DOM.

```js
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".orion-alert__close");
  if (closeBtn) {
    const alertEl = closeBtn.closest(".orion-alert");
    if (alertEl) {
      alertEl.style.transition = "opacity 0.15s, transform 0.15s";
      alertEl.style.opacity = "0";
      alertEl.style.transform = "translateY(-4px)";
      setTimeout(() => alertEl.remove(), 150);
    }
  }
});
```

## Rules

- Always include the icon matching the type.
- Actions are optional. Maximum 2 links.
- Close button is optional. Placed after body (or after actions if present).
- Don't use alerts for inline field validation — use form-field error state instead.
- Alert links are underlined, 12px, same hue as the alert type.

## Snackbar Pattern

After a successful creation/save action: display `orion-alert--success` at the top of the page confirming the action (e.g. "Contrat enregistré avec succès"). This acts as a snackbar — temporary feedback banner.
