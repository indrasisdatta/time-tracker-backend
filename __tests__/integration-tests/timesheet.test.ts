import { Timesheet } from "../../src/models/Timesheet";
import { logger } from "../../src/utils/logger";
import server from "../../src/server";
import request from "supertest";

describe("Timesheet Integration test", () => {
  let createdRecords: any = [];

  beforeEach(() => {
    jest.setTimeout(60000);
  });

  afterEach(async () => {
    logger.info(`Created record: ${JSON.stringify(createdRecords)}`);
  });

  afterAll(async () => {
    try {
      if (createdRecords.length > 0) {
        await Timesheet.deleteMany({ _id: { $in: createdRecords } });
      }
    } catch (e) {
      console.error("Cleanup Delete error", e);
    }
  });

  describe("POST /timesheet/save", () => {
    it("Should return required validation error", async () => {
      const payload = {
        timesheetDate: "",
        timeslots: [
          {
            startTime: "",
            endTime: "",
            category: "",
            subCategory: "",
            comments: "",
          },
        ],
      };
      const response = await request(server)
        .post("/timesheet/save")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        status: 0,
        error: [
          "Date is required",
          "Row #1: Start time is required",
          "Row #1: End time is required",
          "Row #1: Category is required",
          "Row #1: Sub-category is required",
        ],
      });
    });

    it("Should return timeslot validation error", async () => {
      const payload = {
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
      };
      const response = await request(server)
        .post("/timesheet/save")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        status: 0,
        error: [
          "There cannot be a gap between previous end time 08:40 and next start time 08:50.",
        ],
      });
    });

    it("Should create timesheet entry successfully", async () => {
      const payload = {
        timesheetDate: "2020-08-04",
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
      };
      const response = await request(server)
        .post("/timesheet/save")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual(1);
      expect(response.body.data).toBeTruthy();
      response.body.data.map((data: any) => {
        createdRecords.push(data._id);
      });
    });
  });

  describe("GET /timesheet/:date", () => {
    it("Should return timesheet record successfully", async () => {
      const response = await request(server).get("/timesheet/2020-08-04");
      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual(1);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("POST /timesheet/summary", () => {
    it("Should return required validation error", async () => {
      const payload = {
        startDate: "",
        endDate: "",
      };
      const response = await request(server)
        .post("/timesheet/summary")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        status: 0,
        error: [
          "Enter Start date in YYYY-MM-DD format",
          "Enter End date in YYYY-MM-DD format",
        ],
      });
    });
    it("Should return end time validation error", async () => {
      const payload = {
        startDate: "2023-08-05",
        endDate: "2023-08-04",
      };
      const response = await request(server)
        .post("/timesheet/summary")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        status: 0,
        error: ["End date cannot be less than start date"],
      });
    });

    it("Should return timesheet record successfully", async () => {
      const payload = {
        startDate: "2020-08-04",
        endDate: "2020-08-04",
      };
      const response = await request(server)
        .post("/timesheet/summary")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual(1);
      expect(response.body.data.length).toEqual(2);
    });
  });
});
