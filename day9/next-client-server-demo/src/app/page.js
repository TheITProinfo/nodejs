//src/app/page.js
// this is a Server Component by default
// home page with a client component inside

import Counter from "@/components/Counter";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Home (Server Component)</h1>
      <p className="text-gray-600">
        This page is rendered on the server by default. The counter below is a Client Component.
      </p>

      <div className="rounded border p-4 space-y-3">
        <h2 className="text-lg font-semibold">Client Component Demo</h2>
        <Counter />
      </div>
    </div>
  );
}
