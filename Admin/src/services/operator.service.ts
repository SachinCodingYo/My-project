import apiClient from "../constant/apiclient";

export const getOperators = async () => {
  const res = await apiClient.get("/operators");
  return res.data;
};

export const createOperator = async (data: FormData) => {
  const res = await apiClient.post("/operators", data);
  return res.data;
};

export const updateOperator = async (id: string, data: FormData) => {
  const res = await apiClient.patch(`/operators/${id}`, data);
  return res.data;
};

export const deleteOperator = async (id: string) => {
  const res = await apiClient.delete(`/operators/${id}`);
  return res.data;
};