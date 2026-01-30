import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Client vs Server Demo",
  description: "Next.js App Router demo (JS)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-6">
         
          {children}
          
          </main>
      </body>
    </html>
  );
}
