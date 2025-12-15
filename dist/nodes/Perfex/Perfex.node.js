"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfexNode = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../../transport");
class PerfexNode {
    constructor() {
        this.description = {
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
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const baseUrl = this.getNodeParameter('baseUrl', i, '');
            const resource = this.getNodeParameter('resource', i, '');
            const operation = this.getNodeParameter('operation', i, '');
            const id = this.getNodeParameter('id', i, '');
            const search = this.getNodeParameter('search', i, '');
            const payload = this.getNodeParameter('payload', i, {});
            const query = this.getNodeParameter('query', i, {});
            let endpoint;
            try {
                endpoint = (0, transport_1.mapEndpoint)(resource, operation, { id, search });
            }
            catch (e) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), String(e));
            }
            const response = await transport_1.perfexRequest.call(this, {
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
exports.PerfexNode = PerfexNode;
