// this is  clietn component for like button

"use client";

import { useTransition } from "react";

export default function LikeButton({ postId, initialLikes }) {
  const [isPending, startTransition] = useTransition();

  async function like() {
    startTransition(async () => {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      // 简化：刷新页面拿最新 likes（教学直观）
      window.location.reload();
    });
  }

  return (
    <button
      className="rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
      onClick={like}
      disabled={isPending}
    >
      👍 Like {initialLikes}
    </button>
  );
}
