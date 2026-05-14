import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { cookies } from "next/headers";
import type { Lang } from "@/lib/i18n";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "AI Nav — AI工具导航与深度评测", template: "%s | AI Nav" },
  description: "110+ 篇 AI 工具深度评测，涵盖写作、编程、图像、视频等12大类别，每周持续更新。",
  keywords: ["AI工具", "AI评测", "人工智能", "ChatGPT", "Claude", "Gemini"],
  authors: [{ name: "AI Nav" }],
  openGraph: {
    type: "website",
    siteName: "AI Nav",
    locale: "zh_CN",
  },
  metadataBase: new URL("https://ai-nav.vercel.app"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("ai_nav_lang")?.value;
  const initialLang: Lang = langCookie === "en" ? "en" : "zh";

  return (
    <html lang={initialLang === "zh" ? "zh-CN" : "en"} className={geistSans.variable}>
      <head>
        {/* Google Consent Mode v2 — MUST run before AdSense */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
(function(){var c=localStorage.getItem('ai_nav_consent');if(c==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}})();
            `.trim(),
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2135743677328012"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <LanguageProvider initialLang={initialLang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
