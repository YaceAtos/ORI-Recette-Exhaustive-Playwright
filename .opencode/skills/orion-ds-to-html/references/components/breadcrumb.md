# Breadcrumb

Navigation trail (fil d'Ariane). 2–5 levels separated by `/`. Last level is active (dark, non-clickable).

## Classes

- base: `orion-bc`
- elements:
  - `orion-bc__item` — clickable intermediate level (`<a>`)
  - `orion-bc__item--active` — last level, current page (`<span>`)
  - `orion-bc__sep` — `/` separator

## Syntax

Minimal (2 levels):
```html
<nav class="orion-bc">
  <a class="orion-bc__item" href="#">Menu</a>
  <span class="orion-bc__sep">/</span>
  <span class="orion-bc__item orion-bc__item--active">Collaborateurs</span>
</nav>
```

3 levels:
```html
<nav class="orion-bc">
  <a class="orion-bc__item" href="#">Menu</a>
  <span class="orion-bc__sep">/</span>
  <a class="orion-bc__item" href="#">Collaborateurs</a>
  <span class="orion-bc__sep">/</span>
  <span class="orion-bc__item orion-bc__item--active">Nahuel VAN-PEE</span>
</nav>
```

## Rules

- Always use `<nav>` as container.
- Intermediate items are `<a>`, last item is `<span>`.
- Always add `orion-bc__item--active` on the last item.
- No JS behavior — pure CSS component.
- Keep separator as a literal `/` inside `orion-bc__sep`.
