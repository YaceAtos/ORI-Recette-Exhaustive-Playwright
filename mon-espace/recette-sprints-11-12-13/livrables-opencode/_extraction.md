# Extraction des fichiers sources
> Fichier genere automatiquement par l'assistant. Ne pas supprimer.
> Il permet de reutiliser l'extraction dans les conversations suivantes sans relire tous les fichiers.
>
> Derniere mise a jour : 30 juillet 2026
> Fichiers traites : presentation-toolchain-testing 1.pdf, CAS DE TEST DES US SPRINT 11 12 13 (version 1).xlsx

---

## Fichier : presentation-toolchain-testing 1.pdf
- **Type** : PDF texte, 14 pages
- **Confiance** : Haute
- **Contenu principal** : Presentation de la chaine de test automatisee de bout en bout, depuis Confluence jusqu'aux rapports Playwright et a la boucle de correction Jira/Xray.
- **Elements cles extraits** :
  - Confluence est la source de verite des exigences metier.
  - Chaque etape produit un livrable versionne et tracable.
  - Les specifications, parcours et scenarios intermediaires sont structures en Markdown.
  - Les scenarios sont injectes dans Xray et rattaches aux exigences Jira.
  - Le code Playwright est derive des scenarios avec une correspondance 1:1.
  - L'execution produit rapports HTML/JSON, traces et videos.
  - Les echecs alimentent Jira/Xray, une correction et une reexecution ciblee.
- **Points d'attention** : La presentation decrit une cible. Elle ne fournit ni contrat de donnees, ni API Xray configuree, ni implementation de publication.

### Contenu detaille

Flux cible :

```text
Confluence -> Specs MD -> Parcours MD -> Scenarios MD -> Xray/Jira
                                                    -> Playwright
                                                    -> Rapport et correction
```

Principes obligatoires : source unique Confluence, versionnement Git, couverture mesurable, lien exigence-test bidirectionnel, execution multi-navigateurs possible, preuves d'execution et boucle de feedback courte.

---

## Fichier : CAS DE TEST DES US SPRINT 11 12 13 (version 1).xlsx
- **Type** : Classeur Excel
- **Confiance** : Haute
- **Contenu principal** : Matrice de recette Orion pour les US des sprints 11, 12 et 13, release v0.2.0, statut "A recetter", environnement INT2, date source 22/07/2026.
- **Elements cles extraits** :
  - Une feuille `US SPRINT 11 12 13`.
  - 273 lignes, 16 colonnes, 4 080 cellules, aucune formule et aucune cellule en erreur.
  - Colonnes : MP/SP, ID Cas, US Jira, Scenarios de test, Priorite, Profil type, Type, Preconditions, JDD Standard, JDD Limite, JDD Erreur, Specs Confluence/RG, Fixtures dev1, Actions, Resultats attendus par etape, Resultat attendu global.
  - Identifiants de cas de type `CT-*`, tickets `ORI-*`, regles `RG_*` et pointeurs de pages Confluence.
  - Cas IHM, integration et back couvrant notamment Structure, Habilitations, Catalogue, Collaborateurs, CRM, Planning et Facturation/Aides.
  - Donnees standard, limites et erreurs separees pour permettre la parametrisation Playwright.
- **Points d'attention** :
  - Certaines lignes sont des separateurs vides.
  - Certains identifiants de cas sont reutilises dans des US distinctes ; la cle canonique doit inclure au minimum le ticket ORI et l'ID du cas.
  - Certaines references indiquent explicitement qu'une RG ou un wording reste a confirmer sur Confluence.
  - Les fixtures sont nommees `dev1` alors que la recette cible INT2 ; leur disponibilite doit etre controlee avant execution.
  - Une correspondance par ticket ORI avec des tests Playwright existants ne prouve pas la couverture exacte de chaque cas Excel.

### Structure canonique retenue

Chaque ligne de test exploitable sera normalisee avec :

```text
sourceRow, canonicalId, caseId, issueKey, issueSummary, module,
scenario, priority, persona, type, preconditions,
datasets.standard, datasets.boundary, datasets.error,
confluence.pageIds, confluence.rules, fixtures,
steps[], expectedSteps[], expectedGlobal
```

La couverture Playwright sera classee en `exacte`, `ticket-seulement` ou `manquante`. Seule une correspondance explicite au cas canonique pourra produire une couverture exacte.
