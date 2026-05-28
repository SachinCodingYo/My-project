import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useForgotPassword } from "../hooks/useForgotPassword";

import toast from "react-hot-toast";
import { useConfirmPassword } from "../hooks/useConfirmPassword";

interface Props {
  onSuccess?: () => void;
}

const ForgotPasswordForm: React.FC<Props> = ({ onSuccess }) => {

  const forgotMutation = useForgotPassword();
  const verifyMutation = useConfirmPassword();

  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");

  const [emailOrMobile, setEmailOrMobile] = useState("");

  const [otpData, setOtpData] = useState({
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // SEND OTP
  const handleSendOtp = () => {

    if (!emailOrMobile) {
      toast.error("Email or Mobile required");
      return;
    }

    forgotMutation.mutate(
      { emailOrMobile },
      {
        onSuccess: (data) => {

          setUserId(data?.data?.userId);



          setStep(2);
        }
      }
    );

  };

  // VALIDATE
  const validate = () => {

    if (!/^\d{6}$/.test(otpData.otp)) {
      toast.error("OTP must be 6 digits");
      return false;
    }

    if (otpData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (otpData.password !== otpData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;

  };

  // VERIFY OTP
  const handleVerify = () => {

    if (!validate()) return;

    verifyMutation.mutate(
      {
        userId: userId,
        otp: otpData.otp,
        newPassword: otpData.password
      },
      {
        onSuccess: () => {



          if (onSuccess) {
            onSuccess();
          }

        }
      }
    );

  };

  return (
    <div className="space-y-4">

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Email or Mobile"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />

          <button
            onClick={handleSendOtp}
            disabled={forgotMutation.isPending}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
          >
            {forgotMutation.isPending
              ? "Sending OTP..."
              : "Send OTP"}
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            type="tel"
            placeholder="Enter OTP"
            maxLength={6}
            value={otpData.otp}
            onChange={(e) =>
              setOtpData({
                ...otpData,
                otp: e.target.value.replace(/\D/g, "").slice(0, 6)
              })
            }
            className="w-full border p-3 rounded-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={otpData.password}
              onChange={(e) =>
                setOtpData({
                  ...otpData,
                  password: e.target.value
                })
              }
              className="w-full border p-3 rounded-lg"
            />

            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={otpData.confirmPassword}
              onChange={(e) =>
                setOtpData({
                  ...otpData,
                  confirmPassword: e.target.value
                })
              }
              className="w-full border p-3 rounded-lg"
            />

            <div
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showConfirmPassword
                ? <EyeOff size={20} />
                : <Eye size={20} />}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={verifyMutation.isPending}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
          >
            {verifyMutation.isPending
              ? "Verifying..."
              : "Reset Password"}
          </button>
        </>
      )}

    </div>
  );
};

export default ForgotPasswordForm;