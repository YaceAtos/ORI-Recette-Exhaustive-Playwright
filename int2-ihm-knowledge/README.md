# Knowledge-Driven Form Intelligence

This directory stores semantic knowledge used by autonomous form filling.

## Layers

- `semantic/`: Field meaning, aliases, semantic types, and constraints.
- `generators/`: Value generation strategies and provider mappings.
- `validators/`: Validation rules (regex/checksum/domain constraints).
- `locales/`: Locale-specific defaults for dates, phones, and samples.
- `ui/`: UI framework signals and selector hints.
- `testing/`: Boundary/security/accessibility/performance/visual policies.

## Runtime Integration

- `int2-ihm-scripts/int2-ihm-agent-form-semantics.js` loads `semantic/*.yaml`.
- Alias and keyword matching determine `semantic_type` and inferred intent.
- Generated samples are knowledge-aware (including SIREN/SIRET rules).
- `int2-ihm-tests/int2-ihm-create-workflows-autonomous.spec.ts` applies runtime variation per route/field/variant.

## Practical Notes

- Keep aliases multilingual where possible.
- Keep generator values realistic and business-safe.
- Put strict business constraints in `validators/`.
- For deterministic reproducibility, set `INT2_DATASET_RUN_SEED`.