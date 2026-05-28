import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const providers = [
  { name: "Jio", logo: "/jio.png", value: "jio" },
  { name: "Airtel", logo: "/airtel.png", value: "airtel" },
  { name: "Vi", logo: "/vi.png", value: "vi" },
];

const CompareProvidersSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-100">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-3">
            Compare Network Providers
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto">
            Compare our plans with leading telecom providers and find the best
            data, validity, and price for your needs.
          </p>
        </div>

        {/* Provider Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">

          {providers.map((provider, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-md p-10 text-center hover:shadow-2xl transition border border-gray-100"
            >

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-full shadow-sm">
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className="h-10 object-contain"
                  />
                </div>
              </div>

              {/* Provider Name */}
              <h3 className="text-xl font-semibold mb-6">
                {provider.name}
              </h3>

              {/* Button */}
              <button
                onClick={() =>
                  navigate(`/compare?provider=${provider.value}`)
                }
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full transition shadow-md"
              >
                Buy Now
                <FaArrowRight size={14} />
              </button>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default CompareProvidersSection;