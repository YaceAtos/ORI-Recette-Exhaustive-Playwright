# 📊 ANALYSE AUTOMATISATION PAR BRIQUE — Orion INT2

## 🎯 RÉSUMÉ EXÉCUTIF

| Brique | Parties Créables | Scénarios Automatisables | JDD Scenarios | Estimé Temps Tests | État |
|--------|------------------|--------------------------|---------------|--------------------|------|
| **MP4 — CLIENTS** (Leads) | 12+ | 15-20 | 12 ✅ | 1-2 min | Partiellement couvert |
| **MP4 — CLIENTS** (Prospects) | 8-12 | 12-18 | À créer | 2-3 min | À implémenter |
| **MP4 — CLIENTS** (Devis) | 6-8 | 10-12 | À créer | 1-2 min | À implémenter |
| **MP4 — CLIENTS** (Facturation) | 5-6 | 8-10 | À créer | 1-2 min | À implémenter |
| **MP5 — PLANNING** | 8-12 | 15-20 | 12 ✅ | 2-3 min | Partiellement couvert |
| **MP5 — CADRE OPÉRATIONNEL** | 4-6 | 8-12 | À créer | 1-2 min | À implémenter |
| **MP6 — FACTURATION/AIDES** | 6-8 | 12-15 | À créer | 2-3 min | À implémenter |
| **MP3 — COLLABORATEURS** | 8-10 | 12-15 | À créer | 2-3 min | À implémenter |
| **TRANSVERSE** | 10-15 | 20-30 | À créer | 3-5 min | À implémenter |
| **TOTAL** | **67-89** | **112-151** | **24/36** | **15-23 min** | **33% couvert** |

---

## 🔍 DÉTAIL PAR BLOC

### 🟢 MP4 — GESTION COMMERCIALE

#### **MP4.1 — CLIENTS / LEADS** ✅ (Partiellement couvert)

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | JDD | État |
|---|---|---|---|---|---|
| 1 | **Création Lead** | Création manuelle, import CSV, webhook | 4-5 | leadNouveau, leadQualifie | ✅ JDD-001 |
| 2 | **Filtrage par Statut** | Nouveau, Qualifié, EnCours, Fermé, Converti | 5 | leadNouveau → leadConverti | ✅ JDD-001 |
| 3 | **Recherche Email** | Search + combinaison filtres | 3 | leadQualifie (search "dubois") | ✅ JDD-003 |
| 4 | **Filtrage par Date** | < 24h, < 7j, < 30j, > 60j inactifs | 4 | leadNouveau (< 24h), leadAncien (> 60j) | ✅ JDD-002 |
| 5 | **Filtrage par Type** | PP vs PM, petit/moyen/grand budget | 3 | leadEnCours, leadHauteValeur (PM) | ✅ JDD-004 |
| 6 | **Scoring Lead** | Score 0-100, progression, bonus URGENT | 6 | SCORE-001 → SCORE-012 | ✅ SCORE-* |
| 7 | **Devis Status** | EnCours, Signé, Refusé, Expiré | 4 | leadAvecDevis | ✅ JDD-006 |
| 8 | **Détection Doublons** | Email / SIRET déjà existant | 2 | leadDoublon1/2 | ✅ JDD-010 |
| 9 | **Qualification Formulaire** | Recueil besoins, budget, urgence | 3-4 | À compléter | À créer |
| 10 | **Conversion Client** | Lead → Client PP contrat | 2-3 | À créer | À créer |
| 11 | **Tags/Flags métier** | URGENT, À compléter, Incomplet | 3-4 | leadUrgent, leadPetit | ✅ JDD-009/011 |
| 12 | **Reset Filtres** | Réinitialiser tous les filtres | 1 | — | ✅ JDD-012 |

**Sous-total JDD MP4.1** : **12 scénarios** (leadNouveau, leadQualifie, leadEnCours, leadFermé, leadConverti, leadAncien, leadAvecDevis, leadHauteValeur, leadPetit, leadUrgent, leadDoublon1, leadDoublon2)

#### **MP4.2 — CLIENTS & PROSPECTS** (À implémenter)

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | État |
|---|---|---|---|---|
| 1 | **Création Client PP** | Formulaire complet, validation données | 3 | À créer |
| 2 | **Création Client Pro (SIRENE)** | Validation SIRET/SIREN, Luhn-check | 3 | À créer |
| 3 | **Hiérarchie Entité** | Mère/sites, contrats attachés | 2 | À créer |
| 4 | **Filtrage par Type** | PP vs PM, statut contrat | 3 | À créer |
| 5 | **Habilitations/Cône Visibilité** | Multi-agences, droits d'accès | 2 | À créer |
| 6 | **Consentement RGPD** | Acceptation, révocation | 2 | À créer |
| 7 | **Historique Modifications** | Audit trail client | 1 | À créer |
| 8 | **Export Données** | PDF, CSV, fichiers | 2 | À créer |

**Sous-total MP4.2** : **8-12 scénarios** → **À créer**

#### **MP4.3 — DEVIS & CONTRACTS** (À implémenter)

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | État |
|---|---|---|---|---|
| 1 | **Création Devis** | À partir du lead qualifié | 2 | À créer |
| 2 | **Calcul Montants** | Tarifs × services + TVA, frais | 2 | À créer |
| 3 | **Signatures Devis** | E-signature, PDF généré | 2 | À créer |
| 4 | **Statuts Devis** | Brouillon, Envoyé, Signé, Refusé, Expiré | 3 | À créer |
| 5 | **Génération Contrat** | Devis signé → contrat | 2 | À créer |
| 6 | **Validations Métier** | Montants min/max, durée service | 2 | À créer |

**Sous-total MP4.3** : **6-8 scénarios** → **À créer**

#### **MP4.4 — REGLEMENTS & FACTURES** (À implémenter)

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | État |
|---|---|---|---|---|
| 1 | **Génération Facture** | Depuis planning + pointages | 2 | À créer |
| 2 | **Calculs Montants** | Interventions × tarifs, aides financières | 2 | À créer |
| 3 | **Statuts Facture** | COLLECTE, EN_ANOMALIE, ARCHIVE | 2 | À créer |
| 4 | **Aides Financières** | OF, PAP, CDA, PEC | 2 | À créer |
| 5 | **Avoir/Avoir de Compensation** | Annulation → crédit | 1 | À créer |

**Sous-total MP4.4** : **5-6 scénarios** → **À créer**

**TOTAL MP4** : **31-38 parties** | **47-56 scénarios** | **12 JDD ✅** | **15-20 min auto**

---

### 🟡 MP5 — PLANNING & INTERVENTIONS

#### **MP5.1 — PLANNING INTERVENTIONS** ✅ (Partiellement couvert)

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | JDD | État |
|---|---|---|---|---|---|
| 1 | **Création Intervention** | Manuelle, depuis lead/client | 2 | À créer | À créer |
| 2 | **Filtrage par Intervenant** | Vue par collaborateur | 2 | À créer | À créer |
| 3 | **Filtrage par Client** | Vue planning client | 2 | À créer | À créer |
| 4 | **Filtrage par Statut** | Prévue, EnCours, Complétée, Annulée | 3 | À créer | À créer |
| 5 | **Annulation AVANT exécution** | Statut → Annulée | 1 | ANNUL-001 | ✅ ANNUL-001 |
| 6 | **Annulation EN COURS** | Interrompue, pointage invalide | 1 | ANNUL-002 | ✅ ANNUL-002 |
| 7 | **Annulation APRES pointage** | Pointage invalidé, audit | 1 | ANNUL-003 | ✅ ANNUL-003 |
| 8 | **Annulation Série Occurrence** | Une seule occurrence annulée | 1 | ANNUL-004 | ✅ ANNUL-004 |
| 9 | **Annulation Série Complète** | Toutes occurrences annulées | 1 | ANNUL-005 | ✅ ANNUL-005 |
| 10 | **Motif Annulation Obligatoire** | Validation motif requis | 1 | ANNUL-006 | ✅ ANNUL-006 |
| 11 | **Replanification Auto** | Flag replan intervenant indisponible | 1 | ANNUL-007 | ✅ ANNUL-007 |
| 12 | **Compensation Crédit** | Annulation → crédit client appliqué | 1 | ANNUL-008 | ✅ ANNUL-008 |
| 13 | **Facturée Avec Avoir** | Intervention facturée → avoir créé | 1 | ANNUL-009 | ✅ ANNUL-009 |
| 14 | **Urgence SMS** | Annulation < 2h → SMS intervenant | 1 | ANNUL-010 | ✅ ANNUL-010 |
| 15 | **Annulation Partielle** | Durée réduite (120→60 min) | 1 | ANNUL-011 | ✅ ANNUL-011 |
| 16 | **Audit Trail** | Qui, quand, pourquoi enregistrés | 1 | ANNUL-012 | ✅ ANNUL-012 |

**Sous-total JDD MP5.1** : **12 scénarios annulation** + **6-8 scénarios création/filtrage**

#### **MP5.2 — CADRE OPÉRATIONNEL** (À implémenter)

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | État |
|---|---|---|---|---|
| 1 | **Routage Facturation/Paie** | DMN décision (DT1/DT2) | 2 | À créer |
| 2 | **Classification CO** | Succursale, franchise, prestataire | 2 | À créer |
| 3 | **Mandataire Paie** | Gestion mandataire | 1 | À créer |
| 4 | **Flux CO→Facturation** | Déclenchement facturation | 1 | À créer |

**Sous-total MP5.2** : **4-6 scénarios** → **À créer**

**TOTAL MP5** : **20-26 parties** | **22-30 scénarios** | **12 JDD ✅** | **3-5 min auto**

---

### 🟠 MP6 — FACTURATION & AIDES

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | État |
|---|---|---|---|---|
| 1 | **Aides Financières** | OF, PAP, CDA, PEC, statuts | 3 | À créer |
| 2 | **Table de Faits** | 6 blocs × 102 attributs, statuts COLLECTE/EN_ANOMALIE/ARCHIVE | 2 | À créer |
| 3 | **Cockpit Facturation** | Vue globale, filtres anomalies | 2 | À créer |
| 4 | **Routage DMN** | Décision facturation/paie | 2 | À créer |
| 5 | **Correction Anomalies** | EN_ANOMALIE → correction +7j | 2 | À créer |
| 6 | **Export Données** | Fichiers paie Pléiade, OGUST | 2 | À créer |

**Sous-total MP6** : **6-8 scénarios** → **À créer** | **2-3 min auto**

---

### 🔵 MP3 — COLLABORATEURS

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | État |
|---|---|---|---|---|
| 1 | **Création Intervenant** | Formulaire complet | 2 | À créer |
| 2 | **Compétences** | Attribution, validation | 2 | À créer |
| 3 | **Contrats** | Types, durée, statuts | 2 | À créer |
| 4 | **GTA (Gestion Temps)** | Absences, ATT, paie | 2 | À créer |
| 5 | **Habilitations/Droits** | Profils, permissions | 2 | À créer |
| 6 | **Historique Modifications** | Audit trail | 1 | À créer |

**Sous-total MP3** : **8-10 scénarios** → **À créer** | **2-3 min auto**

---

### ⚪ TRANSVERSE — Règles Génériques UI

**Parties créables et automatisables** :

| # | Fonctionnalité | Description | Scénarios Auto | État |
|---|---|---|---|---|
| 1 | **Pagination** | Navigation pages, taille page | 3 | À créer |
| 2 | **Modales** | Création, confirmation, erreurs | 4 | À créer |
| 3 | **Notifications** | Success, warning, error, info | 4 | À créer |
| 4 | **Formulaires** | Validation, messages erreur | 3 | À créer |
| 5 | **Filtres Avancés** | Multi-critères, reset, sauvegarde | 3 | À créer |
| 6 | **Navigation Menu** | Cône visibilité, permissions | 2 | À créer |
| 7 | **Bandeau Agence** | Commutateur agence, contexte | 2 | À créer |
| 8 | **Recherche Globale** | Search cross-domaine | 2 | À créer |
| 9 | **Export/Import** | CSV, PDF, fichiers | 2 | À créer |
| 10 | **Audit Trail** | Historique modifications | 1 | À créer |

**Sous-total TRANSVERSE** : **10-15 scénarios** → **À créer** | **3-5 min auto**

---

## 📈 MATRICE RÉCAPITULATIVE

### Par bloc

```
┌─────────────────────┬─────────┬──────────┬─────────┬─────────┐
│ Bloc                │ Parties │ Scénarios│ JDD ✅  │ Couvert │
├─────────────────────┼─────────┼──────────┼─────────┼─────────┤
│ MP4 — CLIENTS       │ 31-38   │ 47-56    │ 12 ✅   │ 21%     │
│ MP5 — PLANNING      │ 20-26   │ 22-30    │ 12 ✅   │ 40%     │
│ MP6 — FACTURATION   │ 6-8     │ 12-15    │ 0       │ 0%      │
│ MP3 — COLLAB        │ 8-10    │ 12-15    │ 0       │ 0%      │
│ TRANSVERSE          │ 10-15   │ 20-30    │ 0       │ 0%      │
├─────────────────────┼─────────┼──────────┼─────────┼─────────┤
│ TOTAL               │ 75-97   │ 113-146  │ 24 ✅   │ 21%     │
└─────────────────────┴─────────┴──────────┴─────────┴─────────┘
```

---

## 🎯 OPPORTUNITÉS D'AUTOMATISATION (Priority Order)

### **PHASE 5 — HIGH IMPACT (Immédiates)**

1. **MP4.2 — Clients & Prospects** (12-18 scénarios)
   - ✅ Dépend de: MP4.1 existant
   - 🎬 Pattern éprouvé (leads → prospects)
   - ⏱️ Estimé: 2-3 heures

2. **MP5.2 — Cadre Opérationnel** (4-6 scénarios)
   - ✅ DMN routing testable
   - ⏱️ Estimé: 1-2 heures

3. **MP4.3 — Devis & Contracts** (6-8 scénarios)
   - ✅ Dépend de: MP4.1/MP4.2
   - ⏱️ Estimé: 2-3 heures

### **PHASE 6 — MEDIUM IMPACT**

4. **MP6 — Facturation/Aides** (12-15 scénarios)
   - 🔑 Critique: Table de faits (6 blocs × 102 attributs)
   - ⏱️ Estimé: 4-6 heures

5. **MP3 — Collaborateurs** (12-15 scénarios)
   - ✅ Indépendant, peu de dépendances
   - ⏱️ Estimé: 3-4 heures

### **PHASE 7 — TRANSVERSE FOUNDATION**

6. **Transverse — UI Génériques** (20-30 scénarios)
   - 🎯 Bénéficiera tous les blocs
   - ⏱️ Estimé: 4-5 heures

---

## 📊 PROJECTION COMPLÈTE

| Phase | Bloc | Scénarios | JDD | Temps | Cumul |
|-------|------|-----------|-----|-------|-------|
| **P4 ✅** | MP4.1 + MP5.1 | 24 | 24 | 1-2 min | 24 ✅ |
| **P5** | MP4.2 + MP5.2 + MP4.3 | 22-32 | 22-32 | 5-8 min | 46-56 |
| **P6** | MP6 + MP3 | 24-30 | 24-30 | 7-10 min | 70-86 |
| **P7** | Transverse | 20-30 | 20-30 | 5-8 min | 90-116 |
| **TOTAL** | **Orion Complete** | **90-116** | **90-116** | **18-28 min** | **~110 ✅** |

**Couverture projetée** : 110+ scenarios testés + automatisés = **Recette complète Orion**

---

## ✅ RECOMMANDATIONS

### Court terme (Cette semaine)
1. ✅ Phase 4 complétée : 36/36 JDD ✅
2. → Passer à **Phase 5**: MP4.2 (Clients & Prospects) + MP5.2 (Cadre Opérationnel)

### Moyen terme (2-3 semaines)
3. → Phase 6: MP6 (Facturation) + MP3 (Collaborateurs)
4. → Consolidation: 80+ scenarios total

### Long terme (CI/CD)
5. → Transverse UI (Phase 7) → Pipeline automation complète

---

**Prochaine étape** : Veux-tu que j'implémente Phase 5 (MP4.2 + MP5.2) ? 🚀
