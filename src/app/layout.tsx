import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth"; // <-- Auth'u buraya ekle

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ziraat Otomasyon",
  description: "Bitirme Tezi Projesi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Kullanıcı bilgisini burada (Sunucuda) çekiyoruz
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="tr">
      <body className={inter.className}>
        {/* Kullanıcı bilgisini Navbar'a "prop" olarak gönderiyoruz */}
        <Navbar user={user} />
        
        <main className="min-h-screen bg-gray-50 pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}