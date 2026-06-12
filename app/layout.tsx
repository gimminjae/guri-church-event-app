import type { Metadata } from "next";
import { FirebaseAnalytics } from "@/components/firebase-analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "구리교회 추억 전시관",
  description: "행사 추억을 사진과 함께 업로드하고 모두의 이야기를 함께 보는 모바일 전시관",
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
