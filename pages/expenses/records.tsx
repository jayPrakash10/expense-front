import Head from "next/head";
import AuthLayout from "@/components/layouts/auth";
import { useCallback, useState } from "react";
import { api } from "@/services/api";
import { Pagination as PaginationType, Subcategory } from "@/types/api";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { formatDate, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Calendar as CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Plus,
  Filter as FilterIcon,
  CreditCard,
  Package,
  Trash2,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddExpenseDialog } from "@/store/slices/globalSlice";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectIcon } from "@radix-ui/react-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RootState } from "@/store";
import ExpenseTable from "@/components/app-component/expense-table";
import { useRouter, useSearchParams } from "next/navigation";
import { setExpenses } from "@/store/slices/expenseSlice";
import UpdateExpense from "@/components/app-component/update-expense";
import AddExpense from "@/components/app-component/add-expense";

type Props = {};

const Records = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [filter, setFilter] = useState({
    paymentMode: "all",
    category: "",
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const dispatch = useDispatch();

  const search = new URLSearchParams();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  searchParams.forEach((value, key) => {
    search.set(key, value);
  });

  useEffect(() => {
    searchParams.forEach((value, key) => {
      search.set(key, value);
    });

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if ((page || page === 0) && pagination) {
      if (page <= pagination.totalPages) {
        setCurrentPage(page);
      } else {
        search.set("page", "1");
        replace(`?${search.toString()}`);
      }
    }

    if ((limit || limit === 0) && pagination) {
      if ([10, 20, 30].includes(limit)) {
        setPageLimit(limit);
      } else {
        search.set("limit", "10");
        replace(`?${search.toString()}`);
      }
    }
  }, [searchParams, pagination]);

  useEffect(() => {
    if (pagination) {
    }
  }, [pagination]);

  useEffect(() => {
    getExpenses();
  }, [pageLimit, currentPage, filter, dateRange]);

  const getExpenses = () => {
    const params = {
      limit: pageLimit,
      page: currentPage,
      ...(dateRange && {
        startDate: formatDate(dateRange.from!, "yyyy-MM-dd HH:mm:ss"),
        endDate: formatDate(endOfDay(dateRange.to!), "yyyy-MM-dd HH:mm:ss"),
      }),
      ...(filter.paymentMode !== "all" && { mode: filter.paymentMode }),
      ...(filter.category && { sub_category: filter.category }),
    };

    api.expenses
      .getRecents(params)
      .then((resp) => {
        if (!resp.error) {
          dispatch(setExpenses(resp.data?.data || []));
          setPagination(resp.data?.meta || null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const increasePage = useCallback(() => {
    if (currentPage === pagination?.totalPages) return;
    handlePageChange(currentPage + 1);
  }, [pagination, currentPage]);

  const decreasePage = useCallback(() => {
    if (currentPage === 1) return;
    handlePageChange(currentPage - 1);
  }, [pagination, currentPage]);

  const handleDeleteMultiple = () => {
    api.expenses.deleteMultiple(Array.from(selectedItems)).then((resp) => {
      if (!resp.error) {
        toast.success("Expenses deleted successfully", {
          duration: 4000,
          position: "top-center",
          classNames: {
            success: "!bg-destructive",
          },
        });
        getExpenses();
        setSelectedItems(new Set());
      }
    });
  };

  const handleDeleteSingle = () => {
    getExpenses();
  };

  const handlePageChange = (page: number) => {
    search.set("page", page.toString());
    replace(`?${search.toString()}`);
    setCurrentPage(page);
  };

  const handleLimitChange = (limit: number) => {
    search.set("limit", limit.toString());
    replace(`?${search.toString()}`);
    setPageLimit(limit);
  };

  return (
    <>
      <Head>
        <title>Records | Expense</title>
      </Head>
      <AuthLayout>
        <AddExpense onAdd={() => getExpenses()} />
        <UpdateExpense onUpdate={() => getExpenses()} />
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">All Expenses</h2>
              <Button
                className="has-[>svg]:px-2 py-1 h-auto rounded-sm text-xs text-primary bg-transparent shadow-none hover:bg-primary/20"
                onClick={() => {
                  dispatch(toggleAddExpenseDialog(true));
                }}
              >
                <Plus className="size-4" /> Add Expense
              </Button>
            </div>
            <Card className="py-2 px-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full flex items-center justify-start gap-4">
                  <Pagination className="w-fit mx-[unset]">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          className={`bg-muted hover:bg-muted/80 text-muted-foreground`}
                          disabled={currentPage === 1}
                          onClick={decreasePage}
                        >
                          <ChevronLeftIcon />
                        </Button>
                      </PaginationItem>
                      {currentPage > 2 && (
                        <PaginationItem>
                          <PaginationLink
                            className="bg-accent data-[active=true]:bg-primary data-[active=true]:hover:bg-primary/80"
                            isActive={currentPage === 1}
                            onClick={() => {
                              handlePageChange(1);
                            }}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {currentPage > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      {Array.from(
                        { length: pagination?.totalPages || 1 },
                        (_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              className="bg-accent data-[active=true]:bg-primary data-[active=true]:hover:bg-primary/80"
                              isActive={currentPage === i + 1}
                              onClick={() => {
                                handlePageChange(i + 1);
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      ).slice(
                        currentPage - 2 < 0 ? 0 : currentPage - 2,
                        currentPage + 1
                      )}
                      {currentPage + 2 < (pagination?.totalPages || 0) && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      {currentPage + 1 < (pagination?.totalPages || 0) && (
                        <PaginationItem>
                          <PaginationLink
                            className="bg-accent data-[active=true]:bg-primary data-[active=true]:hover:bg-primary/80"
                            isActive={
                              currentPage === (pagination?.totalPages || 0)
                            }
                            onClick={() =>
                              handlePageChange(pagination?.totalPages || 0)
                            }
                          >
                            {pagination?.totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <Button
                          className={`bg-muted hover:bg-muted/80 text-muted-foreground`}
                          disabled={
                            currentPage === (pagination?.totalPages || 1)
                          }
                          onClick={increasePage}
                        >
                          <ChevronRightIcon />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>

                  <Select
                    value={pageLimit.toString()}
                    onValueChange={(value) => handleLimitChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  {selectedItems.size > 0 && (
                    <Button
                      variant="outline"
                      className="text-destructive has-[>svg]:px-2 aspect-square"
                      onClick={handleDeleteMultiple}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Popover
                    open={datePickerOpen}
                    onOpenChange={setDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-center aspect-square w-auto has-[>svg]:px-2 font-normal relative"
                      >
                        <FilterIcon className="h-4 w-4" />
                        {(dateRange || filter.paymentMode !== "all") && (
                          <span className="absolute right-1 top-1 aspect-square bg-primary rounded-full px-1.5" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-4" align="end">
                      <FilterOption
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        filter={filter}
                        setFilter={setFilter}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <ExpenseTable
                expenses={expenses}
                selectable
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                loading={loading}
                onDelete={handleDeleteSingle}
              />
            </Card>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

const FilterOption = ({
  dateRange,
  setDateRange,
  filter,
  setFilter,
}: {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  filter: { paymentMode: string; category: string };
  setFilter: (prop: any) => void;
}) => {
  const clearAll = () => {
    setDateRange(undefined);
    setFilter({ paymentMode: "all", category: "" });
  };
  return (
    <div className="space-y-4">
      <div className="h-0 flex items-center justify-end">
        {(dateRange || filter.category || filter.paymentMode !== "all") && (
          <button
            onClick={clearAll}
            className="text-destructive cursor-pointer px-2 text-xs"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Date Range
          </label>
          {dateRange && (
            <button
              onClick={() => setDateRange(undefined)}
              className="text-destructive cursor-pointer px-2 text-xs"
            >
              Clear
            </button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent h-9 justify-start text-left font-normal gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              {dateRange ? (
                formatDate(dateRange.from!, "dd-MM-yyyy") ===
                formatDate(dateRange.to!, "dd-MM-yyyy") ? (
                  formatDate(dateRange.from!, "dd-MM-yyyy")
                ) : (
                  `${formatDate(dateRange.from!, "dd-MM-yyyy")} - ${formatDate(
                    dateRange.to!,
                    "dd-MM-yyyy"
                  )}`
                )
              ) : (
                <span className="text-muted-foreground">Select Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              disabled={{ after: new Date() }}
              defaultMonth={new Date()}
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range || undefined);
              }}
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Spent On
          </label>
          {filter.category && (
            <button
              onClick={() =>
                setFilter((prev: any) => ({
                  ...prev,
                  category: "",
                }))
              }
              className="text-destructive cursor-pointer px-2 text-xs"
            >
              Clear
            </button>
          )}
        </div>
        <SelectCategoryDropdown
          selected={filter.category}
          onSelect={(value) =>
            setFilter((prev: any) => ({
              ...prev,
              category: value,
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium flex items-center gap-2">
            Payment Mode
          </label>
          {filter.paymentMode !== "all" && (
            <button
              onClick={() =>
                setFilter((prev: any) => ({
                  ...prev,
                  paymentMode: "all",
                }))
              }
              className="text-destructive cursor-pointer px-2 text-xs"
            >
              Clear
            </button>
          )}
        </div>
        <Select
          value={filter.paymentMode}
          onValueChange={(value) =>
            setFilter((prev: any) => ({
              ...prev,
              paymentMode: value,
            }))
          }
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              <SelectIcon className="text-foreground">
                <CreditCard />
              </SelectIcon>
              <SelectValue placeholder="Select payment mode" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Modes</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="net_banking">Net Banking</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const SelectCategoryDropdown = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (value: string) => void;
}) => {
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const [selectedCat, setSelected] = useState<Subcategory | null | undefined>(
    null
  );

  useEffect(() => {
    setSelected(
      categories
        .flatMap((cat) => cat.subcategories)
        .find((cat) => cat?._id === selected)
    );
  }, [selected, categories]);

  const handleSelect = (value: Subcategory) => {
    setSelected(value);
    onSelect(value._id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-transparent justify-between px-2"
        >
          <div className="flex items-center gap-2">
            <Package className="size-4" />
            {selectedCat ? (
              <span className="">{selectedCat.name}</span>
            ) : (
              <span className="text-muted-foreground">Select Category</span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="lg:max-w-[600px]"
      >
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex flex-col flex-wrap max-h-84 w-max gap-2 pb-3">
            {categories.map((category) => (
              <DropdownMenuGroup className="w-44" key={category._id}>
                <DropdownMenuLabel className="font-semibold">
                  {category.category_name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-0" />
                {category.subcategories?.map((sub) => (
                  <DropdownMenuItem
                    key={sub._id}
                    className="text-muted-foreground"
                    onSelect={() => handleSelect(sub)}
                  >
                    {sub.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Records;
