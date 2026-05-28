import { useEffect } from "react";
import { LogOut, Mail, Phone, UserRound } from "lucide-react";
import { PageHeader, Button, LoadingSkeleton, FormInput, FormSection, ProfileCard, Card } from "../components/common";
import { useProfile, useUpdateProfile } from "../hooks/useProfile";
import { useAppDispatch } from "../store/hooks";
import { setProfile } from "../store/slices/authSlice";
import { logout } from "../utils/logout";
import { useValidatedForm } from "../hooks/useValidatedForm";
import { profileSchema, type ProfileFormData } from "../lib/validation";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { register, handleSubmit, reset, formState: { errors } } = useValidatedForm<ProfileFormData>({
    schema: profileSchema,
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setProfile(data.data));
      reset({
        fullName: data.data.fullName,
        email: data.data.email,
        mobile: data.data.mobile,
      });
    }
  }, [data?.data, dispatch, reset]);

  if (isLoading) return <LoadingSkeleton />;

  const profile = data?.data;
  if (!profile) return null;

  return (
    <div className="space-y-4 animate-fadeIn">
      <PageHeader title="Profile" subtitle="Keep your contact details up to date." />

      <ProfileCard
        fullName={profile.fullName}
        email={profile.email}
        mobile={profile.mobile}
        isActive={profile.isActive}
        image={profile.image}
      />

      <form onSubmit={handleSubmit((values) => updateProfile.mutate(values))}>
        <FormSection
          title="Personal Information"
          description="Update your contact details"
          footerAction={
            <Button type="submit" fullWidth loading={updateProfile.isPending}>
              Save Changes
            </Button>
          }
        >
          <FormInput
            label="Full Name"
            icon={UserRound}
            placeholder="Enter your full name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <FormInput
            label="Email"
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />
          <FormInput
            label="Mobile"
            icon={Phone}
            type="tel"
            placeholder="Enter 10-digit mobile number"
            error={errors.mobile?.message}
            {...register("mobile")}
          />
        </FormSection>
      </form>

      <Card variant="outlined" padding="md">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-between text-red-500 hover:text-red-600 transition-colors"
        >
          <span className="inline-flex items-center gap-2 font-semibold">
            <LogOut className="h-4 w-4" />
            Logout
          </span>
          <span className="text-sm">Sign out securely</span>
        </button>
      </Card>
    </div>
  );
};

export default Profile;
