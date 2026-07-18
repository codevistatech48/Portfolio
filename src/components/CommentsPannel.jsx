import { useState } from "react";
import { Send, User, Shield } from "lucide-react";

export default function CommentsPanel({
  comments = [],
  onSend,
  saving = false,
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1225]">

      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-xl font-semibold text-white">
          Discussion
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Discuss this revision with the client.
        </p>
      </div>

      {/* Messages */}

      <div className="max-h-[500px] space-y-5 overflow-y-auto p-6">

        {comments.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-slate-500">
            No discussion yet.
          </div>
        )}

        {comments.map((comment, index) => (
          <div
            key={index}
            className={`flex ${
              comment.role === "admin"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-lg rounded-2xl px-5 py-4 ${
                comment.role === "admin"
                  ? "bg-violet-600 text-white"
                  : "bg-[#151D35] text-slate-200"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">

                {comment.role === "admin" ? (
                  <Shield size={16} />
                ) : (
                  <User size={16} />
                )}

                {comment.role}

              </div>

              <p className="whitespace-pre-wrap text-sm leading-7">
                {comment.message}
              </p>

              <div className="mt-3 text-xs opacity-70">
                {new Date(
                  comment.createdAt
                ).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}

      <div className="border-t border-white/10 p-6">

        <textarea
          rows={4}
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Write a comment..."
          className="w-full rounded-xl border border-white/10 bg-[#151D35] p-4 text-white outline-none focus:border-violet-500"
        />

        <button
          onClick={handleSend}
          disabled={saving}
          className="mt-4 flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-white transition hover:bg-violet-700"
        >
          <Send size={18} />

          Send Comment
        </button>

      </div>
    </div>
  );
}