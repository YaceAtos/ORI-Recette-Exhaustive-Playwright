# Pagination

Table pagination bar with rows-per-page selector and first/prev/next/last navigation.

## Classes

- base: `orion-pg`
- elements:
  - `orion-pg__info` — left group (label + select + range)
  - `orion-pg__label` — "Ligne par page :" text
  - `orion-pg__select-wrap` — custom select container
  - `orion-pg__select-trigger` — select button showing current value
  - `orion-pg__select-icon` — dropdown arrow icon
  - `orion-pg__dropdown` — dropdown menu
  - `orion-pg__dropdown-item` — dropdown option
  - `orion-pg__dropdown-item--selected` — selected option
  - `orion-pg__dropdown-check` — check icon (16px)
  - `orion-pg__range` — "1-10 of 102" text
  - `orion-pg__nav` — right navigation buttons group
  - `orion-pg__btn` — nav button (36×36px)
  - `orion-pg__btn--first` | `--prev` | `--next` | `--last` — nav targets
- state: `orion-pg__select-wrap--open` (dropdown visible)

## Syntax

```html
<div class="orion-pg" data-page="1" data-per-page="10" data-total="102">
  <div class="orion-pg__info">
    <span class="orion-pg__label">Ligne par page :</span>
    <div class="orion-pg__select-wrap">
      <div class="orion-pg__select-trigger">10</div>
      <div class="orion-pg__dropdown">
        <div class="orion-pg__dropdown-item" data-value="5">5
          <span class="material-symbols-outlined orion-pg__dropdown-check" style="font-size:16px;line-height:1;">check</span>
        </div>
        <div class="orion-pg__dropdown-item orion-pg__dropdown-item--selected" data-value="10">10
          <span class="material-symbols-outlined orion-pg__dropdown-check" style="font-size:16px;line-height:1;">check</span>
        </div>
        <div class="orion-pg__dropdown-item" data-value="25">25
          <span class="material-symbols-outlined orion-pg__dropdown-check" style="font-size:16px;line-height:1;">check</span>
        </div>
        <div class="orion-pg__dropdown-item" data-value="50">50
          <span class="material-symbols-outlined orion-pg__dropdown-check" style="font-size:16px;line-height:1;">check</span>
        </div>
      </div>
      <span class="orion-pg__select-icon">
        <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">arrow_drop_down</span>
      </span>
    </div>
    <span class="orion-pg__range">1-10 of 102</span>
  </div>
  <div class="orion-pg__nav">
    <button class="orion-pg__btn orion-pg__btn--first" disabled title="Première page">
      <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">keyboard_double_arrow_left</span>
    </button>
    <button class="orion-pg__btn orion-pg__btn--prev" disabled title="Page précédente">
      <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">keyboard_arrow_left</span>
    </button>
    <button class="orion-pg__btn orion-pg__btn--next" title="Page suivante">
      <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">keyboard_arrow_right</span>
    </button>
    <button class="orion-pg__btn orion-pg__btn--last" title="Dernière page">
      <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">keyboard_double_arrow_right</span>
    </button>
  </div>
</div>
```

## Behavior (JS)

Nav buttons update page, recalculate range text, and toggle disabled states. Select dropdown opens on click, selects value, resets to page 1. Outside click closes dropdown.

```js
document.querySelectorAll(".orion-pg").forEach(pag => {
  let page = parseInt(pag.dataset.page);
  let perPage = parseInt(pag.dataset.perPage);
  const total = parseInt(pag.dataset.total);

  function totalPages() { return Math.ceil(total / perPage); }

  function update() {
    const tp = totalPages();
    if (page < 1) page = 1;
    if (page > tp) page = tp;
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);
    pag.querySelector(".orion-pg__range").textContent = `${start}-${end} of ${total}`;
    pag.querySelector(".orion-pg__btn--first").disabled = page === 1;
    pag.querySelector(".orion-pg__btn--prev").disabled = page === 1;
    pag.querySelector(".orion-pg__btn--next").disabled = page >= tp;
    pag.querySelector(".orion-pg__btn--last").disabled = page >= tp;
  }

  pag.querySelector(".orion-pg__btn--first").addEventListener("click", () => { page = 1; update(); });
  pag.querySelector(".orion-pg__btn--prev").addEventListener("click", () => { page--; update(); });
  pag.querySelector(".orion-pg__btn--next").addEventListener("click", () => { page++; update(); });
  pag.querySelector(".orion-pg__btn--last").addEventListener("click", () => { page = totalPages(); update(); });

  const selectWrap = pag.querySelector(".orion-pg__select-wrap");
  const selectTrigger = pag.querySelector(".orion-pg__select-trigger");

  selectTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".orion-pg__select-wrap--open").forEach(el => {
      if (el !== selectWrap) el.classList.remove("orion-pg__select-wrap--open");
    });
    selectWrap.classList.toggle("orion-pg__select-wrap--open");
  });

  pag.querySelectorAll(".orion-pg__dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      perPage = parseInt(item.dataset.value);
      page = 1;
      selectTrigger.textContent = perPage;
      pag.querySelectorAll(".orion-pg__dropdown-item").forEach(i => i.classList.remove("orion-pg__dropdown-item--selected"));
      item.classList.add("orion-pg__dropdown-item--selected");
      selectWrap.classList.remove("orion-pg__select-wrap--open");
      update();
    });
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".orion-pg__select-wrap--open").forEach(el => el.classList.remove("orion-pg__select-wrap--open"));
});
```

## Rules

- Requires `data-page`, `data-per-page`, `data-total` attributes on root element.
- Default per-page options: 5, 10, 25, 50.
- First/prev buttons disabled on page 1. Next/last disabled on last page.
- Dropdown opens upward (above the select) — `bottom: calc(100% + 4px)`.
- Nav icons use `wght` 300 (lighter than default).
- Range text format: `{start}-{end} of {total}`.
