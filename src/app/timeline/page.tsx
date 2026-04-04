import Link from "next/link";

export default function TimelinePage() {
  const timelineData = [
    {
      phase: "Фаза запуска",
      time: "T-0 ДО T+24 ЧАСОВ",
      events: [
        {
          t: "T-0",
          title: "Старт (Liftoff)",
          loc: "Космический центр Кеннеди, Стартовый комплекс 39B",
          desc: "Ракета SLS зажигает четыре двигателя RS-25 и два твердотопливных ускорителя, генерируя 39.1 млн Ньютонов тяги. Орион начинает свое путешествие к Луне.",
        },
        {
          t: "T+2 МИН",
          title: "Отделение ускорителей",
          desc: "Два твердотопливных ускорителя отделяются и падают в Атлантический океан после обеспечения начальной тяги.",
        },
        {
          t: "T+8 МИН",
          title: "Отделение центрального блока",
          desc: "Главная ступень SLS отделяется. Управление берет на себя верхняя ступень ICPS (Interim Cryogenic Propulsion Stage).",
        },
        {
          t: "T+18 МИН",
          title: "Выход на низкую околоземную орбиту",
          desc: "Орион достигает НОО (высота ~300 км). Экипаж проводит проверку систем и готовится к транслунному импульсу.",
        },
        {
          t: "T+24 ЧАСА",
          title: "Транслунный импульс (TLI)",
          desc: "Критическое включение двигателей: ICPS разгоняет Орион в сторону Луны. Орион покидает орбиту Земли. В этот момент миссия начинается по-настоящему.",
        },
      ],
    },
    {
      phase: "Перелет к Луне",
      time: "ДЕНЬ 1 - ДЕНЬ 4",
      events: [
        {
          t: "ДЕНЬ 1",
          title: "Коррекция курса",
          desc: "Европейский служебный модуль выполняет корректирующие включения двигателей. Экипаж обустраивается в корабле.",
        },
        {
          t: "ДЕНЬ 2-3",
          title: "Операции в дальнем космосе",
          desc: "Экипаж тестирует системы Ориона, проводит эксперименты и связывается с Центром управления. Земля становится всё меньше в иллюминаторах.",
        },
        {
          t: "ДЕНЬ 4",
          title: "Приближение к лунному пространству",
          desc: "Орион входит в сферу гравитационного влияния Луны. Экипаж готовится к максимальному сближению.",
        },
      ],
    },
    {
      phase: "Облет Луны",
      time: "ДЕНЬ 4 - ДЕНЬ 5",
      events: [
        {
          t: "ДЕНЬ 4",
          title: "Максимальное сближение с Луной",
          desc: "Высота: ~10 000 км над поверхностью Луны. Орион выполняет гравитационный маневр (рогатку), чтобы оттолкнуться обратно к Земле. В этот момент экипаж улетит от Земли дальше, чем кто-либо со времен Аполлона в 1972 году.",
        },
        {
          t: "ДЕНЬ 5",
          title: "Удаление от Луны",
          desc: "Орион использует гравитацию Луны для ускорения. Экипаж делает исторические фотографии обратной стороны Луны.",
        },
      ],
    },
    {
      phase: "Возвращение",
      time: "ДЕНЬ 5 - ДЕНЬ 10",
      events: [
        {
          t: "ДЕНЬ 5-9",
          title: "Путь домой",
          desc: "Орион летит обратно к Земле по инерции. Экипаж выполняет оставшиеся проверки и готовится к входу в атмосферу.",
        },
        {
          t: "ДЕНЬ 10",
          title: "Отделение служебного модуля",
          desc: "Модуль ESM отделяется от капсулы с экипажем перед входом в атмосферу и сгорает.",
        },
      ],
    },
    {
      phase: "Вход в атмосферу и Посадка",
      time: "ДЕНЬ 10",
      events: [
        {
          t: "ДЕНЬ 10",
          title: "Вход в атмосферу",
          desc: "Скорость: ~40 000 км/ч. Температура щита: ~2 760°C. Орион входит в атмосферу Земли на рекордной для пилотируемых кораблей скорости.",
        },
        {
          t: "ФИНАЛ",
          title: "Выпуск парашютов",
          desc: "Три главных парашюта раскрываются, замедляя Орион до ~32 км/ч для безопасного приводнения.",
        },
        {
          t: "УСПЕХ",
          title: "Приводнение в Тихом океане",
          desc: "Капсула приводняется у берегов Калифорнии. Спасательные корабли ВМС США забирают экипаж. Миссия завершена!",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#02050A] text-white font-sans selection:bg-cyan-500/30 pb-24">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 relative z-10 pt-16">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-4 mb-8">
            <Link
              href="/"
              className="text-[10px] uppercase tracking-widest px-4 py-2 border border-slate-700 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              ← В трекер
            </Link>
            <button className="text-[10px] uppercase tracking-widest px-4 py-2 border border-cyan-800 bg-cyan-950/30 rounded text-cyan-400">
              Info Hub
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-widest text-cyan-400 uppercase mb-4">
            Детальный таймлайн миссии
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Полный профиль миссии от старта до посадки
          </p>
        </div>

        {/* 4 Карточки Статистики */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { val: "~10 Дней", label: "ДЛИТЕЛЬНОСТЬ" },
            { val: "4 Чел.", label: "АСТРОНАВТЫ" },
            { val: "~380 000 км", label: "МАКС. УДАЛЕНИЕ" },
            { val: "Апр 2026", label: "ЗАПУСК" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0a1120] rounded-xl border border-slate-800/60 p-4 text-center flex flex-col justify-center"
            >
              <div className="text-lg font-bold text-cyan-400 mb-1">
                {stat.val}
              </div>
              <div className="text-[8px] text-slate-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Секции Таймлайна */}
        <div className="flex flex-col gap-12">
          {timelineData.map((section, idx) => (
            <section key={idx}>
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-2 mb-6">
                <h2 className="text-xl font-black text-cyan-400 uppercase tracking-widest">
                  {section.phase}
                </h2>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                  {section.time}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {section.events.map((event, eIdx) => (
                  <div
                    key={eIdx}
                    className="bg-[#0a1120] rounded-xl border border-slate-800/60 p-6 flex flex-col md:flex-row gap-4 md:gap-8 hover:border-slate-700 transition-colors"
                  >
                    <div className="md:w-24 shrink-0 font-bold text-cyan-500 text-xs md:text-sm pt-0.5 uppercase tracking-wider">
                      {event.t}
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-2">
                        {event.title}
                      </h3>
                      {event.loc && (
                        <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-wide">
                          Место: {event.loc}
                        </div>
                      )}
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {event.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Следите за миссией в прямом эфире
          </h2>
          <p className="text-sm text-slate-500 mb-8">
            Следите за путешествием Ориона в режиме реального времени на нашем
            3D-трекере.
          </p>
          <Link
            href="/"
            className="inline-block bg-cyan-900/40 border border-cyan-700 text-cyan-400 px-8 py-3 rounded hover:bg-cyan-800 transition-colors uppercase tracking-widest text-xs font-bold"
          >
            Перейти к трекеру
          </Link>
        </div>
      </div>
    </main>
  );
}
