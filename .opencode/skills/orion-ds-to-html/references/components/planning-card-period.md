# Planning Card Period

Period block in the planning grid (conge, absence, astreinte). 2 types (Astreinte, Absence), 3 formats (Vertical, Horizontal, Small). Hatched/striped backgrounds.

## Classes

- base: `orion-pcp`
- type: `orion-pcp--astreinte` | `orion-pcp--absence`
- format: `orion-pcp--vertical` | `orion-pcp--horizontal` | `orion-pcp--small`
- elements:
  - `orion-pcp__sideline` — colored left/top bar (hidden in small)
  - `orion-pcp__body` — hatched background container
  - `orion-pcp__label` — text wrapper
  - `orion-pcp__label-text` — text with white bg for readability over hatching
  - `orion-pcp__time` — optional time range

## Type Table

| Aspect | Astreinte | Absence |
|--------|-----------|---------|
| Color | `#8f2800` (dark orange) | `#150792` (dark indigo) |
| Hatching | white / `#fff4e5` stripes | white / `#e0e7ff` stripes |

## Format Table

| Format | Direction | Sideline | Min size |
|--------|-----------|----------|----------|
| Vertical | row (sideline left) | 4px wide, left | 315 x 209px |
| Horizontal | column (sideline top) | 100% wide, 4px tall | 315 x 209px |
| Small | row, no sideline | hidden; 2px top border on body | 315px wide |

## Syntax

Vertical (default):
```html
<div class="orion-pcp orion-pcp--vertical orion-pcp--astreinte" tabindex="0">
  <div class="orion-pcp__sideline"></div>
  <div class="orion-pcp__body">
    <div class="orion-pcp__label"><span class="orion-pcp__label-text">Astreinte</span></div>
  </div>
</div>
```

Small with time:
```html
<div class="orion-pcp orion-pcp--small orion-pcp--astreinte" tabindex="0">
  <div class="orion-pcp__body">
    <div class="orion-pcp__label">
      <span class="orion-pcp__label-text">Astreinte <span class="orion-pcp__time">8:00 - 10:00</span></span>
    </div>
  </div>
</div>
```

Horizontal absence:
```html
<div class="orion-pcp orion-pcp--horizontal orion-pcp--absence" tabindex="0">
  <div class="orion-pcp__sideline"></div>
  <div class="orion-pcp__body">
    <div class="orion-pcp__label"><span class="orion-pcp__label-text">Absence</span></div>
  </div>
</div>
```

## Rules

- Always combine base + format + type.
- `tabindex="0"` on every card.
- Small format has no `orion-pcp__sideline` element — omit it entirely.
- Vertical and Horizontal always include `orion-pcp__sideline` as first child.
- Time span is optional, placed inside `orion-pcp__label-text`.
- No JS behavior — pure CSS component.
