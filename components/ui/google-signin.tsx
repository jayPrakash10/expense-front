import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/userSlice";
import { User } from "@/types/api";

interface GoogleSignInProps {
  onSuccess?: () => void;
}

export function GoogleSignInButton({ onSuccess }: GoogleSignInProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        dispatch(setUser(user as User));
        router.push("/dashboard");
        onSuccess?.();
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-center gap-2"
      onClick={handleGoogleSignIn}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className="h-4 w-4"
      >
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.46 14.97 2 12 2 7.7 2 4.1 4.79 2.18 8.25l3.64 2.84c.24-.72.75-1.36 1.41-1.82-.03-.24-.05-.47-.05-.7z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </Button>
  );
}
