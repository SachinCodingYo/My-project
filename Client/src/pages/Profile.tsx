// src/pages/Profile.tsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileHeader from "../profile/ProfileHeader";
import ProfileTab from "../profile/ProfileTab";
import ProfileInfo from "../profile/ProfileInfo";
import AccountSettings from "../profile/AccountSettings";
import AddressSection from "../profile/AddressSection";
import OrderSection from "../profile/OrderSection";

const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();

  const tabFromUrl = searchParams.get("tab") as
    | "profile"
    | "account"
    | "address"
    | "orders"
    | null;

  const [activeTab, setActiveTab] = useState<"profile" | "account" | "address" | "orders">(
    tabFromUrl || "profile"
  );

  // ✅ Update tab if URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ProfileHeader />

        {/* Tabs */}
        <ProfileTab activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "profile" && <ProfileInfo />}
        {activeTab === "address" && <AddressSection />}
        {activeTab === "orders" && <OrderSection />}
        {activeTab === "account" && <AccountSettings />}
      </div>
    </div>
  );
};

export default Profile;