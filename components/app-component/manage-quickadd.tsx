import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleManageQuickAddDialog } from "@/store/slices/globalSlice";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { updateSettings } from "@/store/slices/userSlice";
import { Subcategory } from "@/types/api";
import { Button } from "../ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { api } from "@/services/api";
import { toast } from "sonner";

const ManageQuick = () => {
  const dispatch = useDispatch();
  const isManageQuickAddOpen = useSelector(
    (state: RootState) => state.global.isManageQuickAddOpen
  );

  const quick = useSelector(
    (state: RootState) => state.user.settings.quickAdd || []
  );

  const [selected, setSelected] = useState<Subcategory[]>(
    quick.map((item) => item)
  );

  useEffect(() => {
    setSelected(quick.map((item) => item));
  }, [quick]);

  const handleSelect = (value: Subcategory) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((id) => id !== value)
        : [...prev, value]
    );
  };

  const handleDelete = (value: string) => {
    setSelected((prev) => prev.filter((item) => item._id !== value));
  };

  const handleSave = () => {
    api.user.updateSettings({ quickAdd: selected }).then((res) => {
      if (!res.error) {
        toast.success("Quick add updated successfully", {
          duration: 4000,
          position: "top-center",
          classNames: {
            success: "!bg-green-600",
          },
        });
        dispatch(updateSettings({ quickAdd: selected }));
        dispatch(toggleManageQuickAddDialog(false));
      }
    });
  };

  return (
    <Dialog
      open={isManageQuickAddOpen}
      onOpenChange={(open) => {
        setSelected(quick.map((item) => item));
        dispatch(toggleManageQuickAddDialog(open));
        // !open && dispatch(resetAddExpenseForm());
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Quick Add</DialogTitle>
          <DialogDescription>
            Manage your quick add items here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 h-60">
          <SelectCategoryDropdown
            selected={selected}
            onSelectItem={(value) => {
              handleSelect(value);
              // dispatch(updateSettings({ quickAdd: [...quick, value] }));
            }}
          />
          {selected?.map((item) => (
            <QuickItem key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
        <DialogFooter className="gap-8">
          <DialogClose onClick={() => setSelected(quick.map((item) => item))}>
            Cancel
          </DialogClose>
          <Button
            onClick={() => {
              handleSave();
            }}
            className="h-8"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const QuickItem = ({
  item,
  onDelete,
}: {
  item: Subcategory;
  onDelete?: (value: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 border rounded-lg overflow-hidden p-1">
      <span className="text-sm px-2">{item.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 py-2 px-2"
        onClick={() => onDelete?.(item._id)}
      >
        <XIcon />
      </Button>
    </div>
  );
};

const SelectCategoryDropdown = ({
  placeholder = "Select Option",
  selected,
  onSelect,
  onSelectItem,
}: {
  placeholder?: string;
  selected?: Subcategory[];
  onSelect?: (value: Subcategory) => void;
  onSelectItem?: (value: Subcategory) => void;
}) => {
  const dispatch = useDispatch();

  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const handleSelect = (value: Subcategory) => {
    onSelect && onSelect(value);
    onSelectItem && onSelectItem(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start px-2"
          disabled={selected?.length === 4}
        >
          <span className="text-muted-foreground">{placeholder}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
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
                    {selected?.map((item) => item._id).includes(sub._id) && (
                      <CheckIcon />
                    )}
                  </DropdownMenuItem>
                ))}
                {category.subcategories?.length === 0 && (
                  <DropdownMenuItem
                    key={category._id}
                    className="text-muted-foreground text-xs"
                  >
                    <Link
                      href="/settings/spend-category"
                      onClick={() =>
                        dispatch(toggleManageQuickAddDialog(false))
                      }
                    >
                      Add spend type
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            ))}

            {categories.length === 0 && (
              <p className="text-center text-xs text-muted-foreground p-8">
                You don't have category.{" "}
                <Link
                  href="/settings/spend-category"
                  className="underline"
                  onClick={() => dispatch(toggleManageQuickAddDialog(false))}
                >
                  Click here
                </Link>{" "}
                to add category.
              </p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ManageQuick;
