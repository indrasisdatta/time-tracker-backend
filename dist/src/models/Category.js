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
exports.Category = void 0;
const mongoose_1 = require("mongoose");
// export interface iCategoryRequest extends ICategory, Document {
//   isCategoryNameUnique(name: string): Promise<boolean>;
// }
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    subCategories: [
        new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.ObjectId },
            name: { type: String, required: true, unique: true },
            description: { type: String },
        }),
    ],
}, { timestamps: true });
categorySchema.static("isCategoryNameUnique", function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingCategory = yield this.findOne({ name });
        return !existingCategory;
    });
});
exports.Category = (0, mongoose_1.model)("Category", categorySchema);
// export default Category;
//# sourceMappingURL=Category.js.map