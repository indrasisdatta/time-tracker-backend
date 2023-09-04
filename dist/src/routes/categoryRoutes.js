"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const validationMiddleware_1 = require("../validators/validationMiddleware");
const router = (0, express_1.Router)();
router.get("/", categoryController_1.getCategories);
router.post("/", (0, validationMiddleware_1.validationMiddleware)("category"), categoryController_1.addCategory);
router.put("/:catId", (0, validationMiddleware_1.validationMiddleware)("category"), categoryController_1.updateCategory);
router.delete("/:catId", categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map