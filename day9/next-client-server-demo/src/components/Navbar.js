// this is a server component

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto max-w-4xl px-4 py-3 flex gap-4">
        <Link className="hover:underline" href="/">Home</Link>
        <Link className="hover:underline" href="/posts">Posts</Link>
      </div>
    </nav>
  );
}