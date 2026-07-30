# INT2 Real Business Runbook (Strict)

This workflow is strict real mode only:
- No mock fallback
- No synthetic success
- Any missing upstream dependency fails with `FULL_BUSINESS_REQUIRED`

## Files
- Runner: `int2-ihm-scripts/int2-ihm-run-real-chains.sh`
- Relay: `int2-ihm-scripts/int2-ihm-business-hooks-server.js`
- Harness: `int2-ihm-helpers/int2-ihm-business-harness.ts`
- Real env template: `.env.int2.real`

## Upstream mapping modes
You must configure one of these two modes in `.env.int2.real`:

1. Single endpoint mode (recommended)
- `ORION_UPSTREAM_EXEC_URL`

2. Per-action mode (advanced)
- `ORION_UPSTREAM_SEED_URL`
- `ORION_UPSTREAM_CLEANUP_URL`
- `ORION_UPSTREAM_CREATE_SERIES_URL`
- `ORION_UPSTREAM_TRIGGER_RRULE_URL`
- `ORION_UPSTREAM_READ_INTERVENTIONS_URL`
- `ORION_UPSTREAM_UPDATE_INTERVENTION_URL`
- `ORION_UPSTREAM_CANCEL_INTERVENTION_URL`
- `ORION_UPSTREAM_VERIFY_KAFKA_URL`
- `ORION_UPSTREAM_VERIFY_SIRENE_URL`
- `ORION_UPSTREAM_VERIFY_INS_LIFECYCLE_URL`
- `ORION_UPSTREAM_VERIFY_DMP_URL`

## Upstream contract (relay <-> action endpoint)
Request body:
```json
{
  "chain": "chain1-pp-domicile",
  "action": "seed",
  "payload": {}
}
```

Expected success response:
```json
{
  "ok": true,
  "data": {}
}
```

Expected failure response:
```json
{
  "ok": false,
  "error": "reason"
}
```

## Run
```bash
npm run test:int2:chains:real:all
```

## Authentication setup examples
If upstream returns `Missing Authentication Token`, configure auth in `.env.int2.real`.

Bearer token mode:
```env
ORION_UPSTREAM_API_KEY=your-token
ORION_UPSTREAM_API_KEY_HEADER=Authorization
ORION_UPSTREAM_API_KEY_PREFIX=Bearer
```

API Gateway x-api-key mode:
```env
ORION_UPSTREAM_API_KEY=your-api-key
ORION_UPSTREAM_API_KEY_HEADER=x-api-key
ORION_UPSTREAM_API_KEY_PREFIX=
```

Auto mode (recommended first try):
```env
ORION_UPSTREAM_API_KEY=your-secret
ORION_UPSTREAM_API_KEY_MODE=auto
```
This sends both headers:
- `Authorization: Bearer <secret>`
- `x-api-key: <secret>`

## Outputs
- Playwright artifacts: `int2-ihm-test-results/`
- MP4 videos: `int2-ihm-recordings/int2-real-chains/`
- Hook relay logs: `int2-ihm-recordings/int2-real-chains/hook-server.log`
