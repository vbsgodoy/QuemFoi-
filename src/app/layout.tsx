import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuemFoi? · Amigo secreto",
  description: "Organize amigos secretos com sorteio, regras, lista de desejos e mensagens anônimas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
