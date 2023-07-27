import { NextFunction, Request } from "express";
import { validationMiddleware } from "../../src/validators/validationMiddleware";
import { categorySchema } from "../../src/validators/validationSchema";

describe("Validation middleware", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Add category", () => {
    it("Required fields check", async () => {
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
      const next = jest.fn() as NextFunction;

      let validationResult = await validationMiddleware("category")(
        req,
        res,
        next
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });

    it("Unique name check", async () => {
      // Mock validateAsync function to return category (unique name check fails)
      jest
        .spyOn(categorySchema, "validateAsync")
        .mockRejectedValue("Category name already exists");
      const req = {
        body: {
          name: "Cat1",
          subCategories: [{ name: "Subcat1" }],
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("category")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
    });

    it("Valid fields", async () => {
      // Mock validateAsync function to return null (unique email check passes)
      jest.spyOn(categorySchema, "validateAsync").mockResolvedValue(null);
      const req = {
        body: {
          name: "Cat1",
          subCategories: [{ name: "Subcat1" }],
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("category")(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
