// src/app/posts/[id]/page.js
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";

async function getPost(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export default async function PostDetailPage({ params }) {
   const { id } = await params;    // 
  const post = await getPost(id);  // alwasy  make mistake of params.id

  if (!post) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Post #{post.id}</h1>

      <div className="rounded border p-4 space-y-2">
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="text-gray-700">{post.body}</p>
      </div>

      <div className="rounded border p-4 space-y-2">
        <h2 className="text-lg font-semibold">Client Interaction</h2>
        <p className="text-gray-600">
          Like button is a Client Component; the post content is rendered by the Server Component.
        </p>
        <LikeButton />
      </div>
    </div>
  );
}
