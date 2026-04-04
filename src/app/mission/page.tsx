import Link from "next/link";

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-[#02050A] text-white font-sans selection:bg-cyan-500/30 pb-24">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 relative z-10 pt-16">
        {/* Заголовок */}
        <div className="text-center mb-12">
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
          <h1 className="text-4xl md:text-5xl font-black tracking-widest text-cyan-400 uppercase mb-4">
            Миссия Artemis II
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Возвращение человечества к исследованию Луны
          </p>
        </div>

        {/* 4 Карточки Статистики */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { val: "10", label: "ДНЕЙ" },
            { val: "4", label: "АСТРОНАВТА" },
            { val: "2.1М", label: "КИЛОМЕТРОВ" },
            { val: "50+", label: "ЛЕТ СПУСТЯ" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0a1120] rounded-xl border border-slate-800/60 p-6 text-center"
            >
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                {stat.val}
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-12">
          {/* Обзор миссии */}
          <section>
            <h2 className="text-xl font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800/60 pb-4">
              Обзор миссии
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              <strong>Artemis II</strong> знаменует собой историческую веху в
              освоении космоса человеком, поскольку это первая пилотируемая
              миссия НАСА за пределы низкой околоземной орбиты со времен
              Аполлона-17 в декабре 1972 года. Во время этого новаторского
              10-дневного путешествия четверо астронавтов отправятся по
              траектории вокруг Луны.
            </p>
            <div className="bg-[#0a1120] border-l-4 border-cyan-500 p-6 rounded-r-xl mt-6">
              <p className="text-sm text-slate-300">
                <strong className="text-white">Значимость миссии:</strong>{" "}
                Artemis II — важнейший испытательный полигон для обеспечения
                устойчивого освоения Луны. Каждая система, процедура и
                технология, протестированная в этом полете, напрямую
                обеспечивает создание лунной базы Artemis III и закладывает
                основу для постоянного присутствия человека на Луне и вокруг
                нее.
              </p>
            </div>
          </section>

          {/* Космический корабль Orion */}
          <section>
            <h2 className="text-xl font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800/60 pb-4">
              Космический корабль Orion
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Многоцелевой пилотируемый корабль Orion — это капсула нового
              поколения НАСА для исследования дальнего космоса, спроектированная
              с нуля для миссий за пределы земной орбиты.
            </p>

            <h3 className="text-white font-bold mb-4">
              Модуль экипажа (CM-002)
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400 mb-8 pl-4">
              <li>
                <strong className="text-white">Диаметр:</strong> 5 метров —
                просторнее, чем Аполлон
              </li>
              <li>
                <strong className="text-white">Обитаемый объем:</strong> 8.9
                кубических метров (на 20% больше Аполлона)
              </li>
              <li>
                <strong className="text-white">Тепловой щит:</strong> Крупнейший
                из когда-либо созданных — выдерживает температуру 2 760°C
              </li>
              <li>
                <strong className="text-white">Системы:</strong> Продвинутая
                авионика, сенсорные дисплеи, системы жизнеобеспечения на 21 день
              </li>
            </ul>

            <h3 className="text-white font-bold mb-4">
              Европейский служебный модуль (ESM-2)
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Служебный модуль, созданный Европейским космическим агентством
              (ESA) и Airbus Defence and Space, обеспечивает корабль всеми
              расходными материалами и тягой.
            </p>
            <ul className="flex flex-col gap-3 text-sm text-slate-400 pl-4">
              <li>
                <strong className="text-white">Главный двигатель:</strong>{" "}
                Двигатель AJ10 (использовался в программе Space Shuttle)
              </li>
              <li>
                <strong className="text-white">Солнечные панели:</strong> Четыре
                7-метровых крыла, генерирующих 11.2 кВт энергии
              </li>
              <li>
                <strong className="text-white">Жизнеобеспечение:</strong>{" "}
                Кислород, азот, вода, терморегуляция и системы удаления CO2
              </li>
            </ul>
          </section>

          {/* Главные цели миссии */}
          <section>
            <h2 className="text-xl font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800/60 pb-4">
              Главные цели миссии
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-bold mb-3">
                  1. Проверка систем экипажа
                </h3>
                <ul className="list-disc list-inside text-sm text-slate-400 pl-4 space-y-2">
                  <li>
                    Демонстрация работы Системы жизнеобеспечения (ECLSS) с
                    экипажем на борту
                  </li>
                  <li>Проверка генерации кислорода и удаления CO2</li>
                  <li>
                    Оценка пригодности для жизни, эргономики и рабочей нагрузки
                    в замкнутом пространстве
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-3">
                  2. Операции в дальнем космосе
                </h3>
                <ul className="list-disc list-inside text-sm text-slate-400 pl-4 space-y-2">
                  <li>
                    Проверка систем навигации и управления на лунных расстояниях
                  </li>
                  <li>
                    Тестирование возможностей сети дальней космической связи
                    (DSN)
                  </li>
                  <li>Проверка алгоритмов орбитальной механики</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Историческая значимость */}
          <section>
            <h2 className="text-xl font-black text-cyan-400 uppercase tracking-widest mb-6 border-b border-slate-800/60 pb-4">
              Историческая значимость
            </h2>
            <ul className="flex flex-col gap-4 text-sm text-slate-400">
              <li className="flex gap-3">
                <span className="text-cyan-500">→</span>
                <div>
                  <strong className="text-white">
                    Первая пилотируемая миссия за пределы НОО с 1972 года
                  </strong>{" "}
                  — спустя более 53 лет
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500">→</span>
                <div>
                  <strong className="text-white">
                    Первая женщина за пределами НОО
                  </strong>{" "}
                  (Кристина Кох)
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500">→</span>
                <div>
                  <strong className="text-white">
                    Первый темнокожий астронавт в дальнем космосе
                  </strong>{" "}
                  (Виктор Гловер)
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500">→</span>
                <div>
                  <strong className="text-white">
                    Люди улетят дальше, чем когда-либо в истории
                  </strong>{" "}
                  — побив рекорд Аполлона-13
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
