// ══════════════════════════════════════════════════
// Search Bar
// ══════════════════════════════════════════════════
// Label flottant : centré quand vide + pas focus, en haut quand focus ou rempli
// Dropdown avec autocompletion et sélection

export const name = "Search Bar";
export const description = "Barre de recherche avec autocomplétion. Label flottant, dropdown filtrable, sélection d'item.";

// ── Icônes (Material Symbols) ──
const mi = (name, size = 16, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_SEARCH = mi('search', 16, 'sbar__icon');
const ICON_CHECK = mi('check', 16, 'sbar__check');

// ── CSS ──
export const styles = `
  /* ══ Search Bar ══ */
  .sbar {
    position: relative;
    width: 100%;
    font-family: 'Inter', sans-serif;
  }

  /* ── Input wrapper ── */
  .sbar__wrapper {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    background: #ffffff;
    border: 1px solid #7381a2;
    border-radius: 6px;
    transition: border-color 0.15s;
    cursor: text;
  }

  .sbar__wrapper:hover {
    border-color: #1d2024;
  }

  /* ── Label ── */
  .sbar__label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #48546d;
    pointer-events: none;
    transition: all 0.15s ease;
    background: transparent;
    padding: 0;
  }

  /* Label flottant : quand focus OU quand il y a une valeur */
  .sbar--float .sbar__label {
    top: 0;
    transform: translateY(-50%);
    font-size: 12px;
    line-height: 16px;
    padding: 0 4px;
    background: #ffffff;
    left: 12px;
  }

  .sbar--focus .sbar__label {
    color: #013aba;
  }

  /* ── Input ── */
  .sbar__input {
    flex: 1;
    min-width: 0;
    height: 38px;
    padding: 0 0 0 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    color: #1d2024;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    border-radius: 6px;
  }

  .sbar__input::placeholder {
    color: transparent;
  }

  /* ── Trailing icon ── */
  .sbar__trailing {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 38px;
    color: #717680;
    pointer-events: none;
  }

  .sbar__icon {
    width: 16px;
    height: 16px;
  }

  /* ── Focus state ── */
  .sbar--focus .sbar__wrapper {
    border: 2px solid #013aba;
  }

  .sbar--focus .sbar__wrapper:hover {
    border-color: #013aba;
  }

  .sbar--focus .sbar__input {
    height: 36px;
    padding-left: 15px;
  }

  .sbar--focus .sbar__trailing {
    height: 36px;
  }

  /* ── Dropdown ── */
  .sbar__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 6px;
    box-shadow:
      0 2px 4px -2px rgba(0, 0, 0, 0.06),
      0 4px 8px -2px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 10;
    display: none;
    max-height: 240px;
    overflow-y: auto;
  }

  .sbar--focus .sbar__dropdown {
    display: block;
  }

  .sbar__dropdown:empty {
    display: none;
  }

  /* ── Dropdown items ── */
  .sbar__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1d2024;
    cursor: pointer;
    transition: background-color 0.1s;
  }

  .sbar__item:hover {
    background: rgba(29, 32, 36, 0.08);
  }

  .sbar__item--selected {
    background: rgba(29, 32, 36, 0.04);
    font-weight: 500;
  }

  .sbar__item--selected:hover {
    background: rgba(29, 32, 36, 0.08);
  }

  .sbar__check {
    width: 16px;
    height: 16px;
    color: #013aba;
    flex-shrink: 0;
  }

  .sbar__item:not(.sbar__item--selected) .sbar__check {
    display: none;
  }

  /* ══ Demo ══ */
  .sbar-demo-label {
    font-size: 11px;
    font-weight: 500;
    color: #8e96a3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .sbar .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Données de démo ──
const DEMO_DATA = [
  "Lucas Bernard",
  "Léa Boiserie",
  "Marie Dupont",
  "Marcel Dupuis",
  "Sophie Martin",
  "Antoine Moreau",
];

// ── Fonction de rendu ──
function searchBar({ id = "" } = {}) {
  const sbId = id || `sb-${Math.random().toString(36).slice(2, 8)}`;

  const itemsHtml = DEMO_DATA.map(name =>
    `<div class="sbar__item" data-value="${name}">${name}${ICON_CHECK}</div>`
  ).join("");

  return `
    <div class="sbar" data-sbar-id="${sbId}">
      <div class="sbar__wrapper">
        <label class="sbar__label">Rechercher</label>
        <input class="sbar__input" type="text" autocomplete="off" />
        <div class="sbar__trailing">${ICON_SEARCH}</div>
      </div>
      <div class="sbar__dropdown">${itemsHtml}</div>
    </div>
  `;
}

// ── Script interactif ──
export const script = `
  // Focus : ouvrir dropdown, label flottant
  document.addEventListener("focusin", (e) => {
    const input = e.target.closest(".sbar__input");
    if (!input) return;
    const sb = input.closest(".sbar");
    sb.classList.add("sbar--focus", "sbar--float");
    filterDropdown(sb, input.value);
  });

  // Blur : fermer dropdown, label redescend si vide
  document.addEventListener("focusout", (e) => {
    const input = e.target.closest(".sbar__input");
    if (!input) return;
    const sb = input.closest(".sbar");
    // Delay pour laisser le click sur un item se déclencher
    setTimeout(() => {
      if (!sb.contains(document.activeElement)) {
        sb.classList.remove("sbar--focus");
        if (!input.value.trim()) {
          sb.classList.remove("sbar--float");
        }
      }
    }, 150);
  });

  // Saisie : filtrer la liste
  document.addEventListener("input", (e) => {
    const input = e.target.closest(".sbar__input");
    if (!input) return;
    const sb = input.closest(".sbar");
    filterDropdown(sb, input.value);
  });

  // Clic sur un item : sélectionner
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".sbar__item");
    if (!item) return;
    const sb = item.closest(".sbar");
    const input = sb.querySelector(".sbar__input");
    const value = item.dataset.value;

    // Toggle selected
    if (item.classList.contains("sbar__item--selected")) {
      item.classList.remove("sbar__item--selected");
      input.value = "";
      sb.classList.remove("sbar--float");
    } else {
      // Déselectionner les autres
      sb.querySelectorAll(".sbar__item--selected").forEach(el => el.classList.remove("sbar__item--selected"));
      item.classList.add("sbar__item--selected");
      input.value = value;
      sb.classList.add("sbar--float");
    }

    sb.classList.remove("sbar--focus");
    input.blur();
  });

  function filterDropdown(sb, query) {
    const items = sb.querySelectorAll(".sbar__item");
    const q = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.dataset.value.toLowerCase();
      item.style.display = (!q || text.includes(q)) ? "" : "none";
    });
  }
`;

// ── Variants ──
export const variants = [
  {
    label: "Interactive",
    description: "Cliquez dans le champ pour ouvrir. Tapez pour filtrer. Cliquez un résultat pour le sélectionner.",
    render: () => `<div style="width:320px;">${searchBar()}</div>`,
  },
];
