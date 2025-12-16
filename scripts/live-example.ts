import 'dotenv/config';
import axios from 'axios';

function baseUrl(): string {
  const url = process.env.PERFEX_BASE_URL || '';
  return url.replace(/\/+$/, '');
}

function authHeaders(): { headers: Record<string, string>; params: Record<string, string> } {
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
  headers['Content-Type'] = 'application/json';
  return { headers, params };
}

async function run() {
  const { headers, params } = authHeaders();
  const root = baseUrl();
  const results: Record<string, any> = {};

  // Example 1: Items search (per API guide: GET /api/items/search/:keysearch)
  try {
    const url = `${root}/api/items/search/test`;
    const res = await axios.get(url, { headers, params, validateStatus: () => true });
    results.itemsSearch = { status: res.status, data: res.data };
  } catch (e) {
    results.itemsSearch = { error: (e as Error).message };
  }

  // Example 2: Leads list
  try {
    const url = `${root}/api/leads`;
    const res = await axios.get(url, { headers, params, validateStatus: () => true });
    results.leadsList = { status: res.status, data: res.data };
  } catch (e) {
    results.leadsList = { error: (e as Error).message };
  }

  // Print concise shapes without secrets
  console.log(JSON.stringify(results, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
