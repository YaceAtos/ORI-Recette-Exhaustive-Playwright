---
name: confluence-conventions
description: Conventions de formatage et structure Confluence pour les specifications fonctionnelles Orion (titres, sommaire, tableaux RG, criteres acceptation Gherkin, sections fonctionnelles)
---

# Skill : Conventions Confluence — Structure des Spécifications Fonctionnelles

Regles de formatage et de structure a appliquer systematiquement lors de la redaction de specs fonctionnelles. Ces conventions sont extraites de l'analyse des specs Orion existantes validees par l'equipe.

Les specs sont generees dans `mon-espace/[nom-du-sujet]/livrables-opencode/spec_vN.md` avec versionnement incremental.

---

## 1. Titre de la page

### Format du titre
```
E{MP}.{SP}.{Écran}.{Variante} {Description en langage naturel}
```

### Exemples
- `E4.1.1.C3 Consulter la liste des leads de type 'Particulier' (personnes physiques)`
- `E4.1.1.A. Créer un prospect ou un lead de type 'Particulier' (personne physique)`
- `E6.1.2.A0 Cadre Général OF - Type Aides - Activités Financées`

### Conventions de nommage des codes écran
| Élément | Signification | Exemples |
|---|---|---|
| E | Préfixe "Écran" | Toujours présent |
| {MP} | Numéro du Macro-Processus | 1, 3, 4, 5, 6 |
| {SP} | Numéro du Sous-Processus | 1.1, 1.2, 6.1 |
| {Écran} | Numéro de l'écran dans le SP | 1, 2, 3... |
| {Variante} | Lettre + chiffre optionnel | A (créer), B (modifier), C (consulter), C3 (variante de consultation) |

### Variantes courantes
- **A** = Créer / Ajouter
- **B** = Modifier
- **C** = Consulter / Lister
- **D** = Supprimer
- Les chiffres après la lettre indiquent des sous-variantes (C1, C2, C3...)

---

## 2. En-tête de page

Immédiatement après le titre, indiquer :
```
Mise à jour : [date au format JJ mois AAAA]
```

---

## 3. Sommaire

Générer un sommaire structuré listant toutes les sections de la spec. Le sommaire doit refléter exactement la structure du document :

```
SOMMAIRE

Description
Contexte
Maquette
E{code}.1 [Nom de la section 1]
    Description et Règles de gestion
    Liste des US dans Jira
    Critères d'acceptance
E{code}.2 [Nom de la section 2]
    Description et Règles de gestion
    ...
Flux de données inter-domaines
```

---

## 4. Section "Description"

Rédiger au format User Story :

```
En tant que [rôle(s) — séparer par virgule si plusieurs]

Je souhaite [action principale]

Afin de [objectif / bénéfice]

Et de [objectif complémentaire — optionnel]
```

### Exemple
```
En tant que Opérationnel Agence, Responsable d'Agence, Service client ou Franchisé

Je souhaite consulter la liste de mes leads de type 'Particulier' (personnes physiques)

Afin de visualiser l'ensemble des leads enregistrés dans Orion

Et de rechercher et filtrer les informations d'un lead à partir de différents critères.
```

---

## 5. Section "Contexte"

Paragraphe libre décrivant le contexte fonctionnel :
- But de la fonctionnalité
- Références à des comportements communs existants (ex : "voir spin Collaborateur" pour le chargement)
- Pré-requis éventuels

---

## 6. Section "Maquette"

Indiquer les informations de navigation et les références visuelles :

```
Navigation : [Menu principal]

Fil d'Ariane : [Niveau 1 > Niveau 2 > ...]

Lien d'accès aux maquettes Figma : [nom du fichier Figma ou lien]
```

---

## 7. Sections fonctionnelles (coeur de la spec)

Chaque fonctionnalité de l'écran est découpée en sections numérotées.

### Numérotation des sections
Format : `E{code complet de l'écran}.{N}` où N est un compteur séquentiel.

Exemples pour l'écran E4.1.1.C3 :
- `E4.1.1.C.3.1 Critères de recherche et filtres`
- `E4.1.1.C.3.2 Tableau Liste des leads`
- `E4.1.1.C.3.3 Actions sur la page`

### Structure de chaque section fonctionnelle

Chaque section contient obligatoirement les 3 sous-parties suivantes, dans cet ordre :

#### 7a. Description et Règles de gestion

Deux tableaux successifs :

**Tableau 1 — Description des champs / éléments**

| Libellé du champ | Description | Type | Obligatoire / Facultatif / Conditionnel | Règles de gestion |
|---|---|---|---|---|
| [nom du champ] | [description fonctionnelle] | [type de composant UI] | [Obligatoire / Facultatif / Conditionnel] | [référence RG_xxx ou description courte] |

Types de composants UI courants :
- Texte (champ de saisie libre)
- Liste déroulante (simple ou avec cases à cocher)
- Lien cliquable
- Bouton d'action
- Élément cliquable (icône, ligne de tableau...)
- Case à cocher
- Date (sélecteur de date)
- Zone de recherche

**Tableau 2 — Détail des règles de gestion**

| Identifiant RG | Description RG |
|---|---|
| RG_LEAD_RECH_01 | [description détaillée de la règle, comportement par défaut, cas particuliers] |

### Convention de nommage des RG
Format : `RG_<DOMAINE>_<OBJET>_<NN>`

| Élément | Description | Exemples |
|---|---|---|
| DOMAINE | Code du domaine métier (3-4 lettres) | LEAD, MRK, STE, PLA, GEN |
| OBJET | Code de l'objet ou action concerné (3-5 lettres) | RECH (recherche), LIST (liste), FILT (filtre), MODIF (modification), PAGIN (pagination) |
| NN | Numéro séquentiel sur 2 chiffres | 01, 02, 03... |

Règles de rédaction des RG :
- Chaque RG décrit UN comportement précis
- Inclure le comportement par défaut ("Par défaut, ...")
- Décrire les cas d'interaction (ex : cocher/décocher une case)
- Référencer les autres écrans avec leur code complet quand pertinent
- Si la RG est partagée avec d'autres écrans, le mentionner explicitement

#### 7b. Liste des US dans Jira

Tableau des User Stories Jira liées à cette section :

| Identifiant | Libellé |
|---|---|
| ORI-241 | ORI-241: E4.1.1.C Consulter la liste des leads : critères de recherche et filtres |

Statuts possibles : Terminé(e), En attente, En cours, A VENIR

Si des évolutions futures sont prévues, les indiquer sous le tableau :
```
A VENIR
[description de l'évolution prévue]
```

#### 7c. Critères d'acceptance

Format **Étant donné / Quand / Alors** (Gherkin en français) :

```
Scénario [code] : [titre descriptif du scénario]

Étant donné que [contexte / pré-condition]

Quand [action de l'utilisateur]

Alors [résultat attendu]

Et [résultat complémentaire — optionnel, peut être répété]
```

### Convention de nommage des scénarios
- Code : lettre A (pour Acceptance) + numéro séquentiel (A1, A2, A3...)
- Le préfixe peut varier selon la section (A1 pour section 1, EA1 pour une variante)
- Titre : phrase descriptive courte

### Règles de rédaction des scénarios
- Chaque scénario teste UN comportement précis
- Le contexte "Étant donné" doit mentionner les habilitations si pertinent
- Le "Quand" décrit une action utilisateur concrète
- Le "Alors" décrit un résultat observable et vérifiable
- Utiliser "Et" pour ajouter des vérifications complémentaires au "Alors"
- Couvrir : le cas nominal, les cas alternatifs, les cas aux limites (liste vide, pas d'habilitation, etc.)

---

## 8. Section "Flux de données inter-domaines"

Dernière section de la spec. Décrit les échanges de données entre domaines/microservices :
- Quels domaines sont consommateurs / producteurs
- Quelles données sont échangées
- Via quels mécanismes (API REST, événements Kafka, etc.)

Si aucun flux inter-domaines n'est identifié, indiquer : "Aucun flux inter-domaines identifié pour cette fonctionnalité."

---

## 9. Conventions de formatage markdown

### Titres
- **H1** (`#`) : titre de la page uniquement
- **H2** (`##`) : sections principales (Description, Contexte, Maquette, sections fonctionnelles E{code}.N, Flux de données)
- **H3** (`###`) : sous-sections (Description et Règles de gestion, Liste des US, Critères d'acceptance)

### Tableaux
- Toujours utiliser le format markdown avec séparateurs `|---|`
- Aligner les colonnes pour la lisibilité
- Ne pas laisser de cellule vide sans raison — mettre un tiret `-` si non applicable

### Références croisées
- Toujours citer le code écran complet lors d'une référence à un autre écran
- Format : `E4.1.1.A. Créer un prospect ou un lead de type 'Particulier' (personne physique)`
- Si la référence est vers une RG d'une autre page, préfixer par "voir RG [identifiant] de la page [titre]"

### Tags de validation
- `[À VALIDER]` : zone d'incertitude nécessitant une validation PO/métier
- Utiliser avec parcimonie — chaque tag doit être justifié

---

## 10. Checklist de conformité

Avant de livrer une spec, vérifier :

- [ ] Le titre suit le format `E{MP}.{SP}.{Écran}.{Variante} {Description}`
- [ ] La description est au format User Story (En tant que / Je souhaite / Afin de)
- [ ] Le sommaire reflète exactement la structure du document
- [ ] Chaque section fonctionnelle contient les 3 sous-parties (Description+RG, US Jira, Critères)
- [ ] Chaque RG a un identifiant unique au format `RG_<DOMAINE>_<OBJET>_<NN>`
- [ ] Chaque critère d'acceptation est au format Étant donné / Quand / Alors
- [ ] Les références croisées utilisent le code écran complet
- [ ] Les zones d'incertitude sont marquées `[À VALIDER]`
- [ ] Aucune règle métier n'a été inventée (toutes proviennent des sources)
