//src/app/posts/page.js

//import Link from "next/link";
import Link from "next/link";

async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    //避免缓存带来的“怎么不更新”疑问
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Posts (Server fetch)</h1>
      <p className="text-gray-600">
        This page fetches data on the server and renders a list.
      </p>

      <ul className="space-y-2">
        {posts.slice(0, 10).map((p) => (
          <li key={p.id} className="rounded border p-3 hover:bg-gray-50">
            <Link className="font-medium hover:underline" href={`/posts/${p.id}`}>
              {p.id}. {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
