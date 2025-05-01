import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

interface SetupProfileResponse {
  success: boolean;
  avatarUrl?: string;
  message?: string;
}

const SetupProfile: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.log("No userId in localStorage, redirecting to /");
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !avatar) {
      setError("Please provide a username and an avatar.");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("userId", userId);
    formData.append("avatar", avatar);

    // Логування FormData (не всі браузери дозволяють легко вивести FormData, тому вручну)
    console.log("📦 Sending formData:");
    console.log("username:", username);
    console.log("userId:", userId);
    console.log("avatar:", avatar.name, "size:", avatar.size, "type:", avatar.type);
    console.log("API baseURL:", api.defaults.baseURL);

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<SetupProfileResponse>("/users/setup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from /users/setup:", response.data);

      if (response.data.success) {
        console.log("Profile setup successful, redirecting to /chat");
        navigate("/chat");
      } else {
        setError(response.data.message || "Failed to set up profile.");
      }
    } catch (err: any) {
      console.error("❌ Setup profile error:", err);

      let errorMessage = "Failed to set up profile.";
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        errorMessage = err.response.data.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        console.error("No response received:", err.request);
        errorMessage = "No response from server. Check network or server status.";
      } else {
        console.error("Error message:", err.message);
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-bgBase">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Set up your profile</h2>

        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setAvatar(file);
            console.log("Selected file:", file?.name, "size:", file?.size, "type:", file?.type);
          }}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={isLoading}
        />

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Continue to Chat"}
        </button>
      </form>
    </div>
  );
};

export default SetupProfile;