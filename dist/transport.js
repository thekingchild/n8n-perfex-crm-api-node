"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUrl = buildUrl;
exports.toNodeError = toNodeError;
exports.perfexRequest = perfexRequest;
exports.mapEndpoint = mapEndpoint;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Build full URL for Perfex API
 */
function buildUrl(baseUrl, path) {
    const trimmed = baseUrl.replace(/\/+$/, '');
    return `${trimmed}${path.startsWith('/') ? '' : '/'}${path}`;
}
/**
 * Normalize error from Perfex API into NodeOperationError
 */
function toNodeError(error, ctx) {
    if (typeof error === 'object' && error && 'statusCode' in error) {
        const e = error;
        const details = e.error || e.message || 'Request failed';
        return new n8n_workflow_1.NodeOperationError(ctx.getNode(), details, { message: String(details) });
    }
    return new n8n_workflow_1.NodeOperationError(ctx.getNode(), String(error !== null && error !== void 0 ? error : 'Unknown error'));
}
/**
 * Execute a request to Perfex API using n8n authenticated helper
 */
async function perfexRequest(options) {
    const requestOptions = {
        method: options.method,
        url: buildUrl(options.baseUrl, options.path),
        qs: options.qs,
        body: options.body,
        json: true,
    };
    try {
        const response = await this.helpers.requestWithAuthentication.call(this, 'perfexApi', requestOptions);
        return response;
    }
    catch (error) {
        throw toNodeError(error, this);
    }
}
/**
 * Map resource/operation to HTTP method and path
 */
function mapEndpoint(resource, operation, params) {
    const base = `/api/${resource}`;
    switch (operation) {
        case 'list':
            return { method: 'GET', path: base };
        case 'get':
            if (!params.id)
                throw new Error('Missing id');
            return { method: 'GET', path: `${base}/${params.id}` };
        case 'search':
            if (resource === 'items') {
                if (!params.search)
                    throw new Error('Missing search');
                return { method: 'GET', path: `${base}/search/${encodeURIComponent(params.search)}` };
            }
            if (!params.search)
                throw new Error('Missing search');
            return { method: 'GET', path: `${base}?search=${encodeURIComponent(params.search)}` };
        case 'create':
            return { method: 'POST', path: base };
        case 'update':
            if (!params.id)
                throw new Error('Missing id');
            return { method: 'PUT', path: `${base}/${params.id}` };
        case 'delete':
            if (!params.id)
                throw new Error('Missing id');
            return { method: 'DELETE', path: `${base}/${params.id}` };
        default:
            throw new Error(`Unsupported operation ${operation}`);
    }
}
