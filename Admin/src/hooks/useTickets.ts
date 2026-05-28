import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTickets,
  getTicketById,
  replyTicket,
  closeTicket,
} from "../services/ticket.service";
import type { SupportTicket } from "../common/types/types";

export const useTickets = () => {
  return useQuery<SupportTicket[]>({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });
};

export const useTicketDetails = (id: string) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id),
    enabled: !!id,
  });
};

export const useReplyTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      replyTicket(id, message),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useCloseTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => closeTicket(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};