//app/layout.tsx
import "./globals.css";


export const metadata = {
  title: "WDD 430",
  description: "Learning Activities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
