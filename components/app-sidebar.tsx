import React from "react";
import { PieChart, Settings, Wallet } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

import logo from "@/public/images/logo.png";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: `/dashboard?month=${new Date().toLocaleString("en-US", {
        month: "numeric",
      })}&year=${new Date().getFullYear()}`,
      icon: PieChart,
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: Wallet,
      items: [
        {
          title: "Analytics",
          url: `/expenses/analytics?tab=monthly&month=${new Date().toLocaleString(
            "en-US",
            { month: "numeric" }
          )}&year=${new Date().getFullYear()}`,
        },
        {
          title: "Records",
          url: `/expenses/records?page=1&limit=10`,
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Spend Category",
          url: "/settings/spend-category",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="p-1">
          <Link href="/dashboard" className="w-fit block">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className="size-8 group-data-[state=collapsed]:size-6 transition-all duration-200 ease-linear"
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
