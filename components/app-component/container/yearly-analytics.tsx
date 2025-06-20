import { useEffect, useState } from "react";
import { formatDate } from "date-fns";
import { api } from "@/services/api";
import { useCurrencySymbol } from "@/hooks/use-curreny-code";
import { AppCard } from "@/components/app-component/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import BarSkeleton from "@/components/app-component/bars-skeleton";
import { Bar, BarChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Plus } from "lucide-react";
import { getPaymentModeLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import ExpenseTable from "../expense-table";
import { setYearlyAnalytics } from "@/store/slices/expenseSlice";
import { RootState } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import AddExpense from "../add-expense";
import { Button } from "@/components/ui/button";
import { toggleAddExpenseDialog } from "@/store/slices/globalSlice";

type Props = {};

const YearlyAnalytics = (props: Props) => {
  const search = new URLSearchParams();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const dispatch = useDispatch();

  searchParams.forEach((value, key) => {
    search.set(key, value);
  });

  const [yearsList, setYearsList] = useState<
    { value: number; label: string }[]
  >([]);

  const [selectedYear, setSelectedYear] = useState<number>();

  useEffect(() => {
    const temp_list = [];
    for (let i = new Date().getFullYear(); i > 2020; i--) {
      temp_list.push({ value: i, label: i.toString() });
    }
    setYearsList(temp_list);
  }, []);

  useEffect(() => {
    const year = Number(searchParams.get("year"));

    if (year) {
      setSelectedYear(year);
    } else {
      setSelectedYear(yearsList[0]?.value);
    }
  }, [yearsList, searchParams]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={selectedYear?.toString()}
            onValueChange={(value) => {
              setSelectedYear(Number(value));
              search.set("year", value);
              replace(`?${search.toString()}`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {yearsList.map((year) => (
                <SelectItem key={year.value} value={year.value.toString()}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => dispatch(toggleAddExpenseDialog(true))}>
          <Plus /> Add Expense
        </Button>
      </div>

      <YearlyChart selectedYear={selectedYear} />
    </div>
  );
};

const YearlyChart = ({ selectedYear }: any) => {
  const dispatch = useDispatch();
  const currency = useCurrencySymbol();

  const { totalAmount, barChartData, pieChartData, expenses, topPaymentMode } =
    useSelector((state: RootState) => state.expenses.yearlyAnalytics);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getYearlyAnalytics();
  }, [selectedYear]);

  const getYearlyAnalytics = () => {
    if (selectedYear) {
      api.expenses
        .getYearlyAnalytics({
          year: selectedYear,
        })
        .then((resp) => {
          if (!resp.error) {
            const yearlyAnalytics = {
              totalAmount: resp.data?.data.totalAmount,
              barChartData: resp.data?.data.analytics.monthly.some(
                (item: any) => item.amount > 0
              )
                ? resp.data?.data.analytics.monthly.map((item: any) => ({
                    date: formatDate(
                      new Date(selectedYear, item.month - 1),
                      "yyyy-MM-dd"
                    ),
                    amount: item.amount,
                  }))
                : [],
              pieChartData: resp.data?.data.analytics.paymentModes.map(
                (item: any, index: number) => ({
                  name: item.mode,
                  amount: item.amount,
                  fill: `var(--chart-${index + 1})`,
                })
              ),
              expenses: resp.data?.data.expenses,
              topPaymentMode: {
                mostUsedPaymentMode:
                  resp.data?.data.analytics.mostUsedPaymentMode,
                highestAmountPaymentMode:
                  resp.data?.data.analytics.highestAmountPaymentMode,
              },
            };
            dispatch(setYearlyAnalytics(yearlyAnalytics));
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const onDelete = () => {
    getYearlyAnalytics();
  };

  return (
    <>
      <AddExpense onAdd={getYearlyAnalytics} />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-4 h-32 justify-between relative">
          <CardHeader className="px-0">
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <p className="text-2xl font-bold">
              {currency} {totalAmount}
            </p>
          </CardContent>
          <span className="absolute bottom-0 right-4 text-8xl text-gray-500/20 select-none">
            {currency}
          </span>
        </Card>
        <Card className="p-4 h-32 justify-between relative">
          <CardHeader className="px-0">
            <CardTitle>Top Payment Mode (Used)</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <p className="text-2xl font-bold">
              {getPaymentModeLabel(topPaymentMode?.mostUsedPaymentMode?.mode) ||
                "N/A"}
            </p>
          </CardContent>
          <span className="absolute bottom-0 right-4 text-8xl text-gray-500/20">
            <CreditCard className="size-18" />
          </span>
        </Card>
        <Card className="p-4 h-32 justify-between relative">
          <CardHeader className="px-0">
            <CardTitle>Top Payment Mode (Amount)</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <p className="text-2xl font-bold">
              {getPaymentModeLabel(
                topPaymentMode?.highestAmountPaymentMode?.mode
              ) || "N/A"}
            </p>
          </CardContent>
          <span className="absolute bottom-0 right-4 text-8xl text-gray-500/20">
            <CreditCard className="size-18" />
          </span>
        </Card>
      </div>
      <div className="flex items-center justify-center flex-col lg:flex-row gap-4">
        <div className="flex-1 w-full">
          <AppCard title="Daily" className="">
            <ChartContainer
              config={{ amount: { label: "Amount" } }}
              className="pt-4"
            >
              {loading ? (
                <BarSkeleton type="yearly" />
              ) : barChartData.length ? (
                <BarChart data={barChartData}>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) =>
                          formatDate(new Date(value), "MMM yyyy")
                        }
                        formatter={(value) => (
                          <div className="flex-1 flex items-center justify-between gap-2">
                            <span className="text-xs">Amount</span>
                            <span className="text-xs">
                              {currency} {value}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar
                    dataKey="amount"
                    maxBarSize={20}
                    radius={[4, 4, 0, 0]}
                    fill="var(--chart-1)"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
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
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, item) => {
                          return (
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-xs bg-(--color-bg)"
                                style={
                                  {
                                    "--color-bg": item.payload.fill,
                                  } as React.CSSProperties
                                }
                              />
                              <div className="flex-1 flex items-center justify-between gap-2 min-w-24">
                                <span className="text-muted-foreground">
                                  {getPaymentModeLabel(name as string)}
                                </span>
                                <span>
                                  {currency} {value}
                                </span>
                              </div>
                            </div>
                          );
                        }}
                      />
                    }
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
      <div>
        <Card className="p-4">
          <ExpenseTable
            expenses={expenses}
            loading={loading}
            onDelete={onDelete}
          />
        </Card>
      </div>
    </>
  );
};

export default YearlyAnalytics;
