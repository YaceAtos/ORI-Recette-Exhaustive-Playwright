// ══════════════════════════════════════════════════
// Segmented Control
// ══════════════════════════════════════════════════

export const name = "Segmented Control";
export const description = "Barre de boutons segmentés. Le bouton actif prend un fond bleu. Nombre de segments libre, taille adaptée au contenu.";

// ── CSS ──
export const styles = `
  .segmented {
    display: inline-flex;
    align-items: stretch;
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    height: 40px;
    border: 1px solid #dee2e9;
    font-family: 'Inter', sans-serif;
  }

  .segmented__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 32px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    color: #1d2024;
    background: transparent;
    border: none;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background-color 0.15s, color 0.15s;
    outline: none;
  }

  /* Divider entre les items */
  .segmented__item + .segmented__item::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #dee2e9;
  }

  /* Pas de divider à côté de l'item actif */
  .segmented__item--active + .segmented__item::before,
  .segmented__item--active::before {
    background: transparent;
  }

  .segmented__item:hover:not(.segmented__item--active) {
    background: rgba(38, 63, 122, 0.04);
  }

  .segmented__item:focus-visible {
    box-shadow: inset 0 0 0 2px #013aba;
    border-radius: 0;
  }

  .segmented__item--active {
    background: #eaf0ff;
    color: #263f7a;
  }
`;

// ── Fonction de rendu ──
function segmented({ items = ["Input", "Un texte un peu long", "Input"], activeIndex = 0 } = {}) {
  const buttons = items.map((label, i) => {
    const active = i === activeIndex ? " segmented__item--active" : "";
    return `<button class="segmented__item${active}" data-index="${i}">${label}</button>`;
  }).join("");

  return `<div class="segmented">${buttons}</div>`;
}

// ── Script d'interactivité ──
export const script = `
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".segmented__item");
    if (!item) return;
    const parent = item.closest(".segmented");
    parent.querySelectorAll(".segmented__item").forEach(el => el.classList.remove("segmented__item--active"));
    item.classList.add("segmented__item--active");
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "3 segments",
    description: "Cas standard avec 3 boutons.",
    render: () => segmented(),
  },
  {
    label: "5 segments",
    description: "Exemple avec plus d'options.",
    render: () => segmented({ items: ["Jour", "Semaine", "Mois", "Trimestre", "Année"], activeIndex: 1 }),
  },
  {
    label: "2 segments",
    description: "Toggle binaire.",
    render: () => segmented({ items: ["Interventions", "Clients"], activeIndex: 0 }),
  },
];
