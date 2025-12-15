import type { IExecuteFunctions, IHookFunctions, IRequestOptions, ITriggerFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export type AuthType = 'bearer' | 'authtokenHeader' | 'authtokenQuery';

export interface PerfexRequestOptions {
  baseUrl: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  qs?: Record<string, unknown>;
  body?: Record<string, unknown>;
}

/**
 * Build full URL for Perfex API
 */
export function buildUrl(baseUrl: string, path: string): string {
  const trimmed = baseUrl.replace(/\/+$/, '');
  return `${trimmed}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Normalize error from Perfex API into NodeOperationError
 */
export function toNodeError(
  error: unknown,
  ctx: IExecuteFunctions | IHookFunctions | ITriggerFunctions,
): NodeOperationError {
  if (typeof error === 'object' && error && 'statusCode' in error) {
    const e = error as any;
    const details = e.error || e.message || 'Request failed';
    return new NodeOperationError(ctx.getNode(), details, { message: String(details) });
  }
  return new NodeOperationError(ctx.getNode(), String(error ?? 'Unknown error'));
}

/**
 * Execute a request to Perfex API using n8n authenticated helper
 */
export async function perfexRequest(
  this: IExecuteFunctions | IHookFunctions | ITriggerFunctions,
  options: PerfexRequestOptions,
): Promise<any> {
  const requestOptions: IRequestOptions = {
    method: options.method,
    url: buildUrl(options.baseUrl, options.path),
    qs: options.qs as any,
    body: options.body as any,
    json: true,
  };
  try {
    const response = await this.helpers.requestWithAuthentication.call(this, 'perfexApi', requestOptions);
    return response;
  } catch (error) {
    throw toNodeError(error, this);
  }
}

/**
 * Map resource/operation to HTTP method and path
 */
export function mapEndpoint(
  resource: string,
  operation: string,
  params: { id?: string; search?: string },
): { method: 'GET' | 'POST' | 'PUT' | 'DELETE'; path: string } {
  const base = `/api/${resource}`;
  switch (operation) {
    case 'list':
      return { method: 'GET', path: base };
    case 'get':
      if (!params.id) throw new Error('Missing id');
      return { method: 'GET', path: `${base}/${params.id}` };
    case 'search':
      if (resource === 'items') {
        if (!params.search) throw new Error('Missing search');
        return { method: 'GET', path: `${base}/search/${encodeURIComponent(params.search)}` };
      }
      if (!params.search) throw new Error('Missing search');
      return { method: 'GET', path: `${base}?search=${encodeURIComponent(params.search)}` };
    case 'create':
      return { method: 'POST', path: base };
    case 'update':
      if (!params.id) throw new Error('Missing id');
      return { method: 'PUT', path: `${base}/${params.id}` };
    case 'delete':
      if (!params.id) throw new Error('Missing id');
      return { method: 'DELETE', path: `${base}/${params.id}` };
    default:
      throw new Error(`Unsupported operation ${operation}`);
  }
}
