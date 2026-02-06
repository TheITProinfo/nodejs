// this server  component is used across multiple pages
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Real Blog
        </Link>

        <nav className="flex gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/posts" className="hover:underline">Posts</Link>
          <Link href="/posts/new" className="hover:underline">New</Link>
        </nav>
      </div>
    </header>
  );
}
