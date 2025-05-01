import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CodeInput from "../components/CodeInput";
import { ConfirmationResult, UserCredential } from "firebase/auth";
import { registerWithToken } from "../api/auth";

declare global {
  interface Window {
    confirmationResult: ConfirmationResult | null;
  }
}

const VerifyCode: React.FC = () => {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedPhone = localStorage.getItem("phone");
    if (!savedPhone || !window.confirmationResult) {
      navigate("/");
    } else {
      setPhone(savedPhone);
    }
  }, [navigate]);

  const handleVerifyCode = async (verificationCode: string) => {
    if (isLoading || !window.confirmationResult) return;

    setIsLoading(true);
    setError(null);

    try {
      const result: UserCredential = await window.confirmationResult.confirm(
        verificationCode
      );
      const user = result.user;

      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("phone", user.phoneNumber || "Unknown");

      console.log("✅ Verified:", user.uid, user.phoneNumber);

      // 🔥 Надсилаємо токен на бекенд для створення/оновлення користувача
      try {
        await registerWithToken(token);
        console.log("🔄 User synced with backend");
      } catch (backendError) {
        console.error("Error syncing with backend:", backendError);
      }

      const from = (location.state as { from?: string })?.from || "/setup-profile";
      navigate(from);
    } catch (error: any) {
      console.error("Error verifying code:", error);
      if (error.code === "auth/code-expired") {
        setError("The verification code has expired. Please request a new code.");
      } else {
        setError("Invalid verification code. Please check and try again.");
      }
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    navigate("/");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleVerifyCode(code);
  };

  if (!phone) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgBase px-4">
      <div className="p-8 w-full max-w-md text-text">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Check your messages
        </h2>

        <p className="text-text text-center text-sm mb-6">
          We've sent the code for {" "}
          <span className="text-white font-medium">{phone}</span> on your
          device. {" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-edit hover:text-blue-300 font-medium"
          >
            Edit
          </button>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CodeInput
            value={code}
            onChange={setCode}
            onComplete={handleVerifyCode}
            isLoading={isLoading}
          />

          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-text/60">
            Didn't receive the code? {" "}
            <button
              className="text-blue-500 font-medium"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;