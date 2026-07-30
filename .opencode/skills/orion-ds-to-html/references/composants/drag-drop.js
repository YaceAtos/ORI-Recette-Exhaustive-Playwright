// ══════════════════════════════════════════════════
// Drag & Drop
// ══════════════════════════════════════════════════

export const name = "Drag & Drop";
export const description = "Zone de glisser-déposer pour l'import de fichiers. 2 tailles (md, lg), 4 états (default, hover, focus, disabled). Lien d'import optionnel.";

// ── Icône (Material Symbols) ──
const mi = (name, size = 12, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_UPLOAD = mi('upload', 12, 'dd__upload-icon');

// ── CSS ──
export const styles = `
  /* ── Base ── */
  .dd {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #7381a2;
    border-radius: 6px;
    background: #ffffff;
    padding: 18px 48px 18px 40px;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    transition: background-color 0.15s, border-color 0.15s;
    cursor: default;
  }

  /* ── Tailles ── */
  .dd--md {
    width: 224px;
    height: 70px;
  }

  .dd--lg {
    width: 616px;
    height: 70px;
  }

  /* ── State layer ── */
  .dd::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: transparent;
    transition: background 0.15s;
  }

  /* ── Hover ── */
  .dd:hover:not(.dd--disabled):not(.dd--focus) {
    border-color: #7381a2;
  }

  .dd:hover:not(.dd--disabled):not(.dd--focus)::after {
    background: rgba(72, 84, 109, 0.08);
  }

  /* ── Focus (dragover) ── */
  .dd--focus {
    background: #eaf0ff;
    border-color: #3557a0;
    border-style: dashed;
  }

  /* ── Disabled ── */
  .dd--disabled {
    opacity: 0.38;
    pointer-events: none;
  }

  .dd--disabled::after {
    background: rgba(72, 84, 109, 0.10);
  }

  /* ── Contenu ── */
  .dd__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .dd__label {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0;
    color: #48546d;
    white-space: nowrap;
  }

  /* ── Lien d'import ── */
  .dd__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #0a359f;
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    outline: none;
    white-space: nowrap;
  }

  .dd__link:hover {
    opacity: 0.8;
  }

  .dd__upload-icon {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    display: block;
    color: #0a359f;
  }

  /* ── Input file caché ── */
  .dd__input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }

  .dd--disabled .dd__input {
    cursor: default;
    pointer-events: none;
  }

  /* ── Helpers démo ── */
  .dd-demo-row {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    flex-wrap: wrap;
  }

  .dd-demo-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dd .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Fonction de rendu ──
function dragDrop({
  size = "md",
  showLink = true,
  disabled = false,
  focus = false,
} = {}) {
  let cls = `dd dd--${size}`;
  if (disabled) cls += " dd--disabled";
  if (focus) cls += " dd--focus";

  const linkHtml = showLink
    ? `<a class="dd__link" href="#" onclick="event.preventDefault()">${ICON_UPLOAD}<span>importer votre fichier</span></a>`
    : "";

  return `<div class="${cls}">
    <div class="dd__content">
      <span class="dd__label">Glisser et déposer</span>
      ${linkHtml}
    </div>
  </div>`;
}

// ── Script d'interactivité ──
export const script = `
  document.addEventListener("dragover", (e) => {
    const dd = e.target.closest(".dd");
    if (!dd || dd.classList.contains("dd--disabled")) return;
    e.preventDefault();
    dd.classList.add("dd--focus");
  });

  document.addEventListener("dragleave", (e) => {
    const dd = e.target.closest(".dd");
    if (!dd) return;
    dd.classList.remove("dd--focus");
  });

  document.addEventListener("drop", (e) => {
    const dd = e.target.closest(".dd");
    if (!dd || dd.classList.contains("dd--disabled")) return;
    e.preventDefault();
    dd.classList.remove("dd--focus");
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "Default — md & lg",
    description: "Zone de drop par défaut, 2 tailles.",
    render: () => `<div class="dd-demo-col">
      ${dragDrop({ size: "md" })}
      ${dragDrop({ size: "lg" })}
    </div>`,
  },
  {
    label: "Focus (dragover)",
    description: "État quand un fichier est glissé au-dessus de la zone. Fond bleu clair, bordure bleue.",
    render: () => `<div class="dd-demo-col">
      ${dragDrop({ size: "md", focus: true })}
      ${dragDrop({ size: "lg", focus: true })}
    </div>`,
  },
  {
    label: "Disabled",
    description: "Zone désactivée, opacité réduite, non interactive.",
    render: () => `<div class="dd-demo-col">
      ${dragDrop({ size: "md", disabled: true })}
      ${dragDrop({ size: "lg", disabled: true })}
    </div>`,
  },
];
