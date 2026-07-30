# Navigation — Drawer vs Detail Page

> Voir aussi : `modales.md` (tailles et boutons), `deletion.md` (suppression depuis tableau/fiche)

## Criteres de choix

| Critere | Drawer | Page detail |
|---------|--------|-------------|
| Quantite de contenu | Peu | Beaucoup |
| Contexte parent | Reste visible (cote gauche) | Masque |
| Actions max | 3 | Illimitees |
| Fermeture | Bouton X ou clic zone grise | Navigation retour |
| Largeur max contenu | — | 1500px |
| Exemple | Planning, mapping | Profil utilisateur, detail de fait |

**Menus contextuels** : tableaux utilisent "..." par ligne. Pages detail utilisent "..." en haut a droite dans le header.

## Row click — regle critique

**Une ligne de tableau navigue vers exactement UNE destination. Jamais de chaine tableau → drawer → page detail.**

| Clic sur une ligne | Quand l'utiliser |
|---|---|
| **Page detail** (direct) | L'entite a sa propre page (contenu riche, 6+ champs, multiples sections). |
| **Drawer** (panel lateral) | Consultation rapide uniquement, pas de page dediee. Contenu tient dans un seul scroll. |

Jamais de drawer comme etape de preview avant une page detail. Si une page detail existe, le clic ligne va directement dessus.

## Boutons du drawer

La logique footer/contenu suit le meme principe que le reste de l'outil :
- **Boutons dans le contenu** (drawer detail) : geres comme une liste — le principal est en **premier** (a gauche)
- **Boutons dans le footer** (drawer filtres) : geres comme un footer de modale — le principal est a **droite**

Exemples :
- Drawer detail d'intervention : bouton principal a gauche
- Drawer filtres avances : bouton principal a droite
