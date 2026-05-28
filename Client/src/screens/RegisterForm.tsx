import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useRegister } from "../hooks/useRegister";
import { useVerifyOtp } from "../hooks/useVerifyOtp";

import type {
    RegisterPayload,
    VerifyOtpPayload
} from "../utils/types";
import toast from "react-hot-toast";

interface Props {
    onSuccess?: () => void;
}

const RegisterForm: React.FC<Props> = ({ onSuccess }) => {

    const registerMutation = useRegister();
    const verifyMutation = useVerifyOtp();
    const [step, setStep] = useState(1);
    const [userId, setUserId] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState<RegisterPayload>({
        fullName: "",
        mobile: "",
        email: ""
    });
    const [otpData, setOtpData] = useState({
        otp: "",
        password: "",
        confirmPassword: ""
    });


    const handleChange = (key: keyof RegisterPayload, value: string) => {
        setForm({
            ...form,
            [key]: value
        });

    };
    const validateRegister = () => {

        if (form.fullName.trim().length < 4) {
            toast.error("Full name must be at least 4 characters");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (form.email && !emailRegex.test(form.email)) {
            toast.error("Invalid Email");
            return false;
        }

        const mobileRegex = /^[6-9]\d{9}$/;

        if (!mobileRegex.test(form.mobile)) {
            toast.error("Invalid Mobile Number");
            return false;
        }

        return true;

    };
    const validateOtp = () => {

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
    const handleRegister = () => {

        if (!validateRegister()) return;

        registerMutation.mutate(form, {

            onSuccess: (data) => {

                setUserId(data?.data.userId);

                setStep(2);

            }

        });


    };
    const handleVerify = () => {

        if (!validateOtp()) return;

        const payload: VerifyOtpPayload = {

            userId: userId,
            otp: otpData.otp,
            password: otpData.password

        };
        verifyMutation.mutate(payload, {

            onSuccess: () => {

                if (onSuccess) {
                    onSuccess();
                }

            }

        });


    };


    return (

        <div className="space-y-4">
            {step === 1 && (
                <>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={form.fullName}
                        onChange={(e) =>
                            handleChange("fullName", e.target.value)
                        }
                        className="w-full border p-3 rounded-lg"
                    />
                    <input
                        type="tel"
                        placeholder="Mobile Number"
                        maxLength={10}
                        value={form.mobile}
                        onChange={(e) =>
                            handleChange(
                                "mobile",
                                e.target.value.replace(/\D/g, "").slice(0, 10)
                            )
                        }
                        className="w-full border p-3 rounded-lg"
                    />

                    <input
                        type="email"
                        placeholder="Email (Optional)"
                        value={form.email}
                        onChange={(e) =>
                            handleChange("email", e.target.value)
                        }
                        className="w-full border p-3 rounded-lg"
                    />
                    <button
                        onClick={handleRegister}
                        disabled={registerMutation.isPending}
                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
                    >

                        {registerMutation.isPending
                            ? "Sending OTP..."
                            : "Send OTP"}
                    </button>
                </>
            )}
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
                            placeholder="Create Password"
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
                            {showPassword
                                ? <EyeOff size={20} />
                                : <Eye size={20} />
                            }
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 cursor-pointer"
                        >
                            {showConfirmPassword
                                ? <EyeOff size={20} />
                                : <Eye size={20} />
                            }
                        </div>
                    </div>
                    <button
                        onClick={handleVerify}
                        disabled={verifyMutation.isPending}
                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg"
                    >
                        {verifyMutation.isPending
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>
                </>
            )}
        </div>
    );
};
export default RegisterForm;
