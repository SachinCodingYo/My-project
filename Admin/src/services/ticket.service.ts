import apiClient from "../constant/apiclient";

export const getTickets = async () => {
  const res = await apiClient.get("/tickets");
  return res.data.data;
};

export const getTicketById = async (id: string) => {
  const res = await apiClient.get(`/tickets/${id}`);
  return res.data.data;
};

export const replyTicket = async (id: string, message: string) => {
  const res = await apiClient.post(`/tickets/reply/${id}`, {
    message,
  });

  return res.data.data;
};

export const closeTicket = async (id: string) => {
  const res = await apiClient.patch(`/tickets/close/${id}`);
  return res.data.data;
};