// ══════════════════════════════════════════════════
// Pagination
// ══════════════════════════════════════════════════

export const name = "Pagination";
export const description = "Barre de pagination avec sélecteur de lignes par page et navigation premier/précédent/suivant/dernier.";

// ── Icons (Material Symbols) ──
const mi = (name, size = 16) => `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_DOUBLE_LEFT = mi('keyboard_double_arrow_left');
const ICON_LEFT = mi('keyboard_arrow_left');
const ICON_RIGHT = mi('keyboard_arrow_right');
const ICON_DOUBLE_RIGHT = mi('keyboard_double_arrow_right');
const ICON_DROPDOWN = mi('arrow_drop_down');
const ICON_CHECK = mi('check');

// ── CSS ──
export const styles = `
  .pagination {
    display: flex;
    align-items: center;
    gap: 24px;
    font-family: 'Inter', sans-serif;
    user-select: none;
  }

  /* ── Left group ── */
  .pagination__info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pagination__label,
  .pagination__range {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #1d2024;
    white-space: nowrap;
  }

  /* ── Custom select (rows per page) ── */
  .pagination__select-wrap {
    position: relative;
    width: 70px;
  }
  .pagination__select-trigger {
    width: 100%;
    height: 40px;
    border: 1px solid #7381a2;
    border-radius: 6px;
    background: transparent;
    padding: 0 30px 0 16px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 40px;
    color: #48546d;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s;
    white-space: nowrap;
  }
  .pagination__select-trigger:hover {
    border-color: #48546d;
  }
  .pagination__select-wrap--open .pagination__select-trigger {
    border-color: #013aba;
    box-shadow: 0 0 0 1px #013aba;
  }
  .pagination__select-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #48546d;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pagination__dropdown {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 6px;
    box-shadow:
      0 2px 4px -2px rgba(0, 0, 0, 0.06),
      0 4px 8px -2px rgba(0, 0, 0, 0.1);
    z-index: 10;
    display: none;
    max-height: 240px;
    overflow-y: auto;
  }
  .pagination__select-wrap--open .pagination__dropdown {
    display: block;
  }
  .pagination__dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1d2024;
    cursor: pointer;
    transition: background-color 0.1s;
  }
  .pagination__dropdown-item:hover {
    background: rgba(29, 32, 36, 0.06);
  }
  .pagination__dropdown-item--selected {
    font-weight: 500;
    background: rgba(29, 32, 36, 0.04);
  }
  .pagination__dropdown-check {
    width: 16px;
    height: 16px;
    color: #013aba;
    flex-shrink: 0;
  }
  .pagination__dropdown-item:not(.pagination__dropdown-item--selected) .pagination__dropdown-check {
    display: none;
  }

  /* ── Nav buttons ── */
  .pagination__nav {
    display: flex;
    align-items: center;
  }
  .pagination__btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    border-radius: 4px;
    color: #1d2024;
    cursor: pointer;
    padding: 0;
    transition: background 0.15s;
  }
  .pagination__btn:hover {
    background: rgba(0, 0, 0, 0.06);
  }
  .pagination__btn:active {
    background: rgba(0, 0, 0, 0.1);
  }
  .pagination__btn:disabled {
    color: #9ca0a6;
    cursor: default;
    background: none;
  }
  .pagination__btn:disabled:hover {
    background: none;
  }
  .pagination .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Helpers ──
function buildPagination({ perPage, currentPage, totalItems, disabledFirst, disabledLast }) {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  return `
    <div class="pagination" data-page="${currentPage}" data-per-page="${perPage}" data-total="${totalItems}">
      <div class="pagination__info">
        <span class="pagination__label">Ligne par page :</span>
        <div class="pagination__select-wrap">
          <div class="pagination__select-trigger">${perPage}</div>
          <div class="pagination__dropdown">
            ${[5, 10, 25, 50].map(v => `<div class="pagination__dropdown-item${v === perPage ? ' pagination__dropdown-item--selected' : ''}" data-value="${v}">${v}<span class="material-symbols-outlined pagination__dropdown-check" style="font-size:16px;line-height:1;">check</span></div>`).join('')}
          </div>
          <span class="pagination__select-icon">${ICON_DROPDOWN}</span>
        </div>
        <span class="pagination__range">${start}-${end} of ${totalItems}</span>
      </div>
      <div class="pagination__nav">
        <button class="pagination__btn pagination__btn--first"${disabledFirst ? ' disabled' : ''} title="Première page">${ICON_DOUBLE_LEFT}</button>
        <button class="pagination__btn pagination__btn--prev"${disabledFirst ? ' disabled' : ''} title="Page précédente">${ICON_LEFT}</button>
        <button class="pagination__btn pagination__btn--next"${disabledLast ? ' disabled' : ''} title="Page suivante">${ICON_RIGHT}</button>
        <button class="pagination__btn pagination__btn--last"${disabledLast ? ' disabled' : ''} title="Dernière page">${ICON_DOUBLE_RIGHT}</button>
      </div>
    </div>
  `;
}

// ── Variants ──
export const variants = [
  {
    label: "Default (page 1)",
    render: () => buildPagination({ perPage: 10, currentPage: 1, totalItems: 102, disabledFirst: true, disabledLast: false })
  },
  {
    label: "Page intermédiaire",
    render: () => buildPagination({ perPage: 10, currentPage: 5, totalItems: 102, disabledFirst: false, disabledLast: false })
  },
  {
    label: "Dernière page",
    render: () => buildPagination({ perPage: 10, currentPage: 11, totalItems: 102, disabledFirst: false, disabledLast: true })
  }
];

// ── Interactive script ──
export const script = (container) => {
  container.querySelectorAll('.pagination').forEach(pag => {
    let page = parseInt(pag.dataset.page);
    let perPage = parseInt(pag.dataset.perPage);
    const total = parseInt(pag.dataset.total);

    function totalPages() {
      return Math.ceil(total / perPage);
    }

    function update() {
      const tp = totalPages();
      if (page < 1) page = 1;
      if (page > tp) page = tp;

      const start = (page - 1) * perPage + 1;
      const end = Math.min(page * perPage, total);
      pag.querySelector('.pagination__range').textContent = `${start}-${end} of ${total}`;

      const isFirst = page === 1;
      const isLast = page >= tp;
      pag.querySelector('.pagination__btn--first').disabled = isFirst;
      pag.querySelector('.pagination__btn--prev').disabled = isFirst;
      pag.querySelector('.pagination__btn--next').disabled = isLast;
      pag.querySelector('.pagination__btn--last').disabled = isLast;

      pag.dataset.page = page;
      pag.dataset.perPage = perPage;
    }

    pag.querySelector('.pagination__btn--first').addEventListener('click', () => { page = 1; update(); });
    pag.querySelector('.pagination__btn--prev').addEventListener('click', () => { page--; update(); });
    pag.querySelector('.pagination__btn--next').addEventListener('click', () => { page++; update(); });
    pag.querySelector('.pagination__btn--last').addEventListener('click', () => { page = totalPages(); update(); });

    // Custom select dropdown
    const selectWrap = pag.querySelector('.pagination__select-wrap');
    const selectTrigger = pag.querySelector('.pagination__select-trigger');

    selectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other open dropdowns
      document.querySelectorAll('.pagination__select-wrap--open').forEach(el => {
        if (el !== selectWrap) el.classList.remove('pagination__select-wrap--open');
      });
      selectWrap.classList.toggle('pagination__select-wrap--open');
    });

    pag.querySelectorAll('.pagination__dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        perPage = parseInt(item.dataset.value);
        page = 1;
        selectTrigger.textContent = perPage;
        // Update selected state
        pag.querySelectorAll('.pagination__dropdown-item').forEach(i => i.classList.remove('pagination__dropdown-item--selected'));
        item.classList.add('pagination__dropdown-item--selected');
        selectWrap.classList.remove('pagination__select-wrap--open');
        update();
      });
    });
  });

  // Close dropdown on click outside
  document.addEventListener('click', () => {
    container.querySelectorAll('.pagination__select-wrap--open').forEach(el => {
      el.classList.remove('pagination__select-wrap--open');
    });
  });
};
