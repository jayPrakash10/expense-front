import React from "react";
import { Skeleton } from "../ui/skeleton";

type Props = {
  type?: "basic" | "monthly" | "yearly";
};

const BarSkeleton = ({ type = "basic" }: Props) => {
  return type === "basic" ? <Variant1 /> : type === "monthly" ? <Variant2 /> : <Variant3 />;
};

const Variant1 = () => {
  return (
    <div className="border border-blue-500/20 rounded-lg p-4 flex items-center justify-center w-96">
      <div className="flex items-end gap-4">
        <Skeleton className="w-6 h-40 bg-blue-500/20" />
        <Skeleton className="w-6 h-52 bg-blue-500/20" />
        <Skeleton className="w-6 h-44 bg-blue-500/20" />
      </div>
    </div>
  );
};

const Variant2 = () => {
  return (
    <div className="h-full p-8 px-10">
      <div className="flex items-end justify-evenly gap-1 h-full px-2 border-b border-l text-2xl text-muted-foreground">
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-3/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-5/6 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-3/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-5/6 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-3/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-5/6 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-3/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-5/6 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-3/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-5/6 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-3/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-5/6 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/5 bg-blue-500/20 rounded-b-none" />
      </div>
    </div>
  );
};

const Variant3 = () => {
  return (
    <div className="h-full p-8 px-10">
      <div className="flex items-end justify-evenly gap-1 h-full px-2 border-b border-l text-2xl text-muted-foreground">
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-3/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-5/6 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-3/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-5/6 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/5 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-2/3 bg-blue-500/20 rounded-b-none" />
        <Skeleton className="w-full max-w-5 h-1/2 bg-blue-500/20 rounded-b-none" />
      </div>
    </div>
  );
};

export default BarSkeleton;
