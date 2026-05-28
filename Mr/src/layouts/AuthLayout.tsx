import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div
  className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
  style={{
    backgroundImage: "url('/banner.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_30%)]" />
  <div className="relative z-10 w-full">
    <Outlet />
  </div>
</div>

  );
};

export default AuthLayout;
