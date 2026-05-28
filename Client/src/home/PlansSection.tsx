
import { useNavigate } from "react-router-dom";
import { FaSimCard, FaPhoneAlt } from "react-icons/fa";
import { MdSwapHoriz, MdBusiness } from "react-icons/md";

const plans = [
  {
    title: "Prepaid Plans",
    description: "Recharge your number with the best prepaid plans with unlimited data and calls.",
    link: "/prepaid",
    icon: FaSimCard
  },
  {
    title: "Postpaid Plans",
    description: "Choose affordable monthly postpaid plans with premium benefits.",
    link: "/postpaid",
    icon: FaPhoneAlt
  },
  {
    title: "Port Your Number",
    description: "Switch to a better network easily with Mobile Number Portability.",
    link: "/portnumber",
    icon: MdSwapHoriz
  },
  {
    title: "Business SIM",
    description: "Special telecom solutions designed for companies and teams.",
    link: "/businesssim",
    icon: MdBusiness
  }
];

const PlansSection = () => {

  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Title */}
        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold">
            Explore Our <span className="text-blue-600">Plans</span>
          </h2>

          <p className="text-gray-500 mt-3">
            Find the best telecom plans tailored for your needs
          </p>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {plans.map((plan, index) => {

            const Icon = plan.icon;

            return (

              <div
                key={index}
                onClick={() => navigate(plan.link)}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-100"
              >

                {/* Icon */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition">

                  <Icon />

                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition">

                  {plan.title}

                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">

                  {plan.description}

                </p>

                {/* CTA */}
                <span className="text-blue-600 font-medium text-sm group-hover:underline">

                  View Plans →

                </span>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );

};

export default PlansSection;