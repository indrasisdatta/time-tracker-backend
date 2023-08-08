import { NextFunction, Request } from "express";
import { Timesheet } from "../../../src/models/Timesheet";
import { getDailyRecords } from "../../../src/controllers/timesheetController";
import { mockTimesheetEntries } from "../mocks/mockTimesheetEntries";
import { API_STATUS } from "../../../src/config/constants";

describe(">>>> Timesheet APIs", () => {
  describe("Daily timesheet", () => {
    it("Should fetch daily records successfully", async () => {
      const req = { params: { date: "2023-08-04" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      //   jest.spyOn(Timesheet, "find").mockResolvedValue(mockTimesheetEntries);
      Timesheet.find = jest.fn().mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockTimesheetEntries),
      }));
      await getDailyRecords(req, res, {} as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.SUCCESS,
        data: mockTimesheetEntries,
      });
    });
    it("Error fetching daily records", async () => {
      const req = { params: { date: "2023-08-04" } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      Timesheet.find = jest.fn().mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue("Timesheet error"),
      }));
      await getDailyRecords(req, res, {} as NextFunction);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: API_STATUS.ERROR,
        error: "Timesheet error",
        data: [],
      });
    });
  });

  /**
   * TODO: Timesheet summary unit testing
   */
  describe("Timesheet summary", () => {
    it("Should fetch timesheet summary successfully", async () => {
      // Should fetch timesheet summary successfully
    });
    it("Error fetching timesheet summary", async () => {
      // Error fetching timesheet summary
    });
  });

  /**
   * TODO: Save timesheet unit testing
   */
  describe("Save timesheet", () => {
    it("Save timesheet successfully", async () => {
      // Save timesheet successfully
    });
    it("Error saving timesheet", async () => {
      // Error saving timesheet
    });
  });
});
