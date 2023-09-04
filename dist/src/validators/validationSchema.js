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
exports.categorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const Category_1 = require("../models/Category");
const logger_1 = require("../utils/logger");
exports.categorySchema = joi_1.default.object({
    name: joi_1.default.string()
        .required()
        .external((name, helpers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        logger_1.logger.info(`Context:`, helpers.prefs.context);
        // const isUnique = await Category.isCategoryNameUnique(value);
        let findCondition = { name };
        if (typeof helpers.prefs.context !== "undefined" &&
            ((_b = (_a = helpers.prefs.context.req) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.catId)) {
            findCondition = Object.assign(Object.assign({}, findCondition), { _id: { $ne: (_d = (_c = helpers.prefs.context.req) === null || _c === void 0 ? void 0 : _c.params) === null || _d === void 0 ? void 0 : _d.catId } });
        }
        const isExisting = yield Category_1.Category.findOne(findCondition);
        if (isExisting) {
            throw new Error("Category name already exists");
            // return helpers.error("Category name already exists");
        }
        return name;
    }))
        .messages({
        "any.required": "Category name is required",
        "string.empty": "Category name is required", // name is passed as blank
    }),
    description: joi_1.default.string().optional().allow(null, ""),
    subCategories: joi_1.default.array()
        .min(1)
        .items(joi_1.default.object({
        _id: joi_1.default.string().optional(),
        name: joi_1.default.string()
            .required()
            .external((name, helpers) => __awaiter(void 0, void 0, void 0, function* () {
            var _e, _f, _g, _h;
            logger_1.logger.info(`Context:`, helpers.prefs.context);
            /* {"subCategories.name": "FT"},
            {"subCategories": {"$elemMatch": {name: "FT""} }} */
            let findCondition = {
                "subCategories.name": name,
            };
            if (typeof helpers.prefs.context !== "undefined" &&
                ((_f = (_e = helpers.prefs.context.req) === null || _e === void 0 ? void 0 : _e.params) === null || _f === void 0 ? void 0 : _f.catId)) {
                findCondition = Object.assign(Object.assign({}, findCondition), { _id: { $ne: (_h = (_g = helpers.prefs.context.req) === null || _g === void 0 ? void 0 : _g.params) === null || _h === void 0 ? void 0 : _h.catId } });
            }
            const isExisting = yield Category_1.Category.findOne(findCondition);
            if (isExisting) {
                throw new Error("Sub-category name already exists");
                // return helpers.error("Category name already exists");
            }
            return name;
        }))
            .messages({
            "any.required": "Sub-category name is required",
            "string.empty": "Sub-category name is required",
        }),
        description: joi_1.default.string().optional().allow(null, ""),
    }))
        .required(),
    // .messages({
    //   "any.required": "Sub-category is required", // name is not passed at all
    //   "string.empty": "Sub-category is required", // name is passed as blank
    // }),
});
//# sourceMappingURL=validationSchema.js.map