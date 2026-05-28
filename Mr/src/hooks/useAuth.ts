import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth.service";
import type { LoginPayload } from "../common/types/types";

export const useSignIn = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });
