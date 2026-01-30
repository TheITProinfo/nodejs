// this is a client component

"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-3">
      <button
        className="rounded border px-3 py-2 hover:bg-gray-50"
        onClick={() => setCount(count + 1)}
      >
        +1
      </button>
      <span className="font-medium text-red-500">Count: {count}</span>
    </div>
  );
}