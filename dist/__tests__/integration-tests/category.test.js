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
// import app from "../../src/app";
const supertest_1 = __importDefault(require("supertest"));
const logger_1 = require("../../src/utils/logger");
// import mongoose, { ConnectOptions } from "mongoose";
const server_1 = __importDefault(require("../../src/server"));
const Category_1 = require("../../src/models/Category");
describe("Category Integration testing", () => {
    const uid = new Date().getTime();
    const categoryPayload = {
        name: `Category integration test ${uid}`,
        description: `Category integration test description ${uid}`,
        subCategories: [
            {
                name: `Subcategory integration test ${uid}`,
                description: `Subcategory integration test description ${uid}`,
            },
        ],
    };
    let createdRecords = [];
    let createdSubcategories = [];
    beforeEach(() => {
        jest.setTimeout(60000);
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info(`Created records: ${JSON.stringify(createdRecords)}`);
        logger_1.logger.info(`Created subcategories: ${JSON.stringify(createdSubcategories)}`);
    }));
    /* Clean up in afterAll hook */
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const delRes = yield Category_1.Category.deleteMany({
                _id: { $in: createdRecords },
            });
            console.log("Delete response: ", delRes);
        }
        catch (e) {
            logger_1.logger.error(`Error deleting category: ${e.getMessage()}`);
        }
    }));
    describe("GET /category", () => {
        it("Should return all categories", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default).get("/category");
            logger_1.logger.info("Category list response: ", response);
            expect(response.type).toMatch(/json/);
            expect(response.statusCode).toEqual(200);
            expect(response.body.status).toEqual(1);
            expect(response.body.data.length).toBeGreaterThan(0);
        }));
    });
    describe("POST /category", () => {
        it("Should create a new category", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/category")
                .send(categoryPayload)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json");
            logger_1.logger.info("Category add success response: ", response);
            createdRecords.push(response.body.data._id);
            createdSubcategories = [
                ...createdSubcategories,
                ...response.body.data.subCategories,
            ];
            // createdSubcategories.push(response.body.data.subCategories);
            expect(response.type).toMatch(/json/);
            expect(response.statusCode).toEqual(200);
            expect(response.body.status).toEqual(1);
            expect(response.body.data).toBeTruthy();
        }));
        it("Should return required validation error", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = {
                name: "",
                subCategories: [{ name: "" }],
            };
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/category")
                .send(payload)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json");
            logger_1.logger.info("Category add validation error response: ", response);
            expect(response.type).toMatch(/json/);
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual(0);
            expect(response.body.error).toHaveLength(2);
        }));
        it("Should return unique category name error", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/category")
                .send(categoryPayload)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json");
            logger_1.logger.info("Category unique name error response: ", response);
            expect(response.type).toMatch(/json/);
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual(0);
            expect(response.body.error).toHaveLength(1);
            expect(response.body.error[0]).toMatch(/Category name already exists/);
        }));
    });
    describe("PUT /category", () => {
        it("Should update category successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = JSON.parse(JSON.stringify(categoryPayload));
            payload.description += " edited";
            payload.subCategories[0]._id = createdSubcategories[0]._id;
            payload.subCategories[0].description += " edited";
            payload.subCategories.push({
                name: "Subcategory integration test 2",
                description: "Subcategory integration test 2 description",
            });
            const response = yield (0, supertest_1.default)(server_1.default)
                .put(`/category/${createdRecords[0]}`)
                .send(payload)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json");
            expect(response.type).toMatch(/json/);
            expect(response.statusCode).toEqual(200);
            expect(response.body.status).toEqual(1);
            expect(response.body.data).toBeTruthy();
            expect(response.body.data._id).toEqual(createdRecords[0]);
        }));
        // it("Should return invalid category error", async () => {
        //   const response = await request(server)
        //     .put(`/category/64c351680e00ca26c3b63863`)
        //     .send(categoryPayload)
        //     .set("Content-Type", "application/json")
        //     .set("Accept", "application/json");
        //   expect(response.type).toMatch(/json/);
        //   expect(response.statusCode).toEqual(400);
        //   expect(response.body.status).toEqual(0);
        //   expect(response.body.error).toHaveLength(1);
        //   expect(response.body.error[0]).toMatch(/invalid/);
        // });
        it("Should return required validation error", () => __awaiter(void 0, void 0, void 0, function* () {
            // Required validation
            const payload = {
                name: "",
                subCategories: [{ name: "" }],
            };
            const response = yield (0, supertest_1.default)(server_1.default)
                .put(`/category/${createdRecords[0]}`)
                .send(payload)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json");
            expect(response.type).toMatch(/json/);
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual(0);
            expect(response.body.error).toHaveLength(2);
        }));
        it("Should return unique name validation error", () => __awaiter(void 0, void 0, void 0, function* () {
            // Category name unique validation
            const category = yield Category_1.Category.findOne({});
            const payload = JSON.parse(JSON.stringify(categoryPayload));
            payload.name = category === null || category === void 0 ? void 0 : category.name;
            const response = yield (0, supertest_1.default)(server_1.default)
                .put(`/category/${createdRecords[0]}`)
                .send(payload)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json");
            expect(response.type).toMatch(/json/);
            expect(response.statusCode).toEqual(400);
            expect(response.body.status).toEqual(0);
            expect(response.body.error).toHaveLength(1);
            expect(response.body.error[0]).toMatch(/Category name already exists/);
        }));
    });
});
//# sourceMappingURL=category.test.js.map