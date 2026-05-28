import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";

/* =========================
   GET ALL FANCY NUMBERS
========================= */
export const useFancyNumbers = () => {
  return useQuery({
    queryKey: ["fancy-numbers"],
    queryFn: async () => {
      const res = await apiClient.get("/fancy-number");
      console.log("FANCY LIST:", res.data);
      return res.data.data;
    },
  });
};

/* =========================
   GET FANCY NUMBER BY ID
========================= */
export const useFancyNumberById = (id: string) => {
  return useQuery({
    queryKey: ["fancy-number", id],
    queryFn: async () => {
      const res = await apiClient.get(`/fancy-number/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
};