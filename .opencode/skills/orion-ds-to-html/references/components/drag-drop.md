# Drag & Drop

File upload drop zone. 2 sizes (md, lg), optional import link. States: default, dragover, disabled.

## Classes

- base: `orion-dd`
- size: `orion-dd--md` (224×70px) | `orion-dd--lg` (616×70px)
- state: `orion-dd--focus` (dragover) | `orion-dd--disabled`
- elements:
  - `orion-dd__content` — centered content wrapper
  - `orion-dd__label` — "Glisser et déposer" text
  - `orion-dd__link` — import file link
  - `orion-dd__upload-icon` — upload icon in link (12px)

## Syntax

Minimal:
```html
<div class="orion-dd orion-dd--md">
  <div class="orion-dd__content">
    <span class="orion-dd__label">Glisser et déposer</span>
    <a class="orion-dd__link" href="#">
      <span class="material-symbols-outlined orion-dd__upload-icon" style="font-size:12px;line-height:1;">upload</span>
      <span>importer votre fichier</span>
    </a>
  </div>
</div>
```

Large:
```html
<div class="orion-dd orion-dd--lg">
  <div class="orion-dd__content">
    <span class="orion-dd__label">Glisser et déposer</span>
    <a class="orion-dd__link" href="#">
      <span class="material-symbols-outlined orion-dd__upload-icon" style="font-size:12px;line-height:1;">upload</span>
      <span>importer votre fichier</span>
    </a>
  </div>
</div>
```

## Behavior (JS)

Dragover adds `orion-dd--focus` (blue background + border). Dragleave/drop removes it.

```js
document.addEventListener("dragover", (e) => {
  const dd = e.target.closest(".orion-dd");
  if (!dd || dd.classList.contains("orion-dd--disabled")) return;
  e.preventDefault();
  dd.classList.add("orion-dd--focus");
});
document.addEventListener("dragleave", (e) => {
  const dd = e.target.closest(".orion-dd");
  if (!dd) return;
  dd.classList.remove("orion-dd--focus");
});
document.addEventListener("drop", (e) => {
  const dd = e.target.closest(".orion-dd");
  if (!dd || dd.classList.contains("orion-dd--disabled")) return;
  e.preventDefault();
  dd.classList.remove("orion-dd--focus");
});
```

## Rules

- Always combine base + size.
- Import link is optional but recommended.
- Disabled: add `orion-dd--disabled`. 38% opacity, no pointer events.
- The dashed border style is built into the base class.
- For real file handling, add a hidden `<input type="file">` inside the zone.
