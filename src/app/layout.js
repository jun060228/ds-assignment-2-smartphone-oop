import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "스마트폰 OOP 시각화 | 자료구조 과제 2",
  description:
    "OOP 상속 구조와 다형성을 인터랙티브하게 시각화하는 웹 애플리케이션",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
