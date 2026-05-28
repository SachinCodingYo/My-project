import type { ReactNode } from "react";
import { getInitials } from "../../../utils/format";
import Card from "./Card";

interface ProfileCardProps {
  fullName: string;
  email: string;
  mobile?: string;
  isActive?: boolean;
  image?: string;
  actions?: ReactNode;
}

const ProfileCard = ({
  fullName,
  email,
  mobile,
  isActive = true,
  image,
  actions,
}: ProfileCardProps) => {
  return (
    <Card padding="lg" className="text-center">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-700">
        {image ? (
          <img src={image} alt={fullName} className="h-full w-full rounded-full object-cover" />
        ) : (
          getInitials(fullName)
        )}
      </div>

      <h2 className="mt-4 text-xl font-semibold text-slate-900">{fullName}</h2>
      <p className="mt-1 text-sm text-slate-500">{email}</p>

      {mobile && <p className="mt-0.5 text-sm text-slate-500">{mobile}</p>}

      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          MR | {isActive ? "Active" : "Inactive"}
        </div>
      </div>

      {actions && <div className="mt-5">{actions}</div>}
    </Card>
  );
};

export default ProfileCard;
