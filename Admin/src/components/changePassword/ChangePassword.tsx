import { useState } from "react";
import { Check, Lock, Eye, EyeOff } from "lucide-react";
import PageHeader from "../common/layout/PageHeader";
import { useChangePassword } from "../../hooks/useChangePassword";

interface FieldProps {
  label: string;
  value: string;
  show: boolean;
  placeholder: string;
  onChange: (val: string) => void;
  onToggle: () => void;
}

const PasswordField = ({
  label,
  value,
  show,
  placeholder,
  onChange,
  onToggle,
}: FieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);

  const mismatch = form.confirm && form.newPass !== form.confirm;
  const tooShort = form.newPass && form.newPass.length < 6;

  const canSubmit =
    form.current &&
    form.newPass.length >= 6 &&
    form.newPass === form.confirm;

  const { changePassword, loading } = useChangePassword();

  const handleSave = async () => {
    if (!canSubmit) return;

    try {
      const res = await changePassword({
        currentPassword: form.current,
        newPassword: form.newPass,
        confirmPassword: form.confirm,
      });

      // ✅ USE BACKEND MESSAGE
      const message = res?.message || "Password updated successfully";

      setSaved(true);
      setForm({ current: "", newPass: "", confirm: "" });

      alert(message); // 👈 now dynamic

    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "message" in err) {
        alert((err as { message: string }).message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div>
      <PageHeader title="Change Password" />

      <div className="max-w-md mx-auto mt-6">
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Lock size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Update your password
              </p>
              <p className="text-xs text-gray-400">
                Use at least 6 characters
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800" />

          {/* Fields */}
          <PasswordField
            label="Current Password"
            value={form.current}
            show={show.current}
            placeholder="Enter current password"
            onChange={(val) =>
              setForm((p) => ({ ...p, current: val }))
            }
            onToggle={() =>
              setShow((p) => ({ ...p, current: !p.current }))
            }
          />

          <PasswordField
            label="New Password"
            value={form.newPass}
            show={show.newPass}
            placeholder="Min. 6 characters"
            onChange={(val) =>
              setForm((p) => ({ ...p, newPass: val }))
            }
            onToggle={() =>
              setShow((p) => ({ ...p, newPass: !p.newPass }))
            }
          />

          <PasswordField
            label="Confirm New Password"
            value={form.confirm}
            show={show.confirm}
            placeholder="Re-enter new password"
            onChange={(val) =>
              setForm((p) => ({ ...p, confirm: val }))
            }
            onToggle={() =>
              setShow((p) => ({ ...p, confirm: !p.confirm }))
            }
          />

          {/* Validation */}
          <div className="space-y-1">
            {tooShort && (
              <p className="text-yellow-400 text-xs">
                Minimum 6 characters required
              </p>
            )}
            {mismatch && (
              <p className="text-red-400 text-xs">
                Passwords do not match
              </p>
            )}
            {canSubmit && (
              <p className="text-green-400 text-xs">
                Looks good
              </p>
            )}
          </div>

          {/* Button */}
          <div className="border-t border-gray-800 pt-4 flex justify-center">
            <button
              onClick={handleSave}
              disabled={!canSubmit || loading}
              className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg text-sm font-medium transition ${saved
                ? "bg-green-600/20 text-green-400 border border-green-600/30"
                : canSubmit
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-600/20 text-indigo-400 cursor-not-allowed"
                }`}
            >
              {saved ? (
                <>
                  <Check size={15} />
                  Updated
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChangePassword;