# Row Item

Table cell component. 6 types with different internal structures, hover state. Expandable type supports 7 indentation levels.

## Classes

- base: `orion-ri`
- type: `orion-ri--default` | `orion-ri--expandable` | `orion-ri--tag` | `orion-ri--icon` | `orion-ri--checkbox` | `orion-ri--user`
- level (expandable): `orion-ri--level-1` through `orion-ri--level-7`
- state: `orion-ri--expanded` (chevron rotated 90°)
- elements:
  - `orion-ri__text` — cell text (14px/400, grey)
  - `orion-ri__chevron` — expand arrow icon (16px, rotates on expand)
  - `orion-ri__icon-sm` — small icon (16px, for workspaces/info)
  - `orion-ri__icon-action` — action icon (24px, for more_vert)
  - `orion-ri__content` — expandable inner row (icon + text + tag + number)
  - `orion-ri__tag` — inline tag (24px height, blue bg #e0e7ff, text #150792)
  - `orion-ri__tags` — tag container
  - `orion-ri__number` — tertiary number text (#a4a7ae)
  - `orion-ri__checkbox` — checkbox click target (40×40 circle)
  - `orion-ri__checkbox-box` — the 16×16 checkbox
  - `orion-ri__checkbox-box--checked` — checked state
  - `orion-ri__avatar` — user avatar circle (30×30px, #ccdcff)
  - `orion-ri__avatar-initials` — initials text (12px/700, #0c3289)
  - `orion-ri__icon-placeholder` — icon placeholder (36×36, #eaf0ff)

## Type Decision Table

| Type | Padding | Content | Width |
|------|---------|---------|-------|
| default | 14px 16px | text only | 100px |
| expandable | 14px 16px + level indent | chevron + icon + text + optional tag/number | auto |
| tag | 12px 16px | tag only | 100px |
| icon | 6px 14px | icon placeholder (36×36) | 64px, h=48px |
| checkbox | 4px 14px | checkbox (16×16) | auto, justify-end |
| user | 0 14px | avatar + text | auto, h=48px |

## Indentation Levels (Expandable)

| Level | padding-left |
|-------|-------------|
| 1 | 16px |
| 2 | 40px |
| 3 | 64px |
| 4 | 88px |
| 5 | 112px |
| 6 | 136px |
| 7 | 160px |

## Syntax

### Default

```html
<div class="orion-ri orion-ri--default">
  <span class="orion-ri__text">Item</span>
</div>
```

### Expandable (with tag and number)

```html
<div class="orion-ri orion-ri--expandable orion-ri--level-2">
  <span class="material-symbols-outlined orion-ri__chevron" style="font-size:16px;line-height:1;">chevron_right</span>
  <div class="orion-ri__content">
    <span class="material-symbols-outlined orion-ri__icon-sm" style="font-size:16px;line-height:1;">workspaces</span>
    <span class="orion-ri__text">Item</span>
    <div class="orion-ri__tags">
      <span class="orion-ri__tag">
        <span class="material-symbols-outlined orion-ri__icon-sm" style="font-size:16px;line-height:1;">info</span>
        <span>Label</span>
      </span>
    </div>
    <span class="orion-ri__number">Numéro</span>
  </div>
</div>
```

### Tag

```html
<div class="orion-ri orion-ri--tag">
  <span class="orion-ri__tag">
    <span class="material-symbols-outlined orion-ri__icon-sm" style="font-size:16px;line-height:1;">info</span>
    <span>Label</span>
  </span>
</div>
```

### Icon

```html
<div class="orion-ri orion-ri--icon">
  <div class="orion-ri__icon-placeholder"></div>
</div>
```

### Checkbox

```html
<div class="orion-ri orion-ri--checkbox">
  <div class="orion-ri__checkbox">
    <div class="orion-ri__checkbox-box"></div>
  </div>
</div>
```

### User

```html
<div class="orion-ri orion-ri--user">
  <div class="orion-ri__avatar">
    <span class="orion-ri__avatar-initials">PN</span>
  </div>
  <span class="orion-ri__text">Item</span>
</div>
```

## Behavior (JS)

Expandable toggle (chevron rotation) and checkbox toggle.

```js
document.addEventListener("click", (e) => {
  const expandable = e.target.closest(".orion-ri--expandable");
  if (expandable) {
    expandable.classList.toggle("orion-ri--expanded");
    return;
  }
  const checkbox = e.target.closest(".orion-ri__checkbox");
  if (checkbox) {
    const box = checkbox.querySelector(".orion-ri__checkbox-box");
    if (box) box.classList.toggle("orion-ri__checkbox-box--checked");
  }
});
```

## Rules

- All types share the same base `orion-ri` with bottom border #dee2e9.
- Hover: background changes to #eaf0ff on all types.
- Expandable: `orion-ri--expanded` rotates chevron 90°. Use `orion-ri--level-N` for indentation.
- Checkbox checked: bg #013aba, border #013aba, white checkmark via ::after.
- Icons use Material Symbols Outlined with `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20`.
- Tag icon inside `orion-ri__tag` inherits color #150792.

## Multi-Element Cell Patterns

When a table cell contains multiple values:

| Pattern | When | Display | Sort by |
|---------|------|---------|---------|
| Type A: "Élément, +N" | Items of same type | First alphabetically + counter | Displayed text |
| Type B: "N éléments" | Items of different types | Counter only | Displayed text |
