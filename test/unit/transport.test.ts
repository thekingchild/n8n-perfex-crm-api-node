import { buildUrl, mapEndpoint, toNodeError, perfexRequest } from '../../src/transport';
import { NodeOperationError } from 'n8n-workflow';

describe('transport helpers', () => {
  test('buildUrl trims and concatenates', () => {
    expect(buildUrl('https://a.com/', '/api/leads')).toBe('https://a.com/api/leads');
    expect(buildUrl('https://a.com', 'api/leads')).toBe('https://a.com/api/leads');
  });

  test('mapEndpoint list', () => {
    expect(mapEndpoint('leads', 'list', {})).toEqual({ method: 'GET', path: '/api/leads' });
  });

  test('mapEndpoint get requires id', () => {
    expect(() => mapEndpoint('leads', 'get', {})).toThrow('Missing id');
    expect(mapEndpoint('leads', 'get', { id: '1' })).toEqual({ method: 'GET', path: '/api/leads/1' });
  });

  test('mapEndpoint search items special path', () => {
    expect(mapEndpoint('items', 'search', { search: 'JBL' })).toEqual({
      method: 'GET',
      path: '/api/items/search/JBL',
    });
  });

  test('mapEndpoint search general resources', () => {
    expect(mapEndpoint('leads', 'search', { search: 'john' })).toEqual({
      method: 'GET',
      path: '/api/leads?search=john',
    });
  });
 
  test('mapEndpoint search missing param errors', () => {
    expect(() => mapEndpoint('items', 'search', {} as any)).toThrow('Missing search');
    expect(() => mapEndpoint('leads', 'search', {} as any)).toThrow('Missing search');
  });

  test('mapEndpoint CRUD', () => {
    expect(mapEndpoint('leads', 'create', {})).toEqual({ method: 'POST', path: '/api/leads' });
    expect(mapEndpoint('leads', 'update', { id: '2' })).toEqual({ method: 'PUT', path: '/api/leads/2' });
    expect(mapEndpoint('leads', 'delete', { id: '3' })).toEqual({ method: 'DELETE', path: '/api/leads/3' });
  });
 
  test('mapEndpoint CRUD missing id errors', () => {
    expect(() => mapEndpoint('leads', 'update', {} as any)).toThrow('Missing id');
    expect(() => mapEndpoint('leads', 'delete', {} as any)).toThrow('Missing id');
  });
 
  test('mapEndpoint unsupported operation errors', () => {
    expect(() => mapEndpoint('leads', 'unknown', {} as any)).toThrow('Unsupported operation unknown');
  });

  test('toNodeError wraps string', () => {
    const ctx = { getNode: () => ({}) } as any;
    const err = toNodeError('boom', ctx);
    expect(err).toBeInstanceOf(NodeOperationError);
  });

  test('toNodeError wraps request error object', () => {
    const ctx = { getNode: () => ({}) } as any;
    const raw = { statusCode: 404, error: { message: 'No data were found' } };
    const err = toNodeError(raw, ctx);
    expect(err).toBeInstanceOf(NodeOperationError);
  });
 
  test('perfexRequest error path produces NodeOperationError', async () => {
    const ctx = {
      getNode: () => ({}),
      helpers: {
        requestWithAuthentication: () => {
          const e: any = new Error('Request failed');
          e.statusCode = 401;
          e.error = { message: 'Unauthorized' };
          throw e;
        },
      },
    } as any;
    await expect(
      perfexRequest.call(ctx, { baseUrl: 'https://x.com', path: '/api/leads', method: 'GET' }),
    ).rejects.toBeInstanceOf(NodeOperationError);
  });
});
