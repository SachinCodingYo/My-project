// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";

// const LoginModal = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
//       <div className="bg-white w-[420px] p-8 rounded-xl shadow-xl">

//         {/* Login / Signup Tabs */}
//         <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
//           <button
//             onClick={() => setIsLogin(true)}
//             className={`flex-1 py-2 rounded-md text-sm font-medium ${
//               isLogin
//                 ? "bg-blue-200 text-blue-700"
//                 : "text-gray-600"
//             }`}
//           >
//             Log in
//           </button>

//           <button
//             onClick={() => setIsLogin(false)}
//             className={`flex-1 py-2 rounded-md text-sm font-medium ${
//               !isLogin
//                 ? "bg-blue-200 text-blue-700"
//                 : "text-gray-600"
//             }`}
//           >
//             Signup
//           </button>
//         </div>

//         {/* Email */}
//         <input
//           type="text"
//           placeholder="Email or Phone"
//           className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
//         />

//         {/* Password */}
//         <div className="relative mb-2">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
//           />

//           <button
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-3 text-gray-500"
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>

//         {/* Forgot password */}
//         <div className="text-right mb-5">
//           <span className="text-sm text-gray-600 cursor-pointer hover:underline">
//             Forgot Password?
//           </span>
//         </div>

//         {/* Login Button */}
//         <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-purple-700 transition">
//           LOG IN
//         </button>

//         {/* Divider */}
//         <div className="flex items-center my-6">
//           <div className="flex-1 h-px bg-gray-300"></div>
//           <span className="px-3 text-gray-400 text-sm">OR</span>
//           <div className="flex-1 h-px bg-gray-300"></div>
//         </div>

//         {/* Social Login */}
//         <p className="text-center text-sm text-gray-600 mb-4">
//           LOGIN WITH
//         </p>

//         <div className="flex justify-center gap-6">
//           <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow">
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
//               className="w-6"
//             />
//           </button>

//           <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow">
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
//               className="w-6"
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;