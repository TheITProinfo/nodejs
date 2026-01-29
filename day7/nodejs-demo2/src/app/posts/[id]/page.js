// this page shows details of a specific post based on the id parameter
// import necessary modules
// Sample posts data
// src/app/posts/[id]/page.js
//src/app/posts/data.js
// Sample posts data
// simple data module to be imported in other files
// the data shoulld be fetched from  the database in real applications
//import simlated data from data.js
//import { posts } from "../data.js";

// const posts = [
//   { id: 1, title: "First Post", content: "This is the content of the first post." },
//   { id: 2, title: "Second Post", content: "This is the content of the second post." },
//   { id: 3, title: "Third Post", content: "This is the content of the third post." },
//   { id: 4, title: "Fourth Post", content: "This is the content of the fourth post." },
//   { id: 5, title: "Fifth Post", content: "This is the content of the fifth post." },
// ];

export default async  function PostDetailsPage({ params }) {
  const { id } = await params;          // ✅ 解包 params
  //const postId = Number(id);
 
  // fetch the data from the simulated API by id
   const res = await fetch(`http://localhost:3000/api/posts/${id}`,{


    cache:'no-store',  //to avoid caching and always fetch fresh data
  } );
 
 
    //const postId = Number(params.id);
  // const post = posts.find(p => p.id === postId);

  if (!res.ok) {
    return (
      <div align="center" style={{ padding: "2rem" }}>
        <h1>Post Not Found</h1>
        <p>The post you are looking for does not exist.</p>
      </div>
    );
  }
const post = await res.json();
  return (
    <div align="center" style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
