"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = exports.nodes = void 0;
const Perfex_node_1 = require("./nodes/Perfex/Perfex.node");
const PerfexTrigger_node_1 = require("./nodes/Perfex/PerfexTrigger.node");
const PerfexApi_credentials_1 = require("./credentials/PerfexApi.credentials");
exports.nodes = [new Perfex_node_1.PerfexNode(), new PerfexTrigger_node_1.PerfexTrigger()];
exports.credentials = [new PerfexApi_credentials_1.PerfexApi()];
