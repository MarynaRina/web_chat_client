import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios"; // тут беремо готовий API обʼєкт

interface SetupProfileResponse {
  success: boolean;
  avatarUrl?: string;
}

const SetupProfile: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");

  if (!userId) {
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
    formData.append("avatar", avatar);
    formData.append("userId", userId);

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post<SetupProfileResponse>(
        "/api/users/setup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        navigate("/chat");
      } else {
        setError("Failed to set up profile. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to setup profile", err);
      if (err.response?.status === 404) {
        setError(
          "API endpoint not found. Please check the server configuration."
        );
      } else if (err.response?.status === 400) {
        setError("Invalid request. Please provide all required fields.");
      } else {
        setError("Something went wrong. Please try again.");
      }
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
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
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