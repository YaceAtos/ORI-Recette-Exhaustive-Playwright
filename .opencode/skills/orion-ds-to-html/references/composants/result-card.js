// ══════════════════════════════════════════════════
// Result Card
// ══════════════════════════════════════════════════

export const name = "Result Card";
export const description = "Carte de résultat flexible. Peut aller du plus simple (une seule ligne d'info) au plus complexe (avatar, header, colonnes d'infos, tags, lien, note, actions au hover). Toutes les sections sont optionnelles.";

// ── Icônes (Material Symbols) ──
const mi = (name, size = 16) => `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;">${name}</span>`;

// ── Helpers ──
function avatar(initials = "PN") {
  return `<div class="rc__avatar">${initials}</div>`;
}

function tag(label, variant = "neutral", icon = "") {
  const variants = {
    neutral:  { bg: "#e6e8eb", text: "#1d2024" },
    success:  { bg: "#e8fdef", text: "#017437" },
    info:     { bg: "#e0e7ff", text: "#3e2bc5" },
    brand:    { bg: "#eaf0ff", text: "#013aba" },
    warning:  { bg: "#fef3cd", text: "#856404" },
    error:    { bg: "#fde8e7", text: "#b2271e" },
  };
  const c = variants[variant] || variants.neutral;
  const iconHtml = icon ? `<span class="rc__tag-icon">${mi(icon)}</span>` : "";
  return `<span class="rc__tag" style="background:${c.bg}; color:${c.text};">${iconHtml}${label}</span>`;
}

function infoItem(icon, text, link = "") {
  const linkHtml = link ? ` <a href="#" class="rc__link rc__link--sm" onclick="event.preventDefault()">${link}</a>` : "";
  return `<div class="rc__info-row">
    <span class="rc__info-icon">${mi(icon)}</span>
    <span class="rc__info-text">${text}</span>${linkHtml}
  </div>`;
}

/**
 * renderCard — Flexible result card
 *
 * @param {Object} opts
 * @param {string}  opts.title          - Titre principal (obligatoire si header visible)
 * @param {string}  opts.subtitle       - Sous-titre (code, entite, etc.)
 * @param {Object}  opts.statusTag      - Tag statut dans le header { label, variant, icon }
 * @param {string}  opts.initials       - Initiales pour l'avatar (null = pas d'avatar)
 * @param {boolean} opts.showCheckbox   - Afficher la checkbox
 * @param {boolean} opts.showHeader     - Afficher le header (titre + sous-titre + tag)
 * @param {string}  opts.firstElement   - Ligne d'info avec icône sous le header { icon, text }
 * @param {Array}   opts.columns        - Colonnes d'infos : [ [{ icon, text, link? }], [{ icon, text }] ]
 * @param {Array}   opts.tags           - Tags d'activité : [{ label, variant, icon }]
 * @param {string}  opts.linkText       - Lien cliquable
 * @param {string}  opts.noteText       - Note en bas avec séparateur
 * @param {Array}   opts.actions        - Boutons d'action au hover : [{ icon, style, label, title }]
 * @param {string}  opts.state          - "default" | "disabled"
 */
function renderCard({
  title = "",
  subtitle = "",
  statusTag = null,
  initials = null,
  showCheckbox = false,
  showHeader = true,
  firstElement = null,
  columns = null,
  tags = null,
  linkText = "",
  noteText = "",
  actions = null,
  state = "default",
} = {}) {
  const isDisabled = state === "disabled";
  const cls = ["rc"];
  if (isDisabled) cls.push("rc--disabled");

  // Checkbox
  const checkboxHtml = showCheckbox
    ? `<div class="rc__checkbox"><div class="rc__checkbox-box"></div></div>`
    : "";

  // Avatar
  const avatarHtml = initials ? avatar(initials) : "";

  // Header
  let headerHtml = "";
  if (showHeader && title) {
    const titleHtml = `<span class="rc__name">${title}</span>`;
    const subtitleHtml = subtitle ? `<span class="rc__code">${subtitle}</span>` : "";
    const statusHtml = statusTag
      ? tag(statusTag.label, statusTag.variant || "success", statusTag.icon || "")
      : "";

    // Hover actions
    let actionsHtml = "";
    if (actions && actions.length && !isDisabled) {
      actionsHtml = `<div class="rc__actions">${actions.map(a => {
        if (a.label && !a.iconOnly) {
          const iconPart = a.icon ? `<span class="rc__action-btn-icon">${mi(a.icon)}</span>` : "";
          return `<button class="rc__action-btn-text rc__action-btn-text--${a.style || 'outlined'}">${iconPart}<span>${a.label}</span></button>`;
        }
        return `<button class="rc__action-btn rc__action-btn--${a.style || 'outlined'}" title="${a.label || a.title || ''}">${mi(a.icon)}</button>`;
      }).join("")}</div>`;
    }

    headerHtml = `
      <div class="rc__header">
        <div class="rc__header-left">${titleHtml}${subtitleHtml}${statusHtml}</div>
        ${actionsHtml}
      </div>`;
  }

  // First element (single info row under header)
  const firstHtml = firstElement
    ? infoItem(firstElement.icon, firstElement.text)
    : "";

  // Columns
  let columnsHtml = "";
  if (columns && columns.length) {
    const colsInner = columns.map((col, i) => {
      const flexCls = i === columns.length - 1 && columns.length > 1 ? " rc__info-col--flex" : "";
      const rows = col.map(r => infoItem(r.icon, r.text, r.link || "")).join("");
      return `<div class="rc__info-col${flexCls}">${rows}</div>`;
    }).join("");
    columnsHtml = `<div class="rc__infos">${colsInner}</div>`;
  }

  // Tags
  let tagsHtml = "";
  if (tags && tags.length) {
    tagsHtml = `<div class="rc__tags">${tags.map(t => tag(t.label, t.variant || "neutral", t.icon || "")).join("")}</div>`;
  }

  // Link
  const linkHtml = linkText
    ? `<a href="#" class="rc__link" onclick="event.preventDefault()">${linkText}</a>`
    : "";

  // Note
  const noteHtml = noteText
    ? `<div class="rc__note-sep"></div><p class="rc__note">${noteText}</p>`
    : "";

  return `<div class="${cls.join(" ")}">
    ${checkboxHtml}
    ${avatarHtml}
    <div class="rc__body">
      ${headerHtml}
      ${firstHtml}
      ${columnsHtml}
      ${tagsHtml}
      ${linkHtml}
      ${noteHtml}
    </div>
  </div>`;
}

// ── CSS ──
export const styles = `
  /* ═══════════ CONTAINER ═══════════ */
  .rc {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 24px;
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 8px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
    transition: box-shadow 0.15s;
    position: relative;
  }

  /* ── Hover overlay ── */
  .rc::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: #1d2024;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s;
  }

  .rc:not(.rc--disabled):hover::after {
    opacity: 0.04;
  }

  .rc:not(.rc--disabled):hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .rc--disabled {
    opacity: 0.38;
    pointer-events: none;
  }

  /* ── Checkbox ── */
  .rc__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 40px;
    flex-shrink: 0;
  }

  .rc__checkbox-box {
    width: 16px;
    height: 16px;
    border: 1px solid #48546d;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    transition: background 0.15s, border-color 0.15s;
  }

  .rc__checkbox-box.rc__checkbox-box--checked {
    background: #013aba;
    border-color: #013aba;
  }

  .rc__checkbox-box.rc__checkbox-box--checked::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 5px;
    width: 4px;
    height: 8px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  /* ── Avatar ── */
  .rc__avatar {
    width: 46px;
    height: 46px;
    border-radius: 100px;
    background: #ccdcff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    color: #0c3289;
  }

  /* ── Body ── */
  .rc__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  /* ── Header ── */
  .rc__header {
    display: flex;
    align-items: center;
    min-height: 36px;
    position: relative;
  }

  .rc__header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .rc__name {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #181d27;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex-shrink: 1;
  }

  .rc__code {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #48546d;
    white-space: nowrap;
  }

  /* ── Actions (hover) ── */
  .rc__actions {
    display: none;
    align-items: center;
    gap: 8px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    background: #f5f5f6;
  }

  .rc:not(.rc--disabled):hover .rc__actions {
    display: flex;
  }

  .rc__action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    color: #48546d;
    transition: background 0.15s;
  }

  .rc__action-btn--tonal {
    background: #eaf0ff;
    color: #0c3289;
  }
  .rc__action-btn--tonal:hover { background: #ccdcff; }

  .rc__action-btn--outlined {
    background: transparent;
    border: 1px solid #7381a2;
  }
  .rc__action-btn--outlined:hover { background: rgba(29, 32, 36, 0.06); }

  /* Text action buttons (hover) */
  .rc__action-btn-text {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 8px 16px;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    cursor: pointer;
    border: none;
    white-space: nowrap;
    transition: background 0.15s;
  }

  .rc__action-btn-text--outlined {
    background: transparent;
    color: #48546d;
    border: 1px solid #dee2e9;
  }
  .rc__action-btn-text--outlined:hover { background: rgba(0, 0, 0, 0.04); }

  .rc__action-btn-text--tonal {
    background: #eaf0ff;
    color: #263f7a;
  }
  .rc__action-btn-text--tonal:hover { background: #dce6ff; }

  .rc__action-btn-icon {
    display: flex;
    align-items: center;
    width: 16px;
    height: 16px;
  }

  /* ── Tag ── */
  .rc__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 4px 6px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
  }

  .rc__tag-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  /* ── Infos ── */
  .rc__infos {
    display: flex;
    gap: 32px;
    width: 100%;
  }

  .rc__info-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
  }

  .rc__info-col--flex {
    flex: 1;
    min-width: 0;
  }

  .rc__info-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .rc__info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #48546d;
  }

  .rc__info-text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #48546d;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* ── Tags row ── */
  .rc__tags {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 4px 0;
    flex-wrap: wrap;
  }

  /* ── Link ── */
  .rc__link {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #013aba;
    text-decoration: underline;
    cursor: pointer;
  }

  .rc__link--sm {
    font-size: 12px;
    line-height: 16px;
  }

  .rc__link:hover { color: #0c3289; }

  /* ── Note ── */
  .rc__note-sep {
    width: 100%;
    height: 0;
    border-top: 1px solid #e7e8e9;
  }

  .rc__note {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #535862;
    margin: 0;
  }

  /* ── Demo ── */
  .rc-demo-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 900px;
  }

  .rc-demo-label {
    font-size: 11px;
    font-weight: 500;
    color: #8e96a3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }

  .rc .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Script ──
export const script = `
  document.querySelectorAll(".rc__checkbox-box").forEach((box) => {
    box.addEventListener("click", () => {
      box.classList.toggle("rc__checkbox-box--checked");
    });
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "Minimal — Info seule",
    description: "Aucun header, juste une ligne icône + texte. Usage : intervention ponctuelle, date.",
    render: () => `<div class="rc-demo-grid">
      ${renderCard({
        showHeader: false,
        columns: [
          [{ icon: "calendar_month", text: "Le <b>01/10/2025</b>, entre 15:30 et 16:45." }],
        ],
      })}
    </div>`,
  },
  {
    label: "Titre + sous-info",
    description: "Titre, code, une ligne d'info en dessous, bouton icon. Usage : secteur, produit.",
    render: () => `<div class="rc-demo-grid" style="max-width:400px;">
      ${renderCard({
        title: "Quartier Nord",
        subtitle: "12345678",
        firstElement: { icon: "map", text: "4 familles de produit" },
        actions: [{ icon: "edit", style: "outlined" }],
      })}
    </div>`,
  },
  {
    label: "Titre + tag statut + description",
    description: "Titre avec tag statut, description riche en dessous. Usage : série récurrente.",
    render: () => `<div class="rc-demo-grid" style="max-width:650px;">
      ${renderCard({
        title: "Mensuel",
        statusTag: { label: "Actif", variant: "success", icon: "mode_standby" },
        columns: [
          [{ icon: "calendar_month", text: 'Se produit <b>le 27, tous les mois,</b> à compter du 27/10/2026 et jusqu\'au 31/12/2026, entre 15:30 et 16:45.' }],
        ],
      })}
    </div>`,
  },
  {
    label: "Titre + code + tag + bouton texte",
    description: "Header avec tag neutral et bouton texte outlined. Usage : contrat, offre.",
    render: () => `<div class="rc-demo-grid">
      ${renderCard({
        title: "OSCAR - CARSAT 2026",
        subtitle: "CARSAT",
        statusTag: { label: "Brouillon", variant: "neutral" },
        actions: [{ icon: "edit", label: "Personnaliser", style: "outlined" }],
      })}
    </div>`,
  },
  {
    label: "Titre + tag info + adresse + 2 colonnes",
    description: "Header avec tag info, first element adresse, 2 colonnes d'infos. Usage : agence, annexe.",
    render: () => `<div class="rc-demo-grid" style="max-width:500px;">
      ${renderCard({
        title: "CD de la Sarthe - Annexe de la Croix de Pierre",
        statusTag: { label: "Annexe", variant: "info" },
        firstElement: { icon: "home_work", text: "Adresse : 2 rue des Maillets" },
        columns: [
          [
            { icon: "add", text: "Complément :" },
            { icon: "location_city", text: "Ville : Le Mans" },
          ],
          [
            { icon: "markunread_mailbox", text: "Code postal : 72072" },
            { icon: "flag", text: "Pays : France", link: "+3 autres" },
          ],
        ],
      })}
    </div>`,
  },
  {
    label: "Titre + code + tag statut + 2 colonnes",
    description: "Header complet, 2 colonnes courtes. Usage : société, entité.",
    render: () => `<div class="rc-demo-grid" style="max-width:500px;">
      ${renderCard({
        title: "O2 Care Services Le Mans",
        subtitle: "4401234569800",
        statusTag: { label: "Actif", variant: "success", icon: "mode_standby" },
        columns: [
          [{ icon: "location_on", text: "Le Mans (72)" }],
          [{ icon: "connected_tv", text: "Portail : Connecté" }],
        ],
      })}
    </div>`,
  },
  {
    label: "Complet — Titre + sous-titre + colonnes + tags",
    description: "Le plus riche : header, 2 colonnes d'infos, tags d'activité. Usage : contrat APA/PCH.",
    render: () => `<div class="rc-demo-grid">
      ${renderCard({
        title: "APA - CD de la Sarthe 2026",
        subtitle: "Conseil départemental de la Sarthe",
        columns: [
          [
            { icon: "calendar_today", text: "01/02/2025 → 31/01/2026" },
            { icon: "description", text: "N° de décision : APA-2025-00123" },
          ],
          [
            { icon: "checklist", text: "2/5 activités : 15h allouées/mois" },
          ],
        ],
        tags: [
          { label: "Horaire", variant: "brand", icon: "payment" },
          { label: "Dépassement : Non autorisé", variant: "neutral", icon: "close" },
        ],
      })}
    </div>`,
  },
  {
    label: "Complet — Avatar + actions hover + tags + note",
    description: "Collaborateur avec avatar, infos détaillées, tags activité, lien, note. Actions au survol.",
    render: () => `<div class="rc-demo-grid">
      ${renderCard({
        title: "Jean DUPONT",
        subtitle: "EMP2025-0147",
        initials: "JD",
        statusTag: { label: "Actif", variant: "success", icon: "mode_standby" },
        columns: [
          [
            { icon: "work", text: "Aide à domicile" },
            { icon: "mail", text: "jean.dupont@gmail.com" },
            { icon: "phone", text: "+33 6 12 34 56 78" },
          ],
          [
            { icon: "mail", text: "jean.dupont@pro.com" },
            { icon: "home", text: "Agence A · Agence B · Agence C", link: "+3 autres" },
          ],
        ],
        tags: [
          { label: "Garde d'enfants", variant: "neutral", icon: "child_friendly" },
          { label: "Ménage", variant: "neutral", icon: "cleaning_services" },
          { label: "Jardinage", variant: "neutral", icon: "grass" },
          { label: "+3", variant: "neutral" },
        ],
        actions: [
          { icon: "visibility", style: "tonal", label: "Voir" },
          { icon: "edit", style: "outlined", label: "Éditer" },
          { icon: "delete", style: "outlined", label: "Supprimer" },
        ],
        linkText: "Sélectionner ce collaborateur",
        noteText: "Notes : Disponible du lundi au jeudi, 9h - 17h.",
      })}
    </div>`,
  },
  {
    label: "Avec checkbox",
    description: "Checkbox sélectionnable à gauche.",
    render: () => `<div class="rc-demo-grid" style="max-width:500px;">
      ${renderCard({
        title: "O2 Care Services Le Mans",
        subtitle: "4401234569800",
        statusTag: { label: "Actif", variant: "success", icon: "mode_standby" },
        showCheckbox: true,
        columns: [
          [{ icon: "location_on", text: "Le Mans (72)" }],
          [{ icon: "connected_tv", text: "Portail : Connecté" }],
        ],
      })}
    </div>`,
  },
  {
    label: "Disabled",
    description: "État désactivé, opacité réduite, pas d'interaction.",
    render: () => `<div class="rc-demo-grid" style="max-width:400px;">
      ${renderCard({
        title: "Quartier Nord",
        subtitle: "12345678",
        firstElement: { icon: "map", text: "4 familles de produit" },
        state: "disabled",
      })}
    </div>`,
  },
];
