/**
 * Model: Support Ticket Schema
 * Description: Defines support ticket structure with replies and status tracking
 * Author: Aman Kumar Singh
 */
import mongoose from "mongoose";
import { SupportTicketModel } from "./supportTicket.model";


export const createTicketService= async (
    userId: string,
    data: any
) => {
    const { title, description } = data;

    const ticket = await SupportTicketModel.create({
        title,
        description,
        createdBy: userId,
    });
    return ticket;
};

export const getAllTicketServices = async () => {
    const tickets = await SupportTicketModel.find()
    .populate("createdBy", "fullName email role")
    .populate("assignedTo", "fullName email");

    return tickets;
};

export const getTicketByIdService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ticket id");
    }

    const ticket = await SupportTicketModel.findById(id)
    .populate("createdBy", "fullName email role")
    .populate("replies.repliedBy", "fullName role");

    if (!ticket) {
        throw new Error("Ticket not found");
    }
    return ticket;
};

export const replyTicketsService = async (
    ticketId: string,
    userId: string,
    message: string
) => {
    const ticket = await SupportTicketModel.findById(ticketId);

    if (!ticket) {
        throw new Error("ticket not found");
    }

    ticket.replies.push({
        message,
        repliedBy: new mongoose.Types.ObjectId(userId),
        createdAt: new Date(),
    });
    ticket.status = "IN_PROGRESS";

    await ticket .save();

    return ticket;
};

export const closeTicketService = async (ticketId: string) => {
    const ticket = await SupportTicketModel.findById(ticketId);

    if (!ticket) {
        throw new Error("Ticket not found");
    }
    ticket.status = "CLOSED";
    await ticket.save();

    return ticket;
};