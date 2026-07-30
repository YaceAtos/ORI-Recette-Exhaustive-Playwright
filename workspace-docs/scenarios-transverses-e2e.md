# Scénarios de test transverses — Chaînes E2E Orion

> **Objectif** : scénarios chaînés bout-en-bout simulant des flux métier réels.
> Chaque étape produit des données consommées par l'étape suivante.
> Format cible : transformation en tests Playwright automatisés.

---

## Chaîne 1 — Client particulier domicile (ménage/aide)

**Description** : Parcours complet d'un client particulier depuis la configuration initiale jusqu'à la facturation d'une intervention annulée. Couvre le cœur de métier OuiCare.

**But** : Valider la traversée complète du SI pour le cas nominal PP — le flux le plus fréquent en production.

**MP impactés** : MP1 (Structure) → MP2 (Catalogue) → MP4 (Commercial) → MP5 (Planning) → MP6 (Facturation/Aides)

### Étapes chaînées

| # | Action | MP | Donnée produite | Donnée consommée |
|---|--------|-----|-----------------|------------------|
| 1.1 | Créer une agence dans la structure existante | MP1 | `agence_id` | marque + société existantes |
| 1.2 | Créer un produit service "Ménage 2h" dans le catalogue | MP2 | `produit_id` | — |
| 1.3 | Créer un intervenant rattaché à l'agence | MP3 | `intervenant_id` | `agence_id` |
| 1.4 | Renseigner disponibilités de l'intervenant | MP3 | dispos enregistrées | `intervenant_id` |
| 1.5 | Créer un prospect PP (client particulier) | MP4 | `client_id` | `agence_id` |
| 1.6 | Qualifier le besoin du prospect (formulaire) | MP4 | besoin qualifié | `client_id` |
| 1.7 | Créer un devis ménage (étape 1 : synthèse besoin) | MP4 | `devis_id` | `client_id` + `produit_id` |
| 1.8 | Configurer un OF + CDA (aide ménage) | MP6 | `cda_id` | `agence_id` |
| 1.9 | Appliquer un PAP au client (plan d'aide personnalisé) | MP6 | `pap_id` | `client_id` + `cda_id` |
| 1.10 | Créer une série d'interventions récurrente (lundi 9h-11h) | MP5 | `serie_id` | `client_id` + `produit_id` + `intervenant_id` |
| 1.11 | Vérifier que le batch RRULE génère les interventions | MP5 | `intervention_ids[]` | `serie_id` |
| 1.12 | Consulter le planning vue Clients — vérifier affichage | MP5 | — | `client_id` + `intervention_ids[]` |
| 1.13 | Modifier une intervention (changer horaire) | MP5 | intervention modifiée | `intervention_ids[0]` |
| 1.14 | Annuler une intervention (motif "client absent", délai respecté) | MP5 | intervention annulée + état "non facturée" | `intervention_ids[1]` |
| 1.15 | Vérifier notification émise vers MP3/MP4 | MP5 | notification visible | intervention annulée |

### Assertions clés (Given/When/Then)

```gherkin
Scenario: Chaîne PP domicile complète
  Given une agence "Test Auto" existe dans la structure
  And un produit "Ménage 2h" existe dans le catalogue
  And un intervenant "Jean Dupont" est rattaché à l'agence avec dispos lundi 8h-18h
  And un client PP "Marie Martin" est créé avec besoin qualifié
  And un devis ménage est créé pour ce client
  And un OF "CAF Test" avec CDA ménage est configuré
  And un PAP est appliqué au client

  When je crée une série d'interventions récurrente (lundi 9h-11h, intervenant Jean)
  Then la série est en statut "Planifiée"

  When le batch RRULE s'exécute
  Then des interventions sont créées sur 12 mois glissants
  And chaque intervention est en statut "Pourvue"

  When je consulte le planning vue Clients pour "Marie Martin"
  Then les interventions ménage sont visibles sur les lundis

  When je modifie l'intervention du lundi suivant (9h-11h → 10h-12h)
  Then l'intervention est mise à jour
  And une notification est émise

  When j'annule l'intervention du lundi d'après avec motif "Absence client" et délai respecté
  Then l'intervention passe en statut "Annulée"
  And l'état de facturation est "Non facturée"
  And l'intervention est affichée en transparence sur le planning
```

---

## Chaîne 2 — Client professionnel multi-sites (nettoyage bureaux)

**Description** : Parcours d'onboarding d'une entreprise avec plusieurs sites, création de contrats par site, planification et gestion des notifications inter-modules.

**But** : Valider le modèle hiérarchique Pro (mère/filles), la multi-affectation, et le flux notifications.

**MP impactés** : MP1 (Structure) → MP2 (Catalogue) → MP4 (Commercial) → MP5 (Planning)

### Étapes chaînées

| # | Action | MP | Donnée produite | Donnée consommée |
|---|--------|-----|-----------------|------------------|
| 2.1 | Vérifier structure existante (marque + société + agence) | MP1 | — | config existante |
| 2.2 | Créer un produit service "Nettoyage bureaux 3h" | MP2 | `produit_pro_id` | — |
| 2.3 | Créer 2 intervenants rattachés à l'agence | MP3 | `interv_1_id`, `interv_2_id` | `agence_id` |
| 2.4 | Créer un client mère Pro (PM, SIREN) | MP4 | `client_mere_id` | — |
| 2.5 | Enrichir via API SIRENE (forme juridique, APE) | MP4 | données enrichies | `client_mere_id` |
| 2.6 | Créer 2 sites (clients filles) rattachés à la mère | MP4 | `site_1_id`, `site_2_id` | `client_mere_id` |
| 2.7 | Créer série interventions site 1 (mardi+jeudi 6h-9h, interv_1) | MP5 | `serie_site1_id` | `site_1_id` + `produit_pro_id` + `interv_1_id` |
| 2.8 | Créer série interventions site 2 (lundi+mercredi 18h-21h, interv_2) | MP5 | `serie_site2_id` | `site_2_id` + `produit_pro_id` + `interv_2_id` |
| 2.9 | Batch RRULE → vérifier interventions générées pour les 2 sites | MP5 | interventions créées | `serie_site1_id` + `serie_site2_id` |
| 2.10 | Consulter planning vue Intervenants — vérifier les 2 lignes | MP5 | — | `interv_1_id` + `interv_2_id` |
| 2.11 | Déclarer absence client site 1 (fermeture bureaux 1 semaine) | MP4 | `absence_id` | `site_1_id` |
| 2.12 | Vérifier notification Kafka MP4→MP5 (UPSERT absence) | MP5 | absence visible planning | `absence_id` |
| 2.13 | Vérifier interventions site 1 sur semaine absence : maintien ou non | MP5 | — | `absence_id` + interventions |

### Assertions clés (Given/When/Then)

```gherkin
Scenario: Chaîne Pro multi-sites complète
  Given une structure (marque/société/agence) existe
  And un produit "Nettoyage bureaux 3h" existe
  And 2 intervenants sont actifs dans l'agence

  When je crée un client mère Pro avec SIREN "123456789"
  Then le client est enrichi automatiquement via SIRENE (forme juridique, APE)

  When je crée 2 sites rattachés au client mère
  Then chaque site a son propre contrat

  When je crée une série récurrente pour chaque site avec intervenants dédiés
  And le batch RRULE s'exécute
  Then les interventions sont générées pour les 2 sites sur 12 mois
  And le planning vue Intervenants montre les 2 lignes avec créneaux corrects

  When le client déclare une absence site 1 (fermeture 1 semaine)
  Then une notification Kafka est reçue par MP5
  And l'absence est visible sur le planning vue Clients
  And les interventions de la semaine sont marquées selon le paramètre "maintien"
```

---

## Chaîne 3 — Client santé SAAD (aide à domicile médicalisée)

**Description** : Parcours complet d'un bénéficiaire SAAD depuis l'onboarding jusqu'au suivi e-santé (INS, DUI, DMP). Inclut les aides financières APA/PCH.

**But** : Valider l'intégration SEGUR de bout en bout — consentement, identité santé, dossier usager, documents médicaux, et planification des interventions santé.

**MP impactés** : MP1 (Structure) → MP2 (Catalogue) → MP3 (Collaborateurs) → MP4 (Commercial + SEGUR) → MP5 (Planning) → MP6 (Aides PEC)

### Étapes chaînées

| # | Action | MP | Donnée produite | Donnée consommée |
|---|--------|-----|-----------------|------------------|
| 3.1 | Vérifier configuration iCanopée (certificats FINESS) | MP4 | prérequis OK | config établissement |
| 3.2 | Créer un produit service "Aide toilette 1h" (prestation santé) | MP2 | `produit_sante_id` | — |
| 3.3 | Créer un intervenant avec compétences santé | MP3 | `interv_sante_id` | `agence_id` |
| 3.4 | Créer un prospect PP avec données santé (collecte SEGUR conditionnelle) | MP4 | `client_sante_id` | `agence_id` |
| 3.5 | Activer le profil santé + recueillir consentement e-santé | MP4 | consentement enregistré | `client_sante_id` |
| 3.6 | Récupérer l'INS via INSi (saisie NIR + 5 traits) | MP4 | INS statut "Récupérée" (orange) | `client_sante_id` + consentement |
| 3.7 | Effectuer contrôle documentaire → INS "Qualifiée" (verte) | MP4 | INS qualifiée, traits verrouillés | `client_sante_id` |
| 3.8 | Configurer OF "Conseil Départemental" + CDA APA | MP6 | `cda_apa_id` | `agence_id` |
| 3.9 | Appliquer PAP APA au client | MP6 | `pap_apa_id` | `client_sante_id` + `cda_apa_id` |
| 3.10 | DUI : admission du bénéficiaire (volet administratif) | MP4 | admission DUI | `client_sante_id` |
| 3.11 | DUI : évaluation AGGIR (grille de dépendance → GIR) | MP4 | évaluation enregistrée | admission DUI |
| 3.12 | DUI : créer projet personnalisé (objectifs + plan d'action) | MP4 | projet perso versionné | évaluation + admission |
| 3.13 | Créer série interventions santé (quotidienne 8h-9h) | MP5 | `serie_sante_id` | `client_sante_id` + `produit_sante_id` + `interv_sante_id` |
| 3.14 | Batch RRULE → interventions générées | MP5 | `intervention_sante_ids[]` | `serie_sante_id` |
| 3.15 | Générer document CDA R2 N1 (CR évaluation AGGIR) | MP4 | document CDA | évaluation + INS qualifiée |
| 3.16 | Alimenter le DMP avec le document généré | MP4 | DMP alimenté | document CDA + INS qualifiée |
| 3.17 | Vérifier que le planning affiche les interventions santé | MP5 | — | `intervention_sante_ids[]` |

### Assertions clés (Given/When/Then)

```gherkin
Scenario: Chaîne SAAD santé complète
  Given la configuration iCanopée est active (certificats FINESS OK)
  And un produit "Aide toilette 1h" existe (prestation santé)
  And un intervenant avec compétences santé est disponible

  When je crée un prospect PP avec prestation santé
  Then la collecte SEGUR est déclenchée (données santé conditionnelles)

  When j'active le profil santé et recueille le consentement
  Then les boutons e-santé sont activés

  When je lance la récupération INS via INSi (NIR + 5 traits stricts)
  Then le statut passe à "Récupérée" (pastille orange)
  And les traits stricts sont verrouillés

  When j'effectue le contrôle documentaire
  Then le statut passe à "Qualifiée" (pastille verte)
  And le matricule INS est transmissible

  When je configure un OF "CD 75" avec CDA APA et applique un PAP au client
  Then le plan d'aide est actif avec calcul reste à charge

  When je réalise l'admission DUI + évaluation AGGIR + projet personnalisé
  Then le dossier usager est complet

  When je crée une série d'interventions quotidienne et le batch s'exécute
  Then les interventions santé sont visibles sur le planning

  When je génère un document CDA R2 N1 (CR évaluation)
  And j'alimente le DMP
  Then le document est disponible dans Mon espace santé
  And la traçabilité est enregistrée (journalisation 10 ans)
```

---

## Matrice de couverture

| MP | Chaîne 1 (PP domicile) | Chaîne 2 (Pro multi-sites) | Chaîne 3 (SAAD santé) |
|----|:---:|:---:|:---:|
| MP1 — Structure | ✅ | ✅ | ✅ |
| MP2 — Catalogue | ✅ | ✅ | ✅ |
| MP3 — Collaborateurs | ✅ | ✅ | ✅ |
| MP4 — Commercial | ✅ | ✅ | ✅ |
| MP4 — SEGUR | — | — | ✅ |
| MP5 — Planning | ✅ | ✅ | ✅ |
| MP5 — Batch RRULE | ✅ | ✅ | ✅ |
| MP5 — Annulation | ✅ | — | — |
| MP5 — Absences client | — | ✅ | — |
| MP5 — Match | — | — | — |
| MP6 — Aides PEC | ✅ | — | ✅ |
| Notifications Kafka | ✅ | ✅ | — |

## Notes pour implémentation Playwright

- **Data strategy** : chaque chaîne doit être autoportante (créer ses propres données, pas de dépendance à un état DB)
- **Ordre d'exécution** : les étapes DOIVENT s'exécuter séquentiellement (dépendances de données)
- **Identifiants** : capturer les IDs retournés par chaque étape pour les injecter dans la suivante
- **Cleanup** : prévoir un teardown en fin de chaîne (ou snapshot DB avant/après)
- **Batch RRULE** : soit déclencher manuellement via API, soit mocker le résultat — à définir avec l'équipe
- **iCanopée (chaîne 3)** : nécessite un bac à sable ou mock du téléservice INSi
- **Timeouts** : le batch peut prendre du temps → adapter les waits Playwright
