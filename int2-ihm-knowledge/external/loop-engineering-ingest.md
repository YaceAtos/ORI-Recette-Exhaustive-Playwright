# Loop Engineering Repo Ingest

Source: external-repos/loop-engineering
Git URL: https://github.com/cobusgreyling/loop-engineering.git

## Why this is ingested

This external repository provides a formal framework for agentic loops:
- loop design
- loop readiness scoring
- maker/checker structure
- safety and governance patterns
- MCP-based connector mindset

## Core concepts imported

- Design the loop instead of manually prompting each step.
- Five primitives + memory/state:
  - scheduling
  - worktrees
  - skills
  - connectors (MCP)
  - sub-agents (maker/checker)
  - durable memory/state
- Loop lifecycle and autonomy levels (L1/L2/L3)
- Safety controls and escalation gates

## High-value docs to query

- external-repos/loop-engineering/README.md
- external-repos/loop-engineering/docs/concepts.md
- external-repos/loop-engineering/docs/primitives.md
- external-repos/loop-engineering/docs/architecture-diagrams.md
- external-repos/loop-engineering/docs/safety.md
- external-repos/loop-engineering/docs/operating-loops.md

## Intended effect in this workspace

- The INT2 multi-agent retrieval index includes this repo content.
- Agents can answer with loop-engineering vocabulary and patterns.
- MCP tools can query these concepts through int2.search after reindexing.
