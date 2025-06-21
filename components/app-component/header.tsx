import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { useAppSelector } from "@/store";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sun, Moon, User, LogOut } from "lucide-react";

import { useTheme } from "next-themes";

type Props = {};

const Header = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const { user } = useAppSelector((state) => state.user);

  return (
    <header className="p-3 px-4 sticky top-0 z-50 flex items-center justify-between bg-sidebar border-b">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full">
            <Avatar className="size-8 cursor-pointer">
              <AvatarImage src={user?.profile_img} />
              <AvatarFallback className="text-xs border bg-primary text-primary-foreground">
                {user?.name?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-2">
                <Avatar className="size-10">
                  <AvatarImage src={user?.profile_img} />
                  <AvatarFallback className="text-base border bg-primary text-primary-foreground">
                    {user?.name?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <p className="text-base font-medium leading-tight truncate">
                    {user?.name}
                  </p>
                  <p className="text-sm leading-tight text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User /> <Link href="/settings/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                localStorage.removeItem("expense-token");
              }}
            >
              <LogOut /> <Link href="/login">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
