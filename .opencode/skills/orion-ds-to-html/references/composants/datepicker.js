// ══════════════════════════════════════════════════
// DatePicker
// ══════════════════════════════════════════════════

export const name = "DatePicker";
export const description = "Calendrier mensuel avec navigation, today outline et sélection de date.";

// ── Icons (Material Symbols) ──
const mi = (name, size = 24) => `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_ARROW_DROP = mi('arrow_drop_down');
const ICON_CHEVRON_LEFT = mi('keyboard_arrow_left');
const ICON_CHEVRON_RIGHT = mi('keyboard_arrow_right');

// ── CSS ──
export const styles = `
  .datepicker {
    background: #e6e8eb;
    border-radius: 6px;
    overflow: hidden;
    width: 344px;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06);
    font-family: 'Inter', sans-serif;
    user-select: none;
  }

  /* ── Header ── */
  .datepicker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px 8px 24px;
  }
  .datepicker__month-label {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }
  .datepicker__month-text {
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: #1d2024;
    white-space: nowrap;
  }
  .datepicker__month-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1d2024;
  }
  .datepicker__arrows {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .datepicker__arrow {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1d2024;
    cursor: pointer;
    border-radius: 999px;
    border: none;
    background: none;
    padding: 0;
    transition: background 0.15s;
  }
  .datepicker__arrow:hover {
    background: rgba(0,0,0,0.06);
  }

  /* ── Week header ── */
  .datepicker__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    gap: 6px;
    padding: 6px 14px;
    justify-content: center;
  }
  .datepicker__weekday {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: #1d2024;
  }

  /* ── Month separator label ── */
  .datepicker__month-sep {
    padding: 6px 24px;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: #1d2024;
  }

  /* ── Date grid ── */
  .datepicker__grid {
    display: grid;
    grid-template-columns: repeat(7, 40px);
    column-gap: 6px;
    row-gap: 4px;
    padding: 6px 14px;
    justify-content: center;
  }
  .datepicker__cell {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #1d2024;
    border-radius: 999px;
    cursor: pointer;
    border: 1px solid transparent;
    background: none;
    padding: 0;
    transition: background 0.15s;
    position: relative;
  }
  .datepicker__cell:hover {
    background: rgba(0,0,0,0.06);
  }
  .datepicker__cell--today {
    border-color: #013aba;
  }
  .datepicker__cell--selected {
    background: #013aba;
    color: white;
  }
  .datepicker__cell--selected:hover {
    background: #012d94;
  }
  .datepicker__cell--empty {
    cursor: default;
  }
  .datepicker__cell--empty:hover {
    background: none;
  }
  .datepicker__cell--outside {
    color: #9ca0a6;
  }

  .datepicker .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
  }
`;

// ── Helpers ──
const MONTH_NAMES_FR = [
  "JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN",
  "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"
];
const MONTH_SHORT_FR = [
  "JAN", "FÉV", "MAR", "AVR", "MAI", "JUIN",
  "JUIL", "AOÛT", "SEP", "OCT", "NOV", "DÉC"
];
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Monday=0 .. Sunday=6
function getStartDayOfWeek(year, month) {
  const d = new Date(year, month, 1).getDay();
  return (d + 6) % 7; // shift so Monday=0
}

function buildCalendarHTML(year, month, todayDate, selectedDate) {
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfWeek(year, month);

  let html = '';
  // Empty cells before first day
  for (let i = 0; i < startDay; i++) {
    html += `<div class="datepicker__cell datepicker__cell--empty"></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = todayDate && todayDate.year === year && todayDate.month === month && todayDate.day === d;
    const isSelected = selectedDate && selectedDate.year === year && selectedDate.month === month && selectedDate.day === d;
    let cls = 'datepicker__cell';
    if (isToday) cls += ' datepicker__cell--today';
    if (isSelected) cls += ' datepicker__cell--selected';
    html += `<button class="${cls}" data-day="${d}">${d}</button>`;
  }
  return html;
}

// ── Variants ──
export const variants = [
  {
    label: "Default (aujourd'hui)",
    render: () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const today = { year, month, day: now.getDate() };
      const monthLabel = `${MONTH_SHORT_FR[month]} ${year}`;

      return `
        <div class="datepicker" data-year="${year}" data-month="${month}">
          <div class="datepicker__header">
            <div class="datepicker__month-label">
              <span class="datepicker__month-text">${monthLabel}</span>
              <span class="datepicker__month-icon">${ICON_ARROW_DROP}</span>
            </div>
            <div class="datepicker__arrows">
              <button class="datepicker__arrow datepicker__arrow--prev">${ICON_CHEVRON_LEFT}</button>
              <button class="datepicker__arrow datepicker__arrow--next">${ICON_CHEVRON_RIGHT}</button>
            </div>
          </div>
          <div class="datepicker__weekdays">
            ${WEEKDAYS.map(d => `<div class="datepicker__weekday">${d}</div>`).join('')}
          </div>
          <div class="datepicker__month-sep">${MONTH_SHORT_FR[month]}</div>
          <div class="datepicker__grid">
            ${buildCalendarHTML(year, month, today, null)}
          </div>
        </div>
      `;
    }
  },
  {
    label: "Avec sélection",
    render: () => {
      // Use Sep 2025 to match Figma
      const year = 2025, month = 8;
      const today = { year: 2025, month: 8, day: 15 };
      const selected = { year: 2025, month: 8, day: 19 };
      const monthLabel = `${MONTH_SHORT_FR[month]} ${year}`;

      return `
        <div class="datepicker" data-year="${year}" data-month="${month}">
          <div class="datepicker__header">
            <div class="datepicker__month-label">
              <span class="datepicker__month-text">${monthLabel}</span>
              <span class="datepicker__month-icon">${ICON_ARROW_DROP}</span>
            </div>
            <div class="datepicker__arrows">
              <button class="datepicker__arrow datepicker__arrow--prev">${ICON_CHEVRON_LEFT}</button>
              <button class="datepicker__arrow datepicker__arrow--next">${ICON_CHEVRON_RIGHT}</button>
            </div>
          </div>
          <div class="datepicker__weekdays">
            ${WEEKDAYS.map(d => `<div class="datepicker__weekday">${d}</div>`).join('')}
          </div>
          <div class="datepicker__month-sep">${MONTH_SHORT_FR[month]}</div>
          <div class="datepicker__grid">
            ${buildCalendarHTML(year, month, today, selected)}
          </div>
        </div>
      `;
    }
  }
];

// ── Interactive script ──
export const script = (container) => {
  container.querySelectorAll('.datepicker').forEach(picker => {
    let year = parseInt(picker.dataset.year);
    let month = parseInt(picker.dataset.month);
    let selectedDate = null;

    // Check if variant had a pre-selected date
    const preSelected = picker.querySelector('.datepicker__cell--selected');
    if (preSelected) {
      selectedDate = { year, month, day: parseInt(preSelected.dataset.day) };
    }

    const now = new Date();
    const today = { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };

    function render() {
      const monthLabel = `${MONTH_SHORT_FR[month]} ${year}`;
      picker.querySelector('.datepicker__month-text').textContent = monthLabel;
      picker.querySelector('.datepicker__month-sep').textContent = MONTH_SHORT_FR[month];
      picker.querySelector('.datepicker__grid').innerHTML = buildCalendarHTML(year, month, today, selectedDate);
      picker.dataset.year = year;
      picker.dataset.month = month;
      bindCells();
    }

    function bindCells() {
      picker.querySelectorAll('.datepicker__cell:not(.datepicker__cell--empty)').forEach(cell => {
        cell.addEventListener('click', () => {
          const day = parseInt(cell.dataset.day);
          selectedDate = { year, month, day };
          render();
        });
      });
    }

    // Nav arrows
    picker.querySelector('.datepicker__arrow--prev')?.addEventListener('click', () => {
      month--;
      if (month < 0) { month = 11; year--; }
      render();
    });
    picker.querySelector('.datepicker__arrow--next')?.addEventListener('click', () => {
      month++;
      if (month > 11) { month = 0; year++; }
      render();
    });

    // Initial cell binding
    bindCells();
  });
};
