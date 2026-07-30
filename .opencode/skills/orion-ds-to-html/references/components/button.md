# Button

Action trigger. 4 types, 3 sizes, optional icons.

## Classes

- base: `orion-btn`
- type: `orion-btn--filled` | `orion-btn--tonal` | `orion-btn--outlined` | `orion-btn--ghost`
- size: `orion-btn--sm` (36px) | `orion-btn--md` (40px) | `orion-btn--lg` (44px)
- icon element: `orion-btn__icon` (+ `orion-btn__icon--lg` for 20px icons in lg size)
- disabled: native `disabled` attribute

## Syntax

```html
<button class="orion-btn orion-btn--filled orion-btn--md">Label</button>
```

With left icon:
```html
<button class="orion-btn orion-btn--filled orion-btn--md">
  <span class="material-symbols-outlined orion-btn__icon" style="font-size:16px;line-height:1;">delete</span>
  <span>Supprimer</span>
</button>
```

With left + right icons (lg size — uses 20px icons):
```html
<button class="orion-btn orion-btn--outlined orion-btn--lg">
  <span class="material-symbols-outlined orion-btn__icon orion-btn__icon--lg" style="font-size:20px;line-height:1;">arrow_back</span>
  <span>Retour</span>
  <span class="material-symbols-outlined orion-btn__icon orion-btn__icon--lg" style="font-size:20px;line-height:1;">arrow_forward</span>
</button>
```

## Rules

- Always combine base + type + size.
- `orion-btn--filled` = primary CTA. Maximum one per screen zone.
- `orion-btn--tonal` = secondary emphasis. Use when filled is too strong.
- `orion-btn--outlined` or `orion-btn--ghost` = secondary/tertiary actions.
- Icons are optional, can appear before and/or after the label text.
- Icon size: 16px for `--sm` and `--md`, 20px for `--lg`.
- Disabled: add native `disabled` attribute. Never fake with opacity classes.
- No JS behavior — buttons are pure CSS.
