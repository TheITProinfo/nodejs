// remove default layout, as we have our own layout in src/app/layout.js
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Real Blog",
  description: "Next.js + Supabase + Prisma real blog demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
