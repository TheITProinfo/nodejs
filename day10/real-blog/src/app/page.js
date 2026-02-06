// src/app/page.js
// removed default content page, as we have our own page in src/app/page.js
import Link from "next/link";
import Counter from "../components/Counter";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome 👋</h1>
      <p className="text-gray-700">
        This is a real Blog demo: Supabase Postgres + Prisma + Next.js App Router (JS).
      </p>

      <div className="rounded border p-4 space-y-2">
        <div className="font-medium">Client Component Demo (Counter)</div>
        <Counter />
      </div>

      <Link
        className="inline-block rounded bg-black px-4 py-2 text-sm text-white hover:opacity-90"
        href="/posts"
      >
        View Posts
      </Link>
    </section>
  );
}
