import { useEffect, useState } from "react";
import Head from "next/head";
import UnauthLayout from "@/components/layouts/unauth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Info, Loader } from "lucide-react";
import OTPForm from "@/components/app-component/otp-form";
import { validateEmail } from "@/lib/utils";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/userSlice";
import { User } from "@/types/api";
import Image from "next/image";
import { GoogleSignInButton } from "@/components/ui/google-signin";

import logo from "@/public/images/logo.png";

type Props = {};

const Login = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetOtp = () => {
    // API call to send OTP
    setIsLoading(true);
    api.auth
      .generateOTP(email)
      .then((resp) => {
        if (!resp.error) {
          toast.success(resp.data?.message, {
            description: "OTP is valid for 5 minutes",
            duration: 4000,
            position: "top-center",
            classNames: {
              success: "!bg-green-600",
            },
          });
          setIsOTPSent(true);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVerifyOTP = () => {
    // API call to verify OTP
    setIsLoading(true);
    api.auth
      .verifyOTP({ email, otp })
      .then((resp) => {
        if (!resp.error) {
          // Navigate to dashboard
          localStorage.setItem("expense-token", resp.data?.data?.token || "");
          dispatch(setUser(resp.data?.data?.user as User));
          router.push("/dashboard");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <UnauthLayout>
      <Head>
        <title>Login | Expense</title>
      </Head>
      <Card className="w-full max-w-sm h-[572px]">
        <CardHeader>
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            className="w-16 h-16 mb-2 mx-auto"
          />
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            {isOTPSent ? (
              <div className="space-y-4 pt-4">
                OTP sent to <strong>{email}</strong>
              </div>
            ) : (
              "Enter your email below to login to your account"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1">
          {isOTPSent ? (
            <>
              <br />
              <OTPForm
                value={otp}
                setValue={setOTP}
                onVerify={handleVerifyOTP}
                isLoading={isLoading}
              />
              <CardDescription>
                Change Email?{" "}
                <Button
                  variant="link"
                  className="px-0 py-0 h-auto cursor-pointer"
                  onClick={() => setIsOTPSent(false)}
                >
                  Click here
                </Button>
              </CardDescription>
            </>
          ) : (
            <>
              <EmailForm
                value={email}
                setValue={setEmail}
                onSubmit={handleGetOtp}
                isLoading={isLoading}
              />
              <div className="space-y-8 mt-8">
                <div className="flex items-center justify-center gap-4">
                  <hr className="flex-1" /> OR <hr className="flex-1" />
                </div>
                <GoogleSignInButton />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2 border-t">
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
          <CardDescription>
            Don't have an account?{" "}
            <Link href="/signup" className="underline underline-offset-2">
              Create here
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </UnauthLayout>
  );
};

const EmailForm = ({
  isLoading,
  value,
  setValue,
  onSubmit,
}: {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
}) => {
  const [email, setEmail] = useState(value);
  const [isValidEmail, setIsValidEmail] = useState(false);

  useEffect(() => {
    setEmail(value);
  }, [value]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValue(e.target.value);
  };

  const handleGetOtp = () => {
    if (!validateEmail(email)) {
      setIsValidEmail(true);
      return;
    }
    setIsValidEmail(false);
    onSubmit();
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            aria-invalid={isValidEmail}
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={handleEmailChange}
          />
          {isValidEmail && (
            <CardDescription className="text-destructive">
              Enter a valid email address
            </CardDescription>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer bg-blue-500/60 text-white hover:bg-blue-500/80"
        onClick={handleGetOtp}
        disabled={isLoading}
      >
        Get OTP
        {isLoading ? <Loader className="animate-spin" /> : null}
      </Button>
      <CardDescription className="flex items-center gap-2">
        <Info size={"16"} /> OTP will be sent to your email
      </CardDescription>
    </>
  );
};

export default Login;
