# Tabs

Horizontal navigation tabs. Active tab has a blue underline indicator. Free number of tabs.

## Classes

- base: `orion-tabs`
- elements:
  - `orion-tabs__item` — each tab button
  - `orion-tabs__item--active` — currently selected tab (blue underline)

## Syntax

Minimal:
```html
<div class="orion-tabs">
  <button class="orion-tabs__item orion-tabs__item--active">Interventions</button>
  <button class="orion-tabs__item">Clients</button>
  <button class="orion-tabs__item">Planning</button>
</div>
```

## Behavior (JS)

Clicking a tab activates it and deactivates the previous one.

```js
document.addEventListener("click", (e) => {
  const tab = e.target.closest(".orion-tabs__item");
  if (!tab) return;
  const parent = tab.closest(".orion-tabs");
  parent.querySelectorAll(".orion-tabs__item").forEach(el => el.classList.remove("orion-tabs__item--active"));
  tab.classList.add("orion-tabs__item--active");
});
```

## Rules

- Always have exactly one `orion-tabs__item--active` at a time.
- The underline indicator is a 2px `::after` pseudo-element — no extra markup.
- Container has a bottom border; active indicator overlaps it.
- Width is `fit-content` — tabs don't stretch to fill.
