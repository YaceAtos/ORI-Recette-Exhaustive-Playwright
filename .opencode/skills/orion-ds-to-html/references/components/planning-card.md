# Planning Card

Resource planning card displayed in calendar/planning grids.
3 types, 4 sizes, 2 directions. **Structure changes per combination** — read the decision table and examples below.

## Classes

- base: `orion-pc`
- type: `orion-pc--intervention` | `orion-pc--rdv` | `orion-pc--rh`
- size: `orion-pc--1` (grand) | `orion-pc--2` (medium) | `orion-pc--3` (small) | `orion-pc--4` (nom)
- direction: `orion-pc--vertical` | `orion-pc--horizontal`
- state: `orion-pc--selected` | `orion-pc--disabled` | `orion-pc--non-pourvue`
- elements:
  - `orion-pc__side-line` — blue left border (intervention only)
  - `orion-pc__body` — content wrapper
  - `orion-pc__header` — name + serie icon row
  - `orion-pc__name` — person name (14px medium, or 12px at size 2 vertical)
  - `orion-pc__serie-icon` — repeat icon (intervention only)
  - `orion-pc__time` — time range or single time
  - `orion-pc__icons` — status icons row (people, key, note)
  - `orion-pc__icon` — individual icon (blue by default)
  - `orion-pc__icon--muted` — grey icon variant
  - `orion-pc__tags` — tag container (intervention/RH)
  - `orion-pc__tag` — text tag (blue bg, icon + text)
  - `orion-pc__tag-icon` — icon inside a tag
  - `orion-pc__tag--rh` — green RH tag variant
  - `orion-pc__tag--icon-only` — icon-only tag chip (RDV)
  - `orion-pc__tag--icon-only-rh` — icon-only RH tag
  - `orion-pc__tags-row` — RDV tag row (count + chips)
  - `orion-pc__tags-count` — number label before RDV chips
  - `orion-pc__tags-list` — RDV icon chip container (with fade mask)
  - `orion-pc__row` — compact 2-column row (size 2 vertical)
  - `orion-pc__time-with-tag` — RH inline tag + time

## Type Differences

| Aspect | Intervention | RDV Commercial | Evenement RH |
|--------|-------------|----------------|--------------|
| Side line | Blue 4px left | None | None |
| Border | Solid grey `#dee2e9` | Dashed dark `#373b44` | Solid green `#008236` |
| Tags | Blue bg, icon + text | Icon-only chips, multi-color, with count | Green bg, icon + text |
| Name | Person name | Person name | No name (time + tag only) |
| Serie icon | Yes (repeat) | No | No |
| Left padding | From side-line | 16px | 16px |

## Content per Size (Decision Table)

What to include at each size. Elements are progressively removed as size decreases:

| Size | Intervention | RDV Commercial | Evenement RH |
|------|-------------|----------------|--------------|
| 1 (grand) | name, serie, time, icons, tag | name, time, icons, tags-row | time, full tag |
| 2 (medium) | name, time, tag, icons (compact) | name, time, icons, tags-row (compact) | time + icon-only tag |
| 3 (small) | serie, name, start-time only | name, start-time only | icon-only tag + start-time |
| 4 (nom) | serie, name only | name only | icon-only tag + start-time |

## Structural Examples

### Intervention — Size 1 (Grand, vertical)

```html
<div class="orion-pc orion-pc--intervention orion-pc--1 orion-pc--vertical" tabindex="0">
  <div class="orion-pc__side-line"></div>
  <div class="orion-pc__body">
    <div class="orion-pc__header">
      <span class="orion-pc__name">PELET Edouard</span>
      <span class="material-symbols-outlined orion-pc__serie-icon" style="font-size:16px;line-height:1;">repeat</span>
    </div>
    <span class="orion-pc__time">10:00 - 10:30</span>
    <div class="orion-pc__icons">
      <span class="material-symbols-outlined orion-pc__icon orion-pc__icon--muted" style="font-size:16px;line-height:1;">people_outline</span>
      <span class="material-symbols-outlined orion-pc__icon orion-pc__icon--muted" style="font-size:16px;line-height:1;">key</span>
      <span class="material-symbols-outlined orion-pc__icon" style="font-size:16px;line-height:1;">note_alt</span>
    </div>
    <div class="orion-pc__tags">
      <span class="orion-pc__tag">
        <span class="material-symbols-outlined orion-pc__tag-icon" style="font-size:16px;line-height:1;">child_friendly</span>
        Garde d'enfants
      </span>
    </div>
  </div>
</div>
```

### Intervention — Size 2 (Medium, vertical — uses row layout)

```html
<div class="orion-pc orion-pc--intervention orion-pc--2 orion-pc--vertical" tabindex="0">
  <div class="orion-pc__side-line"></div>
  <div class="orion-pc__body">
    <div class="orion-pc__row">
      <span class="orion-pc__name">PELET Edouard</span>
      <span class="orion-pc__time">10:00 - 10:30</span>
    </div>
    <div class="orion-pc__row">
      <div class="orion-pc__tags">
        <span class="orion-pc__tag">
          <span class="material-symbols-outlined orion-pc__tag-icon" style="font-size:16px;line-height:1;">child_friendly</span>
          Garde d'enfants
        </span>
      </div>
      <div class="orion-pc__icons">
        <span class="material-symbols-outlined orion-pc__icon orion-pc__icon--muted" style="font-size:16px;line-height:1;">people_outline</span>
        <span class="material-symbols-outlined orion-pc__icon orion-pc__icon--muted" style="font-size:16px;line-height:1;">key</span>
        <span class="material-symbols-outlined orion-pc__icon" style="font-size:16px;line-height:1;">note_alt</span>
      </div>
    </div>
  </div>
</div>
```

### Intervention — Size 3 (Small, vertical — inline layout)

```html
<div class="orion-pc orion-pc--intervention orion-pc--3 orion-pc--vertical" tabindex="0">
  <div class="orion-pc__side-line"></div>
  <div class="orion-pc__body">
    <span class="material-symbols-outlined orion-pc__serie-icon" style="font-size:16px;line-height:1;">repeat</span>
    <span class="orion-pc__name">PELET Edouard</span>
    <span class="orion-pc__time">10:00</span>
  </div>
</div>
```

### Intervention — Size 4 (Nom, vertical — minimal)

```html
<div class="orion-pc orion-pc--intervention orion-pc--4 orion-pc--vertical" tabindex="0">
  <div class="orion-pc__side-line"></div>
  <div class="orion-pc__body">
    <span class="material-symbols-outlined orion-pc__serie-icon" style="font-size:16px;line-height:1;">repeat</span>
    <span class="orion-pc__name">PELET Edouard</span>
  </div>
</div>
```

### RDV Commercial — Size 1 (Grand, vertical)

```html
<div class="orion-pc orion-pc--rdv orion-pc--1 orion-pc--vertical" tabindex="0">
  <div class="orion-pc__body">
    <div class="orion-pc__header">
      <span class="orion-pc__name">PELET Edouard</span>
    </div>
    <span class="orion-pc__time">10:00 - 10:30</span>
    <div class="orion-pc__icons">
      <span class="material-symbols-outlined orion-pc__icon orion-pc__icon--muted" style="font-size:16px;line-height:1;">people_outline</span>
      <span class="material-symbols-outlined orion-pc__icon orion-pc__icon--muted" style="font-size:16px;line-height:1;">key</span>
      <span class="material-symbols-outlined orion-pc__icon" style="font-size:16px;line-height:1;">note_alt</span>
    </div>
    <div class="orion-pc__tags-row">
      <span class="orion-pc__tags-count">4</span>
      <div class="orion-pc__tags-list">
        <span class="orion-pc__tag--icon-only" style="background:#f1efff;color:#5b3fc9;">
          <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">child_friendly</span>
        </span>
        <span class="orion-pc__tag--icon-only" style="background:#f4e6dc;color:#8b5e3c;">
          <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">cleaning_services</span>
        </span>
        <span class="orion-pc__tag--icon-only" style="background:#ddead7;color:#3a7d22;">
          <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">yard</span>
        </span>
        <span class="orion-pc__tag--icon-only" style="background:#e7e1df;color:#6b5b54;">
          <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">elderly</span>
        </span>
      </div>
    </div>
  </div>
</div>
```

### Evenement RH — Size 1 (Grand, vertical)

```html
<div class="orion-pc orion-pc--rh orion-pc--1 orion-pc--vertical" tabindex="0">
  <div class="orion-pc__body">
    <span class="orion-pc__time">10:00 - 10:30</span>
    <div class="orion-pc__tags">
      <span class="orion-pc__tag orion-pc__tag--rh">
        <span class="material-symbols-outlined orion-pc__tag-icon" style="font-size:16px;line-height:1;">medication</span>
        Visite medicale
      </span>
    </div>
  </div>
</div>
```

### Evenement RH — Size 3 (Small, vertical — icon-only tag + time)

```html
<div class="orion-pc orion-pc--rh orion-pc--3 orion-pc--vertical" tabindex="0">
  <div class="orion-pc__body">
    <div class="orion-pc__time-with-tag">
      <span class="orion-pc__tag orion-pc__tag--rh orion-pc__tag--icon-only-rh">
        <span class="material-symbols-outlined orion-pc__tag-icon" style="font-size:16px;line-height:1;">medication</span>
      </span>
      <span class="orion-pc__time">10:00</span>
    </div>
  </div>
</div>
```

## Direction Rules

- **Vertical** (default): content stacks top-to-bottom. Cards have fixed widths per size.
- **Horizontal**: at size 2, stacks vertically within a narrower card (124px). At size 3, narrower still (83px). Names and times may wrap.
- Size 2 vertical uses `orion-pc__row` for compact 2-column layout. Horizontal does not.

## Fixed Widths

| Size | Vertical | Horizontal |
|------|----------|------------|
| 1 | 200px | 265px |
| 2 | 200px | 124px |
| 3 | 200px | 83px |
| 4 | 117px | 56px |

## States

- **Hover:** border color intensifies (CSS handles this, no class needed)
- **Selected:** `orion-pc--selected` — adds focus ring matching the type color
- **Disabled:** `orion-pc--disabled` — opacity 0.45, no pointer events
- **Non-pourvue:** `orion-pc--non-pourvue` — intervention only, name displays "A pourvoir"

## Rules

- Always combine: base + type + size + direction.
- `tabindex="0"` on every card for keyboard accessibility.
- Intervention always has `orion-pc__side-line` as first child inside the card.
- RDV and RH never have a side-line.
- Serie icon (`repeat`) appears only on intervention cards.
- RDV tag chip colors are domain-specific — use inline `style` attributes, not token classes.
- At smaller sizes, progressively remove elements per the decision table above.
- No JS behavior — cards are pure CSS display components.
