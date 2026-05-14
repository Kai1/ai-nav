// This file exists only to prevent the Next.js scaffold from shadowing
// app/(site)/page.tsx. It wraps the real homepage with the site layout.
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import SitePage from "./(site)/page";

export { metadata } from "./(site)/page";

export default function RootPage() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <SitePage />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
