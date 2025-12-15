/**
 * Entry point for n8n community nodes: Perfex CRM
 */
import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { PerfexNode } from './nodes/Perfex/Perfex.node';
import { PerfexTrigger } from './nodes/Perfex/PerfexTrigger.node';
import { PerfexApi } from './credentials/PerfexApi.credentials';

export const nodes: INodeType[] = [new PerfexNode() as unknown as INodeType, new PerfexTrigger() as unknown as INodeType];
export const credentials = [new PerfexApi() as unknown as INodeTypeDescription];
