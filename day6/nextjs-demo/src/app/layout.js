import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Next.js Demo",
  description: "Demo site with Navbar (App Router)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={styles.header}>
          <nav style={styles.nav}>
            <Link href="/" style={styles.link}>Home</Link>
            <Link href="/about" style={styles.link}>About</Link>
            <Link href="/contactus" style={styles.link}>Contact Us</Link>
          </nav>
        </header>

        <main style={styles.main}>{children}</main>

        <footer style={styles.footer}>
          <small>© {new Date().getFullYear()} Next.js Demo</small>
        </footer>
      </body>
    </html>
  );
}

const styles = {
  header: {
    padding: "1rem 2rem",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    background: "var(--background)",
    zIndex: 10,
  },
  nav: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    fontWeight: 600,
    color: "var(--foreground)",
  },
  main: {
    padding: "2rem",
    minHeight: "70vh",
  },
  footer: {
    padding: "1rem 2rem",
    borderTop: "1px solid #ddd",
  },
};
