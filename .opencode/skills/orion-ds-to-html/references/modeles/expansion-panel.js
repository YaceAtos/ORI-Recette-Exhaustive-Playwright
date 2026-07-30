// ══════════════════════════════════════════════════
// Expansion Panel — Modèle de mise en forme
// ══════════════════════════════════════════════════
// Deux expansion panels à la suite (pas de variants).
// Exemples de contenu réel :
//   1. Sélection d'un créneau horaire (boutons + ghost)
//   2. Plage horaire hebdomadaire (selects Jours/Début/Fin + actions)

export const name = "Expansion Panel";
export const description = "Deux exemples de mise en forme d'expansion panels : sélecteur de créneaux horaires et configuration de plages hebdomadaires.";

const mi = (n, size = 16) =>
  `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;display:inline-flex;align-items:center;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">${n}</span>`;

export const styles = `

  /* ══ Expansion Panel ══ */
  .ep {
    position: relative;
    width: 100%;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.08);
    font-family: 'Inter', sans-serif;
  }

  .ep__header { border-radius: 6px 6px 0 0; }
  .ep__body:last-child { border-radius: 0 0 6px 6px; }

  .ep + .ep { margin-top: 12px; }

  /* ── Header ── */
  .ep__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 12px 12px 12px 24px;
    cursor: pointer;
    user-select: none;
    position: relative;
    background: #ffffff;
  }

  .ep__header::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: transparent;
    transition: background 0.15s;
  }

  .ep__header:hover::after { background: rgba(29,32,36,0.06); }

  .ep__header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .ep__title {
    font-size: 14px;
    font-weight: 500;
    color: #1d2024;
    line-height: 20px;
    white-space: nowrap;
  }

  .ep__desc {
    font-size: 14px;
    font-weight: 400;
    color: #535862;
    line-height: 20px;
    white-space: nowrap;
  }

  /* Tag dans le header */
  .ep__tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 4px 6px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ep__tag--info { background: #e0e7ff; color: #150792; }

  .ep__header-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .ep__chevron {
    display: flex;
    align-items: center;
    color: #48546d;
    transition: transform 0.2s ease;
  }

  .ep--open .ep__chevron { transform: rotate(180deg); }

  /* ── Divider ── */
  .ep__divider {
    height: 1px;
    background: #dee2e9;
  }

  /* ── Contenu ── */
  .ep__body {
    display: none;
    flex-direction: column;
    gap: 8px;
    padding: 20px 24px;
  }

  .ep--open .ep__body { display: flex; }

  /* ── Contenu panel 1 : sélecteur de créneaux ── */
  .ep__section-title {
    font-size: 14px;
    font-weight: 700;
    color: #1d2024;
    line-height: 20px;
  }

  .ep__time-slots {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ep__slot {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    border: 1px solid #dee2e9;
    border-radius: 6px;
    background: #ffffff;
    font-size: 16px;
    font-weight: 500;
    color: #1d2024;
    line-height: 24px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    white-space: nowrap;
  }

  .ep__slot:hover { border-color: #8e96a3; }

  .ep__slot--selected {
    background: #eaf0ff;
    border-color: #3557a0;
    color: #1d2024;
  }

  /* Bouton ghost dans le panel */
  .ep__btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 14px;
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
  }

  .ep__btn-ghost::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .ep__btn-ghost:hover::after { background: rgba(1,58,186,0.08); }

  /* ── Contenu panel 2 : plages horaires ── */
  .ep__form-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-end;
    width: 100%;
  }

  /* Select form-field inline */
  .ep__ff {
    position: relative;
    font-family: 'Inter', sans-serif;
    flex: 1;
    min-width: 0;
  }

  .ep__ff--full { width: 100%; flex: none; }

  .ep__ff-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    background: #ffffff;
    border: 1px solid #e7e8e9;
    border-radius: 6px;
    padding: 8px 14px 8px 16px;
    cursor: pointer;
    gap: 8px;
    transition: border-color 0.15s;
  }

  .ep__ff-wrap:hover { border-color: #1d2024; }

  .ep__ff-value {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #1d2024;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ep__ff-chevron {
    color: #48546d;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .ep__ff-label {
    position: absolute;
    left: 14px;
    top: -9px;
    font-size: 12px;
    font-weight: 400;
    color: #535862;
    background: #ffffff;
    padding: 0 2px;
    line-height: 18px;
    pointer-events: none;
    white-space: nowrap;
  }

  /* Ligne début/fin + poubelle */
  .ep__time-row {
    display: flex;
    align-items: center;
    gap: 18px;
    width: 100%;
  }

  /* Bouton poubelle outlined */
  .ep__btn-del {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background: transparent;
    border: 1px solid #7381a2;
    border-radius: 6px;
    color: #48546d;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.15s, color 0.15s;
  }

  .ep__btn-del::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .ep__btn-del:hover { border-color: #b2271e; color: #b2271e; }
  .ep__btn-del:hover::after { background: rgba(178,39,30,0.06); }

  /* Footer du panel 2 */
  .ep__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
  }

  /* Bouton tonal */
  .ep__btn-tonal {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 500;
    color: #263f7a;
    background: #eaf0ff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .ep__btn-tonal::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .ep__btn-tonal:hover::after { background: rgba(38,63,122,0.08); }
`;

// ── Helpers ──

function ffSelect(label, value) {
  return `<div class="ep__ff">
    <div class="ep__ff-wrap">
      <span class="ep__ff-value">${value}</span>
      <span class="ep__ff-chevron">${mi('keyboard_arrow_down', 16)}</span>
    </div>
    <span class="ep__ff-label">${label}</span>
  </div>`;
}

function ffSelectFull(label, value) {
  return `<div class="ep__ff ep__ff--full">
    <div class="ep__ff-wrap">
      <span class="ep__ff-value">${value}</span>
      <span class="ep__ff-chevron">${mi('keyboard_arrow_down', 16)}</span>
    </div>
    <span class="ep__ff-label">${label}</span>
  </div>`;
}

function delBtn() {
  return `<button class="ep__btn-del" type="button" title="Supprimer">
    ${mi('delete', 16)}
  </button>`;
}

// ── Panel 1 : Sélection de créneau ──
function panel1() {
  const slots = ['17:00','17:30','18:00','18:30','19:00','19:30'];
  const selected = '18:00';
  const slotsHtml = slots.map(s =>
    `<button class="ep__slot${s === selected ? ' ep__slot--selected' : ''}" type="button"
       onclick="epSelectSlot(this)">${s}</button>`
  ).join('');

  return `<div class="ep ep--open" id="ep-1">
    <div class="ep__header" onclick="epToggle('ep-1')">
      <div class="ep__header-left">
        <span class="ep__title">Juliette MONTAIGU</span>
        <span class="ep__tag ep__tag--info">Sélectionné : 18:00 - 19:30</span>
        <span class="ep__desc">Ménage・Garde d'enfants</span>
      </div>
      <div class="ep__header-right">
        <span class="ep__chevron">${mi('keyboard_arrow_down', 24)}</span>
      </div>
    </div>
    <div class="ep__divider"></div>
    <div class="ep__body">
      <span class="ep__section-title">Sélection l'heure de début du créneau</span>
      <div class="ep__time-slots">${slotsHtml}</div>
      <div>
        <button class="ep__btn-ghost" type="button">
          ${mi('edit', 16)} Personnaliser l'heure de début
        </button>
      </div>
    </div>
  </div>`;
}

// ── Panel 2 : Plage horaire hebdomadaire ──
function panel2() {
  function timeRow(debut, fin) {
    return `<div class="ep__time-row">
      ${ffSelect('Début', debut)}
      ${ffSelect('Fin', fin)}
      ${delBtn()}
    </div>`;
  }

  return `<div class="ep ep--open" id="ep-2">
    <div class="ep__header" onclick="epToggle('ep-2')">
      <div class="ep__header-left">
        <span class="ep__title">Lun, mar, mer</span>
        <span class="ep__desc">8:00 - 12:00・14:00 - 18:00</span>
      </div>
      <div class="ep__header-right">
        <span class="ep__chevron">${mi('keyboard_arrow_down', 24)}</span>
      </div>
    </div>
    <div class="ep__divider"></div>
    <div class="ep__body">
      <div class="ep__form-group">
        ${ffSelectFull('Jours', 'Lundi, Mardi, Mercredi')}
        ${timeRow('08:00', '12:00')}
        ${timeRow('14:00', '18:00')}
      </div>
      <div class="ep__footer">
        <button class="ep__btn-ghost" type="button">Supprimer la plage</button>
        <button class="ep__btn-tonal" type="button">Ajouter un créneau</button>
      </div>
    </div>
  </div>`;
}

export const variants = [
  {
    label: 'Expansion Panel',
    description: "Deux panels ouverts : sélecteur de créneaux horaires et configuration de plages hebdomadaires avec selects Début/Fin.",
    render: () => `<div style="width:100%;">${panel1()}${panel2()}</div>`,
  },
];

export const script = `
  function epToggle(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('ep--open');
  }

  function epSelectSlot(btn) {
    const row = btn.closest('.ep__time-slots');
    if (!row) return;
    row.querySelectorAll('.ep__slot').forEach(s => s.classList.remove('ep__slot--selected'));
    btn.classList.add('ep__slot--selected');
  }
`;
