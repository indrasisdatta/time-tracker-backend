"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const transports_1 = require("winston/lib/winston/transports");
const winston_1 = require("winston");
exports.logger = (0, winston_1.createLogger)({
    level: "info",
    // levels: logLevels,
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })),
    transports: [
        new transports_1.Console({
            level: "info",
            format: winston_1.format.combine(winston_1.format.colorize({ all: true }), winston_1.format.splat()
            // format.printf(
            //   ({ level, message }: { level: string; message: string }) => {
            //     return `${level.toUpperCase()} ${message}`;
            //   }
            // )
            ),
        }),
        new transports_1.File({
            dirname: "logs",
            filename: "winston.log",
            format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            })),
        }),
    ],
});
//# sourceMappingURL=logger.js.map