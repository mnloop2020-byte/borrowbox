import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import type { ReactElement, ReactNode } from "react";
import { BorrowListHydration } from "../features/borrow-list/BorrowListHydration.tsx";
import { getItemIds } from "../features/cards/itemsApi.ts";
import { Footer } from "../features/site/Footer.tsx";
import { Navbar } from "../features/site/Navbar.tsx";
import { getCurrentUser } from "../features/users/currentUser.ts";
import { getI18n } from "../shared/i18n/serverI18n.ts";
import { Toasts } from "../shared/ui/Toasts.tsx";
import "../style.css";

// Inter for Latin text, Tajawal for Arabic. next/font serves them from this
// site, and style.css uses them through --font-inter and --font-tajawal.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("title.home"), icons: "/favicon.svg" };
}

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * The frame around every page: Navbar, the page in <main>, Footer and the
 * toasts. The server knows the language (cookie), so <html lang dir> is
 * right from the first byte, with no flash of English or left-to-right.
 */
export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<ReactElement> {
  const { lang } = await getI18n();
  const currentUser = await getCurrentUser();
  // Not awaited: the Navbar count waits for it inside Suspense, so a slow
  // API never holds up the page
  const itemIds = getItemIds();

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${tajawal.variable}`}
    >
      <body>
        <div id="app">
          {/* The sticky wrapper (style.css, #nav-mount) */}
          <div id="nav-mount">
            <Navbar lang={lang} currentUser={currentUser} itemIds={itemIds} />
          </div>
          <main id="main-content" className="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
        <Toasts />
        <BorrowListHydration />
      </body>
    </html>
  );
}
