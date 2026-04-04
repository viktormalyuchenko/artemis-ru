import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#02050A] text-white font-sans selection:bg-cyan-500/30 pb-20">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 relative z-10 pt-16">
        {/* Шапка страницы */}
        <div className="text-center mb-16">
          <div className="flex justify-center gap-4 mb-8">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest px-4 py-2 border border-slate-700 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              ← Назад в трекер
            </Link>
            <button className="text-[10px] uppercase tracking-widest px-4 py-2 border border-cyan-800 bg-cyan-950/30 rounded text-cyan-400">
              Info Hub
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-widest text-cyan-400 uppercase mb-4">
            О проекте Artemis Tracker
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Центр управления для энтузиастов космоса
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Блок 1 */}
          <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-8">
            <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800/60 pb-4">
              Что такое Artemis Tracker?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              artemis.viktoor.ru — это веб-приложение для отслеживания миссии
              NASA Artemis II в реальном времени. Этот интерактивный проект
              переносит захватывающий опыт исследования Луны прямо в ваш браузер
              благодаря 3D-визуализации, живому таймеру и исчерпывающей
              информации о миссии.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Независимо от того, являетесь ли вы космическим энтузиастом,
              преподавателем или просто интересуетесь возвращением человечества
              на Луну, наш трекер предоставляет захватывающий способ следить за
              этой исторической миссией от старта до приводнения.
            </p>
          </div>

          {/* Блок 2: Фичи */}
          <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-8">
            <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800/60 pb-4">
              Особенности
            </h2>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              {[
                {
                  title: "Живой отсчет",
                  desc: "Отслеживание каждой секунды до запуска Artemis II",
                },
                {
                  title: "3D Визуализация",
                  desc: "Интерактивная траектория Земля-Луна-Орион с использованием WebGL",
                },
                {
                  title: "Таймлайн миссии",
                  desc: "Машина времени по всему 10-дневному полету с ключевыми точками",
                },
                {
                  title: "Данные экипажа",
                  desc: "Подробные биографии всех четырех астронавтов",
                },
                {
                  title: "Детали корабля",
                  desc: "Технические характеристики и интерактивные схемы",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-cyan-500 mt-1">→</span>
                  <div>
                    <strong className="text-white">{item.title}</strong> -{" "}
                    {item.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Блок 3: Технологии */}
          <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-8">
            <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800/60 pb-4">
              Технологии
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Artemis Tracker создан с использованием современных
              веб-технологий:
            </p>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              {[
                {
                  title: "Next.js & React",
                  desc: "Серверный рендеринг и компонентная архитектура",
                },
                {
                  title: "Three.js (WebGL)",
                  desc: "3D графика и рендеринг в реальном времени",
                },
                {
                  title: "Tailwind CSS",
                  desc: "Стилизация, эффекты размытия и космическая эстетика",
                },
                {
                  title: "NASA JPL API",
                  desc: "Официальная эфемеридная телеметрия (Horizons System)",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-cyan-500 mt-1">→</span>
                  <div>
                    <strong className="text-white">{item.title}</strong> -{" "}
                    {item.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
