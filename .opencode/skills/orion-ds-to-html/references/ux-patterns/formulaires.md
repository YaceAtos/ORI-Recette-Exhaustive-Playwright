# Formulaires

> Voir aussi : `modales.md` (modale Large pour creation multi-etapes), `time-slots.md` (plages horaires dans formulaires)

## Niveaux d'obligation des champs

| Niveau | Champs | Navigation | Message |
|--------|--------|-----------|---------|
| **Etape 1** | Obligatoires pour passer a la suite | Onglets suivants inactifs, retour possible | "Sauf mention contraire, tous les champs sont obligatoires (*)" |
| **Etape 2** | Obligatoires pour enregistrer | Navigation libre, tag Error sur onglets incomplets | "(...) Les champs obligatoires (*) sont necessaires pour enregistrer. + taux de completion" |
| **Etape 3** | Aucun obligatoire | Peut etre passee | "Tous les champs sont facultatifs" |

## Asterisques

Apparaissent quand :
- Le champ est obligatoire pour l'enregistrement
- Le champ est dependant d'un autre

**Exemple dependance** : ajout d'un diplome (facultatif) contenant 4 champs A, B, C, D. A et B sont dependants — sans B, A n'est pas viable → l'asterisque apparait sur B quand A est saisi.

## Statut et taux de completion

| Statut | Condition |
|--------|-----------|
| **Complet** | Tous les champs obligatoires renseignes |
| **Non renseigne** | Aucun champ obligatoire renseigne |
| **Incomplet** | Elements necessaires a l'utilisation future non renseignes |
| **En cours** | Saisie en cours |

## Patterns de champs specifiques

**Saisie d'adresse** :
- Autocompletion GEOWS (API d'adresse)
- Fallback : saisie manuelle avec carte interactive
- Affichage : form-field + carte de confirmation a droite

**Depot de documents** :
- **Multiple** : zone drag & drop ou "Parcourir", plusieurs fichiers
- **Unique** : meme interface, un seul fichier
- **Avec categories** : tableau des documents + clic crayon pour categorie dans modale dediee

**Saisie numero / mail** :
- **Unique** : un form-field + bouton d'action
- **Multiples** : liste de champs + bouton "Ajouter", chaque ligne supprimable
