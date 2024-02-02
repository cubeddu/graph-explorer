import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@cloudscape-design/global-styles/index.css";
import { Toaster } from "react-hot-toast";
import StoreProvider from "./StoreProvider";
import ConnectedProvider from "@/app/core/ConnectedProvider";
import { grabConfig } from "./actions/graphExplorer/grabConfig";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Graph Explorer",
  description:
    "React-based web application that enables users to visualize both property graph and RDF data and explore connections between data without having to write graph queries.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await grabConfig(); // Fetch configuration on the server
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConnectedProvider config={config}>
          {children}
          <Toaster />
        </ConnectedProvider>
      </body>
    </html>
  );
}
