import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Sidebar, Header, BottomNav } from "../components/common";
import { useProfile } from "../hooks/useProfile";
import { useAppDispatch } from "../store/hooks";
import { setProfile } from "../store/slices/authSlice";
import { useLiveLocationTracking } from "../hooks/useLiveLocationTracking";

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const { data } = useProfile();
  const isOnline = data?.data?.isOnline ?? false;

  useLiveLocationTracking({ enabled: isOnline });

  useEffect(() => {
    if (data?.data) {
      dispatch(setProfile(data.data));
    }
  }, [data?.data, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 py-4 pb-24 md:px-6 lg:pb-6">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
