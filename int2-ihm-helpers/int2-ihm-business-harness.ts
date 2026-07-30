type HookPayload = Record<string, unknown>;

type HookResponse<T = Record<string, unknown>> = {
  ok: boolean;
  action: string;
  chain: string;
  data?: T;
  error?: string;
};

export type ChainSeed = {
  agenceName?: string;
  produitName?: string;
  intervenantName?: string;
  clientName?: string;
  clientId?: string;
  devisId?: string;
  ofName?: string;
  cdaName?: string;
  papId?: string;
  [k: string]: unknown;
};

export class Int2BusinessHarness {
  private readonly execUrl: string;
  private readonly apiKey?: string;

  constructor(private readonly chain: string) {
    this.execUrl = String(process.env.ORION_HOOK_EXEC_URL || '').trim();
    this.apiKey = String(process.env.ORION_HOOK_API_KEY || '').trim() || undefined;
    if (!this.execUrl) {
      throw new Error('FULL_BUSINESS_REQUIRED: Missing ORION_HOOK_EXEC_URL for real business execution');
    }
  }

  private async exec<T = Record<string, unknown>>(action: string, payload: HookPayload = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Orion-Chain': this.chain,
      'X-Orion-Action': action,
    };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;

    const response = await fetch(this.execUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ chain: this.chain, action, payload }),
    });

    const raw = await response.text();
    let parsed: HookResponse<T> | null = null;
    try {
      parsed = JSON.parse(raw) as HookResponse<T>;
    } catch {
      throw new Error(`FULL_BUSINESS_REQUIRED: Hook response is not JSON for ${action} (${response.status})`);
    }

    if (!response.ok || !parsed?.ok) {
      const reason = parsed?.error || `HTTP ${response.status}`;
      throw new Error(`FULL_BUSINESS_REQUIRED: Hook action failed (${action}) - ${reason}`);
    }

    return (parsed.data || {}) as T;
  }

  seed(initial: HookPayload = {}) {
    return this.exec<ChainSeed>('seed', initial);
  }

  cleanup(finalState: HookPayload = {}) {
    return this.exec('cleanup', finalState);
  }

  createSeries(payload: HookPayload) {
    return this.exec<{ seriesId: string; status?: string }>('create_series', payload);
  }

  triggerRrule(payload: HookPayload) {
    return this.exec<{ batchRunId?: string; generatedCount?: number }>('trigger_rrule', payload);
  }

  readInterventions(payload: HookPayload) {
    return this.exec<{ interventions: Array<Record<string, unknown>> }>('read_interventions', payload);
  }

  updateIntervention(payload: HookPayload) {
    return this.exec<{ interventionId: string; status?: string }>('update_intervention', payload);
  }

  cancelIntervention(payload: HookPayload) {
    return this.exec<{ interventionId: string; status?: string; billingState?: string }>('cancel_intervention', payload);
  }

  verifyKafka(payload: HookPayload) {
    return this.exec<{ found: boolean; eventId?: string }>('verify_kafka', payload);
  }

  verifySirene(payload: HookPayload) {
    return this.exec<{ enriched: boolean; ape?: string; legalForm?: string }>('verify_sirene', payload);
  }

  verifyInsLifecycle(payload: HookPayload) {
    return this.exec<{ states: string[] }>('verify_ins_lifecycle', payload);
  }

  verifyDmp(payload: HookPayload) {
    return this.exec<{ published: boolean; documentId?: string }>('verify_dmp', payload);
  }
}
