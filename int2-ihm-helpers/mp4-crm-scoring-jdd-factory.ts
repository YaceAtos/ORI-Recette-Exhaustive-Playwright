/**
 * MP4 CRM — Scoring Lead JDD Factory
 * 12 scénarios pondération scoring automatique
 */

export const MP4_SCORING_JDD = {
  scoreRejeté: {
    nom: 'Petit Prospect Rejeté',
    type: 'PP',
    budgetEstime: 100,
    besoinsPrincipal: 'Ponctuellement',
    statut: 'Nouveau',
    expectedScore: 15,
  },

  scoreFaible: {
    nom: 'PM Moyen Faible',
    type: 'PM',
    budgetEstime: 5000,
    besoinsPrincipal: 'Services réguliers',
    statut: 'Nouveau',
    nbInteractions: 1,
    expectedScore: 45,
  },

  scoreMoyen: {
    nom: 'Lead Moyen Qualifié',
    type: 'PP',
    budgetEstime: 10000,
    statut: 'Qualifié',
    nbInteractions: 3,
    rdvPrevu: true,
    expectedScore: 70,
  },

  scoreExcellent: {
    nom: 'EHPAD Excellent',
    type: 'PM',
    budgetEstime: 100000,
    statut: 'Qualifié',
    nbInteractions: 8,
    rdvPrevu: true,
    devisGenere: true,
    expectedScore: 95,
  },

  scoreConverti: {
    nom: 'Lead Converti Confirmé',
    type: 'PM',
    budgetEstime: 25000,
    statut: 'Converti',
    nbInteractions: 10,
    expectedScore: 100,
  },

  scoreFermé: {
    nom: 'Lead Fermé Volontaire',
    type: 'PP',
    budgetEstime: 3000,
    statut: 'Fermé',
    motifFermeture: 'Client refusé',
    expectedScore: 0,
  },

  scoreInactif: {
    nom: 'Lead Oublié',
    type: 'PP',
    budgetEstime: 8000,
    statut: 'Nouveau',
    derniereInteraction: new Date(Date.now() - 7776000000),
    expectedScore: 5,
  },

  scoreUrgent: {
    nom: 'Lead Urgent HotSale',
    type: 'PM',
    budgetEstime: 50000,
    priorite: 'URGENTE',
    besoinDate: new Date(Date.now() + 86400000),
    statut: 'Qualifié',
    expectedScore: 90,
  },

  scoreAvecDevis: {
    nom: 'Lead Devis Envoyé',
    type: 'PM',
    budgetEstime: 15000,
    statut: 'En cours',
    nbInteractions: 4,
    devisGenere: true,
    dateDevisEnvoi: new Date(Date.now() - 86400000),
    expectedScore: 65,
  },

  scoreRechute: {
    nom: 'Lead Rechute',
    type: 'PM',
    budgetEstime: 20000,
    statut: 'Qualifié',
    dateQualification: new Date(Date.now() - 1209600000),
    derniereInteraction: new Date(Date.now() - 604800000),
    expectedScore: 40,
  },

  scoreRecalcule: {
    nom: 'Lead Recalc',
    type: 'PP',
    budgetEstime: 12000,
    statut: 'En cours',
    nbInteractions: 5,
    dateRecalcul: new Date(Date.now()),
    expectedScore: 62,
  },

  scoreVIP: {
    nom: 'VIP Référent',
    type: 'PM',
    budgetEstime: 200000,
    statut: 'Qualifié',
    flagVIP: true,
    priorite: 'VIP',
    expectedScore: 100,
  },
};

export function getScoreByScenario(scenario: keyof typeof MP4_SCORING_JDD) {
  return MP4_SCORING_JDD[scenario];
}

export function getAllScoreScenarios() {
  return Object.values(MP4_SCORING_JDD);
}
