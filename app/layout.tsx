import type { Metadata } from "next";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "2026 하계수양회 응모 2 | 추억 전시관",
  description:
    "하계수양회에서의 소중했던 추억을 사진과 짧은 설명으로 나누는 모바일 응모 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
