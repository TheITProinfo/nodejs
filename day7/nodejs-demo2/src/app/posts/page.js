import Link from "next/link";
//import { posts } from "./data.js";
// Sample posts data
// list all posts with links to their individual pages
// const posts = [
//   { id: 1, title: "First Post" },
//   { id: 2, title: "Second Post" },
//   { id: 3, title: "Third Post" },
//     { id: 4, title: "Fourth Post" },
//   { id: 5, title: "Fifth Post" },
// ];

//get the data from the simluated API
const post=await fetch('http://localhost:3000/api/posts');  
const posts=await post.json();

export default function PostsPage() {
  return (
    <div align="center" style={{ padding: "2rem" }}>
      <h1>Posts Page</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}