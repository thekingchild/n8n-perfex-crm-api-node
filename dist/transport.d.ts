import type { IExecuteFunctions, IHookFunctions, ITriggerFunctions } from 'n8n-workflow';
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
export declare function buildUrl(baseUrl: string, path: string): string;
/**
 * Normalize error from Perfex API into NodeOperationError
 */
export declare function toNodeError(error: unknown, ctx: IExecuteFunctions | IHookFunctions | ITriggerFunctions): NodeOperationError;
/**
 * Execute a request to Perfex API using n8n authenticated helper
 */
export declare function perfexRequest(this: IExecuteFunctions | IHookFunctions | ITriggerFunctions, options: PerfexRequestOptions): Promise<any>;
/**
 * Map resource/operation to HTTP method and path
 */
export declare function mapEndpoint(resource: string, operation: string, params: {
    id?: string;
    search?: string;
}): {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
};
