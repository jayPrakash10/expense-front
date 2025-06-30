import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useCurrencySymbol } from "@/hooks/use-curreny-code";
import { Calendar } from "../ui/calendar";
import { Card, CardHeader } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/services/api";
import { RootState } from "@/store";
import {
  setAddExpenseCategory,
  setAddExpenseMode,
  setAddExpenseAmount,
  setAddExpenseDate,
  toggleAddExpenseDialog,
  resetAddExpenseForm,
} from "@/store/slices/globalSlice";
import { Subcategory } from "@/types/api";
import { PAYMENT_MODE_OPTIONS } from "@/constants/paymentModes";
import { PaymentMode } from "@/constants/paymentModes";
import { toast } from "sonner";

type Props = {
  onAdd?: () => void;
};

const AddExpense = ({ onAdd }: Props) => {
  const dispatch = useDispatch();

  const { category, mode, amount, date, isAddExpenseOpen } = useSelector(
    (state: RootState) => state.global
  ) as {
    category: string;
    mode: PaymentMode;
    amount: string;
    date: Date | null;
    isAddExpenseOpen: boolean;
  };

  const handleAddExpense = async () => {
    try {
      const expenseData = {
        subcategory_id: category,
        mode_of_payment: mode,
        amount: parseFloat(amount),
        date: date?.toISOString() || new Date().toISOString(),
      };

      const response = await api.expenses.create(expenseData);

      if (!response.error) {
        toast.success("Expense created successfully", {
          duration: 4000,
          position: "top-center",
          classNames: {
            success: "!text-green-600",
          },
        });

        onAdd?.();

        dispatch(resetAddExpenseForm());
        dispatch(toggleAddExpenseDialog(false));
      } else {
        console.error("Error creating expense:", response.error);
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      // Handle network errors here
    }
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setAddExpenseCategory(value));
  };

  const handleModeChange = (value: PaymentMode) => {
    dispatch(setAddExpenseMode(value));
  };

  const handleAmountChange = (value: string) => {
    dispatch(setAddExpenseAmount(value));
  };

  const handleDateChange = (value: Date | undefined) => {
    dispatch(setAddExpenseDate(value || null));
  };

  return (
    <Dialog
      open={isAddExpenseOpen}
      onOpenChange={(open) => {
        dispatch(toggleAddExpenseDialog(open));
        !open && dispatch(resetAddExpenseForm());
      }}
    >
      <DialogContent className="sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>Add a new expense to your list.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-2 py-6">
          <div className="flex-1 flex flex-col gap-4">
            <SelectCategoryDropdown
              selected={category || ""}
              onSelect={handleCategoryChange}
            />

            <SelectModeDropdown selected={mode} onSelect={handleModeChange} />

            <Input
              placeholder={`How much did you spent? (${useCurrencySymbol()})`}
              className="px-2"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              onKeyDown={(e) => {
                return (
                  e.key.match(/[^0-9]/g) &&
                  e.key !== "Backspace" &&
                  !e.key.startsWith("Arrow") &&
                  (e.key !== "." ||
                    (e.target as HTMLInputElement).value.includes(".")) &&
                  e.preventDefault()
                );
              }}
            />
          </div>
          <div className="flex-1 flex items-start justify-center">
            <Card className="py-0 gap-0 overflow-hidden">
              <CardHeader className="text-center bg-background place-content-center gap-0 pt-4">
                <span className="text-muted-foreground">
                  When did you spent?
                </span>
              </CardHeader>
              <Calendar
                mode="single"
                disabled={{ after: new Date() }}
                endMonth={new Date()}
                classNames={{
                  day: "w-10 h-10",
                }}
                selected={date || undefined}
                onSelect={handleDateChange}
              />
            </Card>
          </div>
        </div>
        <DialogFooter className="gap-4 border-t pt-4">
          <DialogClose className="text-sm px-4 h-8 rounded-md border cursor-pointer">
            Cancel
          </DialogClose>
          <Button size="sm" className="w-16" onClick={handleAddExpense}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
        <Button variant="outline" className="w-full justify-start px-2">
          {selectedCat ? (
            <span className="font-semibold">{selectedCat.name}</span>
          ) : (
            <span className="text-muted-foreground">Where did you spent?</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="lg:max-w-[600px]"
      >
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex flex-col flex-wrap max-h-80 w-max gap-2 pb-3">
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

const SelectModeDropdown = ({
  selected,
  onSelect,
}: {
  selected: PaymentMode;
  onSelect: (value: PaymentMode) => void;
}) => {
  const [selectedMode, setSelected] = useState<any>(null);

  useEffect(() => {
    setSelected(PAYMENT_MODE_OPTIONS.find((mode) => mode.value === selected));
  }, [selected, PAYMENT_MODE_OPTIONS]);

  const handleSelect = (value: any) => {
    setSelected(value);
    onSelect(value?.value as PaymentMode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start px-2">
          {selectedMode ? (
            <span className="font-semibold">{selectedMode?.label}</span>
          ) : (
            <span className="text-muted-foreground">How did you spent?</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-96">
        {PAYMENT_MODE_OPTIONS.map((mode) => (
          <DropdownMenuItem
            key={mode.value}
            onSelect={() => handleSelect(mode)}
          >
            {mode.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddExpense;
