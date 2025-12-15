import axios from 'axios';

const baseUrl = process.env.PERFEX_BASE_URL || '';
const token = process.env.PERFEX_TOKEN || '';
const authType = (process.env.PERFEX_AUTH_TYPE || 'bearer') as 'bearer' | 'authtokenHeader' | 'authtokenQuery';

const headers: Record<string, string> = {};
const params: Record<string, string> = {};

if (authType === 'bearer') {
  headers['Authorization'] = `Bearer ${token}`;
} else if (authType === 'authtokenHeader') {
  headers['authtoken'] = token;
} else {
  params['authtoken'] = token;
}

const enabled = !!baseUrl && !!token;

describe('integration: Perfex API connectivity', () => {
  (enabled ? test : test.skip)('items search returns data or error payload', async () => {
    const url = `${baseUrl.replace(/\/+$/, '')}/api/items/search/test`;
    const res = await axios.get(url, { headers, params, validateStatus: () => true });
    expect([200, 404, 401, 403]).toContain(res.status);
    expect(typeof res.data).toBe('object');
  });

  (enabled ? test : test.skip)('list leads endpoint reachable', async () => {
    const url = `${baseUrl.replace(/\/+$/, '')}/api/leads`;
    const res = await axios.get(url, { headers, params, validateStatus: () => true });
    expect([200, 404, 401, 403]).toContain(res.status);
    expect(typeof res.data).toBe('object');
  });
});
