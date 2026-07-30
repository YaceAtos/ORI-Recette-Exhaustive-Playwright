#!/usr/bin/env node

const http = require('node:http');

const HOST = process.env.ORION_HOOK_HOST || '127.0.0.1';
const PORT = Number(process.env.ORION_HOOK_PORT || 8787);
const INBOUND_API_KEY = String(process.env.ORION_HOOK_API_KEY || '').trim();
const UPSTREAM_API_KEY = String(process.env.ORION_UPSTREAM_API_KEY || '').trim();
const UPSTREAM_API_KEY_MODE = String(process.env.ORION_UPSTREAM_API_KEY_MODE || 'auto').trim().toLowerCase();
const UPSTREAM_API_KEY_HEADER = String(process.env.ORION_UPSTREAM_API_KEY_HEADER || 'Authorization').trim();
const UPSTREAM_API_KEY_PREFIX = String(process.env.ORION_UPSTREAM_API_KEY_PREFIX || 'Bearer').trim();
const DEFAULT_UPSTREAM_EXEC_URL = String(process.env.ORION_UPSTREAM_EXEC_URL || '').trim();

const ACTION_ENV = {
  seed: 'ORION_UPSTREAM_SEED_URL',
  cleanup: 'ORION_UPSTREAM_CLEANUP_URL',
  create_series: 'ORION_UPSTREAM_CREATE_SERIES_URL',
  trigger_rrule: 'ORION_UPSTREAM_TRIGGER_RRULE_URL',
  read_interventions: 'ORION_UPSTREAM_READ_INTERVENTIONS_URL',
  update_intervention: 'ORION_UPSTREAM_UPDATE_INTERVENTION_URL',
  cancel_intervention: 'ORION_UPSTREAM_CANCEL_INTERVENTION_URL',
  verify_kafka: 'ORION_UPSTREAM_VERIFY_KAFKA_URL',
  verify_sirene: 'ORION_UPSTREAM_VERIFY_SIRENE_URL',
  verify_ins_lifecycle: 'ORION_UPSTREAM_VERIFY_INS_LIFECYCLE_URL',
  verify_dmp: 'ORION_UPSTREAM_VERIFY_DMP_URL',
};

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', reject);
  });
}

function readBearer(req) {
  const auth = String(req.headers.authorization || '').trim();
  const match = /^Bearer\s+(.+)$/i.exec(auth);
  return match ? match[1].trim() : '';
}

async function callUpstream({ chain, action, payload }) {
  const envName = ACTION_ENV[action];
  if (!envName) {
    throw new Error(`Unsupported action: ${action}`);
  }

  const actionUrl = String(process.env[envName] || '').trim();
  const url = actionUrl || DEFAULT_UPSTREAM_EXEC_URL;
  if (!url) {
    throw new Error(`Missing ${envName} (or ORION_UPSTREAM_EXEC_URL) for action ${action}`);
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Orion-Chain': chain,
    'X-Orion-Action': action,
  };
  if (UPSTREAM_API_KEY) {
    if (UPSTREAM_API_KEY_MODE === 'auto') {
      headers.Authorization = `Bearer ${UPSTREAM_API_KEY}`;
      headers['x-api-key'] = UPSTREAM_API_KEY;
    } else {
      if (UPSTREAM_API_KEY_PREFIX) {
        headers[UPSTREAM_API_KEY_HEADER] = `${UPSTREAM_API_KEY_PREFIX} ${UPSTREAM_API_KEY}`;
      } else {
        headers[UPSTREAM_API_KEY_HEADER] = UPSTREAM_API_KEY;
      }
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ chain, action, payload }),
  });

  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Upstream ${action} returned non-JSON (${response.status})`);
  }

  if (!response.ok) {
    const reason = parsed && (parsed.error || parsed.message)
      ? String(parsed.error || parsed.message)
      : `HTTP ${response.status}`;
    throw new Error(`Upstream ${action} failed: ${reason}`);
  }

  if (typeof parsed.ok === 'boolean') {
    if (!parsed.ok) {
      throw new Error(`Upstream ${action} returned ok=false: ${String(parsed.error || 'unknown')}`);
    }
    return parsed.data || {};
  }

  return parsed;
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    return writeJson(res, 200, { ok: true, service: 'int2-business-hooks-server' });
  }

  if (req.url !== '/exec' || req.method !== 'POST') {
    return writeJson(res, 404, { ok: false, error: 'Not found' });
  }

  if (INBOUND_API_KEY) {
    const token = readBearer(req);
    if (token !== INBOUND_API_KEY) {
      return writeJson(res, 401, { ok: false, error: 'Unauthorized' });
    }
  }

  try {
    const raw = await collectBody(req);
    const body = raw ? JSON.parse(raw) : {};
    const chain = String(body.chain || '').trim();
    const action = String(body.action || '').trim();
    const payload = body.payload && typeof body.payload === 'object' ? body.payload : {};

    if (!chain) {
      return writeJson(res, 400, { ok: false, error: 'Missing chain' });
    }
    if (!action) {
      return writeJson(res, 400, { ok: false, error: 'Missing action' });
    }

    const data = await callUpstream({ chain, action, payload });
    return writeJson(res, 200, { ok: true, chain, action, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return writeJson(res, 500, { ok: false, error: message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`INT2 business hooks server listening on http://${HOST}:${PORT}`);
  console.log('Real mode: each action requires a configured ORION_UPSTREAM_*_URL');
});
