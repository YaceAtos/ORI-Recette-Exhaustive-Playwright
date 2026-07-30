// ══════════════════════════════════════════════════
// Button
// ══════════════════════════════════════════════════

export const name = "Button";
export const description = "Bouton d'action. 4 types (Filled, Tonal, Outlined, Ghost), 3 tailles (sm, md, lg), avec icônes optionnelles.";

// ── Icône par défaut (poubelle) pour la démo ──
const mi = (name, size = 16, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_TRASH = mi('delete', 16, 'btn__icon');
const ICON_TRASH_20 = mi('delete', 20, 'btn__icon btn__icon--lg');

// ── CSS ──
export const styles = `
  /* ── Button base ── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    letter-spacing: 0;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    transition: background-color 0.15s, box-shadow 0.15s, border-color 0.15s;
    outline: none;
    white-space: nowrap;
    vertical-align: middle;
  }

  /* State layer overlay */
  .btn::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: transparent;
    transition: background 0.15s;
  }

  .btn__icon {
    flex-shrink: 0;
    display: block;
  }

  /* ── Sizes ── */
  .btn--sm {
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    line-height: 20px;
  }

  .btn--md {
    height: 40px;
    padding: 0 16px;
    font-size: 16px;
    line-height: 24px;
  }

  .btn--lg {
    height: 44px;
    padding: 0 18px;
    font-size: 16px;
    line-height: 24px;
  }

  .btn--sm .btn__icon { width: 16px; height: 16px; }
  .btn--md .btn__icon { width: 16px; height: 16px; }
  .btn--lg .btn__icon { width: 20px; height: 20px; }

  /* ── Filled ── */
  .btn--filled {
    background: #013aba;
    color: #ffffff;
  }

  .btn--filled:hover::after {
    background: rgba(255, 255, 255, 0.08);
  }

  .btn--filled:focus-visible::after {
    background: rgba(255, 255, 255, 0.10);
  }

  .btn--filled:active::after {
    background: rgba(255, 255, 255, 0.10);
  }

  .btn--filled:disabled {
    background: rgba(29, 32, 36, 0.12);
    color: rgba(29, 32, 36, 0.38);
    cursor: default;
  }

  .btn--filled:disabled::after {
    display: none;
  }

  /* ── Tonal ── */
  .btn--tonal {
    background: #eaf0ff;
    color: #263f7a;
  }

  .btn--tonal:hover::after {
    background: rgba(38, 63, 122, 0.08);
  }

  .btn--tonal:focus-visible::after {
    background: rgba(38, 63, 122, 0.10);
  }

  .btn--tonal:active::after {
    background: rgba(38, 63, 122, 0.10);
  }

  .btn--tonal:disabled {
    background: rgba(234, 240, 255, 1);
    color: rgba(38, 63, 122, 0.38);
    cursor: default;
  }

  .btn--tonal:disabled::after {
    display: none;
  }

  /* ── Outlined ── */
  .btn--outlined {
    background: transparent;
    color: #48546d;
    box-shadow: inset 0 0 0 1px #dee2e9;
  }

  .btn--outlined:hover::after {
    background: rgba(38, 63, 122, 0.08);
  }

  .btn--outlined:focus-visible::after {
    background: rgba(38, 63, 122, 0.10);
  }

  .btn--outlined:active::after {
    background: rgba(38, 63, 122, 0.10);
  }

  .btn--outlined:disabled {
    color: rgba(72, 84, 109, 0.38);
    box-shadow: inset 0 0 0 1px rgba(222, 226, 233, 0.38);
    cursor: default;
  }

  .btn--outlined:disabled::after {
    display: none;
  }

  /* ── Ghost ── */
  .btn--ghost {
    background: transparent;
    color: #013aba;
  }

  .btn--ghost:hover::after {
    background: rgba(38, 63, 122, 0.08);
  }

  .btn--ghost:focus-visible::after {
    background: rgba(38, 63, 122, 0.10);
  }

  .btn--ghost:active::after {
    background: rgba(38, 63, 122, 0.10);
  }

  .btn--ghost:disabled {
    color: rgba(29, 32, 36, 0.38);
    cursor: default;
  }

  .btn--ghost:disabled::after {
    display: none;
  }

  /* ── Variant grid helpers ── */
  .btn-state-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .btn-state-label {
    font-size: 11px;
    color: #8e96a3;
    width: 60px;
    flex-shrink: 0;
  }

  .btn-size-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .btn .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Fonction pour générer un bouton ──
function btn({ type = "filled", size = "sm", label = "Label", iconLeft = null, iconRight = null, disabled = false } = {}) {
  const cls = `btn btn--${type} btn--${size}`;
  const disabledAttr = disabled ? "disabled" : "";
  const leftIcon = iconLeft || "";
  const rightIcon = iconRight || "";

  return `<button class="${cls}" ${disabledAttr}>${leftIcon}<span>${label}</span>${rightIcon}</button>`;
}

// ── Helpers pour les démos ──
function sizeRow(type) {
  return `
    <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
      ${btn({ type, size: "sm", iconLeft: ICON_TRASH, iconRight: ICON_TRASH })}
      ${btn({ type, size: "md", iconLeft: ICON_TRASH, iconRight: ICON_TRASH })}
      ${btn({ type, size: "lg", iconLeft: ICON_TRASH_20, iconRight: ICON_TRASH_20 })}
      ${btn({ type, size: "sm", iconLeft: ICON_TRASH, iconRight: ICON_TRASH, disabled: true })}
    </div>
  `;
}

// ── Variants exportées ──
export const variants = [
  {
    label: "Filled",
    description: "Bouton principal. Fond bleu #013aba, texte blanc.",
    render: () => sizeRow("filled"),
  },
  {
    label: "Tonal",
    description: "Bouton secondaire. Fond #eaf0ff, texte #263f7a.",
    render: () => sizeRow("tonal"),
  },
  {
    label: "Outlined",
    description: "Bouton avec bordure. Fond transparent, texte #48546d, border #dee2e9.",
    render: () => sizeRow("outlined"),
  },
  {
    label: "Ghost",
    description: "Bouton sans fond ni bordure. Texte #013aba.",
    render: () => sizeRow("ghost"),
  },
];
