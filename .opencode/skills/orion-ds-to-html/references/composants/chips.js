// ══════════════════════════════════════════════════
// Chips
// ══════════════════════════════════════════════════

export const name = "Chips";
export const description = "Chip sélectionnable avec icône contextuelle à gauche. Fond tonal (#eaf0ff) par défaut, fond bleu (#013aba) quand sélectionné. Croix à droite optionnelle pour supprimer le chip d'une liste. 4 états (default, hover, focus, disabled).";

// ── Icônes (Material Symbols) ──
const mi = (name, size = 16, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_CALENDAR = mi('calendar_today', 16, 'chip__icon');
const ICON_PERSON = mi('person', 16, 'chip__icon');
const ICON_LOCATION = mi('location_on', 16, 'chip__icon');
const ICON_TAG = mi('sell', 16, 'chip__icon');
const ICON_CLOSE = mi('close', 16, 'chip__close-icon');

// ── CSS ──
export const styles = `
  /* ── Base ── */
  .chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 30px;
    padding: 6px 8px;
    border-radius: 16px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    border: none;
    outline: none;
    position: relative;
    overflow: hidden;
    transition: background-color 0.15s;
  }

  /* State layer */
  .chip::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: transparent;
    transition: background 0.15s;
  }

  /* ── Non sélectionné ── */
  .chip--default {
    background: #eaf0ff;
    color: #263f7a;
  }

  .chip--default .chip__icon,
  .chip--default .chip__close-icon {
    color: #263f7a;
  }

  .chip--default:hover::after {
    background: rgba(38, 63, 122, 0.08);
  }

  .chip--default:focus-visible::after {
    background: rgba(38, 63, 122, 0.10);
  }

  /* ── Sélectionné ── */
  .chip--selected {
    background: #013aba;
    color: #ffffff;
  }

  .chip--selected .chip__icon,
  .chip--selected .chip__close-icon {
    color: #ffffff;
  }

  .chip--selected:hover::after {
    background: rgba(255, 255, 255, 0.08);
  }

  .chip--selected:focus-visible::after {
    background: rgba(255, 255, 255, 0.10);
  }

  /* ── Disabled ── */
  .chip--disabled {
    background: rgba(29, 32, 36, 0.10);
    color: #1d2024;
    opacity: 0.38;
    cursor: default;
    pointer-events: none;
  }

  .chip--disabled .chip__icon,
  .chip--disabled .chip__close-icon {
    color: #1d2024;
  }

  .chip--disabled::after {
    display: none;
  }

  /* ── Icône contextuelle (gauche) ── */
  .chip__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: block;
  }

  /* ── Bouton close (droite) ── */
  .chip__close {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    outline: none;
    transition: opacity 0.15s;
  }

  .chip__close:hover {
    opacity: 0.7;
  }

  .chip__close-icon {
    width: 16px;
    height: 16px;
    display: block;
    color: inherit;
  }

  /* ── Texte ── */
  .chip__text {
    padding: 0 4px;
    text-align: center;
  }

  /* ── Helpers démo ── */
  .chip-demo-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .chip-demo-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .chip .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Fonction de rendu ──
function chip({
  label = "Label",
  selected = false,
  disabled = false,
  icon = null,
  removable = false,
} = {}) {
  let cls = "chip";
  if (disabled) {
    cls += " chip--disabled";
  } else if (selected) {
    cls += " chip--selected";
  } else {
    cls += " chip--default";
  }

  const iconHtml = icon || "";
  const closeHtml = removable
    ? `<button class="chip__close" type="button" aria-label="Supprimer">${ICON_CLOSE}</button>`
    : "";

  return `<div class="${cls}">
    ${iconHtml}<span class="chip__text">${label}</span>${closeHtml}
  </div>`;
}

// ── Script d'interactivité ──
export const script = `
  document.addEventListener("click", (e) => {
    // Clic sur la croix → supprimer le chip
    const closeBtn = e.target.closest(".chip__close");
    if (closeBtn) {
      const chipEl = closeBtn.closest(".chip");
      if (chipEl) {
        chipEl.style.transition = "opacity 0.15s, transform 0.15s";
        chipEl.style.opacity = "0";
        chipEl.style.transform = "scale(0.9)";
        setTimeout(() => chipEl.remove(), 150);
      }
      return;
    }

    // Clic sur le chip → toggle sélection
    const chipEl = e.target.closest(".chip");
    if (!chipEl || chipEl.classList.contains("chip--disabled")) return;
    chipEl.classList.toggle("chip--selected");
    chipEl.classList.toggle("chip--default");
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "Default — avec icône",
    description: "Chips avec icône contextuelle à gauche pour illustrer le contenu.",
    render: () => `<div class="chip-demo-row">
      ${chip({ label: "Aujourd'hui", icon: ICON_CALENDAR })}
      ${chip({ label: "Intervenant", icon: ICON_PERSON })}
      ${chip({ label: "Secteur", icon: ICON_LOCATION })}
      ${chip({ label: "Catégorie", icon: ICON_TAG })}
    </div>`,
  },
  {
    label: "Sélectionné",
    description: "Chips sélectionnés. Fond bleu #013aba, texte et icône blancs.",
    render: () => `<div class="chip-demo-row">
      ${chip({ label: "Aujourd'hui", icon: ICON_CALENDAR, selected: true })}
      ${chip({ label: "Intervenant", icon: ICON_PERSON, selected: true })}
      ${chip({ label: "Secteur", icon: ICON_LOCATION, selected: true })}
    </div>`,
  },
  {
    label: "Sans icône",
    description: "Chips texte seul, sans icône contextuelle.",
    render: () => `<div class="chip-demo-row">
      ${chip({ label: "Lundi" })}
      ${chip({ label: "Mardi" })}
      ${chip({ label: "Mercredi", selected: true })}
    </div>`,
  },
  {
    label: "Liste — removable",
    description: "Chips dans une liste éditable. Croix à droite pour supprimer un élément. Cliquer la croix retire le chip.",
    render: () => `<div class="chip-demo-row">
      ${chip({ label: "HENRI, Bernard", icon: ICON_PERSON, removable: true })}
      ${chip({ label: "KEULEYAN, Luc", icon: ICON_PERSON, removable: true })}
      ${chip({ label: "POIRE, Pomme", icon: ICON_PERSON, removable: true })}
      ${chip({ label: "Paris 15e", icon: ICON_LOCATION, removable: true })}
    </div>`,
  },
  {
    label: "Disabled",
    description: "Chips désactivés, opacité réduite, non interactifs.",
    render: () => `<div class="chip-demo-row">
      ${chip({ label: "Inactif", icon: ICON_TAG, disabled: true })}
      ${chip({ label: "Supprimé", icon: ICON_PERSON, disabled: true, removable: true })}
    </div>`,
  },
];
