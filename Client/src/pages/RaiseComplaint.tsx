import React, { useState } from "react";
import { AlertTriangle, Send } from "lucide-react";

const RaiseComplaint = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    category: "",
    priority: "Medium",
    description: "",
    file: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Complaint submitted successfully  Our team will contact you soon.");
    setFormData({
      name: "",
      mobile: "",
      category: "",
      priority: "Medium",
      description: "",
      file: null,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-20">
        <AlertTriangle className="mx-auto mb-4" size={40} />
        <h1 className="text-4xl font-bold mb-4">Raise a Complaint</h1>
        <p className="opacity-90">
          We take your issues seriously. Submit your complaint below.
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 rounded-3xl shadow-xl">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block font-medium mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none"
                placeholder="Enter registered mobile number"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-medium mb-2">Complaint Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              >
                <option value="">Select category</option>
                <option value="Network Issue">Network Issue</option>
                <option value="Billing Problem">Billing Problem</option>
                <option value="SIM Activation">SIM Activation</option>
                <option value="Porting Issue">Porting Issue</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block font-medium mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-2">Issue Description</label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none"
                placeholder="Describe your issue in detail..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block font-medium mb-2">
                Attach Screenshot (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-gray-600"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition duration-300"
            >
              <Send size={18} />
              Submit Complaint
            </button>

          </form>

        </div>
      </div>

    </div>
  );
};

export default RaiseComplaint;