import "antd/dist/reset.css";
import "../src/index.css";
import { AppProviders } from "../components/AppProviders";

export const metadata = {
  title: "Sweetie Ayman - Shop Now",
  description: "Premium bag marketplace",
  keywords: "bag, handbag, wallet, accessories",
  authors: [{ name: "Sweetie Ayman" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
