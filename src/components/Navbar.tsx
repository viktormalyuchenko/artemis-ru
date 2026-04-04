"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Трекер", href: "/" },
    { name: "О миссии", href: "/mission" },
    { name: "Таймлайн", href: "/timeline" },
    { name: "О проекте", href: "/about" },
  ];

  return (
    <nav className="border-b border-slate-800/80 bg-[#02050A]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-950/30 group-hover:border-cyan-400 transition-colors">
            <Rocket size={16} className="text-cyan-400" />
          </div>
          <span className="font-bold tracking-widest text-white uppercase text-sm">
            Artemis Tracker
          </span>
        </Link>

        {/* Ссылки (скрыты на мобилках, можно потом добавить бургер-меню) */}
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors ${isActive ? "text-cyan-400" : "text-slate-500 hover:text-white"}`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
