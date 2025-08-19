import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useCurrencySymbol } from "@/hooks/use-curreny-code";
import { cn } from "@/lib/utils";

type Props = {};

const Overview = (props: Props) => {
  const currency = useCurrencySymbol();

  const { overview } = useSelector((state: RootState) => state.expenses);

  let topSpendType = [...(overview?.categories || [])].sort(
    (a, b) => b.amount - a.amount
  )[0];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {overview?.summary ? (
          <OverviewCard>
            <div className="grid grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Income</p>
                <p className="font-bold text-emerald-500">
                  {currency} {overview?.summary.monthlyIncome}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Total Spend
                </p>
                <p className="font-bold text-rose-400">
                  {currency} {overview?.summary.totalExpenses}
                </p>
              </div>
            </div>
          </OverviewCard>
        ) : null}

        {topSpendType ? (
          <OverviewCard bgColor={topSpendType?.color}>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Most Spend On
              </p>
              <p className="font-bold">{topSpendType?.name}</p>
            </div>
          </OverviewCard>
        ) : null}
      </div>
    </div>
  );
};

const OverviewCard = ({
  bgColor,
  children,
  className,
  style,
}: {
  bgColor?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <Card
      className={cn("py-4 justify-between relative overflow-hidden", className)}
      style={{ ...style }}
    >
      <CardHeader className="px-4">
        <CardTitle className="font-normal text-sm text-muted-foreground">
          This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">{children}</CardContent>
      {bgColor && (
        <div
          className="absolute bottom-0 left-0 h-full w-full"
          style={{
            backgroundImage: `linear-gradient(to right, transparent 10%, ${bgColor}66 100%)`,
          }}
        />
      )}
    </Card>
  );
};

export default Overview;
