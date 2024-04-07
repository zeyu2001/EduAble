import { Inter } from "next/font/google";
import "./globals.css";
import Theme from './themeProvider'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduAble",
  description: "STEM for all",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
