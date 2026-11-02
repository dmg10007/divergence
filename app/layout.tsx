import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Divergence | Alternate History Simulation Game",
  description: "Step into human history's greatest turning points. Change one decision, fracture history.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
