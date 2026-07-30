/**
 * MP5 Planning — Annulation Intervention JDD Factory
 * 12 scénarios complets pour annulation (avant/après/pointage/série/etc)
 */

export const MP5_ANNULATION_JDD = {
  // Scénario 1: Annulation AVANT intervention (planifiée aujourd'hui)
  annulationAvant: {
    interventionId: 'int-' + Date.now(),
    clientName: 'Rousseau Nathan',
    datePrevue: new Date(Date.now() + 3600000),
    heurePrevue: '14:00',
    duree: 60,
    intervenant: 'Marie Dupont',
    motifAnnulation: 'Client décalage horaire demandé',
    type: 'AVANT_EXECUTION',
    expectedStatus: 'Annulée',
  },

  // Scénario 2: Annulation EN COURS (pendant exécution)
  annulationEnCours: {
    interventionId: 'int-' + (Date.now() + 1000),
    clientName: 'Dubois Pierre',
    datePrevue: new Date(Date.now()),
    heurePrevue: '10:00',
    heureDebut: '10:05',
    duree: 90,
    motifAnnulation: 'Client urgence médicale',
    type: 'PENDANT_EXECUTION',
    expectedStatus: 'Interrompue',
  },

  // Scénario 3: Annulation APRÈS pointage validé
  annulationApresPointage: {
    interventionId: 'int-' + (Date.now() + 2000),
    clientName: 'Martin Alice',
    datePrevue: new Date(Date.now() - 3600000),
    heurePrevue: '09:00',
    duree: 120,
    heureDebut: '09:00',
    heureFin: '11:00',
    pointageEtat: 'Validé',
    pointageId: 'pt-12345',
    motifAnnulation: 'Erreur saisie pointage',
    type: 'APRES_POINTAGE',
    expectedStatus: 'Annulée (pointage invalidé)',
  },

  // Scénario 4: Annulation d'une occurrence dans série RRULE
  annulationSerie: {
    serieId: 'serie-rec-001',
    clientName: 'Bernard Société',
    dateDebut: new Date(Date.now() - 2592000000),
    rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=12',
    occurrence: 3,
    motifAnnulation: 'Réduction services client',
    type: 'SERIE_OCCURRENCE',
    expectedStatus: 'Occurrence annulée, série continue',
  },

  // Scénario 5: Annulation TOUTE une série
  annulationTouteSerie: {
    serieId: 'serie-rec-002',
    clientName: 'Laurent SARL',
    rrule: 'FREQ=WEEKLY;BYDAY=TU,TH',
    nbOccurrencesRestantes: 8,
    motifAnnulation: 'Fermeture temporaire entreprise',
    type: 'ANNUL_SERIE_COMPLETE',
    expectedStatus: '8 interventions annulées',
  },

  // Scénario 6: Annulation SANS motif (motif = requis)
  annulationSansMotif: {
    interventionId: 'int-' + (Date.now() + 3000),
    clientName: 'Petit Claude',
    datePrevue: new Date(Date.now() + 7200000),
    motif: null,
    type: 'MOTIF_MISSING',
    expectedError: 'Motif annulation requis',
  },

  // Scénario 7: Annulation intervenant responsable (indisponibilité)
  annulationIntervenant: {
    interventionId: 'int-' + (Date.now() + 4000),
    clientName: 'Rossi Jeanne',
    datePrevue: new Date(Date.now() + 86400000),
    intervenant: 'Sophie Martin',
    motifAnnulation: 'Indisponibilité intervenant (maladie)',
    type: 'INTERVENANT_INDISPONIBLE',
    replanification: true,
    expectedStatus: 'Annulée + Flaggée pour replanification',
  },

  // Scénario 8: Annulation avec compensation client
  annulationAvecCompensation: {
    interventionId: 'int-' + (Date.now() + 5000),
    clientName: 'Gérard Marie-Jo',
    datePrevue: new Date(Date.now() + 172800000),
    tarif: 45.00,
    motifAnnulation: 'Erreur planning (double réservation)',
    compensation: true,
    montantCredit: 45.00,
    expectedStatus: 'Annulée + Crédit appliqué',
  },

  // Scénario 9: Annulation intervention facturée
  annulationFacturee: {
    interventionId: 'int-' + (Date.now() + 6000),
    clientName: 'Bonnet Santé',
    datePrevue: new Date(Date.now() - 604800000),
    duree: 120,
    tarif: 85.00,
    factureId: 'FA-2026-001',
    etatFacture: 'Validée',
    motifAnnulation: 'Correction en accord client',
    type: 'INTERVENTION_FACTUREE',
    expectedStatus: 'Annulée (avoir créé)',
  },

  // Scénario 10: Annulation urgente (< 2h avant)
  annulationUrgente: {
    interventionId: 'int-' + (Date.now() + 7000),
    clientName: 'Moreau Urgence',
    datePrevue: new Date(Date.now() + 3600000),
    delaiAnnulation: 60,
    motifAnnulation: 'Annulation client urgent',
    type: 'ANNUL_URGENTE',
    notificationIntervenant: true,
    expectedStatus: 'Annulée + Notification urgente',
  },

  // Scénario 11: Annulation partielle (réduction durée)
  annulationPartielle: {
    interventionId: 'int-' + (Date.now() + 8000),
    clientName: 'Fernandes Réduit',
    datePrevue: new Date(Date.now() + 259200000),
    dureePrevue: 120,
    dureeAnnulee: 60,
    motifAnnulation: 'Réduction service client',
    type: 'REDUCTION_DUREE',
    expectedStatus: 'Modifiée (60 min au lieu de 120)',
  },

  // Scénario 12: Annulation avec audit trail complet
  annulationAvecAudit: {
    interventionId: 'int-' + (Date.now() + 9000),
    clientName: 'Xxx Audit Trail',
    datePrevue: new Date(Date.now() + 432000000),
    motifAnnulation: 'Test audit trail',
    type: 'AUDIT_TRAIL_TEST',
    expectedStatus: 'Annulée (audit enregistré)',
  },
};

export function getAnnulationByScenario(scenario: keyof typeof MP5_ANNULATION_JDD) {
  return MP5_ANNULATION_JDD[scenario];
}

export function getAllAnnulationScenarios() {
  return Object.values(MP5_ANNULATION_JDD);
}
