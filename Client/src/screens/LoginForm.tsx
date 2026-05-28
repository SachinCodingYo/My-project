import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import type { LoginPayload } from "../utils/types";
import { Eye, EyeOff } from "lucide-react";


interface Props {
  onSuccess?: () => void;
}

const LoginForm: React.FC<Props> = ({ onSuccess }) => {

  const loginMutation = useLogin();

  const [form, setForm] = useState<LoginPayload>({
    emailOrMobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (
    key: keyof LoginPayload,
    value: string
  ) => {

    setForm({
      ...form,
      [key]: value,
    });

  };

  const handleSubmit = () => {

    loginMutation.mutate(form, {

      onSuccess: () => {

        if (onSuccess) {
          onSuccess();
        }

      }

    });



  };

  return (

    <div className="space-y-4">

      <input
        type="text"
        placeholder="Mobile or Email"
        value={form.emailOrMobile}
        onChange={(e) =>
          handleChange(
            "emailOrMobile",
            e.target.value
          )
        }
        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <div className="relative">

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            handleChange(
              "password",
              e.target.value
            )
          }
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 cursor-pointer text-gray-500"
        >

          {showPassword
            ? <EyeOff size={20} />
            : <Eye size={20} />
          }

        </div>

      </div>


      <button
        onClick={handleSubmit}
        disabled={loginMutation.isPending}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
      >

        {loginMutation.isPending
          ? "Logging..."
          : "Login"}

      </button>

    </div>

  );

};

export default LoginForm;
