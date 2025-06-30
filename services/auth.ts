import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { api } from "@/services/api";

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const response = await api.auth.googleSignIn({
      email: user.email || "",
      name: user.displayName || "",
      profile_img: user.photoURL || undefined,
    });

    if (!response.error) {
      localStorage.setItem("expense-token", response.data?.data?.token || "");
      return response.data?.data?.user;
    }

    throw new Error("Failed to authenticate with Google");
  } catch (error) {
    console.error("Error signing in with Google:", error);
    // throw error;
  }
};
