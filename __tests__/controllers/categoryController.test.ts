import { NextFunction, Request } from "express";
import { Category } from "../../src/models/Category";
import {
  addCategory,
  getCategories,
  updateCategory,
} from "../../src/controllers/categoryController";
import { logger } from "../../src/utils/logger";
import { API_STATUS } from "../../src/config/constants";

describe(" >>>> Category APIs", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Category listing", () => {
    it("Successfully fetch category data", async () => {
      /* Mock the request and response objects */
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const mockCategories = [
        { _id: "1", name: "Category 1" },
        { _id: "2", name: "Category 2" },
      ];
      /* Mock the Category.find function to return some sample data */
      jest.spyOn(Category, "find").mockResolvedValue(mockCategories);

      /* Call the controller function */
      await getCategories(req, res, {} as NextFunction);

      /* Expect the response to be called with the correct data */
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.SUCCESS,
        data: mockCategories,
      });
    });

    it("Error fetching data", async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      jest.spyOn(Category, "find").mockRejectedValue("DB error");
      await getCategories(req, res, {} as NextFunction);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: "DB error",
      });
    });
  });

  describe("Category add", () => {
    it("Add new category successfully", async () => {
      const req = {
        body: {
          name: "Category 1",
          description: "Sample category",
          subCategories: [
            { name: "Subcategory 1", description: "Sample subcategory" },
          ],
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const mockCategory = {
        _id: 1,
        name: "Category 1",
        description: "Sample category",
        subCategories: [
          { _id: 1, name: "Subcategory 1", description: "Sample subcategory" },
        ],
      };
      /* Mock the Category.find function to return some sample data */
      jest.spyOn(Category.prototype, "save").mockResolvedValue(mockCategory);

      await addCategory(req, res, {} as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.SUCCESS,
        data: mockCategory,
      });
    });

    it("Add new category error", async () => {
      const req = {
        body: {
          name: "",
          subCategories: [{ name: "" }],
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      /* Mock the Category.find function to return some sample data */
      jest.spyOn(Category.prototype, "save").mockRejectedValue("DB error");

      await addCategory(req, res, {} as NextFunction);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: "DB error",
      });
    });
  });

  describe("Category update", () => {
    it("Update failed due to invalid category id", async () => {
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
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      /* Mock the Category.findById function to return null */
      jest.spyOn(Category, "findById").mockResolvedValue(null);

      await updateCategory(req, res, {} as NextFunction);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: ["Invalid category"],
      });
    });

    it("Update category successfully", async () => {
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
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      /* Mock the Category.findById function to return null */
      const mockExisting = new Category({
        ...req.body,
        _id: req.params.catId,
        subCategories: [
          {
            id: "12ab5576745435hj65656",
            name: "Subcategory 1",
            description: "Sample subcategory",
          },
        ],
      });
      jest.spyOn(Category, "findById").mockResolvedValue(mockExisting);

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
      jest.spyOn(Category.prototype, "save").mockResolvedValue(mockCategory);

      await updateCategory(req, res, {} as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.SUCCESS,
        data: mockCategory,
      });
    });
  });
});
