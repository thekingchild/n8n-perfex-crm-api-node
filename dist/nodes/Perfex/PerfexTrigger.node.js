"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfexTrigger = void 0;
const transport_1 = require("../../transport");
class PerfexTrigger {
    constructor() {
        this.description = {
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
    }
    async trigger() {
        const baseUrl = this.getNodeParameter('baseUrl', 0);
        const resource = this.getNodeParameter('resource', 0);
        const interval = this.getNodeParameter('interval', 0) * 1000;
        const startId = this.getNodeParameter('startId', 0);
        let lastId = startId ? Number(startId) : 0;
        const executeTrigger = async () => {
            var _a, _b, _c, _d;
            const endpoint = (0, transport_1.mapEndpoint)(resource, 'list', {});
            const res = await transport_1.perfexRequest.call(this, {
                baseUrl,
                path: endpoint.path,
                method: 'GET',
            });
            const items = Array.isArray(res === null || res === void 0 ? void 0 : res.data) ? res.data : Array.isArray(res) ? res : [];
            for (const item of items) {
                const id = Number((_d = (_c = (_b = (_a = item.id) !== null && _a !== void 0 ? _a : item.itemid) !== null && _b !== void 0 ? _b : item.leadid) !== null && _c !== void 0 ? _c : item.invoiceid) !== null && _d !== void 0 ? _d : 0);
                if (id > lastId) {
                    lastId = id;
                    const exec = { json: item };
                    this.emit([[exec]]);
                }
            }
        };
        const intervalId = setInterval(async () => {
            try {
                await executeTrigger();
            }
            catch (e) {
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
exports.PerfexTrigger = PerfexTrigger;
