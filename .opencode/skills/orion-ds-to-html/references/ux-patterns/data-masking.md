# Sensitive Data Masking

## Types de masquage

| Type | Affichage | Cas d'usage |
|------|-----------|-------------|
| **A** — Visibilite de controle | `+33 6 ** ** ** 89`, `n******@gmail.com` | Confirmer l'existence sans extraction |
| **B** — Confidentialite absolue | Icone cadenas + "Donnees restreintes" | RGPD, sante, finance — acces interdit |

Classification A vs B : par role utilisateur, au cas par cas.

## Regles d'affichage des blocs

- **Cas 1 — Bloc mixte** (donnees visibles + confidentielles) : garder le bloc, masquer les champs restreints
- **Cas 2 — Bloc 100% confidentiel** : supprimer le bloc entierement de l'affichage
- **Cas 3 — Formulaire de creation** : adapter le wizard aux permissions — masquer les etapes inaccessibles
