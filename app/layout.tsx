import "@fontsource-variable/manrope";
import "./globals.css";
export const metadata = { title: "NameSketch — Portraits, written by you", description: "Turn a photograph into typographic art, privately in your browser." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
