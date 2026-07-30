# Orion Spec Explorer — Reference

## Patterns de dispatch (carte → page_id → live)

| Question type | Route INDEX | Carte | Action détail |
|---------------|-------------|-------|---------------|
| "Règles d'annulation d'intervention ?" | Tags `annulation` | `mp5-planning-interventions.md` | confluence-explorer sur SP5.2 362840116 (RG_GIN_DPG_*) |
| "Règle RG_CO_OUT_04 ?" | Nomenclature RG `RG_CO_*` | `mp5-cadre-operationnel.md` | confluence-explorer sur 712310799 |
| "Cône de visibilité ?" | Glossaire / Tags | `mp1-structure-marques.md` | confluence-explorer sur SP1.5 362905617 |
| "Routage facturation succursale prestataire ?" | Tags `routage`/`DT1` | `mp5-cadre-operationnel.md` | confluence-explorer 712310799 (+ DMN attaché) |
| "Blocs de la table de faits ?" | Tags `table de faits` | `mp6-facturation-aides.md` | confluence-explorer 926941197 |
| "Contrat collaborateur ?" | Tags `contrat` | `mp3-collaborateurs.md` | ⚠️ doublon SP3.2 non tranché → ne pas lire, signaler |
| "Qui alimente le planning ?" | Tags `flux` | `08-interfaces-flux.md` | flux 388038693 (FD_*) |
| "À quoi ressemble le planning semaine ?" | écran | `09-maquettes-figma.md` → node-id | MCP Figma |
| "Ségur DUI ?" | Tags `DUI` | `mp4-gestion-commerciale.md` | confluence-explorer E4.4.3 723779599 |

## Structure d'une carte domaine

```
# MPx — Titre
> résumé 1-2 lignes
| Meta | Tags | Racine page_id |
## Pages sources   (table : Sujet | page_id | RG | Statut)
## Nomenclature RG (préfixes RG_* du domaine)
## Pièges connus   (doublons, pages vides/A SUPPRIMER, brouillons, EN COURS)
## Détail → confluence-explorer sur page_id
```

La carte ne contient PAS le corps fonctionnel. Tout détail = lecture live Confluence.

## Statuts dans "Pages sources"

- `actif` : lisible, fait foi.
- `EN COURS` : non finalisé (critères vides, questions ouvertes) → ne pas figer.
- `⚠️ A SUPPRIMER` : page en fusion/obsolète → ne pas lire comme finale.
- `vide` : page créée sans contenu → rien à lire.
- `⚠️ DOUBLON` / `BROUILLON` : ambiguïté/non validé → signaler, ne pas trancher seul.

## Figma — MCP

File key : `EfsOdCwqfy1Yi0knogfPNc`. Node-id listés dans `09-maquettes-figma.md` par domaine.

```
get_screenshot(nodeId="3919-88349")
get_metadata(nodeId="3919-88349")
```

## Limitations

- Détail = dépendant du MCP Atlassian (pas de copie locale, pas de fallback offline).
- Confluence contient des doublons / pages vides / brouillons : toujours appliquer les "Pièges connus" de la carte avant de lire.
- Page_id peuvent dériver (page archivée/déplacée) → validation via skill `orion-spec-sync`.
