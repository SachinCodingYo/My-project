import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-blue-500">SIM</span> Admin
        </h1>

        <Link
          to="/signin"
          className="px-5 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition duration-300"
        >
          Login
        </Link>
      </div>

      {/* Hero Section */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="text-center max-w-3xl">

          <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Manage Your <span className="text-blue-500">SIM Network</span> <br />
            Like a Pro 🚀
          </h2>

          <p className="text-gray-300 text-lg mb-10">
            Powerful admin dashboard to manage users, SIM inventory,
            allocation tracking and performance reports — all in one place.
          </p>

          <Link
            to="/signin"
            className="px-8 py-4 bg-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-600/30"
          >
            Enter Admin Panel
          </Link>

        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 px-10 pb-16">
        {[
          "User Management",
          "SIM Inventory Control",
          "Advanced Reports",
        ].map((feature) => (
          <div
            key={feature}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-2">{feature}</h3>
            <p className="text-gray-400 text-sm">
              Streamlined tools designed to simplify operations and boost efficiency.
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-white/10 text-gray-400 text-sm">
        © {new Date().getFullYear()} SIM Management System
      </div>

    </div>
  );
};

export default Home;