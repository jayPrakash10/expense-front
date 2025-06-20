import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const OTPForm = ({
  value,
  isLoading,
  setValue,
  onVerify,
}: {
  value: string;
  isLoading: boolean;
  setValue: (value: string) => void;
  onVerify: () => void;
}) => {
  const [OTP, setOTP] = useState("");

  useEffect(() => {
    setOTP(value);
  }, [value]);

  const handleOTPChange = (value: string) => {
    setValue(value);
    setOTP(value);
  };

  const handleVerifyOTP = () => {
    onVerify();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <div className="grid gap-2">
          <InputOTP
            maxLength={6}
            value={OTP}
            onChange={handleOTPChange}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={4} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer bg-blue-500/60 text-white hover:bg-blue-500/80"
        onClick={() => {
          handleVerifyOTP();
        }}
        disabled={isLoading}
      >
        Verify
        {isLoading ? <Loader className="animate-spin" /> : null}
      </Button>
    </>
  );
};

export default OTPForm;
