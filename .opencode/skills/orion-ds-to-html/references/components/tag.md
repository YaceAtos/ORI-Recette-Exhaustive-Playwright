# Tag

Status badge or category label. 6 colors (Info, Success, Warning, Error, Neutral, Brand), 2 sizes (sm 24px, lg 32px), optional icon.

## Classes

- base: `orion-tag`
- color: `orion-tag--info` | `orion-tag--success` | `orion-tag--warning` | `orion-tag--error` | `orion-tag--neutral` | `orion-tag--brand`
- size: `orion-tag--sm` (24px) | `orion-tag--lg` (32px)
- elements:
  - `orion-tag__icon` — optional icon (SVG or Material Symbol), inherits color via `currentColor`
  - `orion-tag__icon--sm` (16px) | `orion-tag__icon--lg` (20px)

## Syntax

Minimal (text only):
```html
<span class="orion-tag orion-tag--info orion-tag--sm">Info</span>
```

With icon (lg):
```html
<span class="orion-tag orion-tag--success orion-tag--lg">
  <svg class="orion-tag__icon orion-tag__icon--lg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33C14.6 18.33 18.33 14.6 18.33 10C18.33 5.4 14.6 1.67 10 1.67ZM10.83 14.17H9.17V9.17H10.83V14.17ZM10.83 7.5H9.17V5.83H10.83V7.5Z" fill="currentColor"/>
  </svg>
  <span>Success</span>
</span>
```

With icon (sm):
```html
<span class="orion-tag orion-tag--error orion-tag--sm">
  <svg class="orion-tag__icon orion-tag__icon--sm" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM8.67 11.33H7.33V7.33H8.67V11.33ZM8.67 6H7.33V4.67H8.67V6Z" fill="currentColor"/>
  </svg>
  <span>Error</span>
</span>
```

## Rules

- Always combine base + color + size.
- Icon is optional. When present, use the info-circle SVG paths above (or a Material Symbol).
- Icon size must match the tag size: 16px for `--sm`, 20px for `--lg`.
- No JS behavior — pure CSS.
- Use `currentColor` for icon fill so it inherits the tag text color.
