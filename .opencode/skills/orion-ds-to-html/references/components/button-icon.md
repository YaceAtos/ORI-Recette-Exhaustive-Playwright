# Button Icon

Icon-only button (no text label). 4 types (Filled, Tonal, Outlined, Ghost), 3 sizes (sm 36px, md 40px, lg 44px).

## Classes

- base: `orion-btn-icon`
- type: `orion-btn-icon--filled` | `orion-btn-icon--tonal` | `orion-btn-icon--outlined` | `orion-btn-icon--ghost`
- size: `orion-btn-icon--sm` (36px) | `orion-btn-icon--md` (40px) | `orion-btn-icon--lg` (44px)
- disabled: native `disabled` attribute

## Syntax

Minimal:
```html
<button class="orion-btn-icon orion-btn-icon--filled orion-btn-icon--md">
  <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">textsms</span>
</button>
```

Outlined, large:
```html
<button class="orion-btn-icon orion-btn-icon--outlined orion-btn-icon--lg">
  <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">edit</span>
</button>
```

Disabled:
```html
<button class="orion-btn-icon orion-btn-icon--ghost orion-btn-icon--sm" disabled>
  <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">delete</span>
</button>
```

## Rules

- Always combine base + type + size.
- Icon is always 16px Material Symbols Outlined with `FILL 1, wght 400`.
- `orion-btn-icon--filled` = primary. Maximum one per zone.
- Disabled: use native `disabled` attribute.
- No JS behavior — pure CSS.
