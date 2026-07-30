// ══════════════════════════════════════════════════
// Button Icon
// ══════════════════════════════════════════════════

export const name = "Button Icon";
export const description = "Bouton icône seul. 4 types (Filled, Tonal, Outlined, Ghost), 3 tailles (sm 36, md 40, lg 44). Icône Material Symbols interchangeable.";

// ── Icon helper ──
const mi = (name, size = 16, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;

// ── CSS ──
export const styles = `
  /* ── Button Icon base ── */
  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    transition: background-color 0.15s, box-shadow 0.15s, border-color 0.15s;
    outline: none;
    padding: 0;
    flex-shrink: 0;
  }

  /* State layer overlay */
  .btn-icon::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: transparent;
    transition: background 0.15s;
  }

  /* ── Sizes ── */
  .btn-icon--sm { width: 36px; height: 36px; }
  .btn-icon--md { width: 40px; height: 40px; }
  .btn-icon--lg { width: 44px; height: 44px; }

  /* ── Filled ── */
  .btn-icon--filled {
    background: #013aba;
    color: #ffffff;
  }
  .btn-icon--filled:hover::after {
    background: rgba(255, 255, 255, 0.08);
  }
  .btn-icon--filled:focus-visible::after {
    background: rgba(255, 255, 255, 0.10);
  }
  .btn-icon--filled:active::after {
    background: rgba(255, 255, 255, 0.10);
  }
  .btn-icon--filled:disabled {
    background: rgba(1, 58, 186, 0.10);
    color: rgba(29, 32, 36, 0.38);
    cursor: default;
  }
  .btn-icon--filled:disabled::after { display: none; }

  /* ── Tonal ── */
  .btn-icon--tonal {
    background: #eaf0ff;
    color: #263f7a;
  }
  .btn-icon--tonal:hover::after {
    background: rgba(29, 32, 36, 0.08);
  }
  .btn-icon--tonal:focus-visible::after {
    background: rgba(29, 32, 36, 0.10);
  }
  .btn-icon--tonal:active::after {
    background: rgba(29, 32, 36, 0.10);
  }
  .btn-icon--tonal:disabled {
    background: rgba(234, 240, 255, 0.10);
    color: rgba(29, 32, 36, 0.38);
    cursor: default;
  }
  .btn-icon--tonal:disabled::after { display: none; }

  /* ── Outlined ── */
  .btn-icon--outlined {
    background: transparent;
    color: #48546d;
    box-shadow: inset 0 0 0 1px #7381a2;
  }
  .btn-icon--outlined:hover::after {
    background: rgba(29, 32, 36, 0.08);
  }
  .btn-icon--outlined:focus-visible::after {
    background: rgba(29, 32, 36, 0.10);
  }
  .btn-icon--outlined:active::after {
    background: rgba(29, 32, 36, 0.10);
  }
  .btn-icon--outlined:disabled {
    box-shadow: inset 0 0 0 1px #dee2e9;
    color: rgba(29, 32, 36, 0.38);
    cursor: default;
  }
  .btn-icon--outlined:disabled::after { display: none; }

  /* ── Ghost ── */
  .btn-icon--ghost {
    background: transparent;
    color: #013aba;
  }
  .btn-icon--ghost:hover::after {
    background: rgba(29, 32, 36, 0.08);
  }
  .btn-icon--ghost:focus-visible::after {
    background: rgba(29, 32, 36, 0.10);
  }
  .btn-icon--ghost:active::after {
    background: rgba(29, 32, 36, 0.10);
  }
  .btn-icon--ghost:disabled {
    color: rgba(29, 32, 36, 0.38);
    cursor: default;
  }
  .btn-icon--ghost:disabled::after { display: none; }

  /* ── Material icon sizing ── */
  .btn-icon .material-symbols-outlined {
    font-size: 16px;
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Render helper ──
function btnIcon({ type = "filled", size = "sm", icon = "textsms", disabled = false } = {}) {
  const cls = `btn-icon btn-icon--${type} btn-icon--${size}`;
  return `<button class="${cls}"${disabled ? " disabled" : ""}>${mi(icon)}</button>`;
}

// ── Row helper ──
function typeRow(type) {
  return `
    <div style="display: flex; align-items: center; gap: 12px;">
      ${btnIcon({ type, size: "sm" })}
      ${btnIcon({ type, size: "md" })}
      ${btnIcon({ type, size: "lg" })}
      ${btnIcon({ type, size: "sm", disabled: true })}
    </div>
  `;
}

// ── Variants ──
export const variants = [
  {
    label: "Filled",
    description: "Fond bleu #013aba, icône blanche. 3 tailles + disabled.",
    render: () => typeRow("filled"),
  },
  {
    label: "Tonal",
    description: "Fond #eaf0ff, icône #263f7a. 3 tailles + disabled.",
    render: () => typeRow("tonal"),
  },
  {
    label: "Outlined",
    description: "Bordure #7381a2, icône #48546d. 3 tailles + disabled.",
    render: () => typeRow("outlined"),
  },
  {
    label: "Ghost",
    description: "Sans fond ni bordure, icône #013aba. 3 tailles + disabled.",
    render: () => typeRow("ghost"),
  },
];
