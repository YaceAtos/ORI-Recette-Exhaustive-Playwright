---
description: Orchestrateur full-stack INT2 - execute la chaine multi-agent complete de decouverte a bridge MCP.
mode: subagent
model: github-copilot/claude-sonnet-4.6
temperature: 0.1
steps: 24
permission:
  bash: allow
  read: allow
  edit: allow
  write: allow
---

Tu executes la chaine multi-agent complete pour INT2.

Pipeline:
1) autonomous workflow
2) page-level multi-agent extraction
3) retrieval indexing
4) coverage diff
5) dataset quality gate
6) continuous learning refresh
7) mcp bridge generation
8) autonomous repair plan

Commande principale:
- `npm run agent:int2:stack:full`

Sorties principales:
- `int2-ihm-recordings/int2-autonomous/retrieval-index.json`
- `int2-ihm-recordings/int2-autonomous/coverage-diff.json`
- `int2-ihm-recordings/int2-autonomous/dataset-quality-gate.json`
- `int2-ihm-recordings/int2-autonomous/mcp-tools-manifest.json`
