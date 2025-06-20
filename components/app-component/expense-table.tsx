import { useDispatch } from "react-redux";
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "date-fns";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toggleUpdateExpenseDialog } from "@/store/slices/globalSlice";
import {
  setAddExpenseAmount,
  setAddExpenseCategory,
  setAddExpenseDate,
  setAddExpenseMode,
  setExpenseId,
} from "@/store/slices/globalSlice";
import { PaymentMode } from "@/constants/paymentModes";
import { ExpenseResponse } from "@/types/api";
import { useCurrencySymbol } from "@/hooks/use-curreny-code";
import { calculateMonthDays, getPaymentModeLabel } from "@/lib/utils";
import { api } from "@/services/api";
import {
  setDashboardAnalytics,
  setMonthlyAnalytics,
  setRecentExpenses,
  setYearlyAnalytics,
} from "@/store/slices/expenseSlice";
import { useSearchParams, usePathname } from "next/navigation";

type Props = {
  expenses: ExpenseResponse[];
  loading: boolean;
  selectedItems?: Set<string>;
  setSelectedItems?: (items: Set<string>) => void;
  selectable?: boolean;
  onDelete?: () => void;
};

const ExpenseTable = ({
  expenses,
  selectedItems,
  setSelectedItems,
  loading,
  selectable = false,
  onDelete,
}: Props) => {
  const dispatch = useDispatch();
  const currency = useCurrencySymbol();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlefetchRecentExpense = async () => {
    try {
      const response = await api.expenses.getRecents({ limit: 5 });

      if (!response.error) {
        dispatch(setRecentExpenses(response.data?.data || []));
      }

      api.expenses
        .getMonthlyAnalytics({
          month:
            parseInt(searchParams.get("month") || "") ||
            new Date().getMonth() + 1,
          year:
            parseInt(searchParams.get("year") || "") ||
            new Date().getFullYear(),
        })
        .then((resp) => {
          const monthDays = calculateMonthDays(
            parseInt(searchParams.get("month") || "") - 1 ||
              new Date().getMonth() + 1,
            parseInt(searchParams.get("year") || "") || new Date().getFullYear()
          );

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
            };

            dispatch(setDashboardAnalytics(dashboardAnalytics));
          }
        });
    } catch (error) {
      console.error("Error fetching recent expenses:", error);
    }
  };

  const handlefetchAnalyticsExpense = async () => {
    try {
      if (searchParams.get("tab") === "monthly") {
        const monthDays = calculateMonthDays(
          parseInt(searchParams.get("month") || "") - 1 ||
            new Date().getMonth() + 1,
          parseInt(searchParams.get("year") || "") || new Date().getFullYear()
        );

        const resp = await api.expenses.getMonthlyAnalytics({
          month: parseInt(
            searchParams.get("month") ||
              new Date().toLocaleString("en-US", { month: "numeric" })
          ),
          year: parseInt(
            searchParams.get("year") || new Date().getFullYear().toString()
          ),
        });

        if (!resp.error) {
          const monthAnalytics = {
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
            expenses: resp.data?.data.expenses,
            topPaymentMode: {
              mostUsedPaymentMode:
                resp.data?.data.analytics.mostUsedPaymentMode,
              highestAmountPaymentMode:
                resp.data?.data.analytics.highestAmountPaymentMode,
            },
          };
          dispatch(setMonthlyAnalytics(monthAnalytics));
        }
      } else if (searchParams.get("tab") === "yearly") {
        const resp = await api.expenses.getYearlyAnalytics({
          year: parseInt(
            searchParams.get("year") || new Date().getFullYear().toString()
          ),
        });

        if (!resp.error) {
          const yearlyAnalytics = {
            totalAmount: resp.data?.data.totalAmount,
            barChartData: resp.data?.data.analytics.monthly.some(
              (item: any) => item.amount > 0
            )
              ? resp.data?.data.analytics.monthly.map((item: any) => ({
                  date: formatDate(
                    new Date(
                      parseInt(searchParams.get("year") || "") ||
                        new Date().getFullYear(),
                      item.month - 1
                    ),
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
      }
    } catch (error) {
      console.error("Error fetching analytics expenses:", error);
    }
  };

  return (
    <Table className="rounded-md overflow-hidden my-2 text-base">
      <TableHeader className="bg-muted">
        <TableRow>
          {selectable && (
            <TableHead className="w-8">
              <Checkbox
                checked={
                  (expenses.length > 0 &&
                    selectedItems?.size === expenses.length) ||
                  ((selectedItems?.size || 0) > 0 ? "indeterminate" : false)
                }
                onCheckedChange={(checked) => {
                  if (checked === "indeterminate") {
                    setSelectedItems?.(new Set(expenses.map((e) => e._id)));
                  }
                  if (checked) {
                    setSelectedItems?.(new Set(expenses.map((e) => e._id)));
                  } else {
                    setSelectedItems?.(new Set());
                  }
                }}
              />
            </TableHead>
          )}
          <TableHead className="w-2/5 min-w-40">Spent on</TableHead>
          <TableHead className="min-w-28">Date</TableHead>
          <TableHead className="text-right min-w-20">Amount</TableHead>
          <TableHead className="text-center max-w-36">
            Mode of Payment
          </TableHead>
          <TableHead className="text-center min-w-24 max-w-28">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
        {loading ? (
          Array.from({ length: 5 }, (_, i) => (
            <TableRow key={i}>
              <TableCell colSpan={selectable ? 6 : 5} className="py-1 px-0">
                <Skeleton className="w-full h-8" />
              </TableCell>
            </TableRow>
          ))
        ) : expenses.length ? (
          expenses.map((expense) => (
            <TableRow key={expense._id}>
              {selectable && (
                <TableCell className="w-8">
                  <Checkbox
                    checked={selectedItems?.has(expense._id)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedItems);
                      if (checked) {
                        newSelected.add(expense._id);
                      } else {
                        newSelected.delete(expense._id);
                      }
                      setSelectedItems?.(newSelected);
                    }}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium py-1">
                {expense.subcategory_id.name}
              </TableCell>
              <TableCell className="py-1">
                {formatDate(expense.date, "MMM dd, yyyy")}
              </TableCell>
              <TableCell className="text-right py-1">
                {currency} {expense.amount}
              </TableCell>
              <TableCell className="text-center py-1">
                {getPaymentModeLabel(expense.mode_of_payment)}
              </TableCell>
              <TableCell className="text-center py-1">
                <div className="flex items-center justify-evenly gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-1 has-[>svg]:px-1 aspect-square"
                    onClick={() => {
                      dispatch(toggleUpdateExpenseDialog(true));
                      dispatch(setExpenseId(expense._id));
                      dispatch(
                        setAddExpenseCategory(expense.subcategory_id._id)
                      );
                      dispatch(
                        setAddExpenseMode(
                          expense.mode_of_payment as PaymentMode
                        )
                      );
                      dispatch(setAddExpenseAmount(expense.amount.toString()));
                      dispatch(setAddExpenseDate(new Date(expense.date)));
                    }}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-1 has-[>svg]:px-1 aspect-square"
                    onClick={() => {
                      api.expenses.delete(expense._id).then((resp) => {
                        if (!resp.error) {
                          toast.success("Expense deleted successfully", {
                            duration: 4000,
                            position: "top-center",
                            classNames: {
                              success: "!bg-destructive",
                            },
                          });

                          onDelete?.();
                          if (pathname === "/dashboard") {
                            handlefetchRecentExpense();
                          } else if (pathname === "/expenses/analytics") {
                            handlefetchAnalyticsExpense();
                          } else if (pathname === "/expenses/records") {
                          }
                        }
                      });
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={selectable ? 6 : 5}
              className="h-24 text-center"
            >
              No expenses
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ExpenseTable;
