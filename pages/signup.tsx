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
import { Loader } from "lucide-react";
import OTPForm from "@/components/app-component/otp-form";
import { validateEmail } from "@/lib/utils";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/userSlice";
import { User } from "@/types/api";

type Props = {};

const Login = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOTP] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetOtp = () => {
    // API call to send OTP
    setIsLoading(true);
    api.signup
      .generateOTP(email)
      .then((data) => {
        if (!data.error) {
          toast.success(data.data?.message, {
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
    // API call to verify OTP and create account
    setIsLoading(true);
    api.signup
      .createAccount({ email, name, otp })
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
        <title>Signup | Expense</title>
      </Head>
      <Card className="w-full max-w-sm h-[572px]">
        <CardHeader>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="w-16 h-16 mb-2 mx-auto"
          />
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            {isOTPSent ? (
              <>
                OTP sent to <strong>{email}</strong>
              </>
            ) : (
              "Enter your details to create your account"
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
            <SignupForm
              email={email}
              name={name}
              setEmail={setEmail}
              setName={setName}
              onSubmit={handleGetOtp}
              isLoading={isLoading}
            />
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2 border-t">
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
          <CardDescription>
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-2">
              Login here
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </UnauthLayout>
  );
};

const SignupForm = ({
  isLoading,
  email,
  name,
  setEmail,
  onSubmit,
}: {
  isLoading: boolean;
  email: string;
  name: string;
  setEmail: (value: string) => void;
  setName: (value: string) => void;
  onSubmit: () => void;
}) => {
  const [nameInput, setNameInput] = useState(name);
  const [emailInput, setEmailInput] = useState(email);
  const [isValidEmail, setIsValidEmail] = useState(false);

  useEffect(() => {
    setEmailInput(email);
  }, [email]);

  useEffect(() => {
    setNameInput(name);
  }, [name]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
    setEmail(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
  };

  const handleGetOtp = () => {
    if (!validateEmail(emailInput)) {
      setIsValidEmail(true);
      return;
    }
    setIsValidEmail(false);
    onSubmit();
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-full overflow-hidden relative">
            <Image
              src="/images/user-blue.png"
              alt="Login"
              width={80}
              height={80}
            />
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 hidden cursor-pointer"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            aria-invalid={isValidEmail}
            id="name"
            type="text"
            placeholder="John Doe"
            value={nameInput}
            onChange={handleNameChange}
          />
          {isValidEmail && (
            <CardDescription className="text-destructive">
              Enter a valid email address
            </CardDescription>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            aria-invalid={isValidEmail}
            id="email"
            type="email"
            placeholder="m@example.com"
            value={emailInput}
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
        Create Account
        {isLoading ? <Loader className="animate-spin" /> : null}
      </Button>
      {/* <CardDescription className="flex items-center gap-2">
        <Info size={"16"} /> OTP will be sent to your email
      </CardDescription> */}
    </>
  );
};

export default Login;
