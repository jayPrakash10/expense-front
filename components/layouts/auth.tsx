import { useEffect } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import Header from "../app-component/header";
import ManageQuick from "../app-component/manage-quickadd";
import { api } from "@/services/api";
import { useAppDispatch } from "@/store";
import { setUser, setSettings } from "@/store/slices/userSlice";
import { User, Settings } from "@/types/api";
import { setCategories } from "@/store/slices/categorySlice";
import { Category } from "@/types/api";
import { ThemeProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = (props: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    api.user.getProfile().then((resp) => {
      if (!resp.error) {
        dispatch(setUser(resp.data?.data?.user as User));
        dispatch(setSettings(resp.data?.data?.settings as Settings));
      }
    });

    api.categories.getCategories().then((resp) => {
      if (!resp.error) {
        dispatch(setCategories(resp.data?.data as Category[]));
      }
    });
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" themes={["light", "dark"]}>
    <div>
      <SidebarProvider>
        <AppSidebar className="z-[51]" />
        <div className="flex-1 flex flex-col w-full md:w-[calc(100%-(--sidebar-width))]">
          <Header />
          <div className="flex-1 overflow-y-auto px-4">{props.children}</div>
        </div>
        <ManageQuick />
      </SidebarProvider>
    </div>
    </ThemeProvider>
  );
};

export default AuthLayout;
