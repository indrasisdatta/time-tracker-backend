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
const validationSchema_1 = require("../../../src/validators/validationSchema");
const validationMiddleware_1 = require("../../../src/validators/validationMiddleware");
describe("Validation middleware", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("Add category", () => {
        it("Required fields check", () => __awaiter(void 0, void 0, void 0, function* () {
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
            const next = jest.fn();
            let validationResult = yield (0, validationMiddleware_1.validationMiddleware)("category")(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledTimes(0);
        }));
        it("Unique name check", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock validateAsync function to return category (unique name check fails)
            jest
                .spyOn(validationSchema_1.categorySchema, "validateAsync")
                .mockRejectedValue("Category name already exists");
            const req = {
                body: {
                    name: "Cat1",
                    subCategories: [{ name: "Subcat1" }],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();
            yield (0, validationMiddleware_1.validationMiddleware)("category")(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledTimes(0);
        }));
        it("Valid fields", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock validateAsync function to return null (unique email check passes)
            jest.spyOn(validationSchema_1.categorySchema, "validateAsync").mockResolvedValue(null);
            const req = {
                body: {
                    name: "Cat1",
                    subCategories: [{ name: "Subcat1" }],
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();
            yield (0, validationMiddleware_1.validationMiddleware)("category")(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
        }));
    });
});
//# sourceMappingURL=validationMiddleware.test.js.map