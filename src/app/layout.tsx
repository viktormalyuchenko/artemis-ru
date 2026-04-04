import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Artemis II Tracker | Трекер миссии в реальном времени",
  description:
    "Отслеживайте первый пилотируемый полет к Луне за 50 лет (Artemis II). Интерактивная 3D-модель, телеметрия NASA JPL в реальном времени, скорость, расстояние и таймлайн миссии.",
  keywords:
    "Artemis II, NASA, космос, полет на луну, Орион, трекер миссии, 3D симуляция, телеметрия",
  authors: [{ name: "Viktoor" }],
  openGraph: {
    title: "Artemis II Tracker | Прямой эфир",
    description: "Следите за полетом корабля Orion к Луне в реальном времени.",
    type: "website",
    locale: "ru_RU",
    siteName: "Artemis II Mission Tracker",
  },
  icons: {
    icon: "https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg",
  },
  // ВСТАВЛЯЕМ ВЕРИФИКАЦИЮ YANDEX И GOOGLE СЮДА:
  verification: {
    google: "Ihz5Cd5vkNkVuh36pZjbyhECtbKBY5oZu7pMs4t5kXU",
    yandex: "87b7d6e4f4b9cfc5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Navbar />
        {children}

        {/* YANDEX METRIKA SCRIPT */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=108391355', 'ym');

            ym(108391355, 'init', {
              ssr:true, 
              webvisor:true, 
              clickmap:true, 
              ecommerce:"dataLayer", 
              referrer: document.referrer, 
              url: location.href, 
              accurateTrackBounce:true, 
              trackLinks:true
            });
          `}
        </Script>

        {/* YANDEX METRIKA NOSCRIPT */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/108391355"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
