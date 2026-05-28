import React, { useState } from "react";
import { Search, CheckCircle, Clock, Truck } from "lucide-react";

const TrackRequest = () => {
  const [requestId, setRequestId] = useState("");
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulated status (you can connect backend later)
    if (requestId && mobile) {
      setStatus("Out for Delivery");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Track Your Request</h1>
        <p className="opacity-90">
          Enter your Request ID to check the current status.
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-6 py-16">

        <div className="bg-white p-10 rounded-3xl shadow-xl">

          <form onSubmit={handleTrack} className="space-y-6">

            <div>
              <label className="block font-medium mb-2">
                Request ID
              </label>
              <input
                type="text"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Enter your request ID"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Enter registered mobile number"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition duration-300"
            >
              <Search size={18} />
              Track Now
            </button>

          </form>

        </div>

        {/* Status Section */}
        {status && (
          <div className="mt-12 bg-white p-8 rounded-3xl shadow-xl">

            <h2 className="text-2xl font-bold mb-8 text-center">
              Current Status
            </h2>

            <div className="space-y-6">

              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-600" size={24} />
                <p>Request Submitted</p>
              </div>

              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-600" size={24} />
                <p>Processing</p>
              </div>

              <div className="flex items-center gap-4">
                <Truck className="text-green-600" size={24} />
                <p>{status}</p>
              </div>

              <div className="flex items-center gap-4 opacity-50">
                <Clock size={24} />
                <p>Completed</p>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default TrackRequest;