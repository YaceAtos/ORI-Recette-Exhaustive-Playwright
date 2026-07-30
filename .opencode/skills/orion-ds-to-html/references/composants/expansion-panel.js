// ══════════════════════════════════════════════════
// Expansion Panel
// ══════════════════════════════════════════════════

export const name = "Expansion Panel";
export const description = "Panneau dépliable avec header cliquable. Supporte titre, description, tag, toggle, composant custom dans le header, et zone d'action avec bouton.";

// ── Icônes (Material Symbols) ──
const mi = (name, size = 24, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_CHEVRON_DOWN = mi('expand_more', 24, 'ep__chevron-icon');
const ICON_CHEVRON_UP = mi('expand_less', 24, 'ep__chevron-icon');
const ICON_ACCOUNT = mi('account_circle', 24, 'ep__header-icon');

// ── CSS ──
export const styles = `
  /* ── Container ── */
  .ep {
    position: relative;
    width: 400px;
    border-radius: 6px;
    background: #ffffff;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  /* ── Header ── */
  .ep__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 12px 12px 12px 24px;
    cursor: pointer;
    position: relative;
    user-select: none;
    outline: none;
  }

  /* State layer */
  .ep__header::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: transparent;
    transition: background 0.15s;
  }

  .ep__header:hover::after {
    background: rgba(29, 32, 36, 0.08);
  }

  .ep__header:focus-visible::after {
    background: rgba(29, 32, 36, 0.10);
  }

  /* ── Header left ── */
  .ep__header-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ep__title {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0;
    color: #1d2024;
    white-space: nowrap;
  }

  .ep__description {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    color: #535862;
    white-space: nowrap;
  }

  /* ── Tag ── */
  .ep__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 4px 6px;
    border-radius: 6px;
    background: #e0e7ff;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #150792;
    white-space: nowrap;
  }

  .ep--disabled .ep__tag {
    background: #e6e8eb;
    color: #1d2024;
  }

  /* ── Header right (actions) ── */
  .ep__header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Toggle ── */
  .ep__toggle {
    position: relative;
    width: 40px;
    height: 22px;
    border-radius: 40px;
    background: #dcdfe3;
    padding: 2px;
    cursor: pointer;
    border: none;
    outline: none;
    flex-shrink: 0;
  }

  .ep__toggle--active {
    background: #013aba;
  }

  .ep__toggle-handle {
    position: absolute;
    top: 3px;
    left: 4px;
    width: 16px;
    height: 16px;
    border-radius: 999px;
    background: #ffffff;
    transition: left 0.2s;
  }

  .ep__toggle--active .ep__toggle-handle {
    left: 20px;
  }

  /* ── Component slot dans le header ── */
  .ep__header-component {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ep__header-icon {
    width: 24px;
    height: 24px;
    color: #535862;
  }

  /* ── Chevron ── */
  .ep__chevron {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .ep__chevron-icon {
    width: 24px;
    height: 24px;
    color: #535862;
    transition: transform 0.2s;
  }

  .ep--open .ep__chevron-icon {
    transform: rotate(180deg);
  }

  /* ── Divider ── */
  .ep__divider {
    height: 1px;
    width: 100%;
    background: #dee2e9;
  }

  /* ── Content ── */
  .ep__content {
    padding: 16px 24px;
    font-size: 14px;
    line-height: 20px;
    color: #535862;
  }

  .ep__body {
    display: none;
  }

  .ep--open .ep__body {
    display: block;
  }

  /* ── Action area ── */
  .ep__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 16px 16px 16px 24px;
  }

  .ep__actions-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Action button (reprend le style filled sm du DS) ── */
  .ep__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 36px;
    padding: 0 14px;
    border: none;
    border-radius: 4px;
    background: #013aba;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    outline: none;
    transition: background-color 0.15s;
  }

  .ep__btn::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: transparent;
    transition: background 0.15s;
  }

  .ep__btn:hover::after {
    background: rgba(255, 255, 255, 0.08);
  }

  .ep__btn:focus-visible::after {
    background: rgba(255, 255, 255, 0.10);
  }

  /* ── Disabled ── */
  .ep--disabled {
    opacity: 0.38;
    pointer-events: none;
  }

  .ep--disabled .ep__header {
    cursor: default;
  }

  .ep--disabled .ep__header::after {
    display: none;
  }

  .ep .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  }
`;

// ── Fonction de rendu ──
function expansionPanel({
  title = "Title",
  description = null,
  tag = null,
  toggle = false,
  toggleActive = false,
  headerComponent = null,
  open = false,
  showButton = true,
  buttonLabel = "Label",
  content = "Contenu du panneau déplié. Vous pouvez y mettre n'importe quel contenu.",
  disabled = false,
} = {}) {
  const rootCls = `ep${open ? " ep--open" : ""}${disabled ? " ep--disabled" : ""}`;

  // Header left
  const tagHtml = tag ? `<span class="ep__tag">${tag}</span>` : "";
  const descHtml = description ? `<span class="ep__description">${description}</span>` : "";

  // Header right
  const toggleHtml = toggle
    ? `<button class="ep__toggle${toggleActive ? " ep__toggle--active" : ""}" aria-label="Toggle">
        <span class="ep__toggle-handle"></span>
      </button>`
    : "";

  const componentHtml = headerComponent
    ? `<div class="ep__header-component">${headerComponent}</div>`
    : "";

  const chevronHtml = `<span class="ep__chevron">${ICON_CHEVRON_DOWN}</span>`;

  // Body
  const bodyHtml = `
    <div class="ep__body">
      <div class="ep__divider"></div>
      <div class="ep__content">${content}</div>
      ${showButton ? `
        <div class="ep__divider"></div>
        <div class="ep__actions">
          <div class="ep__actions-group">
            <button class="ep__btn">${buttonLabel}</button>
          </div>
        </div>
      ` : ""}
    </div>
  `;

  return `
    <div class="${rootCls}">
      <div class="ep__header" tabindex="0" role="button" aria-expanded="${open}">
        <div class="ep__header-left">
          <span class="ep__title">${title}</span>
          ${tagHtml}
          ${descHtml}
        </div>
        <div class="ep__header-right">
          ${toggleHtml}
          ${componentHtml}
          ${chevronHtml}
        </div>
      </div>
      ${bodyHtml}
    </div>
  `;
}

// ── Script d'interactivité ──
export const script = `
  document.addEventListener("click", (e) => {
    // Toggle switch — traité en priorité, ne doit PAS ouvrir le panel
    const toggle = e.target.closest(".ep__toggle");
    if (toggle) {
      e.stopPropagation();
      toggle.classList.toggle("ep__toggle--active");
      return;
    }

    // Toggle open/close
    const header = e.target.closest(".ep__header");
    if (header) {
      const panel = header.closest(".ep");
      if (panel.classList.contains("ep--disabled")) return;
      panel.classList.toggle("ep--open");
      const expanded = panel.classList.contains("ep--open");
      header.setAttribute("aria-expanded", expanded);
      return;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const header = e.target.closest(".ep__header");
      if (header) {
        e.preventDefault();
        header.click();
      }
    }
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "Fermé — défaut",
    description: "Panel fermé, état par défaut avec titre seul.",
    render: () => expansionPanel(),
  },
  {
    label: "Ouvert — avec bouton",
    description: "Panel ouvert avec zone de contenu et bouton d'action.",
    render: () => expansionPanel({ open: true, buttonLabel: "Valider" }),
  },
  {
    label: "Ouvert — sans bouton",
    description: "Panel ouvert sans zone d'action.",
    render: () => expansionPanel({ open: true, showButton: false }),
  },
  {
    label: "Avec tag",
    description: "Panel fermé avec un tag à côté du titre.",
    render: () => expansionPanel({ tag: "Nouveau" }),
  },
  {
    label: "Avec description",
    description: "Panel fermé avec texte de description.",
    render: () => expansionPanel({ description: "Description text" }),
  },
  {
    label: "Avec tag + description",
    description: "Panel fermé avec tag et description combinés.",
    render: () => expansionPanel({ tag: "APA", description: "3 interventions" }),
  },
  {
    label: "Avec toggle",
    description: "Panel avec un slide toggle dans le header.",
    render: () => expansionPanel({ toggle: true }),
  },
  {
    label: "Avec toggle actif",
    description: "Panel avec le toggle activé.",
    render: () => expansionPanel({ toggle: true, toggleActive: true }),
  },
  {
    label: "Avec composant header",
    description: "Panel avec un tag et une icône custom dans la zone droite du header.",
    render: () => expansionPanel({
      headerComponent: `<span class="ep__tag">Label</span>${ICON_ACCOUNT}`,
    }),
  },
  {
    label: "Disabled",
    description: "Panel désactivé, non interactif.",
    render: () => expansionPanel({ disabled: true }),
  },
  {
    label: "Complet — ouvert",
    description: "Toutes les options activées : tag, description, toggle, composant header, bouton.",
    render: () => expansionPanel({
      tag: "PCH",
      description: "5 occurrences",
      toggle: true,
      toggleActive: true,
      headerComponent: `<span class="ep__tag">Label</span>${ICON_ACCOUNT}`,
      open: true,
      buttonLabel: "Enregistrer",
    }),
  },
];
