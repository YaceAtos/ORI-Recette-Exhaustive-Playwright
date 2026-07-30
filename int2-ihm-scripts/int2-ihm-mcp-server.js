const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const autonomousDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');

function normalizeText(value) {
  return String(value || '').trim();
}

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function execCommand(command, env = {}) {
  const shell = process.platform === 'win32' ? 'cmd' : 'sh';
  const args = process.platform === 'win32' ? ['/c', command] : ['-lc', command];
  const child = spawnSync(shell, args, {
    cwd: rootDir,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });

  return {
    command,
    exitCode: Number.isFinite(child.status) ? child.status : 1,
    stdout: child.stdout || '',
    stderr: child.stderr || '',
  };
}

function mcpText(text) {
  return { type: 'text', text: String(text) };
}

function toolResultFromRun(result, artifactPath) {
  const lines = [];
  lines.push(`Command: ${result.command}`);
  lines.push(`Exit code: ${result.exitCode}`);
  if (artifactPath) lines.push(`Artifact: ${artifactPath}`);
  if (result.stdout.trim()) lines.push(`stdout:\n${result.stdout.trim()}`);
  if (result.stderr.trim()) lines.push(`stderr:\n${result.stderr.trim()}`);

  const payload = {
    command: result.command,
    exitCode: result.exitCode,
    artifact: artifactPath || null,
    stdout: result.stdout,
    stderr: result.stderr,
    ok: result.exitCode === 0,
  };

  return {
    content: [mcpText(lines.join('\n\n'))],
    structuredContent: payload,
    isError: result.exitCode !== 0,
  };
}

const tools = [
  {
    name: 'int2.search',
    description: 'Run ranked retrieval search over INT2 autonomous index.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', minLength: 1 },
        topK: { type: 'number', minimum: 1, maximum: 50 },
      },
      required: ['query'],
      additionalProperties: false,
    },
    handler: (args) => {
      const query = normalizeText(args?.query);
      const topK = Number(args?.topK || 8);
      if (!query) {
        return { isError: true, content: [mcpText('Missing required argument: query')] };
      }

      const result = execCommand(`npm run agent:int2:search -- ${JSON.stringify(query)}`, {
        INT2_SEARCH_TOPK: String(topK),
      });
      const artifact = path.join(autonomousDir, 'search-results.json');
      return toolResultFromRun(result, artifact);
    },
  },
  {
    name: 'int2.knowledge.search',
    description: 'Run ranked retrieval search over knowledge-only sources (local knowledge + external docs).',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', minLength: 1 },
        topK: { type: 'number', minimum: 1, maximum: 50 },
      },
      required: ['query'],
      additionalProperties: false,
    },
    handler: (args) => {
      const query = normalizeText(args?.query);
      const topK = Number(args?.topK || 8);
      if (!query) {
        return { isError: true, content: [mcpText('Missing required argument: query')] };
      }

      const result = execCommand(`npm run agent:int2:knowledge:search -- ${JSON.stringify(query)}`, {
        INT2_KNOWLEDGE_SEARCH_TOPK: String(topK),
      });
      const artifact = path.join(autonomousDir, 'knowledge-search-results.json');
      return toolResultFromRun(result, artifact);
    },
  },
  {
    name: 'int2.retrieval.reindex',
    description: 'Rebuild INT2 retrieval index from latest discovery and extraction artifacts.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    handler: () => {
      const result = execCommand('npm run agent:int2:retrieval:index');
      const artifact = path.join(autonomousDir, 'retrieval-index.json');
      return toolResultFromRun(result, artifact);
    },
  },
  {
    name: 'int2.popup.qa_loop',
    description: 'Run deep popup QA loop with proof artifacts for each action and popup.',
    inputSchema: {
      type: 'object',
      properties: {
        strict: { type: 'boolean' },
        allowSubmit: { type: 'boolean' },
        maxRoutes: { type: 'number', minimum: 1 },
        maxButtons: { type: 'number', minimum: 1 },
      },
      additionalProperties: false,
    },
    handler: (args) => {
      const env = {};
      if (typeof args?.strict === 'boolean') env.INT2_POPUP_QA_STRICT = args.strict ? 'true' : 'false';
      if (typeof args?.allowSubmit === 'boolean') env.INT2_POPUP_QA_ALLOW_SUBMIT = args.allowSubmit ? 'true' : 'false';
      if (Number.isFinite(Number(args?.maxRoutes))) env.INT2_POPUP_QA_MAX_ROUTES = String(Number(args.maxRoutes));
      if (Number.isFinite(Number(args?.maxButtons))) env.INT2_POPUP_QA_MAX_BUTTONS = String(Number(args.maxButtons));

      const result = execCommand('npm run agent:int2:popup:qa', env);
      const artifact = path.join(autonomousDir, 'popup-qa-loop-report.json');
      return toolResultFromRun(result, artifact);
    },
  },
  {
    name: 'int2.coverage.diff',
    description: 'Compute expected-vs-discovered route coverage diff for INT2.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    handler: () => {
      const result = execCommand('npm run agent:int2:coverage:diff');
      const artifact = path.join(autonomousDir, 'coverage-diff.json');
      return toolResultFromRun(result, artifact);
    },
  },
  {
    name: 'int2.dataset.quality_gate',
    description: 'Run dataset quality gate checks for INT2 search/dataset artifacts.',
    inputSchema: {
      type: 'object',
      properties: {
        minTerms: { type: 'number', minimum: 1 },
        minUniqueRatio: { type: 'number', minimum: 0, maximum: 1 },
        minSemanticProfiles: { type: 'number', minimum: 1 },
      },
      additionalProperties: false,
    },
    handler: (args) => {
      const env = {};
      if (Number.isFinite(Number(args?.minTerms))) env.INT2_QG_MIN_TERMS = String(Number(args.minTerms));
      if (Number.isFinite(Number(args?.minUniqueRatio))) env.INT2_QG_MIN_UNIQUE_RATIO = String(Number(args.minUniqueRatio));
      if (Number.isFinite(Number(args?.minSemanticProfiles))) env.INT2_QG_MIN_SEMANTIC_PROFILES = String(Number(args.minSemanticProfiles));

      const result = execCommand('npm run agent:int2:dataset:quality', env);
      const artifact = path.join(autonomousDir, 'dataset-quality-gate.json');
      return toolResultFromRun(result, artifact);
    },
  },
  {
    name: 'int2.repair.plan',
    description: 'Generate autonomous repair plan from graph/manifests failures.',
    inputSchema: {
      type: 'object',
      properties: {
        strict: { type: 'boolean' },
      },
      additionalProperties: false,
    },
    handler: (args) => {
      const env = {};
      if (typeof args?.strict === 'boolean') env.INT2_REPAIR_STRICT = args.strict ? 'true' : 'false';

      const result = execCommand('npm run agent:int2:repair', env);
      const artifact = path.join(autonomousDir, 'autonomous-repair-plan.json');
      return toolResultFromRun(result, artifact);
    },
  },
  {
    name: 'int2.learning.refresh',
    description: 'Refresh learned semantic aliases from autonomous artifacts.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    handler: () => {
      const result = execCommand('npm run agent:int2:learning');
      const artifact = path.join(autonomousDir, 'continuous-learning-report.json');
      return toolResultFromRun(result, artifact);
    },
  },
  {
    name: 'int2.stack.full',
    description: 'Run full autonomous INT2 stack end-to-end.',
    inputSchema: {
      type: 'object',
      properties: {
        deepDiscovery: { type: 'boolean' },
      },
      additionalProperties: false,
    },
    handler: (args) => {
      const env = {};
      if (typeof args?.deepDiscovery === 'boolean') env.INT2_USE_DEEP_DISCOVERY = args.deepDiscovery ? 'true' : 'false';
      const result = execCommand('npm run agent:int2:stack:full', env);
      const artifact = path.join(autonomousDir, 'mcp-tools-manifest.json');
      return toolResultFromRun(result, artifact);
    },
  },
];

const toolMap = new Map(tools.map((t) => [t.name, t]));

function successResponse(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function errorResponse(id, code, message, data) {
  return {
    jsonrpc: '2.0',
    id: id ?? null,
    error: {
      code,
      message,
      ...(data === undefined ? {} : { data }),
    },
  };
}

function writeMessage(payload) {
  const body = JSON.stringify(payload);
  const headers = `Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n`;
  process.stdout.write(headers + body);
}

function handleRequest(msg) {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    return successResponse(id, {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {},
      },
      serverInfo: {
        name: 'int2-autonomous-mcp-server',
        version: '1.0.0',
      },
    });
  }

  if (method === 'notifications/initialized') {
    return null;
  }

  if (method === 'tools/list') {
    return successResponse(id, {
      tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      })),
    });
  }

  if (method === 'tools/call') {
    const name = params?.name;
    const args = params?.arguments || {};
    const tool = toolMap.get(name);
    if (!tool) {
      return errorResponse(id, -32602, `Unknown tool: ${name}`);
    }

    try {
      const result = tool.handler(args);
      return successResponse(id, result);
    } catch (error) {
      return successResponse(id, {
        isError: true,
        content: [mcpText(String(error && error.message ? error.message : error))],
      });
    }
  }

  return errorResponse(id, -32601, `Method not found: ${method}`);
}

let inputBuffer = Buffer.alloc(0);
let expectedBodyLength = null;

function tryParseFrame() {
  while (true) {
    if (expectedBodyLength === null) {
      const headerEnd = inputBuffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) return;

      const rawHeaders = inputBuffer.slice(0, headerEnd).toString('utf8');
      const headers = rawHeaders.split('\r\n');
      let contentLength = null;
      for (const h of headers) {
        const idx = h.indexOf(':');
        if (idx === -1) continue;
        const key = h.slice(0, idx).trim().toLowerCase();
        const value = h.slice(idx + 1).trim();
        if (key === 'content-length') {
          contentLength = Number(value);
        }
      }

      if (!Number.isFinite(contentLength) || contentLength < 0) {
        inputBuffer = Buffer.alloc(0);
        expectedBodyLength = null;
        return;
      }

      expectedBodyLength = contentLength;
      inputBuffer = inputBuffer.slice(headerEnd + 4);
    }

    if (expectedBodyLength === null) return;
    if (inputBuffer.length < expectedBodyLength) return;

    const bodyBuffer = inputBuffer.slice(0, expectedBodyLength);
    inputBuffer = inputBuffer.slice(expectedBodyLength);
    expectedBodyLength = null;

    let message;
    try {
      message = JSON.parse(bodyBuffer.toString('utf8'));
    } catch {
      continue;
    }

    if (!message || message.jsonrpc !== '2.0' || !message.method) {
      continue;
    }

    const response = handleRequest(message);
    if (response) {
      writeMessage(response);
    }
  }
}

process.stdin.on('data', (chunk) => {
  inputBuffer = Buffer.concat([inputBuffer, chunk]);
  tryParseFrame();
});

process.stdin.on('end', () => {
  process.exit(0);
});
