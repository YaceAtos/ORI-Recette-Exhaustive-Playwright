// ══════════════════════════════════════════════════
// Row Item
// ══════════════════════════════════════════════════

export const name = "Row Item";
export const description = "Cellule de tableau. 6 types (Default, Expandable, Tag, Icon, Checkbox, User) avec état hover. Le type Expandable supporte 7 niveaux d'indentation.";

// ── Icônes (Material Symbols) ──
const mi = (name, size = 16, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_CHEVRON_RIGHT = mi('chevron_right', 16, 'ri__chevron');
const ICON_WORKSPACES = mi('workspaces', 16, 'ri__icon-sm');
const ICON_INFO = mi('info', 16, 'ri__icon-sm');
const ICON_MORE_VERT = mi('more_vert', 24, 'ri__icon-action');

// ── CSS ──
export const styles = `
  /* ── Row Item base ── */
  .ri {
    display: flex;
    align-items: center;
    font-family: 'Inter', sans-serif;
    border-bottom: 1px solid #dee2e9;
    background: #ffffff;
    transition: background-color 0.15s;
    box-sizing: border-box;
  }

  .ri:hover {
    background: #eaf0ff;
  }

  /* ── Types ── */

  /* Default */
  .ri--default {
    padding: 14px 16px;
    gap: 12px;
    width: 100px;
  }

  /* Expandable */
  .ri--expandable {
    padding: 14px 16px;
    gap: 8px;
    cursor: pointer;
  }

  /* Niveaux d'indentation (padding-left) */
  .ri--level-1 { padding-left: 16px; }
  .ri--level-2 { padding-left: 40px; }
  .ri--level-3 { padding-left: 64px; }
  .ri--level-4 { padding-left: 88px; }
  .ri--level-5 { padding-left: 112px; }
  .ri--level-6 { padding-left: 136px; }
  .ri--level-7 { padding-left: 160px; }

  /* Tag */
  .ri--tag {
    padding: 12px 16px;
    gap: 16px;
    width: 100px;
  }

  /* Icon */
  .ri--icon {
    padding: 6px 14px;
    height: 48px;
    width: 64px;
    justify-content: flex-end;
  }

  /* Checkbox */
  .ri--checkbox {
    padding: 4px 14px;
    justify-content: flex-end;
  }

  /* User */
  .ri--user {
    padding: 0 14px;
    height: 48px;
    gap: 8px;
  }

  /* ── Texte ── */
  .ri__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    color: #48546d;
    white-space: nowrap;
  }

  /* ── Chevron expandable ── */
  .ri__chevron {
    width: 16px;
    height: 16px;
    color: #48546d;
    flex-shrink: 0;
    transition: transform 0.2s;
  }

  .ri--expanded .ri__chevron {
    transform: rotate(90deg);
  }

  /* ── Icône small (workspaces, info) ── */
  .ri__icon-sm {
    width: 16px;
    height: 16px;
    color: #48546d;
    flex-shrink: 0;
  }

  /* ── Icône action (3 dots) ── */
  .ri__icon-action {
    width: 24px;
    height: 24px;
    color: #48546d;
    flex-shrink: 0;
  }

  /* ── Contenu expandable (icône + texte + tag + numéro) ── */
  .ri__content {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* ── Tag inline ── */
  .ri__tag {
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

  .ri__tag .ri__icon-sm {
    color: #150792;
  }

  /* ── Tags container ── */
  .ri__tags {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Numéro (texte tertiaire) ── */
  .ri__number {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #a4a7ae;
    white-space: nowrap;
  }

  /* ── Checkbox ── */
  .ri__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    cursor: pointer;
  }

  .ri__checkbox-box {
    width: 16px;
    height: 16px;
    border: 1px solid #48546d;
    border-radius: 2px;
    background: transparent;
    transition: background 0.15s, border-color 0.15s;
    position: relative;
  }

  .ri__checkbox-box--checked {
    background: #013aba;
    border-color: #013aba;
  }

  .ri__checkbox-box--checked::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 5px;
    width: 4px;
    height: 8px;
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  /* ── Profile picture (User) ── */
  .ri__avatar {
    width: 30px;
    height: 30px;
    border-radius: 100px;
    background: #ccdcff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .ri__avatar-initials {
    font-size: 12px;
    font-weight: 700;
    line-height: 16px;
    color: #0c3289;
    letter-spacing: 0;
  }

  /* ── Icon placeholder (pour le type Icon) ── */
  .ri__icon-placeholder {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    background: #eaf0ff;
  }

  /* ── Helpers démo ── */
  .ri-demo-row {
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }

  .ri-demo-col {
    display: flex;
    flex-direction: column;
  }

  .ri-demo-col--label {
    font-size: 11px;
    font-weight: 600;
    color: #86868b;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 8px;
  }

  .ri .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Fonctions de rendu ──

function rowItemDefault({ text = "Item" } = {}) {
  return `<div class="ri ri--default">
    <span class="ri__text">${text}</span>
  </div>`;
}

function rowItemExpandable({ text = "Item", level = 1, tag = null, number = null, expanded = false } = {}) {
  const cls = `ri ri--expandable ri--level-${level}${expanded ? " ri--expanded" : ""}`;
  const tagHtml = tag ? `<div class="ri__tags"><span class="ri__tag">${ICON_INFO}<span>${tag}</span></span></div>` : "";
  const numberHtml = number ? `<span class="ri__number">${number}</span>` : "";

  return `<div class="${cls}">
    ${ICON_CHEVRON_RIGHT}
    <div class="ri__content">
      ${ICON_WORKSPACES}
      <span class="ri__text">${text}</span>
      ${tagHtml}
      ${numberHtml}
    </div>
  </div>`;
}

function rowItemTag({ label = "Label" } = {}) {
  return `<div class="ri ri--tag">
    <span class="ri__tag">${ICON_INFO}<span>${label}</span></span>
  </div>`;
}

function rowItemIcon() {
  return `<div class="ri ri--icon">
    <div class="ri__icon-placeholder"></div>
  </div>`;
}

function rowItemCheckbox({ checked = false } = {}) {
  const checkedCls = checked ? " ri__checkbox-box--checked" : "";
  return `<div class="ri ri--checkbox">
    <div class="ri__checkbox">
      <div class="ri__checkbox-box${checkedCls}"></div>
    </div>
  </div>`;
}

function rowItemUser({ initials = "PN", text = "Item" } = {}) {
  return `<div class="ri ri--user">
    <div class="ri__avatar">
      <span class="ri__avatar-initials">${initials}</span>
    </div>
    <span class="ri__text">${text}</span>
  </div>`;
}

// ── Script d'interactivité ──
export const script = `
  document.addEventListener("click", (e) => {
    // Expandable : toggle chevron
    const expandable = e.target.closest(".ri--expandable");
    if (expandable) {
      expandable.classList.toggle("ri--expanded");
      return;
    }

    // Checkbox : toggle
    const checkbox = e.target.closest(".ri__checkbox");
    if (checkbox) {
      const box = checkbox.querySelector(".ri__checkbox-box");
      if (box) box.classList.toggle("ri__checkbox-box--checked");
    }
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "Expandable — 7 niveaux",
    description: "Cellule avec chevron, icône et texte. Indentation progressive par niveau (1 à 7).",
    render: () => `<div class="ri-demo-col" style="width: 340px;">
      ${[1, 2, 3, 4, 5, 6, 7].map(l => rowItemExpandable({ text: "Item", level: l })).join("")}
    </div>`,
  },
  {
    label: "Expandable — avec tag",
    description: "Cellule expandable avec un tag inline.",
    render: () => `<div class="ri-demo-col" style="width: 340px;">
      ${rowItemExpandable({ text: "Item", level: 2, tag: "Label" })}
      ${rowItemExpandable({ text: "Item", level: 3, tag: "Label", number: "Num\u00e9ro" })}
    </div>`,
  },
  {
    label: "Default",
    description: "Cellule texte simple, sans icône ni chevron.",
    render: () => `<div class="ri-demo-col">
      ${rowItemDefault()}
      ${rowItemDefault({ text: "Valeur longue" })}
    </div>`,
  },
  {
    label: "Tag",
    description: "Cellule contenant uniquement un tag.",
    render: () => `<div class="ri-demo-col">
      ${rowItemTag()}
      ${rowItemTag({ label: "Actif" })}
    </div>`,
  },
  {
    label: "Icon",
    description: "Cellule avec une zone d'icône/action.",
    render: () => `<div class="ri-demo-col">
      ${rowItemIcon()}
      ${rowItemIcon()}
    </div>`,
  },
  {
    label: "Checkbox",
    description: "Cellule avec case à cocher. Cliquer pour toggle.",
    render: () => `<div class="ri-demo-col">
      ${rowItemCheckbox()}
      ${rowItemCheckbox({ checked: true })}
    </div>`,
  },
  {
    label: "User",
    description: "Cellule avec avatar (initiales) et nom.",
    render: () => `<div class="ri-demo-col">
      ${rowItemUser()}
      ${rowItemUser({ initials: "BH", text: "HENRI, Bernard" })}
    </div>`,
  },
];
