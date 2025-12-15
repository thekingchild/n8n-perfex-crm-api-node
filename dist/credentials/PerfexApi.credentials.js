"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfexApi = void 0;
/**
 * Perfex CRM API credentials
 */
class PerfexApi {
    constructor() {
        this.name = 'perfexApi';
        this.displayName = 'Perfex CRM API';
        this.properties = [
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
        this.authenticate = {
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
        this.test = {
            request: {
                baseURL: '={{$parameter.baseUrl}}',
                url: '/api/items/search/test',
                method: 'GET',
            },
        };
    }
}
exports.PerfexApi = PerfexApi;
