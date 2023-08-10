import { NextFunction, Request } from "express";
import { Timesheet } from "../../../src/models/Timesheet";
import {
  getDailyRecords,
  getTimesheetSummary,
  saveTimesheet,
} from "../../../src/controllers/timesheetController";
import { mockTimesheetEntries } from "../mocks/mockTimesheetEntries";
import { API_STATUS } from "../../../src/config/constants";
import { mockTimesheetSummary } from "../mocks/mockTimesheetSummary";
import mongoose, { ClientSession } from "mongoose";

describe(">>>> Timesheet APIs", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  describe("Timesheet summary", () => {
    it("Should fetch timesheet summary successfully", async () => {
      const req = {
        body: {
          startDate: "2023-08-04",
          endDate: "2023-08-04",
        },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      // Timesheet.aggregate = jest.fn().mockImplementation(() => {
      //   return jest.fn().mockResolvedValue(mockTimesheetSummary);
      // });
      jest
        .spyOn(Timesheet, "aggregate")
        .mockResolvedValue(mockTimesheetSummary);
      await getTimesheetSummary(req, res, {} as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 1,
        data: mockTimesheetSummary,
      });
    });
    it("Error fetching timesheet summary", async () => {
      const req = {
        body: {
          startDate: "2023-08-04",
          endDate: "2023-08-04",
        },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      jest
        .spyOn(Timesheet, "aggregate")
        .mockRejectedValue("Timesheet summary error");
      await getTimesheetSummary(req, res, {} as NextFunction);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 0,
        data: [],
        error: "Timesheet summary error",
      });
    });
  });

  describe("Save timesheet", () => {
    it("Save timesheet successfully", async () => {
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
          ],
        },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const mockTimesheetResponse = [
        {
          timesheetDate: "2023-08-04T00:00:00.000Z",
          startTime: "2023-08-04T02:30:00.000Z",
          endTime: "2023-08-04T03:10:00.000Z",
          category: "64bdfc50ad4e4abe7b3b3b33",
          subCategory: "Node.js",
          comments: "Timesheet API",
          _id: "64d452ec18176b8a82dad3d9",
          __v: 0,
          createdAt: "2023-08-10T03:01:00.165Z",
          updatedAt: "2023-08-10T03:01:00.165Z",
          startTimeLocal: "2023-08-04T08:00:00+05:30",
          endTimeLocal: "2023-08-04T08:40:00+05:30",
          id: "64d452ec18176b8a82dad3d9",
        },
      ];

      jest.spyOn(Timesheet, "deleteMany").mockResolvedValue({} as any);
      jest
        .spyOn(Timesheet, "insertMany")
        .mockResolvedValue(mockTimesheetResponse as any);

      const mockTransactionStart = jest.fn();
      const mockTransactionCommit = jest.fn();
      const mockTransactionAbort = jest.fn();
      const mockTransactionEnd = jest.fn();

      const mockSession: ClientSession = {} as ClientSession;
      mockSession.startTransaction = mockTransactionStart;
      mockSession.commitTransaction = mockTransactionCommit;
      mockSession.abortTransaction = mockTransactionAbort;
      mockSession.endSession = mockTransactionEnd;

      jest.spyOn(mongoose, "startSession").mockResolvedValueOnce(mockSession);

      await saveTimesheet(req, res, {} as NextFunction);

      expect(mockTransactionStart).toHaveBeenCalled();
      expect(mockTransactionCommit).toHaveBeenCalled();
      expect(mockTransactionEnd).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 1,
        data: mockTimesheetResponse,
      });
    });

    it("Error saving timesheet", async () => {
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
          ],
        },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      jest
        .spyOn(Timesheet, "deleteMany")
        .mockRejectedValue("Delete error" as any);
      jest.spyOn(Timesheet, "insertMany").mockResolvedValue({} as any);

      const mockTransactionStart = jest.fn();
      const mockTransactionCommit = jest.fn();
      const mockTransactionAbort = jest.fn();
      const mockTransactionEnd = jest.fn();

      const mockSession: ClientSession = {} as ClientSession;
      mockSession.startTransaction = mockTransactionStart;
      mockSession.commitTransaction = mockTransactionCommit;
      mockSession.abortTransaction = mockTransactionAbort;
      mockSession.endSession = mockTransactionEnd;

      jest.spyOn(mongoose, "startSession").mockResolvedValueOnce(mockSession);

      await saveTimesheet(req, res, {} as NextFunction);

      expect(mockTransactionStart).toHaveBeenCalled();
      expect(mockTransactionAbort).toHaveBeenCalled();
      expect(mockTransactionEnd).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 0,
        error: "Delete error",
      });
    });
  });
});
