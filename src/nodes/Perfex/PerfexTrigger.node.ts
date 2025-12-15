import type {
  INodeType,
  INodeTypeDescription,
  ITriggerFunctions,
  ITriggerResponse,
  INodeExecutionData,
} from 'n8n-workflow';
import { mapEndpoint, perfexRequest } from '../../transport';

export class PerfexTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Perfex CRM Trigger',
    name: 'perfexCrmTrigger',
    icon: 'file:perfex.svg',
    group: ['trigger'],
    version: 1,
    description: 'Poll Perfex CRM for new records',
    defaults: {
      name: 'Perfex CRM Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'perfexApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'https://yourdomain.com',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Leads', value: 'leads' },
          { name: 'Invoices', value: 'invoices' },
          { name: 'Projects', value: 'projects' },
          { name: 'Tasks', value: 'tasks' },
          { name: 'Customers', value: 'customers' },
        ],
        default: 'leads',
      },
      {
        displayName: 'Poll Interval',
        name: 'interval',
        type: 'number',
        typeOptions: { minValue: 10 },
        default: 60,
        description: 'Polling interval in seconds',
      },
      {
        displayName: 'Start From ID',
        name: 'startId',
        type: 'string',
        default: '',
        description: 'Only emit records with ID greater than this value',
      },
    ],
  };

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
    const baseUrl = this.getNodeParameter('baseUrl', 0) as string;
    const resource = this.getNodeParameter('resource', 0) as string;
    const interval = (this.getNodeParameter('interval', 0) as number) * 1000;
    const startId = this.getNodeParameter('startId', 0) as string;
    let lastId = startId ? Number(startId) : 0;
    const executeTrigger = async () => {
      const endpoint = mapEndpoint(resource, 'list', {});
      const res = await perfexRequest.call(this, {
        baseUrl,
        path: endpoint.path,
        method: 'GET',
      });
      const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      for (const item of items) {
        const id = Number(item.id ?? item.itemid ?? item.leadid ?? item.invoiceid ?? 0);
        if (id > lastId) {
          lastId = id;
          const exec: INodeExecutionData = { json: item };
          this.emit([[exec]]);
        }
      }
    };
    const intervalId = setInterval(async () => {
      try {
        await executeTrigger();
      } catch (e) {
        // Swallow errors to keep polling; n8n logs are handled by runtime
      }
    }, interval);
    return {
      closeFunction: async () => {
        clearInterval(intervalId);
      },
    };
  }
}
