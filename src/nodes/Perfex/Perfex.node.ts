import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { mapEndpoint, perfexRequest } from '../../transport';

export class Perfex implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Perfex CRM',
    name: 'perfexCrm',
    icon: 'file:perfex.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter.resource}}',
    description: 'Interact with Perfex CRM REST API',
    defaults: {
      name: 'Perfex CRM',
    },
    inputs: ['main'],
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
          { name: 'Items', value: 'items' },
          { name: 'Customers', value: 'customers' },
          { name: 'Invoices', value: 'invoices' },
          { name: 'Leads', value: 'leads' },
          { name: 'Projects', value: 'projects' },
          { name: 'Tasks', value: 'tasks' },
          { name: 'Subscriptions', value: 'subscriptions' },
          { name: 'Estimates', value: 'estimates' },
          { name: 'Contracts', value: 'contracts' },
          { name: 'Expenses', value: 'expenses' },
          { name: 'Payments', value: 'payments' },
          { name: 'Taxes', value: 'taxes' },
          { name: 'Payment Modes', value: 'payment_modes' },
          { name: 'Staff', value: 'staff' },
          { name: 'Milestones', value: 'milestones' },
          { name: 'Custom Fields', value: 'custom_fields' },
        ],
        default: 'leads',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        options: [
          { name: 'List', value: 'list', action: 'List records' },
          { name: 'Get', value: 'get', action: 'Get a record' },
          { name: 'Search', value: 'search', action: 'Search records' },
          { name: 'Create', value: 'create', action: 'Create a record' },
          { name: 'Update', value: 'update', action: 'Update a record' },
          { name: 'Delete', value: 'delete', action: 'Delete a record' },
        ],
        default: 'list',
      },
      {
        displayName: 'ID',
        name: 'id',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['get', 'update', 'delete'],
          },
        },
      },
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['search'],
          },
        },
      },
      {
        displayName: 'Payload',
        name: 'payload',
        type: 'json',
        default: '{}',
        displayOptions: {
          show: {
            operation: ['create', 'update'],
          },
        },
      },
      {
        displayName: 'Query Parameters',
        name: 'query',
        type: 'json',
        default: '{}',
        displayOptions: {
          show: {
            operation: ['list', 'search'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    for (let i = 0; i < items.length; i++) {
      const baseUrl = this.getNodeParameter('baseUrl', i, '') as string;
      const resource = this.getNodeParameter('resource', i, '') as string;
      const operation = this.getNodeParameter('operation', i, '') as string;
      const id = this.getNodeParameter('id', i, '') as string;
      const search = this.getNodeParameter('search', i, '') as string;
      const payload = this.getNodeParameter('payload', i, {}) as Record<string, unknown>;
      const query = this.getNodeParameter('query', i, {}) as Record<string, unknown>;
      let endpoint;
      try {
        endpoint = mapEndpoint(resource, operation, { id, search });
      } catch (e) {
        throw new NodeOperationError(this.getNode(), String(e));
      }
      const response = await perfexRequest.call(this, {
        baseUrl,
        path: endpoint.path,
        method: endpoint.method,
        qs: operation === 'list' || operation === 'search' ? query : undefined,
        body: operation === 'create' || operation === 'update' ? payload : undefined,
      });
      returnData.push({
        json: response,
      });
    }
    return [returnData];
  }
}
