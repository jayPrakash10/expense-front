import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import {
  setAddExpenseCategory,
  toggleAddExpenseDialog,
  toggleManageQuickAddDialog,
} from "@/store/slices/globalSlice";
import { AppCard } from "./card";
import { Plus } from "lucide-react";

const QuickAdd = () => {
  const dispatch = useDispatch();

  const quickAdd = useSelector(
    (state: RootState) => state.user.settings.quickAdd || []
  );

  return (
    <AppCard
      title="Quick Add"
      contentClassName="p-0"
      action={
        <Button
          className="has-[>svg]:px-2 py-1 h-auto rounded-sm text-xs text-primary bg-transparent hover:bg-primary/20"
          onClick={() => { dispatch(toggleManageQuickAddDialog(true))}}
        >
          <Plus className="size-3" /> Manage
        </Button>
      }
    >
      {quickAdd?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 place-items-center gap-2 pt-4 pb-1">
          {quickAdd?.map((item) => (
            <QuickAddButton
              key={item._id}
              onClick={() => {
                dispatch(setAddExpenseCategory(item._id));
                dispatch(toggleAddExpenseDialog(true));
              }}
            >
              {item.name}
            </QuickAddButton>
          ))}
        </div>
      ) : null}
    </AppCard>
  );
};

const QuickAddButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Button
      className="h-8 min-w-24 rounded-sm font-semibold text-white bg-primary/80 hover:bg-primary/60"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default QuickAdd;
