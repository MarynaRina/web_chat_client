import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { socket } from "../socket";

interface Message {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  avatarUrl: string;
  timestamp: string;
}

interface UserProfile {
  username: string;
  avatarUrl: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !userId) {
      navigate("/");
      return;
    }

    // Отримати профіль користувача
    axios
      .get<UserProfile>(`/api/users/${userId}`)
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile. Please set up your profile.");
        navigate("/setup-profile");
      });
  }, [userId, navigate]);

  useEffect(() => {
    if (!profile || !userId) return;

    socket.connect();

    socket.emit("join", {
      userId,
      phone: localStorage.getItem("phone") || "Unknown",
    });

    socket.on("chat_history", (history: Message[]) => {
      setMessages(history);
    });

    socket.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [profile, userId]);

  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !profile || !userId) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: message,
      sender: userId,
      senderName: profile.username,
      avatarUrl: profile.avatarUrl,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  if (!profile) {
    return (
      <div className="p-4 text-center text-gray-600">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          "Loading profile..."
        )}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <div className="space-y-2 mb-4 max-h-[60vh] overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 rounded p-2 ${
              m.sender === userId ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            {m.avatarUrl && (
              <img
                src={m.avatarUrl}
                alt={`${m.senderName}'s avatar`}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <div className="text-sm font-bold">{m.senderName}</div>
              <div className="text-sm">{m.text}</div>
              <div className="text-xs text-gray-500">
                {new Date(m.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;