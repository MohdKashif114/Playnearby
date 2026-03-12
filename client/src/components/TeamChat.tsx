import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { socket } from "../socket/socket";
import { Send, Hash } from "lucide-react";

type Message = {
  id: string;
  sender: string;
  text: string;
  name: string;
};

export default function TeamChat() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "Rahul", text: "Hey team 👋", name: "Rahul" },
    { id: "2", sender: user.id, text: "Ready to play today?", name: "You" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchmessage = async () => {
      try {
        const res = await fetch(`http://localhost:5000/messages/${teamId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setMessages(
          data.map((m: any) => ({
            id: m._id,
            sender: m.sender,
            text: m.text,
            name: m.name,
          }))
        );
      } catch (err) {
        console.log("some error occured while fetching messages", err);
      }
    };
    fetchmessage();
  }, [teamId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-message", teamId, message, user.name);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive-message", ({ userId, message, time, name }) => {
      setMessages((prev) => [
        ...prev,
        { id: time.toString(), sender: userId, text: message, name },
      ]);
    });
    setMessage("");
    return () => { socket.off("receive-message"); };
  }, []);

  // Generate a consistent color from a name
  const nameColor = (name: string) => {
    const colors = [
      "text-violet-400", "text-fuchsia-400", "text-cyan-400",
      "text-emerald-400", "text-amber-400", "text-rose-400", "text-blue-400",
    ];
    const i = (name?.charCodeAt(0) ?? 0) % colors.length;
    return colors[i];
  };

  // Initials avatar
  const Avatar = ({ name }: { name: string }) => {
    const hue = (name?.charCodeAt(0) ?? 65) * 5 % 360;
    return (
      <div
        className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
        style={{ background: `hsl(${hue}, 55%, 38%)` }}
      >
        {name?.slice(0, 2).toUpperCase() ?? "??"}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-full text-gray-100 h-screen"
      style={{
        background: "linear-gradient(160deg, #0f1117 0%, #131720 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
          <Hash className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-100 leading-tight">Team Chat</h1>
          <p className="text-xs text-gray-600 font-mono">{teamId}</p>
        </div>
        {/* live indicator */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.4)]" />
          <span className="text-xs text-gray-500">live</span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((msg, i) => {
          const isMe = msg.sender === user.id;
          const prevSame = i > 0 && messages[i - 1].sender === msg.sender;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar — only show when sender changes */}
              <div className="w-7 flex-shrink-0">
                {!prevSame && !isMe && <Avatar name={msg.name} />}
              </div>

              <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                {/* Name label */}
                {!prevSame && (
                  <span className={`text-[11px] font-semibold px-1 ${isMe ? "text-violet-400" : nameColor(msg.name)}`}>
                    {isMe ? "You" : msg.name}
                  </span>
                )}

                {/* Bubble */}
                <div
                  className={`px-3.5 py-2 text-sm leading-relaxed ${
                    isMe
                      ? "rounded-2xl rounded-br-sm text-white"
                      : "rounded-2xl rounded-bl-sm text-gray-200"
                  }`}
                  style={
                    isMe
                      ? {
                          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                          boxShadow: "0 2px 12px rgba(124,58,237,0.25)",
                        }
                      : {
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }
                  }
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex items-center gap-2 rounded-2xl px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <input
            type="text"
            placeholder="Send a message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: message.trim()
                ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                : "rgba(255,255,255,0.05)",
            }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
