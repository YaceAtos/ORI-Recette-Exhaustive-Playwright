# Search Bar

Search input with floating label, autocomplete dropdown, and item selection.

## Classes

- base: `orion-search`
- state: `orion-search--focus` | `orion-search--float` (label floated up)
- elements:
  - `orion-search__wrapper` — input container with border
  - `orion-search__label` — floating label
  - `orion-search__input` — text input
  - `orion-search__trailing` — trailing icon container
  - `orion-search__icon` — search icon (16px)
  - `orion-search__dropdown` — results dropdown
  - `orion-search__item` — dropdown row
  - `orion-search__item--selected` — selected item
  - `orion-search__check` — check icon on selected item (16px)

## Syntax

```html
<div class="orion-search">
  <div class="orion-search__wrapper">
    <label class="orion-search__label">Rechercher</label>
    <input class="orion-search__input" type="text" autocomplete="off" />
    <div class="orion-search__trailing">
      <span class="material-symbols-outlined orion-search__icon" style="font-size:16px;line-height:1;">search</span>
    </div>
  </div>
  <div class="orion-search__dropdown">
    <div class="orion-search__item" data-value="Lucas Bernard">Lucas Bernard
      <span class="material-symbols-outlined orion-search__check" style="font-size:16px;line-height:1;">check</span>
    </div>
    <div class="orion-search__item" data-value="Marie Dupont">Marie Dupont
      <span class="material-symbols-outlined orion-search__check" style="font-size:16px;line-height:1;">check</span>
    </div>
  </div>
</div>
```

## Behavior (JS)

Floating label: moves up on focus or when input has value. Dropdown: opens on focus, filters on input, closes on blur (150ms delay for click). Item click: toggles selection, fills input.

```js
document.addEventListener("focusin", (e) => {
  const input = e.target.closest(".orion-search__input");
  if (!input) return;
  const sb = input.closest(".orion-search");
  sb.classList.add("orion-search--focus", "orion-search--float");
  filterDropdown(sb, input.value);
});

document.addEventListener("focusout", (e) => {
  const input = e.target.closest(".orion-search__input");
  if (!input) return;
  const sb = input.closest(".orion-search");
  setTimeout(() => {
    if (!sb.contains(document.activeElement)) {
      sb.classList.remove("orion-search--focus");
      if (!input.value.trim()) sb.classList.remove("orion-search--float");
    }
  }, 150);
});

document.addEventListener("input", (e) => {
  const input = e.target.closest(".orion-search__input");
  if (!input) return;
  filterDropdown(input.closest(".orion-search"), input.value);
});

document.addEventListener("click", (e) => {
  const item = e.target.closest(".orion-search__item");
  if (!item) return;
  const sb = item.closest(".orion-search");
  const input = sb.querySelector(".orion-search__input");
  if (item.classList.contains("orion-search__item--selected")) {
    item.classList.remove("orion-search__item--selected");
    input.value = "";
    sb.classList.remove("orion-search--float");
  } else {
    sb.querySelectorAll(".orion-search__item--selected").forEach(el => el.classList.remove("orion-search__item--selected"));
    item.classList.add("orion-search__item--selected");
    input.value = item.dataset.value;
    sb.classList.add("orion-search--float");
  }
  sb.classList.remove("orion-search--focus");
  input.blur();
});

function filterDropdown(sb, query) {
  const q = query.toLowerCase().trim();
  sb.querySelectorAll(".orion-search__item").forEach(item => {
    item.style.display = (!q || item.dataset.value.toLowerCase().includes(q)) ? "" : "none";
  });
}
```

## Rules

- Dropdown items need `data-value` attribute for filtering and selection.
- Check icon is always present in markup but hidden via CSS unless `--selected`.
- Label text should describe what is being searched (e.g. "Rechercher un intervenant").
- Dropdown max-height: 240px with overflow scroll.
- Single selection only — clicking a new item deselects the previous one.
