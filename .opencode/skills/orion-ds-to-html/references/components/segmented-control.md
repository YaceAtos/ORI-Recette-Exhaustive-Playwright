# Segmented Control

Toggle bar with multiple options. Active segment gets a tonal background. Free number of segments.

## Classes

- base: `orion-sc`
- elements:
  - `orion-sc__item` — each segment button
  - `orion-sc__item--active` — currently selected segment

## Syntax

Minimal:
```html
<div class="orion-sc">
  <button class="orion-sc__item orion-sc__item--active">Jour</button>
  <button class="orion-sc__item">Semaine</button>
  <button class="orion-sc__item">Mois</button>
</div>
```

2 segments (toggle):
```html
<div class="orion-sc">
  <button class="orion-sc__item orion-sc__item--active">Interventions</button>
  <button class="orion-sc__item">Clients</button>
</div>
```

## Behavior (JS)

Clicking a segment activates it and deactivates the previous one.

```js
document.addEventListener("click", (e) => {
  const item = e.target.closest(".orion-sc__item");
  if (!item) return;
  const parent = item.closest(".orion-sc");
  parent.querySelectorAll(".orion-sc__item").forEach(el => el.classList.remove("orion-sc__item--active"));
  item.classList.add("orion-sc__item--active");
});
```

## Rules

- Always have exactly one `orion-sc__item--active` at a time.
- Dividers between items are generated via CSS `::before` pseudo-elements — no extra markup needed.
- Dividers are hidden adjacent to the active item.
- Width adapts to content (padding: 0 32px per item).
