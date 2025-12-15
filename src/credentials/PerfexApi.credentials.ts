import type { ICredentialType, ICredentialTypeData } from 'n8n-workflow';

/**
 * Perfex CRM API credentials
 */
export class PerfexApi implements ICredentialType {
  name = 'perfexApi';
  displayName = 'Perfex CRM API';
  properties: ICredentialType['properties'] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://yourdomain.com',
      required: true,
    },
    {
      displayName: 'Token',
      name: 'token',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
    {
      displayName: 'Authentication Type',
      name: 'authType',
      type: 'options',
      options: [
        { name: 'Bearer Token', value: 'bearer' },
        { name: 'Authtoken Header', value: 'authtokenHeader' },
        { name: 'Authtoken Query', value: 'authtokenQuery' },
      ],
      default: 'bearer',
      required: true,
    },
  ];

  authenticate: ICredentialType['authenticate'] = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{$parameter.authType === "bearer" ? "Bearer " + $parameter.token : undefined}}',
        authtoken: '={{$parameter.authType === "authtokenHeader" ? $parameter.token : undefined}}',
      },
      qs: {
        authtoken: '={{$parameter.authType === "authtokenQuery" ? $parameter.token : undefined}}',
      },
    },
  };

  test: ICredentialType['test'] = {
    request: {
      baseURL: '={{$parameter.baseUrl}}',
      url: '/api/items/search/test',
      method: 'GET',
    },
  };
}
