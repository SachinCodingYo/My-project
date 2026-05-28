import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import PageHeader from "../common/layout/PageHeader";
import { formatDateIndian } from "../../utils/dateFormat";
import { useUserProfile } from "../../hooks/useUserProfile";
// import { setUser } from "../../store/slices/authSlice";
import { updateUserProfile } from "../../services/user.service";
import { useQueryClient } from "@tanstack/react-query";
// import type { User } from "../../common/types/types";
import imageCompression from "browser-image-compression";

const MyProfile = () => {
  // const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useUserProfile();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // ✅ Handle file select (optimized)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      let finalFile = selected;

      // ✅ Only compress if needed
      if (selected.size > 200 * 1024) {

        const compressedBlob = await imageCompression(
          selected,
          options
        );

        finalFile = new File(
          [compressedBlob],
          selected.name,
          {
            type: selected.type,
            lastModified: Date.now(),
          }
        );
      }

      setFile(finalFile);
      setPreview(URL.createObjectURL(finalFile));

    } catch (error) {
      console.error("Compression error:", error);
    }
  };

  // ✅ Upload image
  const handleUpload = async (e?: React.MouseEvent) => {
    e?.preventDefault();

    if (!file || !user?._id) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await updateUserProfile(user._id, formData);
      // const updatedUser = res.data.data;
      const updatedUser = res.data;

      // ✅ React Query update
      queryClient.setQueryData(
        ["user-profile", user._id],
        updatedUser
      );

      // ✅ Refetch (optional but good)
      queryClient.invalidateQueries({
        queryKey: ["user-profile", user._id],
      });

      // ✅ Update preview instantly (no flicker)
      setPreview(updatedUser.image);
      setFile(null);

    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Cleanup blob URLs (FIXED)
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ✅ Loading state
  if (isLoading || !user) {
    return (
      <div>
        <PageHeader title="My Profile" />
        <p className="text-gray-400 text-sm mt-4">Loading profile...</p>
      </div>
    );
  }

  // ✅ Initials fallback
  const initials = (user.fullName ?? "")
    .split(" ")
    .map((n: string) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fields = [
    { label: "Full Name", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Mobile", value: user.mobile },
    { label: "Role", value: user.role },
    {
      label: "Status",
      value: user.isActive ? "Active" : "Inactive",
      highlight: user.isActive,
    },
    { label: "Joined", value: formatDateIndian(user.createdAt) },
  ];

  return (
    <div>
      <PageHeader title="My Profile" />

      <div className="mt-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-white/10">

          {/* Profile Image */}
          <div className="relative">
            {preview || user.image ? (
              <img
                src={preview || user.image}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                {initials}
              </div>
            )}

            {/* File input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Info */}
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-base">
              {user.fullName}
            </p>

            <div className="flex items-center gap-2 mt-0.5">
              {user.isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}

              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user.isActive ? "Active" : "Inactive"}
              </span>

              <span className="text-gray-300 dark:text-white/20">·</span>

              <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        {file && (
          <div className="px-5 py-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        )}

        {/* Fields */}
        <div className="grid grid-cols-2">
          {fields.map((f, i) => (
            <div
              key={f.label}
              className={[
                "px-5 py-4",
                i % 2 === 0
                  ? "border-r border-gray-100 dark:border-white/10"
                  : "",
                i < fields.length - 2
                  ? "border-b border-gray-100 dark:border-white/10"
                  : "",
              ].join(" ")}
            >
              <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
                {f.label}
              </p>

              <p
                className={`text-sm font-medium ${f.highlight
                  ? "text-emerald-500"
                  : "text-gray-900 dark:text-white"
                  }`}
              >
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

// import { useState } from "react";
// // import { useDispatch } from "react-redux";
// import PageHeader from "../common/layout/PageHeader";
// import { formatDateIndian } from "../../utils/dateFormat";
// import { useUserProfile } from "../../hooks/useUserProfile";
// // import { setUser } from "../../store/slices/authSlice";
// import { updateUserProfile } from "../../services/user.service";
// import { useQueryClient } from "@tanstack/react-query";
// // import type { User } from "../../common/types/types";

// const MyProfile = () => {
//   // const dispatch = useDispatch();
//   const queryClient = useQueryClient();

//   const { data: user, isLoading } = useUserProfile();

//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);

//   // ✅ Sync Redux with query data
//   // useEffect(() => {
//   //   if (user) {
//   //     dispatch(setUser(user));
//   //   }
//   // }, [user, dispatch]);

//   // ✅ Handle file select
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selected = e.target.files?.[0];
//     if (!selected) return;

//     setFile(selected);
//     setPreview(URL.createObjectURL(selected));
//   };

//   // ✅ Upload image (FINAL FIXED)
//   const handleUpload = async (e?: React.MouseEvent) => {
//     e?.preventDefault();

//     if (!file || !user?._id) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       setUploading(true);

//       const res = await updateUserProfile(user._id, formData);

//       // ✅ Update Redux instantly
//       // dispatch(setUser(res.data));

//       // ✅ 🔥 Update React Query cache instantly
//       queryClient.setQueryData(
//         ["user-profile", user._id],
//         res.data
//       );

//       // ✅ Background refetch (optional but good)
//       queryClient.invalidateQueries({
//         queryKey: ["user-profile", user._id],
//       });

//       // ✅ Reset UI
//       setFile(null);
//       setPreview(null);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ✅ Loading state
//   if (isLoading || !user) {
//     return (
//       <div>
//         <PageHeader title="My Profile" />
//         <p className="text-gray-400 text-sm mt-4">Loading profile...</p>
//       </div>
//     );
//   }

//   // ✅ Initials fallback
//   const initials = (user.fullName ?? "")
//     .split(" ")
//     .map((n: string) => n[0] ?? "")
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   const fields = [
//     { label: "Full Name", value: user.fullName },
//     { label: "Email", value: user.email },
//     { label: "Mobile", value: user.mobile },
//     { label: "Role", value: user.role },
//     {
//       label: "Status",
//       value: user.isActive ? "Active" : "Inactive",
//       highlight: user.isActive,
//     },
//     { label: "Joined", value: formatDateIndian(user.createdAt) },
//   ];

//   return (
//     <div>
//       <PageHeader title="My Profile" />

//       <div className="mt-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-white/10">

//           {/* Profile Image */}
//           <div className="relative">
//             {preview || user.image ? (
//               <img
//                 src={preview || user.image}
//                 className="w-12 h-12 rounded-full object-cover"
//               />
//             ) : (
//               <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
//                 {initials}
//               </div>
//             )}

//             {/* File input */}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="absolute inset-0 opacity-0 cursor-pointer"
//             />
//           </div>

//           {/* Info */}
//           <div>
//             <p className="font-medium text-gray-900 dark:text-white text-base">
//               {user.fullName}
//             </p>

//             <div className="flex items-center gap-2 mt-0.5">
//               {user.isActive && (
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//               )}

//               <span className="text-sm text-gray-500 dark:text-gray-400">
//                 {user.isActive ? "Active" : "Inactive"}
//               </span>

//               <span className="text-gray-300 dark:text-white/20">·</span>

//               <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-md">
//                 {user.role}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Upload Button */}
//         {file && (
//           <div className="px-5 py-3">
//             <button
//               type="button"
//               onClick={handleUpload}
//               disabled={uploading}
//               className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm"
//             >
//               {uploading ? "Uploading..." : "Upload Image"}
//             </button>
//           </div>
//         )}

//         {/* Fields */}
//         <div className="grid grid-cols-2">
//           {fields.map((f, i) => (
//             <div
//               key={f.label}
//               className={[
//                 "px-5 py-4",
//                 i % 2 === 0
//                   ? "border-r border-gray-100 dark:border-white/10"
//                   : "",
//                 i < fields.length - 2
//                   ? "border-b border-gray-100 dark:border-white/10"
//                   : "",
//               ].join(" ")}
//             >
//               <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">
//                 {f.label}
//               </p>

//               <p
//                 className={`text-sm font-medium ${f.highlight
//                   ? "text-emerald-500"
//                   : "text-gray-900 dark:text-white"
//                   }`}
//               >
//                 {f.value}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;