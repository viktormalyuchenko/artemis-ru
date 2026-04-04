import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    icon: "https://www.nasa.gov/wp-content/themes/nasa/assets/images/nasa-logo.svg", // Можешь заменить на свою иконку
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
