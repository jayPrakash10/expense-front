import BarSkeleton from "@/components/app-component/bars-skeleton";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("expense-token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);
  
  return (
    <>
      <Head>
        <title>Expense</title>
      </Head>
      <div
        className={`grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16`}
      >
        <div className="flex items-center">
          <BarSkeleton />
        </div>
      </div>
    </>
  );
}
