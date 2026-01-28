import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Home Page
        <p> 
      Cstcollege 
     </p>
       
      </h1>

      <nav style={{ marginTop: "1rem" }}>
        <ul>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contactus">Contact Us</Link></li>
        </ul>
      </nav>
    </main>
  );
}
