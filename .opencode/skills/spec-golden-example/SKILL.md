---
name: spec-golden-example
description: Standard qualite et criteres de structure obligatoires pour toute specification fonctionnelle generee (regles de gestion, criteres acceptation, tableaux de champs, format Confluence)
---

# Skill : Spec de Référence (Golden Example)

Cette skill definit le standard qualite attendu pour toute specification fonctionnelle generee. Toute spec doit atteindre ce niveau de structure, de detail et de clarte.

Les specs sont generees dans `mon-espace/[nom-du-sujet]/livrables-opencode/spec_vN.md` avec versionnement incremental.

---

## Critères de qualité obligatoires

### Structure
- Le titre suit le format `E{MP}.{SP}.{Écran}.{Variante} {Description}`
- La description est au format User Story (En tant que / Je souhaite / Afin de)
- Un sommaire reflète exactement la structure du document
- Chaque section fonctionnelle contient les 3 sous-parties : Description et RG, US Jira, Critères d'acceptance
- La spec se termine par "Flux de données inter-domaines"

### Règles de gestion
- Chaque RG a un identifiant unique au format `RG_<DOMAINE>_<OBJET>_<NN>`
- Chaque RG décrit UN comportement précis et vérifiable
- Le comportement par défaut est explicitement décrit ("Par défaut, ...")
- Les cas d'interaction sont détaillés (ex : coche/décoche, saisie vide, sélection multiple)
- Les références à d'autres écrans utilisent le code écran complet

### Critères d'acceptation
- Format Gherkin en français : Étant donné / Quand / Alors
- Chaque scénario teste UN comportement précis
- Le cas nominal, les cas alternatifs et les cas limites sont couverts
- Les scénarios sont numérotés (A1, A2, A3...)
- Les habilitations sont mentionnées dans le "Étant donné" si pertinent

### Tableaux de champs
- Colonnes obligatoires : Libellé, Description, Type, Obligatoire/Facultatif/Conditionnel, Règles de gestion
- Les types de composants UI sont précisés (Liste déroulante, Zone de recherche, Bouton d'action, etc.)
- Les liens vers les RG sont explicites dans la dernière colonne

### Marqueurs de validation
- Les zones d'incertitude sont signalées avec `[À VALIDER]`
- Aucune règle métier n'est inventée — tout provient des sources fournies
- Les dépendances avec d'autres écrans sont documentées

---

## Exemple de référence : E4.1.1.C3

L'exemple ci-dessous illustre le standard attendu (extrait simplifié).

### Titre
```
E4.1.1.C3 Consulter la liste des leads de type 'Particulier' (personnes physiques)
```

### Description (User Story)
```
En tant que Opérationnel Agence, Responsable d'Agence, Service client ou Franchisé

Je souhaite consulter la liste de mes leads de type 'Particulier' (personnes physiques)

Afin de visualiser l'ensemble des leads enregistrés dans Orion

Et de rechercher et filtrer les informations d'un lead à partir de différents critères.
```

### Exemple de tableau de champs (section E4.1.1.C.3.1)

| Libellé du champ | Description | Type | Obligatoire / Facultatif / Conditionnel | Règles de gestion |
|---|---|---|---|---|
| Rechercher un lead | Zone de recherche | Texte | Obligatoire | RG_LEAD_RECH_01 |
| Statut du lead | Permet de filtrer sur le statut du lead | Liste déroulante avec cases à cocher | Obligatoire | RG_LEAD_LIST_01 |
| Réinitialiser les filtres | Permet de réinitialiser les filtres sélectionnés | Lien cliquable | Obligatoire | Au clic, remise à valeur par défaut |

### Exemple de tableau de RG

| Identifiant RG | Description RG |
|---|---|
| RG_LEAD_RECH_01 | Le champ 'Rechercher un lead' permet une recherche sur les critères : nom et/ou prénom ou numéro de téléphone ou adresse e-mail du lead. Par défaut, le champ est vide. |
| RG_LEAD_LIST_01 | La liste déroulante "Statut du lead" contient des cases à cocher pour sélection multiple. Liste des statuts : Tous, A qualifier, Abandonné. La case "Tous" en haut sélectionne/désélectionne tous les statuts. Par défaut elle est cochée. |
| RG_LEAD_FILT_01 | Les filtres saisis par l'utilisateur sont conservés lors des navigations entre la liste et la modale de qualification d'un lead, ainsi qu'au sein des différentes pages du tableau. |

### Exemple de critères d'acceptation

```
Scénario A1 : Rechercher un lead par nom, prénom, email ou téléphone

Étant donné que je suis habilité à rechercher un lead

Quand je saisis le nom et/ou le prénom ou l'adresse e-mail ou le téléphone d'un lead existant dans la barre de recherche

Alors la liste affiche uniquement les leads correspondant à ma saisie.
```

```
Scénario A5 : Réinitialiser tous les filtres

Étant donné que j'ai appliqué plusieurs filtres (statut) et une recherche

Quand je clique sur "Réinitialiser les filtres"

Alors tous les filtres reviennent à leur valeur par défaut

Et la barre de recherche est vidée

Et la liste affiche tous les leads de mon périmètre.
```

---

## Anti-patterns — Ce qu'il ne faut PAS faire

- Rédiger des RG vagues sans comportement par défaut ("le champ est filtrable" → trop vague)
- Oublier les cas limites dans les critères d'acceptation (liste vide, pas d'habilitation)
- Inventer des RG non présentes dans les sources fournies
- Mélanger plusieurs comportements dans une seule RG
- Écrire des scénarios non testables ("le système fonctionne correctement" → non vérifiable)
- Omettre les références croisées vers d'autres écrans
- Ne pas inclure la section "Flux de données inter-domaines"
