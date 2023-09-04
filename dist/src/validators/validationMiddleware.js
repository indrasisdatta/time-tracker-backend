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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const validationSchema_1 = require("./validationSchema");
const constants_1 = require("../config/constants");
const logger_1 = require("../utils/logger");
const validationMiddleware = (op) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let schema;
        switch (op) {
            case "category":
                schema = validationSchema_1.categorySchema;
                break;
            case "editCategory":
                break;
        }
        if (!schema) {
            return res.status(400).json({
                status: constants_1.API_STATUS.ERROR,
                error: "Invalid request schema",
            });
        }
        try {
            const validationResult = yield schema.validateAsync(req.body, {
                abortEarly: false,
                context: { req },
            });
            logger_1.logger.info(`validationResult:`, validationResult);
            next();
        }
        catch (e) {
            logger_1.logger.error(`validationResult exception:`, e);
            let err;
            if (e.hasOwnProperty("details")) {
                err = e.details.map((err) => err.message);
            }
            else if (e.hasOwnProperty("message")) {
                err = [e.message];
            }
            return res.status(400).json({
                status: constants_1.API_STATUS.ERROR,
                error: err,
            });
        }
    });
};
exports.validationMiddleware = validationMiddleware;
//# sourceMappingURL=validationMiddleware.js.map