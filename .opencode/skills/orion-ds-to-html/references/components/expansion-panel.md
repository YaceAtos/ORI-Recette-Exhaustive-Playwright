# Expansion Panel

Collapsible panel with clickable header. Supports title, description, tag, toggle switch, custom header component, and action button in body.

## Classes

- base: `orion-ep`
- state: `orion-ep--open` | `orion-ep--disabled`
- elements:
  - `orion-ep__header` — clickable header row (`role="button"`, `aria-expanded`)
  - `orion-ep__header-left` — title + tag + description group
  - `orion-ep__title` — panel title (14px/500)
  - `orion-ep__description` — secondary text (14px/400, muted)
  - `orion-ep__tag` — inline tag badge (indigo bg)
  - `orion-ep__header-right` — toggle + custom component + chevron
  - `orion-ep__toggle` — slide toggle switch
  - `orion-ep__toggle--active` — active state for toggle
  - `orion-ep__toggle-handle` — toggle knob
  - `orion-ep__header-component` — slot for custom content in header right
  - `orion-ep__chevron` — expand/collapse icon container
  - `orion-ep__chevron-icon` — the icon itself (rotates 180deg when open)
  - `orion-ep__body` — collapsible content wrapper (hidden by default)
  - `orion-ep__divider` — horizontal line separator
  - `orion-ep__content` — text content area (16px padding)
  - `orion-ep__actions` — action button footer
  - `orion-ep__actions-group` — button group wrapper
  - `orion-ep__btn` — action button (filled sm style)

## Syntax

Closed (default):
```html
<div class="orion-ep">
  <div class="orion-ep__header" tabindex="0" role="button" aria-expanded="false">
    <div class="orion-ep__header-left">
      <span class="orion-ep__title">Title</span>
    </div>
    <div class="orion-ep__header-right">
      <span class="orion-ep__chevron">
        <span class="material-symbols-outlined orion-ep__chevron-icon" style="font-size:24px;line-height:1;">expand_more</span>
      </span>
    </div>
  </div>
  <div class="orion-ep__body">
    <div class="orion-ep__divider"></div>
    <div class="orion-ep__content">Panel content here.</div>
    <div class="orion-ep__divider"></div>
    <div class="orion-ep__actions">
      <div class="orion-ep__actions-group">
        <button class="orion-ep__btn">Label</button>
      </div>
    </div>
  </div>
</div>
```

Open with tag + description + toggle:
```html
<div class="orion-ep orion-ep--open">
  <div class="orion-ep__header" tabindex="0" role="button" aria-expanded="true">
    <div class="orion-ep__header-left">
      <span class="orion-ep__title">Title</span>
      <span class="orion-ep__tag">APA</span>
      <span class="orion-ep__description">3 interventions</span>
    </div>
    <div class="orion-ep__header-right">
      <button class="orion-ep__toggle orion-ep__toggle--active" aria-label="Toggle">
        <span class="orion-ep__toggle-handle"></span>
      </button>
      <span class="orion-ep__chevron">
        <span class="material-symbols-outlined orion-ep__chevron-icon" style="font-size:24px;line-height:1;">expand_more</span>
      </span>
    </div>
  </div>
  <div class="orion-ep__body">
    <div class="orion-ep__divider"></div>
    <div class="orion-ep__content">Content.</div>
  </div>
</div>
```

## Behavior (JS)

Header click toggles `orion-ep--open` and updates `aria-expanded`. Toggle switch toggles `orion-ep__toggle--active` independently (does not open/close panel). Keyboard: Enter/Space on header triggers click.

```js
document.addEventListener("click", (e) => {
  const toggle = e.target.closest(".orion-ep__toggle");
  if (toggle) {
    e.stopPropagation();
    toggle.classList.toggle("orion-ep__toggle--active");
    return;
  }
  const header = e.target.closest(".orion-ep__header");
  if (header) {
    const panel = header.closest(".orion-ep");
    if (panel.classList.contains("orion-ep--disabled")) return;
    panel.classList.toggle("orion-ep--open");
    header.setAttribute("aria-expanded", panel.classList.contains("orion-ep--open"));
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const header = e.target.closest(".orion-ep__header");
    if (header) { e.preventDefault(); header.click(); }
  }
});
```

## Rules

- Body is hidden by default (`display: none`), shown when `orion-ep--open` is added.
- Toggle switch is independent from expand/collapse — clicking it must NOT open/close the panel.
- Disabled: `orion-ep--disabled` — opacity 0.38, no pointer events, no state layer.
- Action button zone and second divider are optional — omit both if no action needed.
- `orion-ep__btn` uses the DS filled-sm button style. For real mockups, prefer `orion-btn orion-btn--filled orion-btn--sm` instead.
- Width defaults to 400px in the DS; override with Tailwind utilities as needed.
