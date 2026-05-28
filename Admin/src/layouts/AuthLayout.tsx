import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('https://payinout.s3.ap-south-1.amazonaws.com/images/1779083535170_adminloginbanner.png')] bg-cover bg-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;