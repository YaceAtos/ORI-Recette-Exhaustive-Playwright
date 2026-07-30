# Form Field

Outlined form field supporting `<input>`, `<select>` (custom dropdown), and `<textarea>`. Floating label, trailing icon, error state, helper text.

## Classes

- base: `orion-ff`
- type: `orion-ff--textarea` | `orion-ff--select`
- state: `orion-ff--float` (label floated up) | `orion-ff--focus` | `orion-ff--disabled` | `orion-ff--error` | `orion-ff--select-open`
- elements:
  - `orion-ff__wrapper` — border container (1px outlined, 40px min-height)
  - `orion-ff__label` — floating label (absolute, transitions up on focus/value)
  - `orion-ff__input` — text input
  - `orion-ff__input--with-trailing` — input with trailing icon (removes right padding)
  - `orion-ff__textarea` — textarea element
  - `orion-ff__select-trigger` — custom select display
  - `orion-ff__select-trigger--placeholder` — placeholder color for empty select
  - `orion-ff__dropdown` — dropdown options container (hidden by default)
  - `orion-ff__dropdown-item` — single option row
  - `orion-ff__dropdown-item--selected` — selected option
  - `orion-ff__dropdown-check` — check icon in selected option
  - `orion-ff__trailing` — trailing icon container (40x38px)
  - `orion-ff__trailing-icon` — the icon itself (16px)
  - `orion-ff__helper` — helper/error text below field
  - `orion-ff__resize-handle` — SVG resize indicator (textarea only)

## Syntax

Input with trailing icon:
```html
<div class="orion-ff">
  <div class="orion-ff__wrapper">
    <label class="orion-ff__label" for="field1">Default label</label>
    <input class="orion-ff__input orion-ff__input--with-trailing" type="text" id="field1" value="" placeholder="Input" />
    <div class="orion-ff__trailing">
      <span class="material-symbols-outlined orion-ff__trailing-icon" style="font-size:16px;line-height:1;">calendar_today</span>
    </div>
  </div>
</div>
```

Input filled (label floats):
```html
<div class="orion-ff orion-ff--float">
  <div class="orion-ff__wrapper">
    <label class="orion-ff__label" for="field2">Default label</label>
    <input class="orion-ff__input" type="text" id="field2" value="Input" placeholder="Input" />
  </div>
</div>
```

Error with helper:
```html
<div class="orion-ff orion-ff--error">
  <div class="orion-ff__wrapper">
    <label class="orion-ff__label" for="field3">Default label</label>
    <input class="orion-ff__input orion-ff__input--with-trailing" type="text" id="field3" value="" placeholder="Input" />
    <div class="orion-ff__trailing">
      <span class="material-symbols-outlined orion-ff__trailing-icon" style="font-size:16px;line-height:1;">calendar_today</span>
    </div>
  </div>
  <span class="orion-ff__helper">Message d'erreur</span>
</div>
```

Custom select:
```html
<div class="orion-ff orion-ff--select">
  <div class="orion-ff__wrapper">
    <label class="orion-ff__label" for="sel1">Default label</label>
    <div class="orion-ff__select-trigger orion-ff__select-trigger--placeholder" id="sel1" tabindex="0"></div>
    <div class="orion-ff__dropdown">
      <div class="orion-ff__dropdown-item" data-value="1" data-label="Option 1">
        <span>Option 1</span>
        <span class="material-symbols-outlined orion-ff__dropdown-check" style="font-size:16px;line-height:1;">check</span>
      </div>
      <div class="orion-ff__dropdown-item" data-value="2" data-label="Option 2">
        <span>Option 2</span>
        <span class="material-symbols-outlined orion-ff__dropdown-check" style="font-size:16px;line-height:1;">check</span>
      </div>
    </div>
    <div class="orion-ff__trailing">
      <span class="material-symbols-outlined orion-ff__trailing-icon" style="font-size:16px;line-height:1;">keyboard_arrow_down</span>
    </div>
  </div>
</div>
```

Textarea:
```html
<div class="orion-ff orion-ff--textarea">
  <div class="orion-ff__wrapper">
    <label class="orion-ff__label" for="ta1">Default label</label>
    <textarea class="orion-ff__textarea" id="ta1" placeholder="Input"></textarea>
  </div>
</div>
```

## Behavior (JS)

Floating label: on focus, add `orion-ff--focus` + `orion-ff--float`. On blur, remove `orion-ff--focus`; keep `orion-ff--float` only if input has value. Custom select: click trigger toggles `orion-ff--select-open`; clicking item updates trigger text and closes dropdown.

```js
document.addEventListener("focusin", (e) => {
  const input = e.target.closest(".orion-ff__input, .orion-ff__textarea");
  if (!input) return;
  const ff = input.closest(".orion-ff");
  if (ff && !ff.classList.contains("orion-ff--disabled")) {
    ff.classList.add("orion-ff--focus", "orion-ff--float");
  }
});

document.addEventListener("focusout", (e) => {
  const input = e.target.closest(".orion-ff__input, .orion-ff__textarea");
  if (!input) return;
  const ff = input.closest(".orion-ff");
  if (!ff) return;
  ff.classList.remove("orion-ff--focus");
  if (!input.value || !input.value.trim()) ff.classList.remove("orion-ff--float");
});

document.addEventListener("click", (e) => {
  const trigger = e.target.closest(".orion-ff__select-trigger");
  if (trigger) {
    const ff = trigger.closest(".orion-ff");
    if (ff && !ff.classList.contains("orion-ff--disabled")) {
      const isOpen = ff.classList.contains("orion-ff--select-open");
      document.querySelectorAll(".orion-ff--select-open").forEach(el => {
        el.classList.remove("orion-ff--select-open", "orion-ff--focus");
      });
      if (!isOpen) ff.classList.add("orion-ff--select-open", "orion-ff--focus", "orion-ff--float");
    }
    return;
  }
  const item = e.target.closest(".orion-ff__dropdown-item");
  if (item) {
    const ff = item.closest(".orion-ff");
    const triggerEl = ff.querySelector(".orion-ff__select-trigger");
    ff.querySelector(".orion-ff__dropdown").querySelectorAll(".orion-ff__dropdown-item").forEach(i => i.classList.remove("orion-ff__dropdown-item--selected"));
    item.classList.add("orion-ff__dropdown-item--selected");
    triggerEl.textContent = item.dataset.label;
    triggerEl.classList.remove("orion-ff__select-trigger--placeholder");
    ff.classList.remove("orion-ff--select-open", "orion-ff--focus");
    ff.classList.add("orion-ff--float");
    return;
  }
  document.querySelectorAll(".orion-ff--select-open").forEach(ff => {
    ff.classList.remove("orion-ff--select-open", "orion-ff--focus");
  });
});
```

## Rules

- Always wrap input/select/textarea in `orion-ff__wrapper`.
- Label floats when `orion-ff--float` is set — add it on focus AND when field has a value.
- Placeholder is hidden by default; only visible when label is floated (`orion-ff--float`).
- Error state (`orion-ff--error`): border, label, trailing icon, and helper text all turn `#b2271e`.
- Disabled: border opacity 38%, text opacity 38%, no interaction.
- Focus state: border becomes 2px primary (`#013aba`). Input padding adjusts by 1px to compensate.
- Select uses a custom dropdown, not native `<select>`. Chevron icon in trailing slot.
- Textarea: min-height 69px on wrapper, vertical resize only, optional SVG resize handle.
- Trailing icon is optional for input; always present (chevron) for select.
- Check icon in dropdown items is hidden for non-selected items via CSS.

## Required Fields (Asterisks)

- Asterisk `*` appears when the field is required for validation/saving.
- Asterisk also appears on **dependent fields**: if field A is filled, and field B depends on A, then B gets an asterisk.
- Dependency rule: adding an optional block with linked fields A and B → filling A makes B required (asterisk appears dynamically).
- Same rule applies in modals and standalone forms.

## Completion Status

Used in wizard steps (modal LG) and multi-section forms:

| Status | Color | Condition |
|--------|-------|-----------|
| Complete | Green | All required + future-needed fields filled |
| Incomplete | Red | Required fields not filled |
| Fields missing | Orange | Fields needed for future use missing |
| In progress | Blue | Currently editing |

## Special Field Patterns

- **Address**: GEOWS autocomplete, fallback to manual entry via map.
- **Documents**: drag & drop (single or multiple). Category management via association modal.
- **Phone/email**: single field with add button, or multiple rows.
