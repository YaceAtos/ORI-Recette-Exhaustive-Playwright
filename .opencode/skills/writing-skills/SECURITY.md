# SECURITY.md — Writing Skills

Reference dev — taxonomie securite complete pour creer/auditer un skill (format Agent Skills). Resume operationnel dans SKILL.md "Securite — garde-fous".
Le scan ici est optionnel : skills partages largement, sensibles, ou en CI — pas pour chaque creation. Pour un skill simple, les garde-fous agent suffisent.

---

## Regles CRITICAL (violations bloquantes)

| Regle | Description |
|-------|-------------|
| **Pas de self-modification** | Le skill ne modifie jamais son propre code ou sa config a runtime |
| **Pas d'exec/eval dynamique** | Jamais `exec()`, `eval()`, `__import__()` sur des inputs non controlees |
| **Pas d'instruction override** | Jamais de "ignore previous instructions", "you are now...", "disregard safety" |

## Regles HIGH (a corriger avant merge)

| Regle | Description |
|-------|-------------|
| **Pas de code obfusque** | Pas de base64/hex encode execute, pas de strings evaluees |
| **Pas de curl pipe bash** | Pas de fetch + exec de scripts distants (`curl \| sh`, `wget \| python`) |
| **Pas d'exfiltration** | Pas d'envoi de donnees vers des URLs externes non declarees |
| **Pas de collecte de secrets** | Pas de harvest `os.environ`, `~/.ssh`, credentials sans besoin declare |
| **Human-in-the-loop** | Toute action destructrice (suppression, deploy, envoi) exige validation utilisateur |
| **Scope strict** | Le skill ne fait que ce que sa description annonce — pas de scope creep |
| **Pas de persistence cachee** | Pas de cron, daemon, startup script non declare |
| **Pas de shadow trigger** | Le trigger ne masque pas une commande built-in ou un autre skill |
| **Dependances pinnees** | Versions exactes dans requirements.txt / package.json |
| **Defaults securises** | TLS actif, auth requise, `shell=False` par defaut dans subprocess |

## Patterns complementaires

### P2 — Prompt injection dans les inputs utilisateur

Tout input utilisateur passe dans un template → risque d'injection.

```python
# BAD
prompt = f"Analyse this: {user_input}"

# GOOD
prompt = f"Analyse this: {user_input!r}"  # repr() echappe les guillemets
# ou valider/sanitiser avant injection
```

### P6 — Acces fichiers hors scope

Le skill ne doit acceder qu'aux fichiers dans son perimetre declare.

```python
# BAD — lecture arbitraire
with open(user_provided_path) as f: ...

# GOOD — restreindre au dossier de travail
import pathlib
safe_root = pathlib.Path("/workspace").resolve()
target = (safe_root / user_provided_path).resolve()
if not target.is_relative_to(safe_root):
    raise ValueError("Path traversal detected")
```

### P7 — Subprocess sans validation

```python
# BAD
subprocess.run(user_cmd, shell=True)

# GOOD
subprocess.run(["git", "status"], shell=False, check=True)
```

### P8 — Secrets loggues accidentellement

Ne jamais logger / afficher des tokens, passwords, cles API.

```python
# BAD
print(f"Using token: {api_key}")

# GOOD — masquer
print(f"Using token: {api_key[:4]}***")
```

### TR1 — Dependances sans pinning

```txt
# BAD (requirements.txt)
requests

# GOOD
requests==2.31.0
```

### TR3 — Import de modules non declares

Tout import doit etre documente dans le README ou le frontmatter du skill.

---

## Scan complet

SkillSpector n'est pas publie sur PyPI ni sur un registry Docker : il faut cloner le repo et builder en local.

### Setup (une fois)

```bash
git clone https://github.com/NVIDIA/SkillSpector.git && cd SkillSpector
# Option A — Python
python3 -m venv .venv && source .venv/bin/activate && make install
# Option B — Docker
make docker-build
```

### Scanner un skill

```bash
# Python (venv actif)
skillspector scan ./mon-skill/ --no-llm
skillspector scan ./mon-skill/ --no-llm --format json   # CI/CD
skillspector scan ./mon-skill/ --no-llm --format sarif  # GitHub Advanced Security

# Docker (image buildee localement, monte le dossier courant dans /scan)
docker run --rm -v "$PWD:/scan" skillspector scan ./mon-skill/ --no-llm
```

Source : [github.com/NVIDIA/SkillSpector](https://github.com/NVIDIA/SkillSpector)

---

## Bareme scoring SkillSpector

| Score | Verdict | Action |
|-------|---------|--------|
| 0–20 | SAFE | Deploy sans restriction |
| 21–50 | REVIEW | Inspecter les findings manuellement |
| 51–80 | HIGH RISK | Corriger avant merge |
| 81–100 | DO NOT INSTALL | Bloquer — rewrite necessaire |

> Insight benchmark NVIDIA (2.12x) : les skills non-scannes presentent en moyenne 2,12x plus de findings HIGH/CRITICAL que les skills passes par SkillSpector avant merge.

---

## Checklist audit manuel (sans SkillSpector)

- [ ] Grep `exec\|eval\|__import__` dans tous les scripts
- [ ] Grep `curl.*sh\|wget.*python` dans SKILL.md et scripts
- [ ] Verifier que requirements.txt/package.json ont des versions pinnees
- [ ] Confirmer qu'aucune URL externe n'est appelee sans declaration dans le frontmatter
- [ ] Valider que les actions destructrices ont un `# requires user confirmation` en commentaire
