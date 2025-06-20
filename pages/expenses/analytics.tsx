import Head from "next/head";
import AuthLayout from "@/components/layouts/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonthlyAnalytics from "@/components/app-component/container/monthly-analytics";
import YearlyAnalytics from "@/components/app-component/container/yearly-analytics";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

const Analytics = (props: Props) => {
  const search = new URLSearchParams();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  return (
    <>
      <Head>
        <title>Analytics | Expense</title>
      </Head>
      <AuthLayout>
        <div className="py-4">
          <Tabs
            value={searchParams.get("tab") || ""}
            onValueChange={(value) => {
              if (value === "monthly") {
                search.set("tab", "monthly");
                search.set(
                  "month",
                  new Date().toLocaleString("en-US", { month: "numeric" })
                );
                search.set("year", new Date().getFullYear().toString());
                replace(`?${search.toString()}`);
              } else if (value === "yearly") {
                search.set("tab", "yearly");
                search.set("year", new Date().getFullYear().toString());
                replace(`?${search.toString()}`);
              }
            }}
          >
            <TabsList>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <MonthlyAnalytics />
            </TabsContent>
            <TabsContent value="yearly">
              <YearlyAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </AuthLayout>
    </>
  );
};

export default Analytics;
