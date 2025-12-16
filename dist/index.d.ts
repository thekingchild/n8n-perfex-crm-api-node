/**
 * Entry point for n8n community nodes: Perfex CRM
 */
import { PerfexNode } from './nodes/Perfex/Perfex.node';
import { PerfexTrigger } from './nodes/Perfex/PerfexTrigger.node';
import { PerfexApi } from './credentials/PerfexApi.credentials';
export declare const nodes: (typeof PerfexNode | typeof PerfexTrigger)[];
export declare const credentials: (typeof PerfexApi)[];
