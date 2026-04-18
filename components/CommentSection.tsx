"use client";

import { useState } from "react";
import { Turnstile } from "react-turnstile";
import { addComment } from "@/lib/actions/comment";
import { MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CommentSectionProps {
  skinId: string;
  comments: any[];
  initialUserName?: string;
}

export function CommentSection({ skinId, comments, initialUserName }: CommentSectionProps) {
  const [name, setName] = useState(initialUserName || "");
  const [content, setContent] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Name is required");
    if (!token) return setError("Please complete the security check");
    if (!content.trim()) return setError("Comment cannot be empty");

    setLoading(true);
    setError("");

    const result = await addComment({
      skinId,
      userName: name.trim(),
      userImage: "",
      content,
      token,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setContent("");
      setToken("");
      setLoading(false);
      setName("");
    }
  };

  return (
    <div className="mt-12 pt-12 border-t border-white/5">
      <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
        <MessageSquare className="text-brand-accent" />
        Engagement Section ({comments.length})
      </h3>

      {/* Comment List */}
      <div className="space-y-6 mb-12">
        {comments.length === 0 ? (
          <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
            <p className="text-gray-500 text-sm">No transmissions yet. Be the first to engage.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="flex-shrink-0">
                {comment.userImage ? (
                  <Image 
                    src={comment.userImage} 
                    alt={comment.userName} 
                    width={40} 
                    height={40} 
                    className="rounded-full border border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-onyx border border-white/10 flex items-center justify-center text-brand-accent font-bold">
                    {comment.userName[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-200">{comment.userName}</span>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="p-4 bg-brand-onyx/50 border border-white/5 rounded-2xl rounded-tl-none group-hover:border-brand-accent/20 transition-colors">
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-brand-onyx rounded-3xl p-6 lg:p-8 border border-white/5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Identity</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl px-5 py-3 text-gray-200 placeholder-gray-600 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Transmission Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Deploy your thoughts..."
              rows={3}
              className="w-full bg-brand-dark border border-white/5 focus:border-brand-accent/50 rounded-2xl p-4 text-gray-200 placeholder-gray-600 outline-none transition-all resize-none"
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="scale-75 md:scale-90 origin-left">
              <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                onVerify={(token) => setToken(token)}
              />
            </div>

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading || !token || !content.trim() || !name.trim()}
              className={cn(
                "w-full md:w-auto px-8 py-3 rounded-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs transition-all",
                loading || !token || !content.trim() || !name.trim()
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-brand-accent text-brand-dark hover:bg-white active:scale-95"
              )}
            >
              {loading ? "Transmitting..." : "Post Transmission"}
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
