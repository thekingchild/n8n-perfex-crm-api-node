import type { ICredentialType } from 'n8n-workflow';
/**
 * Perfex CRM API credentials
 */
export declare class PerfexApi implements ICredentialType {
    name: string;
    displayName: string;
    properties: ICredentialType['properties'];
    authenticate: ICredentialType['authenticate'];
    test: ICredentialType['test'];
}
