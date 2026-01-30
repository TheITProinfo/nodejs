// this is a simple counter component that demonstrates client-server interaction

"use client";
import { useState } from "react";   
export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button
      className="rounded border px-3 py-2 hover:bg-gray-50"
      onClick={() => setLikes(likes + 1)}
    >
       Like {likes}
    </button>
  );
}