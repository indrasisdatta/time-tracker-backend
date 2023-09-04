"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const router = (0, express_1.Router)();
router.use("/category", categoryRoutes_1.default);
// Custom 404 error handler
router.use((req, res, next) => {
    res.status(404).json({ status: 0, message: "Not Found" });
});
exports.default = router;
//# sourceMappingURL=index.js.map