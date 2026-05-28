/**
 * Support Ticket Controller
 * Author: Aman Kumar Singh
 */
import { Response } from "express";
import * as ticketService from "./supportTicket.service";
import { sendResponse } from "../../common/http/apiResponse";
import { IAuthenticatedReq } from "../../common/types/express";

export const createTicket = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const result = await ticketService.createTicketService(
      req.user!.userId.toString(),
      req.body
    );
    return sendResponse(res, 201, result, "Ticket created successfully");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const getAllTickets = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const result = await ticketService.getAllTicketServices();

    return sendResponse(res, 200, result, "Tickets fetched");
  } catch (error: any) {
    return sendResponse(res, 500, null, error.message);
  }
};

export const getTicketById = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const result = await ticketService.getTicketByIdService(req.params.id);

    return sendResponse(res, 200, result, "Ticket details");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const replyTicket = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const result = await ticketService.replyTicketsService(
      req.params.id,
      req.user!.userId.toString(),
      req.body.message
    );

    return sendResponse(res, 200, result, "Reply added");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};

export const closeTicket = async (req: IAuthenticatedReq, res: Response) => {
  try {
    const result = await ticketService.closeTicketService(req.params.id);

    return sendResponse(res, 200, result, "Ticket closed");
  } catch (error: any) {
    return sendResponse(res, 400, null, error.message);
  }
};