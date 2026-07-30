# 00 — Contexte produit Orion

> Vision globale et périmètre d'Orion, la plateforme SaaS unifiée OuiCare pour les services à la personne (SAP). Couvre la chaîne complète de la structure juridique à la facturation/paie. Utilisé comme référence d'entrée pour comprendre le produit, les personas et la stack technique.

| Meta | Valeur |
|------|--------|
| **Tags** | Orion, OuiCare, SaaS, SAP, services à la personne, personas, stack technique, Angular, Keycloak, micro-services, RRULE, V0.1 |
| **Source** | Confluence 139689990 (Spécification fonctionnelle d'Orion) — copie socle stable (offline OK) |

## Vision

Orion remplace les outils métier existants d'OuiCare par une plateforme SaaS unifiée couvrant la gestion des services à la personne : de la structuration juridique jusqu'à la facturation/paie.

## Personas principaux

| Persona | Rôle | Usage quotidien |
|---------|------|-----------------|
| Opérationnel agence | Gère planning, clients, intervenants | Planning, affectation, notifications |
| Responsable agence | Supervise l'activité agence | Dashboard, validation, habilitations |
| Gérant franchisé | Dirige sa franchise | Multi-agences, reporting |
| Commercial agence | Prospection, vente | Fiches clients, devis |
| Administrateur Orion | Configure structure + droits | Marques, profils, utilisateurs |
| Intervenant | Réalise les prestations | Planning mobile, pointage |
| Client PP/Pro | Bénéficiaire des prestations | (Interface limitée / externe) |

## Périmètre fonctionnel

```
Structure (marque/société/agence)
  → Catalogue produits (PIM)
    → Commercial (prospects, clients, devis)
      → Planification (interventions, séries, affectation)
        → Facturation (règlothèque aides, collecte données)
          → Paie (export)
```

**Transverses** : auth/habilitations (Keycloak), notifications, pack réglementaire (FR), RGPD.

## Stack technique (déduit)

- Frontend : Angular (Material Angular)
- Auth : Keycloak (SSO, synchronisation profils)
- APIs externes : SIRENE (enrichissement PM), GEOWS (géocodage), iCanopée (SEGUR santé)
- Architecture : micro-services (1 domaine = 1 micro-service)
- Récurrence planning : standard iCalendar RRULE (RFC 5545)

## Livraison

- **Orion V0.1** : recette client prévue 02/2026
- Périmètre V0.1 : structure + habilitations + catalogue + commercial PP/Pro + planning + aides (règlothèque via Excel, pas d'IHM)
