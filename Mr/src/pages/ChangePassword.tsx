import { useState } from "react";
import { Lock } from "lucide-react";
import { PageHeader, Button, FormInput, FormSection, PasswordStrengthMeter } from "../components/common";
import { useChangePassword } from "../hooks/useProfile";
import { useValidatedForm } from "../hooks/useValidatedForm";
import { getDecodedToken } from "../utils/token";
import { passwordChangeSchema, type PasswordChangeFormData } from "../lib/validation";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const changePassword = useChangePassword();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useValidatedForm<PasswordChangeFormData>({
    schema: passwordChangeSchema,
  });

  const newPassword = watch("newPassword");
  const [showPasswords, setShowPasswords] = useState(false);

  const onSubmit = (values: PasswordChangeFormData) => {
    const token = getDecodedToken();
    if (!token?.id) {
      toast.error("Unable to identify current MR account.");
      return;
    }

    changePassword.mutate(
      {
        userId: token.id,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          reset();
          setShowPasswords(false);
        },
      }
    );
  };

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="Change Password"
        subtitle="Update your sign-in password for the MR panel."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection
          title="Password Security"
          description="Create a strong password with uppercase, lowercase, numbers, and symbols"
          footerAction={
            <Button type="submit" fullWidth loading={changePassword.isPending}>
              Change Password
            </Button>
          }
        >
          <FormInput
            label="Current Password"
            icon={Lock}
            type={showPasswords ? "text" : "password"}
            placeholder="Enter your current password"
            error={errors.oldPassword?.message}
            {...register("oldPassword")}
          />

          <div>
            <FormInput
              label="New Password"
              icon={Lock}
              type={showPasswords ? "text" : "password"}
              placeholder="Enter a new password"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            {newPassword && <PasswordStrengthMeter password={newPassword} />}
          </div>

          <FormInput
            label="Confirm Password"
            icon={Lock}
            type={showPasswords ? "text" : "password"}
            placeholder="Confirm your new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {showPasswords ? "Hide" : "Show"} passwords
          </button>
        </FormSection>
      </form>
    </div>
  );
};

export default ChangePassword;
