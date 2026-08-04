import "./globals.css";

export const metadata = {
  title: "Aniket Patil — Portfolio",
  description:
    "Passionate Computer Science & Engineering student with a strong interest in AI, Web Development, and Database systems.",
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
