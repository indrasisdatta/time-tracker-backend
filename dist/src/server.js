"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conn = void 0;
const app_1 = __importDefault(require("./app"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
const mongoose_1 = __importDefault(require("mongoose"));
logger_1.logger.info(`DB connection string, port: ${JSON.stringify(process.env)} `);
const port = process.env.PORT;
/* DB connection code starts */
mongoose_1.default.connect(process.env.DB_CON_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose_1.default.connection.on("connected", () => {
    logger_1.logger.info("MongoDB connection successful");
});
mongoose_1.default.connection.on("error", (err) => {
    logger_1.logger.error("MongoDB connection error:", err);
    console.error(err);
    // process.exit(1);
});
mongoose_1.default.connection.on("disconnected", (res) => {
    logger_1.logger.warn("MongoDB disconnected:", res);
});
/* DB connection code ends */
app_1.default.get("/", (req, res) => {
    return res.send("App is running");
});
app_1.default.use("/", routes_1.default);
// Custom error handling middleware for 500 errors
app_1.default.use((err, req, res, next) => {
    logger_1.logger.error("Error found: ", err.stack);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
});
exports.conn = app_1.default.listen(port, () => {
    logger_1.logger.info(`Server is running in port ${port}`);
});
exports.default = app_1.default;
//# sourceMappingURL=server.js.map