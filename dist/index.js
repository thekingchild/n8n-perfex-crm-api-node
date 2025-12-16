"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = exports.nodes = void 0;
/**
 * Entry point for n8n community nodes: Perfex CRM
 */
const Perfex_node_1 = require("./nodes/Perfex/Perfex.node");
const PerfexTrigger_node_1 = require("./nodes/Perfex/PerfexTrigger.node");
const PerfexApi_credentials_1 = require("./credentials/PerfexApi.credentials");
exports.nodes = [Perfex_node_1.Perfex, PerfexTrigger_node_1.PerfexTrigger];
exports.credentials = [PerfexApi_credentials_1.PerfexApi];
