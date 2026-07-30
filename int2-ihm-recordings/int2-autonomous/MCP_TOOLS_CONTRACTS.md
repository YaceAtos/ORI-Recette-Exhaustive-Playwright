# INT2 MCP Tools Contracts

- Generated at: 2026-07-24T13:25:29.298Z
- Namespace: int2
- Mode: stdio-mcp-runtime
- Server command: npm run agent:int2:mcp:server

| Tool | Description | Input Contract | Command | Output Artifact |
|---|---|---|---|---|
| int2.search | Query the INT2 retrieval index and return ranked page routes. | query(string), topK(number, optional) | npm run agent:int2:search -- "<query>" | int2-ihm-recordings/int2-autonomous/search-results.json |
| int2.knowledge.search | Query only ingested knowledge sources (local knowledge + external loop-engineering docs). | query(string), topK(number, optional) | npm run agent:int2:knowledge:search -- "<query>" | int2-ihm-recordings/int2-autonomous/knowledge-search-results.json |
| int2.retrieval.reindex | Rebuild retrieval index from discovery graph and page agent extracts. | none | npm run agent:int2:retrieval:index | int2-ihm-recordings/int2-autonomous/retrieval-index.json |
| int2.popup.qa_loop | Run deep popup QA loop: inspect each action button, open dialogs, fill real-like data, and validate evidence. | strict(boolean, optional), allowSubmit(boolean, optional) | npm run agent:int2:popup:qa | int2-ihm-recordings/int2-autonomous/popup-qa-loop-report.json |
| int2.coverage.diff | Compare expected routes from docs against discovered routes from graph. | none | npm run agent:int2:coverage:diff | int2-ihm-recordings/int2-autonomous/coverage-diff.json |
| int2.dataset.quality_gate | Validate dataset quality and fail pipeline when thresholds are not met. | none | npm run agent:int2:dataset:quality | int2-ihm-recordings/int2-autonomous/dataset-quality-gate.json |
| int2.repair.plan | Analyze manifests and graph errors, then generate autonomous repair plan. | none | npm run agent:int2:repair | int2-ihm-recordings/int2-autonomous/autonomous-repair-plan.json |
| int2.learning.refresh | Learn from semantic profiles and extraction artifacts to suggest new aliases. | none | npm run agent:int2:learning | int2-ihm-recordings/int2-autonomous/continuous-learning-report.json |

## Notes

- This bridge is backed by a real local MCP stdio runtime.
- Any MCP-compatible client can connect via stdio using the server command listed above.
