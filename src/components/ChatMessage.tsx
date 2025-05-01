import React from "react";

interface ChatMessageProps {
  text: string;
  senderName: string;
  avatarUrl?: string;
  isOwn: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, senderName, avatarUrl, isOwn }) => {
  return (
    <div className={`flex items-start gap-2 mb-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <img
          src={avatarUrl || "/default-avatar.png"} // fallback аватарка
          alt={senderName}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      <div className="max-w-xs bg-white shadow-md rounded-lg px-4 py-2">
        <p className="text-sm font-semibold text-gray-800 mb-1">{senderName}</p>
        <p className="text-gray-900 text-sm">{text}</p>
      </div>

      {isOwn && (
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt={senderName}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
    </div>
  );
};

export default ChatMessage;