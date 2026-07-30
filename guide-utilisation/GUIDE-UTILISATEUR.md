# 📘 Guide utilisateur — Workspace IA Orion

> 🎯 **Pour qui :** Business Analysts, Product Owners, profils fonctionnels
> **Objectif :** produire des specs fonctionnelles et des maquettes HTML avec l'aide de l'IA, sans configuration technique
>
> ℹ️ **Réf. fonctionnelle Orion :** le dossier `docs/` est une *carte* (pointeurs vers Confluence + nomenclature des règles + pièges connus), pas une copie de la spec. L'IA lit le détail en direct sur Confluence → **MCP Atlassian requis** pour les questions de détail (pas de copie locale). La couche *parcours* a été retirée.

---

## 1. 🧰 A quoi sert ce workspace

Ce workspace est un environnement de travail pré-configuré qui permet de produire deux types de livrables avec l'aide de l'IA :

- 📄 **Spécifications fonctionnelles** au format Confluence, avec règles de gestion, critères d'acceptation et tableaux de champs
- 🖥️ **Maquettes HTML** conformes au design system Orion, prêtes à être présentées ou soumises à la DEV

Il peut aussi servir pour des **analyses plus libres** : résumer un document, comparer deux versions d'une spec, répondre à des questions sur le contexte métier Orion.

Tu n'as pas besoin de savoir coder ni de comprendre comment fonctionne l'IA pour l'utiliser. Il te faut juste tes documents sources et une idée claire de ce que tu veux produire.

---

## 2. ⚙️ Ce qu'il faut comprendre en 1 minute

> **🔍 Ce qui se passe en coulisses — version simple**
>
> Le workspace est organisé autour d'un **orchestrateur** (agent principal) qui comprend votre demande et la confie au bon **sous-agent spécialisé** :
>
> - Tu demandes une spec → le sous-agent "Spec Writer" rédige (et propose de publier sur Confluence)
> - Tu demandes une maquette → le sous-agent "Maquette Generator" génère le HTML
> - Tu demandes une analyse → l'orchestrateur traite directement
>
> Il dispose aussi de **sous-agents explorateurs** pour les sources distantes :
> - Lien Confluence → le sous-agent Confluence lit la page et en fait un résumé
> - Lien Figma → le sous-agent Figma explore le design et décrit la structure
>
> **Tu n'as rien à choisir.** L'orchestrateur détecte le bon mode selon ta demande.
> Si c'est ambigu, il te pose une question avant de démarrer.

### ✅ Ce que l'IA fait pour toi

- 📂 Lit et structure tes documents sources (PDF, Word, Excel, images, etc.)
- 🌐 Va chercher du contenu sur **Confluence** et **Figma** si tu lui fournis un lien ou si elle en detecte un dans tes sources
- 🏷️ Applique les standards de qualité Orion sans que tu aies à les rappeler
- 📦 Génère le livrable dans le bon dossier, versionné automatiquement
- ⚠️ Signale les points à valider quand une règle métier est incertaine

### 🚫 Ce que l'IA ne fait pas

- Elle n'invente pas de règles métier — si un point est flou, elle le marque `[A VALIDER]`
- Elle ne décide pas à ta place des arbitrages fonctionnels
- Elle ne remplace pas ta relecture et ta validation métier

---

## 3. 🚀 Comment travailler concrètement

Le parcours standard se fait en 4 étapes.

### 1️⃣ Étape 1 — Nommer ton sujet

Dis à l'assistant sur quel sujet tu travailles.

> *Exemple : "Je travaille sur la gestion des leads"*

Si un dossier pour ce sujet n'existe pas encore, l'assistant le crée automatiquement :
```
mon-espace/gestion-des-leads/
└── livrables-opencode/
```

### 2️⃣ Étape 2 — Déposer tes documents sources

Dépose manuellement tes fichiers dans le dossier sujet créé à l'étape 1 :

```
mon-espace/gestion-des-leads/
├── doc-cadrage.pdf
├── synthese-mp4.docx
├── screenshot-figma.png
└── livrables-opencode/
```

**Formats acceptés :** PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), images (.png, .jpg), texte (.md, .txt), HTML

> Si tu joins un fichier directement dans le chat, l'assistant t'indiquera si besoin de le déposer
> dans le dossier à la place (limitation technique sur certains formats binaires).

### 3️⃣ Étape 3 — Formuler ta demande

Dis simplement ce que tu veux produire :

> *"Rédige la spec fonctionnelle pour la gestion des leads"*
> *"Génère la maquette HTML pour l'écran de création d'un lead"*
> *"Fais-moi un résumé des règles métier dans ce PDF"*

L'assistant :
1. Lit les documents du dossier
2. Te présente une synthèse + les questions structurantes
3. Attend ta validation avant de rédiger

### 4️⃣ Étape 4 — Récupérer le livrable

Le livrable est généré dans :
```
mon-espace/gestion-des-leads/livrables-opencode/
├── spec_v1.md
└── maquette_v1.html
```

Chaque nouvelle version incrémente le numéro (`v1`, `v2`, `v3`...). Les versions précédentes sont conservées.

<!-- PAGE 2 -->
---

## 4. 🎯 Les 3 usages principaux

### 📄 Usage 1 — Créer une spec fonctionnelle

| | Détail |
|---|---|
| **Tu fournis** | Documents de cadrage, synthèse MP/SP, ODR techniques, specs adjacentes, notes de réunion |
| **L'IA fait** | Lit les sources, synthétise le périmètre, pose les questions structurantes, rédige la spec |
| **Elle produit** | `spec_vN.md` — structure Confluence avec RG, critères d'acceptation, tableaux de champs |
| **Signal déclencheur** | "spec", "spécification", "règles de gestion", "critères d'acceptation", "user story" |
| **Bonus** | Après validation, l'assistant **propose de publier la spec sur Confluence** (avec votre confirmation) |

**Ce que tu valides avant génération :**
- La synthèse du périmètre proposée par l'IA
- Les réponses aux questions structurantes (ou "on avance avec ce qu'on a")

---

### 🖥️ Usage 2 — Créer une maquette HTML

| | Détail |
|---|---|
| **Tu fournis** | Une spec (si disponible), des screenshots Figma, des notes de cadrage |
| **L'IA fait** | Lit la spec et les sources visuelles, applique le design system Orion, génère la maquette |
| **Elle produit** | `maquette_vN.html` — fichier standalone, responsive, conforme au design system |
| **Signal déclencheur** | "maquette", "écran", "page HTML", "mockup", "prototype visuel" |

**Particularité :** la maquette est découpée automatiquement en micro-étapes pour éviter les timeouts.
Tu valides le plan de découpage, puis l'IA enchaîne les étapes sans demander de validation à chaque fois.

---

### 🔎 Usage 3 — Analyse et mode libre

| | Détail |
|---|---|
| **Tu fournis** | N'importe quel document |
| **L'IA fait** | Lit, analyse, résume, compare, répond à tes questions |
| **Elle produit** | Une réponse dans le chat (pas de fichier livrable par défaut) |
| **Signal déclencheur** | Tout le reste — pas de mot-clé particulier |

---

### 🌐 Usage 4 — Exploiter Confluence et Figma

| | Détail |
|---|---|
| **Tu fournis** | Un lien Confluence ou Figma, ou tu demandes "va chercher sur Confluence" |
| **L'IA fait** | Lit la page / explore le fichier de design, et te retourne un résumé structuré |
| **Elle produit** | Un résumé dans le chat, utilisable ensuite pour tes specs ou maquettes |
| **Signal déclencheur** | Un lien, ou "Confluence", "Figma", "va chercher", "regarde le design" |

**Exemples :**
- *"Lis la page Confluence SP4.2 et résume les règles de gestion."*
- *"Voici le lien Figma. Décris-moi l'écran."*
- *"Compare ma spec locale avec ce qui est publié sur Confluence."*

**Note :** la connexion nécessite des droits d'accès actifs. Si l'assistant ne peut pas accéder à Confluence/Figma, contactez votre référent IA.

---

## 5. 💬 Exemples de demandes prêtes à l'emploi

### 📄 Pour une spec

```
"Je travaille sur SP4.2 — gestion des leads. Rédige la spec fonctionnelle
à partir des documents dans le dossier."
```

```
"Rédige les critères d'acceptation pour l'écran de création d'un lead particulier."
```

```
"On a déjà une spec_v1. Je veux intégrer les retours de la revue DEV — génère une v2."
```

---

### 🖥️ Pour une maquette

```
"Génère la maquette de l'écran de liste des leads, en te basant sur la spec_v1."
```

```
"Crée le prototype HTML de la fiche société. Voici un screenshot Figma dans le dossier."
```

```
"La maquette_v1 est validée sauf le tableau — mets à jour et génère une v2."
```

---

### 🔎 Pour une analyse / mode libre

```
"Résume les règles de gestion clés de ce PDF de cadrage."
```

```
"Quelles sont les dépendances entre SP4.1 et SP4.2 d'après ces documents ?"
```

```
"Compare la spec_v1 et les retours de la revue fonctionnelle — liste les écarts."
```

---

### 🌐 Pour exploiter Confluence / Figma

```
"Va lire la page Confluence SP4.2 et résume-moi les règles de gestion."
```

```
"Voici le lien Figma du design de la fiche société. Décris-moi l'écran
pour que je puisse lancer la maquette."
```

```
"Compare ma spec_v1 avec ce qui est publié sur Confluence — qu'est-ce qui a divergé ?"
```

<!-- PAGE 3 -->
---

## 6. 👍 Bonnes pratiques

**🔀 Utiliser les modes Plan et Build**
OpenCode propose deux modes de travail :
- **Mode Plan** : l'assistant analyse, réfléchit et propose un plan d'action, mais **ne modifie aucun fichier**. Utile pour cadrer un sujet ou valider une approche avant de lancer la génération.
- **Mode Build** : l'assistant exécute — il lit les sources, rédige et écrit les livrables sur le disque. C'est le mode de travail par défaut pour produire specs et maquettes.

Tu peux basculer entre les deux via le raccourci `Ctrl+P` puis sélectionner `Toggle Plan/Build`.
> Réflexe recommandé : démarrer en **Plan** pour cadrer le sujet avec l'assistant, puis passer en **Build** quand tu es prêt à générer le livrable.

**🏷️ Bien nommer le sujet**
Utilise un nom métier clair et stable.
> Bien : `gestion-des-leads`, `fiche-societe`, `planning-intervenant`
> Eviter : `sujet1`, `test`, `truc-nouveau`

**🎯 Préciser le scope dès le départ**
L'IA travaille mieux avec un périmètre défini. Dis-lui si tu cibles un SP complet, une US isolée, ou juste un point précis.
> *"Je veux couvrir uniquement la création d'un lead — pas la transformation en client."*

**📂 Déposer les bonnes sources**
Plus les documents sont proches du besoin réel, meilleure est la spec.
- Synthèse MP/SP de cadrage
- Décisions d'architecture (ODR) si impact technique
- Specs adjacentes si dépendances connues
- Screenshots Figma pour les maquettes

**✅ Valider le plan avant génération**
Quand l'IA te propose une synthèse ou un plan de découpage, prends 2 minutes pour le relire.
C'est à ce moment que tu corriges le périmètre, pas après.

**🔄 Itérer dans la même conversation**
Corrections, ajustements, nouvelle version sur le même sujet : tout ça se fait dans la même conversation.
L'assistant garde le contexte et incrémente automatiquement la version.

**🔒 Désactiver la vérification de mise à jour automatique**
Par défaut, OpenCode vérifie régulièrement si une nouvelle version est disponible, ce qui peut générer des notifications intempestives. Pour rester sur la version stable validée par les équipes IA Atos, il est recommandé de désactiver cette vérification :
1. Cliquer sur l'icône **Paramètres** (roue crantée) en bas à gauche de l'écran OpenCode Desktop
2. Désactiver l'option **"Vérification de mise à jour automatique"**

> Les mises à jour seront communiquées et déployées de manière contrôlée par les équipes IA Atos. Ne pas mettre à jour OpenCode de manière autonome.

---

## 7. ⚠️ Limites utiles à connaître

**🔒 Une conversation = un sujet principal**
Pour des raisons de qualité, l'IA refuse de travailler sur un deuxième sujet dans la même conversation.
Si tu as besoin de passer à un autre sujet, ouvre une nouvelle conversation.

**❓ L'IA peut te poser des questions — c'est normal**
Si ta demande est ambiguë ou si des informations manquent dans les sources, l'assistant pose des questions avant de rédiger.
Tu peux répondre, ou dire "avance avec ce qu'on a" — les zones incertaines seront marquées `[A VALIDER]`.

**📁 Certains fichiers doivent être déposés dans le dossier**
Les fichiers PDF, Word, Excel et images ne peuvent pas être transmis directement par le chat.
Si tu glisses un fichier dans le chat et que ça ne fonctionne pas, l'assistant te dira exactement dans quel dossier le déposer.

**👤 La validation métier reste côté BA/PO**
L'IA applique les standards et structure les règles, mais elle ne valide pas le fond métier.
Toujours relire les specs générées avant de les soumettre à l'équipe ou à la DEV.

**🔒 Sécurité Confluence/Figma**
L'assistant ne modifiera JAMAIS Confluence ou Jira sans votre accord explicite. Il demandera toujours une confirmation avant de publier, éditer, ou créer quoi que ce soit. Figma est en lecture seule — aucune modification possible.

---

## 8. 🚨 Erreurs fréquentes et solutions

### Erreur de connexion — "Unable to connect. Is the computer able to access the url?"

**Cause :** Sur site Atos, il s'agit d'un conflit entre le VPN (Zscaler) et le réseau **"Atos-workplace"**.

**Solution :** Basculer sur le réseau **"Atos-internet"** (ou tout autre réseau wifi via 4G/5G). Le conflit VPN ne se produit pas sur ces réseaux.

---

### OpenCode semble réfléchir indéfiniment

**Symptôme :** L'assistant affiche un indicateur de chargement pendant plusieurs minutes sans produire de réponse.

**Solution :** Renvoyer un message du type **"es-tu bloqué ?"** — cela peut suffire à débloquer l'assistant, qui reprend alors son travail normalement.

---

### Erreur "SSE Timeout"

**Cause :** La tâche en cours a duré trop longtemps et la connexion s'est coupée automatiquement.

**Solution :** Demander explicitement à OpenCode de segmenter son travail. Exemple de message à envoyer :

```
"Tu as rencontré une erreur de timeout. Pour éviter cela, découpe impérativement
ton travail en sous-étapes, avec maximum 200 lignes modifiées/ajoutées par tâche."
```

---

### OpenCode n'arrive pas à lire les fichiers .docx, .pdf, etc.

**Note :** Ce problème est en principe résolu depuis la version du kit datant du 26/03/2026.

**Si le problème persiste :** Exécuter le patch `installation-lecture-fichiers.md` disponible sur le SharePoint du projet Orion :
[Dossier OpenCode — SharePoint Orion](https://atos365.sharepoint.com/sites/OrionOuicare/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FOrionOuicare%2FShared%20Documents%2FBuild%2F9%20%2D%20Outillage%2FIA%20et%20agentique%2FOpenCode&viewid=e9b52fd7%2D8d0f%2D49ca%2D9cde%2Db3979116ec97&FolderCTID=0x0120005BCDC61A7BF212418EFC38455846706F)

**Procédure :**
1. Télécharger le fichier `installation-lecture-fichiers.md` depuis le SharePoint
2. Créer une nouvelle conversation dans OpenCode
3. Mettre le fichier en pièce jointe dans le chat
4. Envoyer le message : **"Exécute le fichier en PJ"**

---

## 9. 💡 Quel modèle IA utiliser

Ce workspace a été conçu et testé avec **Claude Opus** (modèle le plus puissant de la gamme Claude).
C'est le modèle recommandé pour obtenir des livrables de qualité optimale, notamment pour :

- Les specs complexes avec beaucoup de règles de gestion
- Les maquettes HTML fidèles au design system
- L'analyse de documents volumineux ou multi-sources

### Modèles disponibles

| Modèle                  | Puissance | Coût    | Usage recommandé                                      |
|-------------------------|-----------|---------|-------------------------------------------------------|
| **Claude Opus**         | ★★★       | Élevé   | Specs, maquettes, analyses complexes (**recommandé**) |
| Gemini 3 Pro Preview    | ★★★       | Élevé   | Alternative à Opus, bonne compréhension contextuelle  |
| GPT-5.4                 | ★★☆       | Modéré  | Specs simples, analyses moyennes                      |
| Claude Sonnet           | ★★☆       | Modéré  | Specs simples, itérations rapides sur maquettes       |
| Gemini 3 Flash          | ★☆☆       | Faible  | Questions rapides, résumés, explorations              |
| Claude Haiku            | ★☆☆       | Faible  | Questions simples, reformulations, vérifications      |

> **En résumé :**
> - **Produire une spec ou une maquette** → Claude Opus ou Gemini 3 Pro (recommandé)
> - **Analyse ou itération légère** → Sonnet ou GPT-5.4
> - **Question rapide ou résumé court** → Flash ou Haiku

### 🧠 Limite de contexte — pourquoi c'est important

Chaque conversation avec l'IA dispose d'une **fenêtre de mémoire limitée** (appelée "contexte").
Concrètement, cela signifie que :

- Plus la conversation est longue (beaucoup d'échanges, documents volumineux), plus l'IA s'approche de sa limite
- Quand la limite est atteinte, l'IA perd progressivement le fil : elle oublie des éléments du début de la conversation, mélange des informations, ou produit des résultats de moindre qualité
- **C'est la raison principale de la règle "1 conversation = 1 sujet"** — elle protège la qualité du livrable

**Réflexes utiles :**
- Ne pas accumuler trop d'allers-retours sur des sujets différents dans une même conversation
- Si l'assistant commence à oublier des éléments discutés plus tôt, c'est un signe que le contexte sature → ouvrir une nouvelle conversation
- Les modèles plus puissants (Opus, Gemini 3 Pro) ont généralement une fenêtre de contexte plus large, un argument de plus pour les utiliser sur les sujets complexes

### 💰 Note sur les coûts

L'utilisation de modèles puissants comme Opus consomme significativement plus de ressources qu'un modèle léger.
Pour cette première phase de déploiement, on privilégie la qualité des livrables.

**Par la suite**, une optimisation pourra être mise en place pour adapter automatiquement le modèle selon le type d'usage — par exemple, Opus pour la génération de specs et maquettes, et un modèle plus léger pour les analyses simples et les questions rapides. L'objectif : maintenir la qualité là où elle compte, réduire les coûts là où c'est possible.

---

## 10. 📋 Pense-bête

### 📄 Je veux produire une spec

- [ ] J'ai nommé mon sujet à l'assistant
- [ ] J'ai déposé mes documents sources dans `mon-espace/[mon-sujet]/`
- [ ] J'ai dit clairement "rédige la spec pour [sujet]"
- [ ] J'ai validé la synthèse proposée avant génération
- [ ] Je récupère le résultat dans `mon-espace/[mon-sujet]/livrables-opencode/spec_v1.md`

### 🖥️ Je veux produire une maquette

- [ ] J'ai nommé mon sujet à l'assistant
- [ ] J'ai déposé les sources visuelles (screenshots Figma, spec) dans `mon-espace/[mon-sujet]/`
- [ ] J'ai dit clairement "génère la maquette pour [sujet]"
- [ ] J'ai validé le plan de découpage proposé
- [ ] Je récupère le résultat dans `mon-espace/[mon-sujet]/livrables-opencode/maquette_v1.html`

### 🔎 Je veux analyser un document

- [ ] J'ai déposé le document dans `mon-espace/[mon-sujet]/` (ou je le joins dans le chat si c'est un texte simple)
- [ ] Je formule ma question directement dans le chat

---

*Ce guide couvre les usages essentiels. Pour toute question sur le workspace ou ses règles de configuration, consulter `AGENTS.md` ou contacter le référent IA du projet.*
