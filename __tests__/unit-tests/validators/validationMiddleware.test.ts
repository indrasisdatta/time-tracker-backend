import { NextFunction, Request } from "express";
import { categorySchema } from "../../../src/validators/validationSchema";
import { validationMiddleware } from "../../../src/validators/validationMiddleware";
import { API_STATUS } from "../../../src/config/constants";

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

  describe("Timesheet save", () => {
    it("Required date", async () => {
      const req = {
        body: {
          timesheetDate: "",
          timeslots: [
            {
              startTime: "08:00",
              endTime: "08:40",
              category: "64bdfc50ad4e4abe7b3b3b33",
              subCategory: "Node.js",
              comments: "Timesheet API",
            },
            {
              startTime: "08:40",
              endTime: "09:00",
              category: "64ba164ffb63941f046ce71d",
              subCategory: "Shower, ready",
              comments: null,
            },
          ],
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("timesheet")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: ["Date is required"],
      });
      expect(next).toHaveBeenCalledTimes(0);
    });

    it("Required timeslots params", async () => {
      const req = {
        body: {
          timesheetDate: "2023-08-03",
          timeslots: [
            {
              startTime: "",
              endTime: "",
              category: "",
              subCategory: "",
              comments: "",
            },
          ],
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("timesheet")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: [
          "Row #1: Start time is required",
          "Row #1: End time is required",
          "Row #1: Category is required",
          "Row #1: Sub-category is required",
        ],
      });
      expect(next).toHaveBeenCalledTimes(0);
    });

    it("Invalid timeslots", async () => {
      const req = {
        body: {
          timesheetDate: "2023-08-04",
          timeslots: [
            {
              startTime: "08:00",
              endTime: "08:40",
              category: "64bdfc50ad4e4abe7b3b3b33",
              subCategory: "Node.js",
              comments: "Timesheet API",
            },
            {
              startTime: "08:50",
              endTime: "09:00",
              category: "64ba164ffb63941f046ce71d",
              subCategory: "Shower, ready",
              comments: null,
            },
          ],
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("timesheet")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: [
          "There cannot be a gap between previous end time 08:40 and next start time 08:50.",
        ],
      });
      expect(next).toHaveBeenCalledTimes(0);
    });

    it("Valid fields", async () => {
      const req = {
        body: {
          timesheetDate: "2023-08-04",
          timeslots: [
            {
              startTime: "08:00",
              endTime: "08:40",
              category: "64bdfc50ad4e4abe7b3b3b33",
              subCategory: "Node.js",
              comments: "Timesheet API",
            },
            {
              startTime: "08:40",
              endTime: "09:00",
              category: "64ba164ffb63941f046ce71d",
              subCategory: "Shower, ready",
              comments: null,
            },
          ],
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("timesheet")(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("Timesheet summary", () => {
    it("Required params validation", async () => {
      const req = {
        body: {
          startDate: "",
          endDate: "",
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("timesheet_summary")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: [
          "Enter Start date in YYYY-MM-DD format",
          "Enter End date in YYYY-MM-DD format",
        ],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("Start, end date validation", async () => {
      const req = {
        body: {
          startDate: "2023-08-05",
          endDate: "2023-08-04",
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("timesheet_summary")(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: ["End date cannot be less than start date"],
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("Valid params", async () => {
      const req = {
        body: {
          startDate: "2023-08-04",
          endDate: "2023-08-04",
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn() as NextFunction;

      await validationMiddleware("timesheet_summary")(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
