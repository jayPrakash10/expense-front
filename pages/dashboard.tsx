import { useEffect } from "react";
import { AppCard } from "@/components/app-component/card";
import AuthLayout from "@/components/layouts/auth";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { useCurrencySymbol } from "@/hooks/use-curreny-code";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddExpenseDialog } from "@/store/slices/globalSlice";
import { api } from "@/services/api";
import { calculateMonthDays } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import BarSkeleton from "@/components/app-component/bars-skeleton";
import {
  setDashboardAnalytics,
  setOverview,
  setRecentExpenses,
} from "@/store/slices/expenseSlice";
import { RootState } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import ExpenseTable from "@/components/app-component/expense-table";
import AddExpense from "@/components/app-component/add-expense";
import UpdateExpense from "@/components/app-component/update-expense";
import { Plus } from "lucide-react";
import QuickAdd from "@/components/app-component/quick-add";
import Overview from "@/components/app-component/overview";

type Props = {};

// Generate last 5 months including current month
const months = Array.from({ length: 5 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - i);
  return {
    value: date.getMonth(),
    label: date.toLocaleString("default", { month: "short" }),
    year: date.getFullYear(),
  };
});

const Dashboard = (props: Props) => {
  const search = new URLSearchParams();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const dispatch = useDispatch();

  const [loadingRecent, setLoadingRecent] = useState<boolean>(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  useEffect(() => {
    getRecentExpenses();
    getOverview();
  }, []);

  useEffect(() => {
    getAnalytics();
  }, [selectedMonth]);

  useEffect(() => {
    const queryMonth = parseInt(searchParams.get("month") || "");
    const queryYear = parseInt(searchParams.get("year") || "");

    if (queryMonth && queryYear) {
      const searchMonth = months.find(
        (m) => m.value === queryMonth - 1 && m.year === queryYear
      );

      if (searchMonth) {
        setSelectedMonth(searchMonth.value);
      } else {
        search.set("month", `${months[0].value + 1}`);
        search.set("year", `${months[0].year}`);
        replace(`?${search.toString()}`);
        setSelectedMonth(months[0].value);
      }
    }
  }, [searchParams]);

  const getOverview = () => {
    api.expenses.getMonthlyOverview().then((resp) => {
      if (!resp.error) {
        dispatch(setOverview(resp.data?.data || []));
      }
    });
  };

  const getRecentExpenses = () => {
    api.expenses
      .getRecents({ limit: 5 })
      .then((resp) => {
        if (!resp.error) {
          dispatch(setRecentExpenses(resp.data?.data || []));
        }
      })
      .finally(() => {
        setLoadingRecent(false);
      });
  };

  const getAnalytics = () => {
    const currentMonth = months.find((m) => m.value === selectedMonth);
    if (currentMonth) {
      const monthDays = calculateMonthDays(
        currentMonth.value,
        currentMonth.year
      );

      api.expenses
        .getMonthlyAnalytics({
          month: currentMonth.value + 1,
          year: currentMonth.year,
        })
        .then((resp) => {
          if (!resp.error) {
            const dashboardAnalytics = {
              totalAmount: resp.data?.data.totalAmount,
              barChartData: resp.data?.data.analytics.daily.length
                ? monthDays.map((day) => {
                    const dailyData = resp.data?.data.analytics.daily.find(
                      (d: any) => d.date === day.date
                    );
                    return {
                      ...day,
                      amount: dailyData ? dailyData.amount : 0,
                    };
                  })
                : [],
              pieChartData: resp.data?.data.analytics.paymentModes.map(
                (item: any, index: number) => ({
                  name: item.mode,
                  amount: item.amount,
                  fill: `var(--chart-${index + 1})`,
                })
              ),
              categoriesBarChartData: resp.data?.data.analytics.categories.map(
                (item: any) => ({
                  name: item.name,
                  amount: item.amount,
                  color: item.color,
                })
              ),
            };

            dispatch(setDashboardAnalytics(dashboardAnalytics));
          }
        })
        .finally(() => setLoadingAnalytics(false));
    }
  };

  const handleMonthChange = (value: number) => {
    const currentMonth = months.find((m) => m.value === value) || months[0];
    search.set("month", (currentMonth.value + 1).toString());
    search.set("year", currentMonth.year.toString());
    replace(`?${search.toString()}`);

    setSelectedMonth(value);
  };

  return (
    <>
      <Head>
        <title>Dashboard | Expense</title>
      </Head>
      <AuthLayout>
        <AddExpense
          onAdd={() => {
            getRecentExpenses();
            getAnalytics();
            getOverview();
          }}
        />
        <UpdateExpense
          onUpdate={() => {
            getRecentExpenses();
            getAnalytics();
            getOverview();
          }}
        />
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <Overview />

            <QuickAdd />

            <AppCard title="Monthly Overview">
              <MonthlyChart
                loading={loadingAnalytics}
                selectedMonth={selectedMonth}
                setSelectedMonth={handleMonthChange}
              />
            </AppCard>

            <AppCard
              title="Recent"
              action={
                <Button
                  className="has-[>svg]:px-2 py-1 h-auto rounded-sm text-xs text-primary bg-transparent hover:bg-primary/20"
                  onClick={() => dispatch(toggleAddExpenseDialog(true))}
                >
                  <Plus className="size-3" /> Add
                </Button>
              }
            >
              <RecentTable loading={loadingRecent} />
            </AppCard>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

const RecentTable = ({ loading }: { loading: boolean }) => {
  const dispatch = useDispatch();

  const recent = useSelector(
    (state: RootState) => state.expenses.recentExpenses
  );

  const getRecentExpenses = () => {
    api.expenses.getRecents({ limit: 5 }).then((resp) => {
      if (!resp.error) {
        dispatch(setRecentExpenses(resp.data?.data || []));
      }
    });
  };

  const handleDelete = () => {
    getRecentExpenses();
  };

  return (
    <>
      <ExpenseTable
        expenses={recent}
        loading={loading}
        onDelete={handleDelete}
      />
    </>
  );
};

const MonthlyChart = ({
  loading,
  selectedMonth,
  setSelectedMonth,
}: {
  loading: boolean;
  selectedMonth: number;
  setSelectedMonth: (value: number) => void;
}) => {
  const { totalAmount, barChartData, pieChartData, categoriesBarChartData } =
    useSelector((state: RootState) => state.expenses.dashboardAnalytics);

  const curreny = useCurrencySymbol();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="hidden sm:block">Last 5 Month : </span>
          <Tabs
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <TabsList>
              {months.map((month) => (
                <TabsTrigger key={month.value} value={month.value.toString()}>
                  {month.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <p>
          <span className="text-base font-thin mr-2">Total : </span>
          <span className="text-3xl">
            {useCurrencySymbol()} {totalAmount}
          </span>
        </p>
      </div>
      <div className="w-full my-4">
        <AppCard title="Daily" className="">
          <ChartContainer
            config={{ amount: { label: "Amount" } }}
            className="pt-4 max-h-[250px] w-full"
          >
            {loading ? (
              <BarSkeleton type="monthly" />
            ) : barChartData.length ? (
              <BarChart data={barChartData}>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => (
                        <div className="flex-1 flex items-center justify-between gap-2">
                          <span className="text-xs">Amount</span>
                          <span className="text-xs">
                            {curreny} {value}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="amount"
                  maxBarSize={10}
                  radius={[4, 4, 0, 0]}
                  fill="var(--chart-1)"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      day: "numeric",
                    });
                  }}
                />
                <YAxis />
              </BarChart>
            ) : (
              <div className="h-full p-8 px-10">
                <div className="flex items-center justify-center h-full border-b border-l text-2xl text-muted-foreground">
                  No Data Available
                </div>
              </div>
            )}
          </ChartContainer>
        </AppCard>
      </div>
      <div className="flex items-center justify-center flex-col lg:flex-row gap-4 mt-2">
        <div className="flex-1 w-full">
          <AppCard title="Spent On" className="">
            <ChartContainer
              config={{ amount: { label: "Amount" } }}
              className="pt-4"
            >
              {loading ? (
                <BarSkeleton type="monthly" />
              ) : categoriesBarChartData?.length ? (
                <BarChart data={categoriesBarChartData}>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) => (
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <span className="text-xs">Amount</span>
                            <span className="text-xs">
                              {curreny} {value}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="amount" maxBarSize={10} radius={[4, 4, 0, 0]}>
                    {categoriesBarChartData.map((item, index) => (
                      <Cell key={`cell-${index}`} fill={item.color} />
                    ))}
                  </Bar>
                  <XAxis dataKey="name" />
                  <YAxis />
                </BarChart>
              ) : (
                <div className="h-full p-8 px-10">
                  <div className="flex items-center justify-center h-full border-b border-l text-2xl text-muted-foreground">
                    No Data Available
                  </div>
                </div>
              )}
            </ChartContainer>
          </AppCard>
        </div>
        <div className="flex-1 w-full">
          <AppCard title="Mode of Payment" className="">
            <ChartContainer
              config={{
                cash: { label: "Cash" },
                card: { label: "Card" },
                upi: { label: "UPI" },
                net_banking: { label: "Net Banking" },
                others: { label: "Others" },
              }}
            >
              {loading ? (
                <div className="h-full p-8 px-10">
                  <div className="flex items-end justify-center gap-1 h-full px-2 text-2xl text-muted-foreground">
                    <Skeleton className="h-full aspect-square rounded-full bg-blue-500/20" />
                  </div>
                </div>
              ) : pieChartData.length ? (
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Pie
                    data={pieChartData}
                    dataKey="amount"
                    innerRadius={"70%"}
                    outerRadius={"90%"}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                  />
                </PieChart>
              ) : (
                <div className="h-full p-12 px-10">
                  <div className="mx-auto flex items-center justify-center text-center h-full border rounded-full aspect-square text-2xl text-muted-foreground">
                    No Data Available
                  </div>
                </div>
              )}
            </ChartContainer>
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
