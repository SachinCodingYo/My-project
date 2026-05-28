import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";
import { getToken } from "../utils/getTocken";
import toast from "react-hot-toast";

/* ---------------- GET ADDRESS ---------------- */

export const useAddress = () => {
  return useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      const token = getToken();

      const res = await apiClient.get("/address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.data;
    },
  });
};

/* ---------------- ADD ADDRESS ---------------- */

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const token = getToken();

     // ✅ ADD ADDRESS
const res = await apiClient.post("/address", data, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      return res.data;
    },

    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ["address"] }); // 🔥 refresh UI
    },

    onError: (error: any) => {
      console.log(error?.response);
      toast.error(error?.response?.data?.message || "Failed to add address");
    },
  });
};

/* ---------------- UPDATE ADDRESS ---------------- */

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: any) => {


      const token = getToken();

     // ✅ UPDATE ADDRESS
const res = await apiClient.patch(`/address/${id}`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      return res.data;
    },

    onSuccess: () => {
   
      queryClient.invalidateQueries({ queryKey: ["address"] }); // 🔥 refresh
    },

    onError: (error: any) => {
      console.log(error?.response);
      toast.error(error?.response?.data?.message || "Failed to update address");
    },
  });
};


/* ---------------- DELETE ADDRESS ---------------- */

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = getToken();

      const res = await apiClient.delete(`/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },

    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Delete failed");
    },
  });
};


/* ---------------- SET DEFAULT ADDRESS ---------------- */


export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = getToken();

      const res = await apiClient.patch(
        `/address/${id}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    },

    onSuccess: () => {
     

      // ✅ FIXED KEY
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });
};