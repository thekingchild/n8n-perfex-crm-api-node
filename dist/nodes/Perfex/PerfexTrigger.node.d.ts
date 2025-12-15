import type { INodeType, INodeTypeDescription, ITriggerFunctions, ITriggerResponse } from 'n8n-workflow';
export declare class PerfexTrigger implements INodeType {
    description: INodeTypeDescription;
    trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined>;
}
