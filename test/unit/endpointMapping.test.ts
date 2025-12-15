import { mapEndpoint } from '../../src/transport';

describe('endpoint mapping for major resources', () => {
  const resources = [
    'items',
    'customers',
    'invoices',
    'leads',
    'projects',
    'tasks',
    'subscriptions',
    'estimates',
    'contracts',
    'expenses',
    'payments',
    'taxes',
    'payment_modes',
    'staff',
    'milestones',
    'custom_fields',
  ];

  test('list endpoints', () => {
    for (const r of resources) {
      expect(mapEndpoint(r, 'list', {})).toEqual({ method: 'GET', path: `/api/${r}` });
    }
  });

  test('get endpoints require id', () => {
    for (const r of resources) {
      expect(() => mapEndpoint(r, 'get', {})).toThrow('Missing id');
    }
  });
});
