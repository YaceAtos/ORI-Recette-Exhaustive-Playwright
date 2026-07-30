# DatePicker

Monthly calendar widget with month/year navigation, weekday header, day grid, today outline, and date selection.

## Classes

- base: `orion-dp`
- elements:
  - `orion-dp__header` — top bar with month label + nav arrows
  - `orion-dp__month-label` — clickable month/year display
  - `orion-dp__month-text` — month text (14px/700)
  - `orion-dp__month-icon` — dropdown arrow icon
  - `orion-dp__arrows` — prev/next navigation container
  - `orion-dp__arrow` — nav button (`orion-dp__arrow--prev` | `orion-dp__arrow--next`)
  - `orion-dp__weekdays` — 7-column weekday header grid
  - `orion-dp__weekday` — single weekday label (L, M, M, J, V, S, D)
  - `orion-dp__month-sep` — month separator label between grids
  - `orion-dp__grid` — 7-column day grid
  - `orion-dp__cell` — day button
  - `orion-dp__cell--today` — today outline (primary border)
  - `orion-dp__cell--selected` — selected day (primary bg, white text)
  - `orion-dp__cell--empty` — placeholder cell before first day
  - `orion-dp__cell--outside` — days from adjacent months (muted)

## Syntax

```html
<div class="orion-dp" data-year="2025" data-month="8">
  <div class="orion-dp__header">
    <div class="orion-dp__month-label">
      <span class="orion-dp__month-text">SEP 2025</span>
      <span class="orion-dp__month-icon">
        <span class="material-symbols-outlined" style="font-size:24px;line-height:1;">arrow_drop_down</span>
      </span>
    </div>
    <div class="orion-dp__arrows">
      <button class="orion-dp__arrow orion-dp__arrow--prev">
        <span class="material-symbols-outlined" style="font-size:24px;line-height:1;">keyboard_arrow_left</span>
      </button>
      <button class="orion-dp__arrow orion-dp__arrow--next">
        <span class="material-symbols-outlined" style="font-size:24px;line-height:1;">keyboard_arrow_right</span>
      </button>
    </div>
  </div>
  <div class="orion-dp__weekdays">
    <div class="orion-dp__weekday">L</div>
    <div class="orion-dp__weekday">M</div>
    <div class="orion-dp__weekday">M</div>
    <div class="orion-dp__weekday">J</div>
    <div class="orion-dp__weekday">V</div>
    <div class="orion-dp__weekday">S</div>
    <div class="orion-dp__weekday">D</div>
  </div>
  <div class="orion-dp__month-sep">SEP</div>
  <div class="orion-dp__grid">
    <!-- empty cells for offset -->
    <div class="orion-dp__cell orion-dp__cell--empty"></div>
    <!-- day buttons -->
    <button class="orion-dp__cell" data-day="1">1</button>
    <button class="orion-dp__cell orion-dp__cell--today" data-day="15">15</button>
    <button class="orion-dp__cell orion-dp__cell--selected" data-day="19">19</button>
    <!-- ... remaining days ... -->
  </div>
</div>
```

## Behavior (JS)

Month navigation (prev/next arrows) updates month label, separator, and regenerates grid. Clicking a day cell marks it as selected.

```js
document.addEventListener("click", (e) => {
  const arrow = e.target.closest(".orion-dp__arrow");
  if (arrow) {
    const picker = arrow.closest(".orion-dp");
    let year = parseInt(picker.dataset.year);
    let month = parseInt(picker.dataset.month);
    if (arrow.classList.contains("orion-dp__arrow--prev")) {
      month--; if (month < 0) { month = 11; year--; }
    } else {
      month++; if (month > 11) { month = 0; year++; }
    }
    picker.dataset.year = year;
    picker.dataset.month = month;
    // Rebuild grid and update labels here
    return;
  }

  const cell = e.target.closest(".orion-dp__cell:not(.orion-dp__cell--empty)");
  if (cell) {
    const grid = cell.closest(".orion-dp__grid");
    grid.querySelectorAll(".orion-dp__cell--selected").forEach(c => c.classList.remove("orion-dp__cell--selected"));
    cell.classList.add("orion-dp__cell--selected");
  }
});
```

## Rules

- Fixed width: 344px. Background: `#e6e8eb`.
- Weekdays use French single letters: L, M, M, J, V, S, D (Monday-first).
- Grid cells are 40x40px circles. Gap: 6px columns, 4px rows.
- Today: 1px primary border. Selected: primary bg + white text.
- `data-year` and `data-month` on root element store current state (month is 0-indexed).
- Empty cells fill the gap before day 1 — use `orion-dp__cell--empty`.
- Month separator label (`orion-dp__month-sep`) appears between weekday header and grid.
