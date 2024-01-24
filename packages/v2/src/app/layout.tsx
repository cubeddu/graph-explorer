import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@cloudscape-design/global-styles/index.css";
import { Theme, applyTheme } from "@cloudscape-design/components/theming";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Graph Explorer",
  description:
    "React-based web application that enables users to visualize both property graph and RDF data and explore connections between data without having to write graph queries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
