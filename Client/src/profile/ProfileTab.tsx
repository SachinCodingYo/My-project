const ProfileTab = ({ activeTab, setActiveTab }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border mb-8">
      <div className="flex">

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-4 ${
            activeTab === "profile" ? "text-blue-600 border-b-2" : ""
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab("address")}
          className={`flex-1 py-4 ${
            activeTab === "address" ? "text-blue-600 border-b-2" : ""
          }`}
        >
          Address
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex-1 py-4 ${
            activeTab === "orders" ? "text-blue-600 border-b-2" : ""
          }`}
        >
          Orders
        </button>

        <button
          onClick={() => setActiveTab("account")}
          className={`flex-1 py-4 ${
            activeTab === "account" ? "text-blue-600 border-b-2" : ""
          }`}
        >
          Account
        </button>

      </div>
    </div>
  );
};

export default ProfileTab;