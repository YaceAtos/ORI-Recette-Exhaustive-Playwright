/**
 * MP4 CRM — Leads JDD Factory
 * 12 scénarios intelligents pour tester les filtres & création leads
 */

export const MP4_LEADS_JDD = {
  // Scénario 1: Lead nouveau (< 24h, non qualifié)
  leadNouveau: {
    nom: 'Nouveau Lead Bordeaux',
    email: 'new.lead@example.fr',
    telephone: '+33 6 11 22 33 44',
    statut: 'Nouveau',
    dateCreation: new Date(Date.now() - 3600000), // 1h ago
    type: 'PP',
    ville: 'Bordeaux',
    codePostal: '33000',
    besoinsPrincipal: 'Aide ménagère',
    scoringLeadValue: 20,
  },

  // Scénario 2: Lead qualifié (48h, conversion possible)
  leadQualifie: {
    nom: 'Dubois Qualifié',
    email: 'dubois.qualified@example.fr',
    telephone: '+33 6 22 33 44 55',
    statut: 'Qualifié',
    dateCreation: new Date(Date.now() - 172800000),
    type: 'PP',
    ville: 'Libourne',
    codePostal: '33500',
    besoinsPrincipal: 'Aide ménagère + Soutien personnalisé',
    scoringLeadValue: 75,
  },

  // Scénario 3: Lead en cours (RDV pris, timeline longue)
  leadEnCours: {
    nom: 'Martin En Cours',
    email: 'martin.ongoing@example.fr',
    telephone: '+33 6 33 44 55 66',
    statut: 'En cours',
    dateCreation: new Date(Date.now() - 604800000),
    type: 'PM',
    ville: 'Talence',
    codePostal: '33400',
    besoinsPrincipal: 'Lots services résidences',
    rdvPrevu: new Date(Date.now() + 604800000),
    scoringLeadValue: 65,
  },

  // Scénario 4: Lead fermé
  leadFermé: {
    nom: 'Fernandes Fermé',
    email: 'fernandes.closed@example.fr',
    telephone: '+33 6 44 55 66 77',
    statut: 'Fermé',
    motifFermeture: 'Client refusé',
    dateCreation: new Date(Date.now() - 259200000),
    type: 'PP',
    ville: 'Pessac',
    codePostal: '33600',
    besoinsPrincipal: 'Aide ménagère',
    scoringLeadValue: 20,
  },

  // Scénario 5: Lead converti
  leadConverti: {
    nom: 'Laurent Converti',
    email: 'laurent.converted@example.fr',
    telephone: '+33 6 55 66 77 88',
    statut: 'Converti',
    dateCreation: new Date(Date.now() - 2592000000),
    type: 'PP',
    ville: 'Mérignac',
    codePostal: '33700',
    besoinsPrincipal: 'Aide ménagère',
    dateConversion: new Date(Date.now() - 604800000),
    scoringLeadValue: 100,
  },

  // Scénario 6: Lead ancien non touché
  leadAncien: {
    nom: 'Gérard Inactif',
    email: 'gerard.old@example.fr',
    telephone: '+33 6 66 77 88 99',
    statut: 'Nouveau',
    dateCreation: new Date(Date.now() - 5184000000),
    type: 'PP',
    ville: 'Saint-Médard',
    codePostal: '33160',
    besoinsPrincipal: 'Aide ménagère',
    scoringLeadValue: 5,
  },

  // Scénario 7: Lead avec devis
  leadAvecDevis: {
    nom: 'Bonnet Devis',
    email: 'bonnet.quote@example.fr',
    telephone: '+33 6 77 88 99 00',
    statut: 'En cours',
    dateCreation: new Date(Date.now() - 259200000),
    type: 'PM',
    ville: 'Arcachon',
    codePostal: '33120',
    besoinsPrincipal: 'Service nettoyage entreprise',
    devisAttache: true,
    statusDevis: 'En préparation',
    scoringLeadValue: 60,
  },

  // Scénario 8: Lead haute valeur
  leadHauteValeur: {
    nom: 'EHPAD Les Pins Parasol',
    email: 'contact@les-pins-parasol.fr',
    telephone: '+33 5 56 10 20 30',
    statut: 'Qualifié',
    dateCreation: new Date(Date.now() - 86400000),
    type: 'PM',
    ville: 'Gujan-Mestras',
    codePostal: '33470',
    besoinsPrincipal: 'Lots services EHPAD',
    nombreLits: 120,
    budgetEstime: 50000,
    scoringLeadValue: 95,
  },

  // Scénario 9: Lead petit client
  leadPetit: {
    nom: 'Dupont Petit',
    email: 'dupont.small@example.fr',
    telephone: '+33 6 88 99 00 11',
    statut: 'Qualifié',
    dateCreation: new Date(Date.now() - 172800000),
    type: 'PP',
    ville: 'Créon',
    codePostal: '33670',
    besoinsPrincipal: 'Aide ménagère ponctuelle',
    budgetEstime: 300,
    scoringLeadValue: 40,
  },

  // Scénario 10: Lead urgent
  leadUrgent: {
    nom: 'Rossi Urgent',
    email: 'rossi.urgent@example.fr',
    telephone: '+33 6 99 00 11 22',
    statut: 'Qualifié',
    dateCreation: new Date(Date.now() - 3600000),
    type: 'PP',
    ville: 'Floirac',
    codePostal: '33270',
    besoinsPrincipal: 'Urgence aide ménagère',
    priorite: 'URGENTE',
    dateBesoinsPrevu: new Date(Date.now() + 172800000),
    scoringLeadValue: 80,
  },

  // Scénario 11-12: Doublons
  leadDoublon1: {
    nom: 'Moreau Doublon A',
    email: 'contact.moreau@example.fr',
    telephone: '+33 6 10 11 12 13',
    statut: 'Nouveau',
    dateCreation: new Date(Date.now() - 604800000),
    type: 'PP',
    scoringLeadValue: 30,
  },

  leadDoublon2: {
    nom: 'Moreau Doublon B',
    email: 'contact.moreau@example.fr',
    telephone: '+33 6 20 21 22 23',
    statut: 'En cours',
    dateCreation: new Date(Date.now() - 86400000),
    type: 'PP',
    scoringLeadValue: 50,
  },
};

export function getLeadByScenario(scenario: keyof typeof MP4_LEADS_JDD) {
  return MP4_LEADS_JDD[scenario];
}

export function getAllLeads() {
  return Object.values(MP4_LEADS_JDD);
}
