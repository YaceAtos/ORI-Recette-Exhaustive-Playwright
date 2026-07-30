// ══════════════════════════════════════════════════
// Tabs
// ══════════════════════════════════════════════════
// Onglets horizontaux. Le tab actif a un indicateur bleu en bas.

export const name = "Tabs";
export const description = "Onglets de navigation. Indicateur bleu sous le tab actif. Nombre de tabs libre.";

// ── CSS ──
export const styles = `
  /* ══ Tabs container ══ */
  .tabs {
    display: flex;
    align-items: stretch;
    background: #ffffff;
    font-family: 'Inter', sans-serif;
    border-bottom: 1px solid #dee2e9;
    width: fit-content;
  }

  /* ══ Tab item ══ */
  .tabs__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    color: #1d2024;
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    transition: background-color 0.1s;
    white-space: nowrap;
  }

  /* Hover */
  .tabs__item:hover {
    background: rgba(29, 32, 36, 0.08);
  }

  /* Focus */
  .tabs__item:focus-visible {
    background: rgba(29, 32, 36, 0.10);
  }

  /* ── Indicateur actif ── */
  .tabs__item::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 2px 2px 0 0;
    background: transparent;
    transition: background-color 0.15s;
  }

  .tabs__item--active::after {
    background: #0a359f;
  }

  .tabs__item--active:hover::after {
    background: #013aba;
  }
`;

// ── Script interactif ──
export const script = `
  document.addEventListener("click", (e) => {
    const tab = e.target.closest(".tabs__item");
    if (!tab) return;
    const parent = tab.closest(".tabs");
    parent.querySelectorAll(".tabs__item").forEach(el => el.classList.remove("tabs__item--active"));
    tab.classList.add("tabs__item--active");
  });
`;

// ── Fonction de rendu ──
function tabs({ items = ["Label", "Label", "Label"], activeIndex = 0 } = {}) {
  const tabsHtml = items.map((label, i) => {
    const active = i === activeIndex ? " tabs__item--active" : "";
    return `<button class="tabs__item${active}">${label}</button>`;
  }).join("");

  return `<div class="tabs">${tabsHtml}</div>`;
}

// ── Variants ──
export const variants = [
  {
    label: "3 onglets",
    description: "Cliquez pour changer d'onglet actif. Survolez pour le hover.",
    render: () => tabs({ items: ["Interventions", "Clients", "Planning"] }),
  },
  {
    label: "5 onglets",
    description: "Exemple avec plus d'onglets.",
    render: () => tabs({ items: ["Général", "Interventions", "Planning", "Documents", "Historique"], activeIndex: 2 }),
  },
  {
    label: "2 onglets",
    description: "Toggle simple.",
    render: () => tabs({ items: ["Détails", "Résumé"] }),
  },
];
