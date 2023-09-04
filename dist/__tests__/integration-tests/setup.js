"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = require("../../src/server");
const logger_1 = require("../../src/utils/logger");
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Final after all...", mongoose_1.default);
    try {
        // Connection to Mongo killed.
        yield mongoose_1.default.disconnect();
        // Server connection closed.
        yield server_1.conn.close();
    }
    catch (e) {
        logger_1.logger.error("DB, server clean up error", e);
        console.error(e);
    }
}));
//# sourceMappingURL=setup.js.map