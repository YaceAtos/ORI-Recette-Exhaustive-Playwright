/**
 * Configuration des environnements et routes Orion
 * 
 * Responsabilité : URLs et navigation uniquement.
 * Les données de test sont dans int2-ihm-fixtures/
 * 
 * Usage :
 *   import { ENV, routes } from '../env.config';
 *   await page.goto(routes.clientPlanAide(clientId));
 */

// ─── Environnements ───
const ENVS = {
  dev1: {
    baseUrl: 'https://orion-dev1.itsap.net',
    description: 'Env développement — CRM, Aides financières, Planning',
  },
  int1: {
    baseUrl: 'https://orion-int1.itsap.net',
    description: 'Env intégration — Planning (données séparées)',
  },
  int2: {
    baseUrl: 'https://orion-int2.itsap.net',
    description: 'Env intégration INT2 — parcours transverses IHM',
  },
} as const;

// Env actif force sur INT2 pour tous les parcours automation de ce workspace.
const ACTIVE_ENV: keyof typeof ENVS = 'int2';
export const ENV = ENVS[ACTIVE_ENV];

// ─── Routes par module ───
export const routes = {
  // MP1 — Structure
  structureMarques: () => `${ENV.baseUrl}/gestion-marque/structure/pages/marque`,
  structureStructures: () => `${ENV.baseUrl}/gestion-marque/structure/pages/structure`,

  // MP1 — SP1.5 Habilitation / Profils (micro-frontend gestion-marque)
  habilitationProfils: () => `${ENV.baseUrl}/gestion-marque/habilitation/pages/habilitation-profils`,

  // MP2 — Catalogue
  catalogueFamilles: () => `${ENV.baseUrl}/offres-tarifs/pages/catalogue/familles`,
  catalogueOptions: () => `${ENV.baseUrl}/offres-tarifs/pages/catalogue/options`,

  // MP3 — Collaborateurs
  collaborateurs: () => `${ENV.baseUrl}/gestion-admin/pages/collaborateur`,

  // MP5 — Planning
  planning: () => `${ENV.baseUrl}/sap/pages/planning`,

  // MP4 — Commercial / CRM
  clientsList: () => `${ENV.baseUrl}/crm/pages/clients-prospects`,
  clientFiche: (clientId: string) => `${ENV.baseUrl}/crm/pages/clients-prospects/${clientId}`,
  clientPlanAide: (clientId: string) => `${ENV.baseUrl}/crm/pages/clients-prospects/${clientId}/plan-aide`,

  // MP6 — Facturation / Aides
  organismeFinanceurList: () => `${ENV.baseUrl}/facturation-paie/pages/organisme-financeur`,
  organismeFinanceurDetail: (ofId: string) => `${ENV.baseUrl}/facturation-paie/pages/organisme-financeur/${ofId}`,
};
