import { useState } from "react";
import { signInWithPopup } from "firebase/auth";

import { auth, googleProvider } from "../../../Config/firebase";
import API_URL from "../../../Config/api";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.51h3.15c1.84-1.69 2.9-4.19 2.9-7.28Z"
      />
      <path
        fill="#34A853"
        d="M12 21.75c2.63 0 4.84-.87 6.45-2.24L15.3 17c-.87.58-1.98.93-3.3.93-2.54 0-4.69-1.72-5.46-4.03H3.28v2.59A9.75 9.75 0 0 0 12 21.75Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.9A5.87 5.87 0 0 1 6.23 12c0-.66.11-1.3.31-1.9V7.51H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.03 4.49l3.26-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.07c1.44 0 2.73.5 3.74 1.48l2.8-2.8C16.83 3.16 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.26l3.26 2.59C7.31 7.79 9.46 6.07 12 6.07Z"
      />
    </svg>
  );
}

export default function SocialLoginButtons({
  loading,
  onStart,
  onSuccess,
  onError,
}) {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) {
      onError?.("Firebase is not configured.");
      return;
    }

    try {
      onStart?.();
      setInternalLoading(true);

      // Step 1 - Google Popup
      const result = await signInWithPopup(auth, googleProvider);

      // Step 2 - Firebase Token
      const idToken = await result.user.getIdToken();

      // Step 3 - Send to Backend
      const response = await fetch(`${API_URL}/api/auth/firebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Firebase login failed");
      }

      if (!data.token) {
        throw new Error("Backend did not return JWT");
      }

      onSuccess?.(data.token);

    } catch (err) {
      onError?.(err.message);

    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading || internalLoading}
      className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#0C1122] transition hover:bg-[#171f3b]"
    >
      <GoogleIcon />

      {loading || internalLoading
        ? "Signing in..."
        : "Continue with Google"}
    </button>
  );
}
