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
exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.getCategories = void 0;
const Category_1 = require("../models/Category");
const constants_1 = require("../config/constants");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.Category.find();
        res.status(200).json({ status: constants_1.API_STATUS.SUCCESS, data: categories });
    }
    catch (error) {
        // next(error);
        logger_1.logger.info(`Category listing error: ${JSON.stringify(error)}`);
        res.status(500).json({ status: constants_1.API_STATUS.ERROR, error });
    }
});
exports.getCategories = getCategories;
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, subCategories: subCat } = req.body;
        const newCat = new Category_1.Category({
            name,
            description,
            subCategories: subCat.map((subCat) => ({
                _id: new mongoose_1.default.Types.ObjectId(),
                name: subCat.name,
                description: subCat.description,
            })),
        });
        const cat = yield newCat.save();
        if (cat) {
            return res.status(200).json({ status: constants_1.API_STATUS.SUCCESS, data: cat });
        }
        res.status(500).json({ status: constants_1.API_STATUS.ERROR, data: [] });
    }
    catch (error) {
        // next(error);
        logger_1.logger.info(`Category add error: ${JSON.stringify(error)}`);
        res.status(500).json({ status: constants_1.API_STATUS.ERROR, error });
    }
});
exports.addCategory = addCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingCat = yield Category_1.Category.findById(req.params.catId);
        if (!existingCat) {
            return res
                .status(400)
                .json({ status: constants_1.API_STATUS.ERROR, error: ["Invalid category"] });
        }
        const { name, description, subCategories: subCat } = req.body;
        existingCat.name = name;
        existingCat.description = description;
        if (subCat && subCat.length > 0) {
            /* Loop through newly added sub categories */
            const tempSubCat = subCat.map((newSubCat) => {
                var _a;
                let existingSubCat = (_a = existingCat.subCategories) === null || _a === void 0 ? void 0 : _a.find((oldSubCat) => {
                    var _a, _b;
                    return ((_a = oldSubCat.id) === null || _a === void 0 ? void 0 : _a.toString()) === newSubCat._id ||
                        ((_b = oldSubCat._id) === null || _b === void 0 ? void 0 : _b.toString()) === newSubCat._id;
                });
                /* If id is passed and subcategory already exists, then edit it */
                if (existingSubCat) {
                    // existingSubCat._id = new Types.ObjectId(existingSubCat._id);
                    existingSubCat.name = newSubCat.name;
                    existingSubCat.description = newSubCat.description;
                    return existingSubCat;
                }
                newSubCat._id = new mongoose_1.default.Types.ObjectId();
                /* Add subcategory */
                return newSubCat;
            });
            existingCat.subCategories = tempSubCat;
        }
        const cat = yield existingCat.save();
        if (cat) {
            return res.status(200).json({ status: constants_1.API_STATUS.SUCCESS, data: cat });
        }
        res.status(500).json({ status: constants_1.API_STATUS.ERROR, data: [] });
    }
    catch (error) {
        // next(e);
        console.log(`Category Update Error:`, error);
        logger_1.logger.info(`Category Update Error:`, error);
        res.status(500).json({ status: constants_1.API_STATUS.ERROR, error });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.Category.findOneAndDelete({ _id: req.params.catId });
        return res.status(200).json({ status: constants_1.API_STATUS.SUCCESS, data: category });
    }
    catch (error) {
        return res.status(500).json({ status: constants_1.API_STATUS.ERROR, error });
    }
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map