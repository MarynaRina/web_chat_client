import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import PhoneSelector from "../components/PhoneSelector";
import PrimaryButton from "../components/PrimaryButton";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "../firebase";

interface Country {
  name: string;
  code: string;
}

declare global {
  interface Window {
    confirmationResult: ConfirmationResult | null;
  }
}

function isValidPhone(phone: string): boolean {
  // Оновлений регулярний вираз для більшої гнучкості
  const phoneRegex = /^\+\d{1,4}\d{4,14}$/;
  return phoneRegex.test(phone);
}

const PhoneLogin: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "Poland",
    code: "+48",
  });
  const [error, setError] = useState<string | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeRecaptcha = async () => {
      if (!recaptchaVerifier) {
        try {
          const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: (response: any) => {
              console.log("✅ reCAPTCHA solved with response:", response);
            },
            'expired-callback': () => {
              console.warn("⚠️ reCAPTCHA expired. Please try again.");
              setError("reCAPTCHA expired. Please try again.");
              setRecaptchaVerifier(null); // Дозволяємо повторну ініціалізацію
            },
          });
          setRecaptchaVerifier(verifier);
        } catch (error) {
          console.error("⚠️ Error creating reCAPTCHA:", error);
          setError("Failed to initialize reCAPTCHA. Please try again.");
        }
      }
    };

    initializeRecaptcha();

    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
          setRecaptchaVerifier(null);
        } catch (error) {
          console.error("Error clearing reCAPTCHA:", error);
        }
      }
    };
  }, [recaptchaVerifier]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const fullNumber = (selectedCountry.code + phone).replace(/\s+/g, '');

    if (!isValidPhone(fullNumber)) {
      setError("Please enter a valid phone number (e.g., +380123456789)");
      setIsLoading(false);
      return;
    }

    try {
      if (!recaptchaVerifier) {
        setError("reCAPTCHA not initialized. Please try again.");
        setIsLoading(false);
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, fullNumber, recaptchaVerifier);
      window.confirmationResult = confirmation;
      localStorage.setItem("phone", fullNumber);
      const from = location.state as { from?: string };
      navigate("/verify", { state: { from: from?.from || "/setup-profile", phone: fullNumber } });
    } catch (error: any) {
      console.error("Error in signInWithPhoneNumber:", error);
      if (error.code === 'auth/invalid-phone-number') {
        setError("Invalid phone number format. Please use the format +[country code][phone number].");
      } else if (error.code === 'auth/invalid-app-credential') {
        setError("reCAPTCHA verification failed. Please try again.");
        setRecaptchaVerifier(null); // Дозволяємо повторну ініціалізацію
      } else if (error.code === 'auth/too-many-requests') {
        setError("Too many requests. Please wait a while and try again.");
      } else {
        setError(`Failed to send SMS: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgBase px-4">
      <div className="p-8 w-full max-w-md text-text">
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
        <p className="text-center mb-6">
          Please confirm your country code and enter your phone number.
        </p>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <PhoneSelector
            phone={phone}
            setPhone={setPhone}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Next"}
          </PrimaryButton>
        </form>

        <div id="recaptcha-container" />
      </div>
    </div>
  );
};

export default PhoneLogin;
