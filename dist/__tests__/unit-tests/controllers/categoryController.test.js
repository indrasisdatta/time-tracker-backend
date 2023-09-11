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
const categoryController_1 = require("../../../src/controllers/categoryController");
const constants_1 = require("../../../src/config/constants");
const Category_1 = require("../../../src/models/Category");
describe(" >>>> Category APIs", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("Category listing", () => {
        it("Successfully fetch category data", () => __awaiter(void 0, void 0, void 0, function* () {
            /* Mock the request and response objects */
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockCategories = [
                { _id: "1", name: "Category 1" },
                { _id: "2", name: "Category 2" },
            ];
            /* Mock the Category.find function to return some sample data */
            jest.spyOn(Category_1.Category, "find").mockResolvedValue(mockCategories);
            /* Call the controller function */
            yield (0, categoryController_1.getCategories)(req, res, {});
            /* Expect the response to be called with the correct data */
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: constants_1.API_STATUS.SUCCESS,
                data: mockCategories,
            });
        }));
        it("Error fetching data", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            jest.spyOn(Category_1.Category, "find").mockRejectedValue("DB error");
            yield (0, categoryController_1.getCategories)(req, res, {});
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: constants_1.API_STATUS.ERROR,
                error: "DB error",
            });
        }));
    });
    describe("Category add", () => {
        it("Add new category successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: {
                    name: "Category 1",
                    description: "Sample category",
                    subCategories: [
                        { name: "Subcategory 1", description: "Sample subcategory" },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockCategory = {
                _id: 1,
                name: "Category 1",
                description: "Sample category",
                subCategories: [
                    { _id: 1, name: "Subcategory 1", description: "Sample subcategory" },
                ],
            };
            /* Mock the Category.find function to return some sample data */
            jest.spyOn(Category_1.Category.prototype, "save").mockResolvedValue(mockCategory);
            yield (0, categoryController_1.addCategory)(req, res, {});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: constants_1.API_STATUS.SUCCESS,
                data: mockCategory,
            });
        }));
        it("Add new category error", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: {
                    name: "",
                    subCategories: [{ name: "" }],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            /* Mock the Category.find function to return some sample data */
            jest.spyOn(Category_1.Category.prototype, "save").mockRejectedValue("DB error");
            yield (0, categoryController_1.addCategory)(req, res, {});
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: constants_1.API_STATUS.ERROR,
                error: "DB error",
            });
        }));
    });
    describe("Category update", () => {
        it("Update failed due to invalid category id", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { catId: "546612313" },
                body: {
                    name: "Category 1",
                    description: "Sample category",
                    subCategories: [
                        {
                            _id: "12ab5576745435hj65656",
                            name: "Subcategory 1",
                            description: "Sample subcategory",
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            /* Mock the Category.findById function to return null */
            jest.spyOn(Category_1.Category, "findById").mockResolvedValue(null);
            yield (0, categoryController_1.updateCategory)(req, res, {});
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: constants_1.API_STATUS.ERROR,
                error: ["Invalid category"],
            });
        }));
        it("Update category successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                params: { catId: "546612313" },
                body: {
                    name: "Category 1",
                    description: "Sample category",
                    subCategories: [
                        {
                            _id: "12ab5576745435hj65656",
                            name: "Subcategory 1",
                            description: "Sample subcategory",
                        },
                    ],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            /* Mock the Category.findById function to return null */
            const mockExisting = new Category_1.Category(Object.assign(Object.assign({}, req.body), { _id: req.params.catId, subCategories: [
                    {
                        id: "12ab5576745435hj65656",
                        name: "Subcategory 1",
                        description: "Sample subcategory",
                    },
                ] }));
            jest.spyOn(Category_1.Category, "findById").mockResolvedValue(mockExisting);
            const mockCategory = {
                _id: req.params.catId,
                name: "Category 1",
                description: "Sample category",
                subCategories: [
                    {
                        id: "12ab5576745435hj65656",
                        name: "Subcategory 1",
                        description: "Sample subcategory",
                    },
                ],
            };
            /* Mock the Category.find function to return some sample data */
            jest.spyOn(Category_1.Category.prototype, "save").mockResolvedValue(mockCategory);
            yield (0, categoryController_1.updateCategory)(req, res, {});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: constants_1.API_STATUS.SUCCESS,
                data: mockCategory,
            });
        }));
    });
});
//# sourceMappingURL=categoryController.test.js.map