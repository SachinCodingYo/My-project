import { useForm } from "react-hook-form";
import { useSignIn } from "../../hooks/useAuth";
import { setToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { handleQueryToast } from "../../utils/queryToast";
import type { LoginPayload } from "../../common/types/types";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const AdminSignIn = () => {
  const { register, handleSubmit } = useForm<LoginPayload>();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginPayload) => {
    try {
      const res = await mutateAsync(data);
      setToken(res.token);
      navigate("/dashboard");
    } catch (error: unknown) {
      handleQueryToast({})?.onError(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-4 sm:mx-0 rounded-2xl bg-transparent border border-white/20 text-white shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-8 transition-all">

      {/* Logo */}
      <div className="flex justify-center mb-1">
        <div className="w-24 h-24 flex items-center justify-center rounded-xl shadow-md overflow-hidden">
          <img
            src="/logo2.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* <div className="flex justify-center mb-1">
        <img
          src="/logo2.png"
          alt="Logo"
          className="w-32 h-32 object-contain"
        />
      </div> */}

      {/* Title */}
      <h2 className="text-xl font-bold text-center text-slate-900 drop-shadow-md">
        Admin Login
      </h2>

      <p className="text-sm text-[#690f65] text-center mb-6 drop-shadow-sm">
        Secure access to TeleLink Management
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Email & Mobile*/}
        <div>
          <label className="text-sm text-slate-800 drop-shadow-sm">
            Email or Mobile
          </label>

          <div className="flex items-center border border-white/30 bg-[#304760] backdrop-blur-sm rounded-lg px-3 mt-1 focus-within:border-indigo-400 transition">

            <Mail size={16} className="text-gray-300" />

            <input
              {...register("emailOrMobile")}
              autoComplete="username"
              type="text"
              required
              placeholder="Enter Email or Mobile Number"
              className="w-full bg-transparent p-2 text-sm text-white placeholder-gray-300 outline-none"
            />

          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-slate-800 drop-shadow-sm">
            Password
          </label>

          <div className="flex items-center border border-white/30 bg-[#304760] backdrop-blur-sm rounded-lg px-3 mt-1 focus-within:border-indigo-400 transition">

            <Lock size={16} className="text-gray-300" />

            <input
              {...register("password")}
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter Your Password"
              className="w-full bg-transparent p-2 text-sm text-white placeholder-gray-300 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={16} className="text-gray-400" />
              ) : (
                <Eye size={16} className="text-gray-400" />
              )}
            </button>

          </div>

          {/* <div className="text-right mt-2">
            <span className="text-sm text-indigo-400 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div> */}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          {isPending ? "Logging in..." : "Sign In to Dashboard"}
        </button>

      </form>
    </div>
  );
};

export default AdminSignIn;
