// ══════════════════════════════════════════════════
// Detail Block — Bloc de contenu pour pages détail
// ══════════════════════════════════════════════════
// Utilisé dans les fiches : collaborateur, société,
// client, etc. Affiche des sections d'informations
// organisées dans une carte blanche.
//
// Variantes :
//   1. Champs texte  — grille valeur/label + chips + contacts
//   2. Result cards  — cartes imbriquées en grille 2 colonnes

export const name = "Detail Block";
export const description = "Bloc de contenu pour pages détail (fiche collaborateur, société…). Carte blanche avec sections, champs valeur/label, chips, et variante result cards.";

const mi = (n, size = 16) =>
  `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;display:inline-flex;align-items:center;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">${n}</span>`;

export const styles = `

  /* ══ Detail Block ══ */

  .db {
    background: #ffffff;
    border: 1px solid #e7e8e9;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 0;
    font-family: 'Inter', sans-serif;
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Header du bloc ── */
  .db__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 16px;
  }

  .db__header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .db__title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .db__title {
    font-size: 18px;
    font-weight: 700;
    color: #1d2024;
    line-height: 28px;
    white-space: nowrap;
  }

  .db__description {
    font-size: 14px;
    font-weight: 400;
    color: #717680;
    line-height: 20px;
  }

  /* Alert inline dans le header */
  .db__alert {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .db__alert--warning { background: #fff4e5; color: #8f2800; }
  .db__alert--info    { background: #e0e7ff; color: #150792; }

  /* Bouton ghost header */
  .db__header-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 500;
    color: #013aba;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    flex-shrink: 0;
    align-self: flex-start;
  }

  .db__header-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: transparent;
    transition: background 0.15s;
    pointer-events: none;
  }

  .db__header-btn:hover::after  { background: rgba(1,58,186,0.08); }
  .db__header-btn:active::after { background: rgba(1,58,186,0.10); }

  /* ── Section ── */
  .db__section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #dee2e9;
  }

  .db__section:first-child { padding-top: 0; }
  .db__section:last-child  { border-bottom: none; padding-bottom: 0; }

  /* Titre de section */
  .db__section-title {
    font-size: 14px;
    font-weight: 500;
    color: #535862;
    line-height: 20px;
  }

  /* Sous-titre de section (ex: "Autre contact : ...") */
  .db__section-subtitle {
    font-size: 14px;
    font-weight: 400;
    color: #535862;
    line-height: 20px;
    margin-bottom: 8px;
    margin-top: 8px;
  }

  /* ── Grille de champs ── */
  .db__grid {
    display: flex;
    gap: 0;
    width: 100%;
  }

  .db__field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .db__value {
    font-size: 14px;
    font-weight: 500;
    color: #1d2024;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .db__value--empty {
    font-style: italic;
    color: #8f2800;
    font-weight: 500;
  }

  .db__label {
    font-size: 14px;
    font-weight: 400;
    color: #a4a7ae;
    line-height: 20px;
    white-space: nowrap;
  }

  /* ── Grille de champs avec inline elements (valeur + tags/boutons) ── */
  .db__field-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  /* ── Chips pour listes (compétences, etc.) ── */
  .db__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .db__chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    padding: 6px 8px;
    background: #eaf0ff;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 400;
    color: #263f7a;
    line-height: 20px;
    white-space: nowrap;
  }

  .db__chip strong {
    font-weight: 600;
    margin-right: 2px;
  }

  /* ── Bouton outlined mini (Disponibilités) ── */
  .db__btn-sm {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 500;
    color: #48546d;
    background: transparent;
    border: 1px solid #dee2e9;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .db__btn-sm::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .db__btn-sm:hover::after { background: rgba(72,84,109,0.06); }

  /* ── Tag inline (star favori, préférence...) ── */
  .db__tag-inline {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    padding: 0 6px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    gap: 4px;
  }

  .db__tag-inline--info { background: #e0e7ff; color: #150792; }

  /* ══ Result Cards Grid ══ */

  /* Sous-titres de groupe (A venir / Historique) */
  .db__group-title {
    font-size: 18px;
    font-weight: 500;
    color: #1d2024;
    line-height: 28px;
    margin-bottom: 16px;
    margin-top: 8px;
  }

  .db__group-title:first-child { margin-top: 0; }

  /* Grille 2 colonnes de cards */
  .db__cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 32px;
    margin-bottom: 16px;
    width: 100%;
  }

  /* Card individuelle */
  .db__card {
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 8px;
    padding: 14px 24px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    cursor: pointer;
    transition: box-shadow 0.15s;
    min-width: 0;
    overflow: hidden;
  }

  .db__card::after {
    content: ""; position: absolute; inset: 0; border-radius: 8px;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .db__card:hover { box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
  .db__card:hover::after { background: rgba(29,32,36,0.02); }

  /* En-tête de card */
  .db__card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .db__card-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    flex-wrap: wrap;
  }

  .db__card-date {
    font-size: 16px;
    font-weight: 500;
    color: #1d2024;
    line-height: 24px;
    white-space: nowrap;
  }

  .db__card-time {
    font-size: 14px;
    font-weight: 400;
    color: #48546d;
    line-height: 20px;
    white-space: nowrap;
  }

  /* Bouton arrow_forward outlined dans la card */
  .db__card-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    background: transparent;
    border: 1px solid #7381a2;
    border-radius: 6px;
    color: #48546d;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.15s;
  }

  .db__card-btn::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .db__card-btn:hover { border-color: #013aba; color: #013aba; }
  .db__card-btn:hover::after { background: rgba(1,58,186,0.06); }

  /* Infos en 2 colonnes dans la card */
  .db__card-infos {
    display: flex;
    gap: 32px;
    align-items: flex-start;
  }

  .db__card-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
  }

  .db__card-col--flex { flex: 1; min-width: 0; }

  .db__card-info-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 400;
    color: #48546d;
    line-height: 20px;
    overflow: hidden;
  }

  /* Tags activités dans la card */
  .db__card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px 0;
  }

  .db__card-tag {
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

  /* Couleurs spécifiques activités */
  .db__card-tag--garde    { background: #e7e1df; color: #794f3f; }
  .db__card-tag--menage   { background: #fce9ef; color: #d01a5d; }
  .db__card-tag--jardinage { background: #ddead7; color: #4d7f34; }
  .db__card-tag--info     { background: #e0e7ff; color: #150792; }
  .db__card-tag--success  { background: #e8fdef; color: #017437; }
  .db__card-tag--error    { background: #ffe5e5; color: #9f0712; }
  .db__card-tag--warning  { background: #fff4e5; color: #8f2800; }
`;

// ─── Helpers ───────────────────────────────────────────

function field({ value, label, empty = false } = {}) {
  const valCls = empty ? 'db__value db__value--empty' : 'db__value';
  const val = empty ? 'Non renseigné' : value;
  return `<div class="db__field">
    <span class="${valCls}">${val}</span>
    <span class="db__label">${label}</span>
  </div>`;
}

function fieldWithRow({ valueHtml, label } = {}) {
  return `<div class="db__field">
    <div class="db__field-row">${valueHtml}</div>
    <span class="db__label">${label}</span>
  </div>`;
}

function section(title, contentHtml) {
  return `<div class="db__section">
    <span class="db__section-title">${title}</span>
    ${contentHtml}
  </div>`;
}

function chip(level, name) {
  return `<span class="db__chip"><strong>${level}</strong> : ${name}</span>`;
}

function tagInline(iconName, label, type = 'info') {
  return `<span class="db__tag-inline db__tag-inline--${type}">${mi(iconName, 14)} ${label}</span>`;
}

function btnSm(iconName, label) {
  return `<button class="db__btn-sm" type="button">${mi(iconName, 14)} ${label}</button>`;
}

function cardTag(label, cls) {
  return `<span class="db__card-tag db__card-tag--${cls}">${label}</span>`;
}

function cardInfoRow(icon, text) {
  return `<div class="db__card-info-row">${mi(icon, 16)} ${text}</div>`;
}

function card({ date, time, statusLabel, statusCls, left = [], right = [], tags = [] } = {}) {
  const tagsHtml = tags.map(t => cardTag(t.label, t.cls)).join('');
  const leftHtml = left.map(r => cardInfoRow(r.icon, r.text)).join('');
  const rightHtml = right.map(r => cardInfoRow(r.icon, r.text)).join('');
  return `<div class="db__card">
    <div class="db__card-header">
      <div class="db__card-title-group">
        <span class="db__card-date">${date}</span>
        <span class="db__card-time">${time}</span>
        <span class="db__card-tag db__card-tag--${statusCls}" style="height:24px;padding:4px 6px;border-radius:6px;font-size:12px;">
          ${mi(statusCls === 'info' ? 'today' : statusCls === 'success' ? 'task_alt' : 'cancel', 14)} ${statusLabel}
        </span>
      </div>
      <button class="db__card-btn" type="button">${mi('arrow_forward', 16)}</button>
    </div>
    ${leftHtml || rightHtml ? `<div class="db__card-infos">
      <div class="db__card-col">${leftHtml}</div>
      <div class="db__card-col db__card-col--flex">${rightHtml}</div>
    </div>` : ''}
    ${tagsHtml ? `<div class="db__card-tags">${tagsHtml}</div>` : ''}
  </div>`;
}

const TAGS_RDV = [
  { label: "Garde d'enfants", cls: 'garde' },
  { label: 'Ménage', cls: 'menage' },
  { label: 'Jardinage', cls: 'jardinage' },
];

// ─── Variante 1 : Champs texte ─────────────────────────
function renderFields() {
  const alertHtml = `<span class="db__alert db__alert--warning">
    ${mi('notification_important', 16)} Informations supplémentaires requises pour contrat.
  </span>`;

  const headerBtn = `<button class="db__header-btn" type="button">
    ${mi('edit', 16)} Modifier
  </button>`;

  // Section Adresse postale
  const sectionAdresse = section('Adresse postale', `
    <div class="db__grid">
      ${field({ value: '1 rue des tulipes, 93240 Stains', label: 'Adresse' })}
      ${field({ value: '2 Bis', label: 'Bâtiment' })}
      ${field({ value: '106', label: 'N° appartement' })}
      ${field({ value: '3', label: 'Étage' })}
    </div>`);

  // Section Coordonnées
  const sectionCoords = section('Coordonnées de contact', `
    <div class="db__grid">
      ${field({ value: '+33 6 12 34 56 89', label: 'Téléphone mobile' })}
      ${field({ value: '+33 1 12 34 56 89', label: 'Téléphone fixe' })}
      ${field({ empty: true, label: 'Adresse e-mail' })}
      <div class="db__field"></div>
    </div>`);

  // Section Locomotion
  const sectionLoco = section('Moyens de locomotion', `
    <div class="db__grid">
      ${field({ empty: true, label: 'Moyen principal' })}
    </div>`);

  // Section Compétences — chips
  const sectionComp = section('Compétences', `
    <div class="db__chips">
      ${chip('Expert', 'Compétences')}
      ${chip('Débutant', 'Compétences')}
      ${chip('Débutant', 'Compétences')}
      ${chip('Intermédiaire', 'Compétences')}
    </div>`);

  // Section Contacts personnels
  const sectionContacts = section(
    `<span style="display:inline-flex;align-items:center;gap:8px;">
       Contacts personnels
       ${tagInline('info', 'Préférence : SMS')}
     </span>`,
    `<div class="db__grid">
       ${fieldWithRow({ label: 'Téléphone mobile', valueHtml:
         `<span class="db__value">+33 6 12 34 56 89</span>
          ${tagInline('star', '', 'info')}
          ${btnSm('schedule', 'Disponibilités')}` })}
       ${fieldWithRow({ label: 'Téléphone fixe', valueHtml:
         `<span class="db__value">+33 6 12 34 56 89</span>
          ${btnSm('schedule', 'Disponibilités')}` })}
       ${fieldWithRow({ label: 'Téléphone fixe', valueHtml:
         `<span class="db__value">+33 6 12 34 56 89</span>
          ${btnSm('schedule', 'Disponibilités')}` })}
       ${fieldWithRow({ label: 'Téléphone fixe', valueHtml:
         `<span class="db__value">+33 6 12 34 56 89</span>
          ${btnSm('schedule', 'Disponibilités')}` })}
     </div>
     <div class="db__grid" style="margin-top:8px;">
       ${field({ value: '+33 1 12 34 56 89', label: 'Téléphone professionnel' })}
       ${field({ value: 'Nahuel.van-pee@gmail.com', label: 'Adresse e-mail' })}
       <div class="db__field"></div>
       <div class="db__field"></div>
     </div>
     <p class="db__section-subtitle">Autre contact : Eloise Bridgerton (conjointe)</p>
     <div class="db__grid">
       ${fieldWithRow({ label: 'Téléphone mobile', valueHtml:
         `<span class="db__value">+33 6 12 34 56 89</span>
          ${tagInline('star', '', 'info')}
          ${btnSm('schedule', 'Disponibilités')}` })}
     </div>`
  );

  return `<div class="db">
    <div class="db__header">
      <div class="db__header-left">
        <div class="db__title-row">
          <span class="db__title">Informations</span>
          ${alertHtml}
        </div>
        <p class="db__description">Moyens de contact et de locomotion du collaborateur.</p>
      </div>
      ${headerBtn}
    </div>
    ${sectionAdresse}
    ${sectionCoords}
    ${sectionLoco}
    ${sectionComp}
    ${sectionContacts}
  </div>`;
}

// ─── Variante 2 : Result cards ─────────────────────────
function renderCards() {
  const headerBtn = `<button class="db__header-btn" type="button">
    ${mi('add', 16)} Nouveau rendez-vous
  </button>`;

  const leftRight = [
    { icon: 'home', text: 'Rendez-vous à domicile' },
  ];
  const right1 = [{ icon: 'info', text: 'Nouvelle prestation' }];
  const right2 = [{ icon: 'info', text: 'Rendez-vous initial' }];

  const avenir = [
    card({ date: '15 mars 2026', time: '10h00 - 11h00', statusLabel: 'Planifié', statusCls: 'info',
      left: [...leftRight, { icon: 'person', text: 'Opérationnel agence : Jean Dupont' }],
      right: right1, tags: TAGS_RDV }),
    card({ date: '12 mars 2026', time: '12h00 - 14h00', statusLabel: 'Planifié', statusCls: 'info',
      left: [...leftRight, { icon: 'person', text: 'Opérationnel agence : Myriam Draf' }],
      right: right1, tags: TAGS_RDV }),
    card({ date: '1 mars 2026', time: '09h00 - 10h30', statusLabel: 'Planifié', statusCls: 'info',
      left: [...leftRight, { icon: 'person', text: 'Opérationnel agence : Jean Dupont' }],
      right: right2, tags: TAGS_RDV }),
  ];

  const historique = [
    card({ date: '1 février 2026', time: '10h00 - 11h00', statusLabel: 'Réalisé', statusCls: 'success',
      left: leftRight, right: right1,
      tags: [{ label: "Garde d'enfants", cls: 'garde' }] }),
    card({ date: '18 janvier 2026', time: '10h00 - 11h00', statusLabel: 'Annulé', statusCls: 'error',
      left: leftRight, right: right1, tags: TAGS_RDV }),
  ];

  // "A venir" : 1 carte pleine largeur + 2 en grille
  const avenirFullHtml = `<div style="margin-bottom:16px;">${avenir[0]}</div>`;
  const avenirGridHtml = `<div class="db__cards-grid">${avenir[1]}${avenir[2]}</div>`;
  const historiqueGridHtml = `<div class="db__cards-grid">${historique[0]}${historique[1]}</div>`;

  return `<div class="db">
    <div class="db__header">
      <div class="db__header-left">
        <div class="db__title-row">
          <span class="db__title">Rendez-vous commerciaux</span>
        </div>
      </div>
      ${headerBtn}
    </div>
    <p class="db__group-title">A venir</p>
    ${avenirFullHtml}
    ${avenirGridHtml}
    <p class="db__group-title">Historique</p>
    ${historiqueGridHtml}
  </div>`;
}

// ─── Exports ───────────────────────────────────────────
export const variants = [
  {
    label: 'Champs texte',
    description: "Sections avec grille valeur/label, chips de liste, champs 'Non renseigné', contacts avec boutons inline.",
    render: renderFields,
  },
  {
    label: 'Result cards',
    description: "Sections titrées avec grille 2 colonnes de result-cards. Statuts, infos avec icônes, tags activités.",
    render: renderCards,
  },
];
