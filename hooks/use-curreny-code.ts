import { useAppSelector } from "@/store";
import { CURRENCIES } from "@/constants/currencies";

export const useCurrencySymbol = () => {
  const { settings } = useAppSelector((state) => state.user);

  return CURRENCIES[settings?.currency as keyof typeof CURRENCIES]?.symbol;
};
