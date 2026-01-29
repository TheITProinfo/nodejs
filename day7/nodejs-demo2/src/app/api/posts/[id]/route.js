//src/api/posts/[id]/route.js
const posts = [
  { id: 1, title: "First Post", content: "This is the content of the first post." },
  { id: 2, title: "Second Post", content: "This is the content of the second post." },
  { id: 3, title: "Third Post", content: "This is the content of the third post." },
  { id: 4, title: "Fourth Post", content: "This is the content of the fourth post." },
  { id: 5, title: "Fifth Post", content: "This is the content of the fifth post." },
];

export async function GET(request, { params }) {
  // 兼容你当前 Next 的 “params 是 Promise” 行为
  const { id } = await params;

  const postId = Number(id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return Response.json({ message: "Post not found" }, { status: 404 });
  }

  return Response.json(post);
}
