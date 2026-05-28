import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSignIn } from "../../hooks/useAuth";
import { setToken, getDecodedToken, removeToken } from "../../utils/token";
import { APP_ROUTES } from "../../constants/routes";
import type { LoginPayload } from "../../common/types/types";
import { getErrorMessage } from "../../utils/toast";
import Button from "../common/Button";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<LoginPayload>();
  const signIn = useSignIn();

  const onSubmit = async (values: LoginPayload) => {
    try {
      const response = await signIn.mutateAsync(values);
      setToken(response.data.token);

      const decoded = getDecodedToken();
      if (decoded?.role !== "MR") {
        removeToken();
        toast.error("This panel is only for MR accounts.");
        return;
      }

      toast.success(response.message);
      navigate(APP_ROUTES.dashboard);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
    >
      <div className="mb-8 text-center">
  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl">
    <img
      src="/logo.png"
      alt="Logo"
      className="h-24 w-24 object-contain"
    />
  </div>
  <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
  <p className="mt-2 text-sm text-slate-500">
    Sign in to continue your delivery run.
  </p>
</div>


      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email or Mobile</label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Mail className="h-4 w-4 text-slate-400" />
            <input
              {...register("emailOrMobile")}
              type="text"
              required
              autoComplete="username"
              placeholder="Enter email or mobile"
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Lock className="h-4 w-4 text-slate-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-400" />
              ) : (
                <Eye className="h-4 w-4 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" loading={signIn.isPending} fullWidth>
          Sign In
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
