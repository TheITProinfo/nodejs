import Link from "next/link";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
          <Link href="/">Home</Link> |{" "}
          <Link href="/about">About</Link> |{" "}
          <Link href="/contactus">Contact Us</Link>
          <Link href="/help" style={{ marginLeft: 8 }}>Help</Link>
         <Link href="/posts" style={{ marginLeft: 8 }}>Posts</Link>


        </nav>
        {children}
      </body>
    </html>
  );
}
