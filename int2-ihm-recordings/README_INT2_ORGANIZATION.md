# INT2 Recording Organization

## Goal
This folder is organized to keep INT2 exhaustive automation readable and auditable.

## Main Outputs
- INT2 functional matrix: [INT2_FUNCTIONAL_SCENARIO_MATRIX.md](INT2_FUNCTIONAL_SCENARIO_MATRIX.md)
- Exhaustive panel (all suites found under recordings): [chains/PANNEAU_EXHAUSTIF_CAS_DE_TEST.md](chains/PANNEAU_EXHAUSTIF_CAS_DE_TEST.md)

## Recording Folders
- `int2-ihm-recordings/chains/`: chain-level videos/manifests.
- `int2-ihm-recordings/working/`: stable scenario pack videos/manifests.
- `int2-ihm-recordings/exhaustive/`: full exhaustive run export outputs.

## INT2 Scope Rule
INT2-only exhaustive automation includes:
- `chains-exhaustive.spec.ts`
- `int2-collaborateur-e2e.spec.ts`
- `int2-collaborateur-extended.spec.ts`

Non-INT2 recordings are retained for traceability but flagged as excluded in the INT2 matrix.

## Functional Policy Labels in Matrix
- `E2E Functional`: scenario currently runnable and validated.
- `Data Mode = No persistent data creation`: no final creation submit.
- `Fill Mode = Semi-autonomous`: only deterministic search/filter inputs or dialog open/close.
- `Creation Coverage`: creation possibility exercised, not exhaustive across all creation variants.

## Regeneration Commands
- `npm run test:exhaustive:record`
- `npm run report:int2:functional`
- `npm run report:panel:exhaustive`
- `npm run test:full:exhaustive`
