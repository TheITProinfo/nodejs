// this is clietn component for counter
"use client";
import { useState } from "react";

export default function Counter() {
  const [n, setN] = useState(0);

  return (
    <div className="flex items-center gap-2">
      <button className="rounded border px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setN(n - 1)}>
        -
      </button>
      <span className="min-w-[48px] text-center font-medium">{n}</span>
      <button className="rounded border px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setN(n + 1)}>
        +
      </button>
      <button className="rounded border px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setN(0)}>
        Reset
      </button>
    </div>
  );
}
