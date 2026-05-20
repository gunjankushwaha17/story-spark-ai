import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import { AnalysisService } from "./analysis.service";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";

const getDashboardAnalysis = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalysisService.getDashboardAnalysis();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OK!",
    data: result,
  });
});

export const AnalysisController = {
  getDashboardAnalysis,
};
