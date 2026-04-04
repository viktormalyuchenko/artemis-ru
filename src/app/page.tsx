"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Rocket,
  Globe,
  CalendarDays,
  CheckCircle2,
  Circle,
  Target,
} from "lucide-react";
import Scene3D from "@/components/Scene3D";
import {
  fetchTrajectoryData,
  getInterpolatedTelemetry,
  MISSION_START,
  MISSION_END,
  TelemetryPoint,
} from "@/lib/api";

const emptyTelemetry: TelemetryPoint = {
  time: 0,
  x: 0,
  y: 0,
  z: 0,
  distance: 0,
  speed: 0,
};

export default function Home() {
  const [trajectoryData, setTrajectoryData] = useState<TelemetryPoint[]>([]);
  const [mounted, setMounted] = useState(false);
  const [moonPos3D, setMoonPos3D] = useState({ x: 384, y: 0, z: 0 });
  const [liveTelemetry, setLiveTelemetry] =
    useState<TelemetryPoint>(emptyTelemetry);
  const [focus, setFocus] = useState("EARTH"); // Удалили WIDE, по умолчанию EARTH
  const [met, setMet] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const [scrubTime, setScrubTime] = useState(MISSION_START);
  const [scrubTelemetry, setScrubTelemetry] =
    useState<TelemetryPoint>(emptyTelemetry);
  const [isLiveScrub, setIsLiveScrub] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    setMounted(true);
    setScrubTime(Date.now());

    fetchTrajectoryData()
      .then((data) => {
        if (isSubscribed && data.length > 0) {
          setTrajectoryData(data);
          let maxPoint = data[0];
          data.forEach((p) => {
            if (p.distance > maxPoint.distance) maxPoint = p;
          });
          setMoonPos3D({
            x: maxPoint.x / 1000,
            y: maxPoint.y / 1000,
            z: maxPoint.z / 1000,
          });
        }
      })
      .catch((err) => console.error(err));

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (trajectoryData.length === 0 || !mounted) return;
    let animationId: number;

    const tick = () => {
      const now = Date.now();
      const currentLiveData = getInterpolatedTelemetry(trajectoryData, now);
      if (currentLiveData) setLiveTelemetry(currentLiveData);

      const timeToCalculate = isLiveScrub ? now : scrubTime;
      const currentScrubData = getInterpolatedTelemetry(
        trajectoryData,
        timeToCalculate,
      );
      if (currentScrubData) setScrubTelemetry(currentScrubData);

      if (isLiveScrub) setScrubTime(now);

      const diff = Math.max(0, now - MISSION_START);
      setMet({
        days: Math.floor(diff / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24)
          .toString()
          .padStart(2, "0"),
        minutes: Math.floor((diff / 1000 / 60) % 60)
          .toString()
          .padStart(2, "0"),
        seconds: Math.floor((diff / 1000) % 60)
          .toString()
          .padStart(2, "0"),
      });

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [trajectoryData, isLiveScrub, scrubTime, mounted]);

  // ============================================================================
  // ЛОГИКА ГОРИЗОНТАЛЬНОГО ПОВОРОТА 2D КАРТЫ
  // ============================================================================

  // Вычисляем угол, на который нужно повернуть все точки, чтобы Луна оказалась на оси X (горизонтально)
  const angle = Math.atan2(moonPos3D.y, moonPos3D.x);
  const cosT = Math.cos(-angle);
  const sinT = Math.sin(-angle);

  // Функция поворота точки и переворота оси Y для правильного отображения в SVG
  const rotatePoint = (x: number, y: number) => ({
    x: x * cosT - y * sinT,
    y: -(x * sinT + y * cosT),
  });

  const mapBounds = useMemo(() => {
    if (trajectoryData.length === 0)
      return {
        minX: -50000,
        maxX: 450000,
        minY: -100000,
        maxY: 100000,
        w: 500000,
        h: 200000,
      };

    let minX = 0,
      maxX = 0,
      minY = 0,
      maxY = 0;
    trajectoryData.forEach((p) => {
      const rp = rotatePoint(p.x, p.y);
      if (rp.x < minX) minX = rp.x;
      if (rp.x > maxX) maxX = rp.x;
      if (rp.y < minY) minY = rp.y;
      if (rp.y > maxY) maxY = rp.y;
    });

    const padX = Math.abs(maxX - minX) * 0.1 || 20000;
    const padY = Math.abs(maxY - minY) * 0.2 || 50000;

    return {
      minX: minX - padX,
      maxX: maxX + padX,
      minY: minY - padY,
      maxY: maxY + padY,
      w: maxX - minX + 2 * padX,
      h: maxY - minY + 2 * padY,
    };
  }, [trajectoryData, moonPos3D]);

  const svgPathData = useMemo(() => {
    if (trajectoryData.length === 0) return "";
    return trajectoryData
      .map((p, i) => {
        const rp = rotatePoint(p.x, p.y);
        return `${i === 0 ? "M" : "L"} ${rp.x} ${rp.y}`;
      })
      .join(" ");
  }, [trajectoryData, moonPos3D]);

  const moonSvgPos = rotatePoint(moonPos3D.x * 1000, moonPos3D.y * 1000);
  const orionSvgPos = rotatePoint(scrubTelemetry.x, scrubTelemetry.y);

  // ============================================================================

  const orionPos3D = {
    x: liveTelemetry.x / 1000,
    y: liveTelemetry.y / 1000,
    z: liveTelemetry.z / 1000,
  };
  const progressPercent = Math.min(
    100,
    ((Date.now() - MISSION_START) / (MISSION_END - MISSION_START)) * 100,
  ).toFixed(0);
  const scrubProgressPercent = Math.min(
    100,
    ((scrubTime - MISSION_START) / (MISSION_END - MISSION_START)) * 100,
  ).toFixed(0);

  const surfaceDistance = Math.max(0, liveTelemetry.distance - 6371);
  const formattedDistance = surfaceDistance
    .toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/,/g, " ");
  const formattedSpeed = liveTelemetry.speed.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <main className="min-h-screen bg-[#02050A] text-white font-sans selection:bg-cyan-500/30 pb-20">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <header className="relative pt-12 pb-10 flex flex-col items-center text-center px-4">
        <div className="bg-[#0a1120] border border-cyan-900/50 rounded-full px-4 py-1.5 flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest">
            Миссия в процессе
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-widest text-[#4deeea] uppercase mb-4 drop-shadow-[0_0_30px_rgba(77,238,234,0.3)]">
          Artemis II
        </h1>
        <p className="text-slate-400 max-w-xl text-sm md:text-base mb-10">
          Первый пилотируемый полёт к Луне за 50+ лет. Четверо астронавтов
          совершают облёт Луны на корабле Orion.
        </p>

        <div className="flex gap-4 md:gap-6 mb-4">
          {[
            { label: "ДНЕЙ", value: mounted ? met.days : "00" },
            { label: "ЧАСОВ", value: mounted ? met.hours : "00" },
            { label: "МИНУТ", value: mounted ? met.minutes : "00" },
            { label: "СЕКУНД", value: mounted ? met.seconds : "00" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-14 h-16 md:w-20 md:h-24 bg-[#0a1120] border border-slate-800/60 rounded-xl flex items-center justify-center text-2xl md:text-4xl font-mono font-bold shadow-lg">
                {item.value}
              </div>
              <span className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest mt-2">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-6">
          Время с момента старта (MET)
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col gap-16 relative z-10">
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">
              Положение корабля
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              Обновляется в реальном времени
            </p>
          </div>

          <div className="w-full h-[500px] md:h-[650px] bg-[#0a1120] rounded-[2rem] border border-slate-800/60 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 cursor-move">
              {trajectoryData.length > 0 ? (
                <Scene3D
                  orionPosition={orionPos3D}
                  moonPosition={moonPos3D}
                  focus={focus}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                  Подключение к JPL...
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#050b14]/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 md:p-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.8)] w-[90%] max-w-[500px]">
              <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest mb-2">
                Текущее расстояние от Земли
              </div>

              <div className="flex justify-center items-baseline gap-3 mb-2">
                <span className="text-5xl md:text-7xl font-bold text-cyan-400 tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  {mounted ? formattedDistance : "---"}
                </span>
                <span className="text-2xl md:text-4xl font-bold text-cyan-800">
                  КМ
                </span>
              </div>

              <div className="flex justify-center items-center gap-4 text-[10px] md:text-[11px] text-slate-400 mb-6 tracking-wider uppercase font-mono">
                <span>↑ {mounted ? formattedSpeed : "-.--"} КМ/С</span>
                <span className="text-emerald-500">ОНЛАЙН (NASA)</span>
              </div>

              <div className="flex justify-center gap-4 w-full">
                {["EARTH", "MOON", "ORION"].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => setFocus(btn)}
                    className={`flex-1 max-w-[120px] text-[9px] md:text-xs py-3 rounded-xl transition-all duration-300 uppercase tracking-widest ${focus === btn ? "bg-cyan-600 text-white font-bold shadow-[0_0_20px_rgba(8,145,178,0.5)]" : "bg-[#121b2d] text-slate-400 hover:bg-slate-700 border border-slate-700/50"}`}
                  >
                    {btn === "EARTH"
                      ? "Земля"
                      : btn === "MOON"
                        ? "Луна"
                        : "Орион"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-5 flex flex-col justify-center items-center text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                Статус
              </div>
              <div className="text-sm md:text-base font-bold text-emerald-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>{" "}
                Транслунный перелёт
              </div>
            </div>
            <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-5 flex flex-col justify-center items-center text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                День миссии
              </div>
              <div className="text-xl md:text-2xl font-bold text-white">
                {mounted ? parseInt(met.days) + 1 : "-"}{" "}
                <span className="text-sm text-slate-500">из 10</span>
              </div>
            </div>
            <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-5 flex flex-col justify-center items-center text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">
                Прогресс миссии
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full bg-cyan-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="text-xs font-bold text-cyan-400">
                {mounted ? progressPercent : "--"}%
              </div>
            </div>
            <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-5 flex flex-col justify-center items-center text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
                Рекорд удаления
              </div>
              <div className="text-sm md:text-base font-mono font-bold text-slate-300">
                400 171 <span className="text-slate-500 text-[10px]">КМ</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ИНТЕРАКТИВНЫЙ ТАЙМЛАЙН 2D (ГОРИЗОНТАЛЬНАЯ КАРТА) */}
        <section>
          <div className="bg-[#0a1120] rounded-3xl border border-slate-800/60 p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Машина времени (Симуляция)
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  Перемещайтесь по траектории миссии
                </p>
              </div>
              <div className="flex items-center gap-4">
                {!isLiveScrub && (
                  <button
                    onClick={() => setIsLiveScrub(true)}
                    className="text-[10px] bg-cyan-900/50 text-cyan-400 border border-cyan-800 px-3 py-2 rounded-lg hover:bg-cyan-800 transition-colors uppercase tracking-widest"
                  >
                    Вернуться в эфир
                  </button>
                )}
                <span
                  className={`text-[11px] font-mono px-3 py-2 rounded-lg border ${isLiveScrub ? "bg-cyan-950/50 text-cyan-400 border-cyan-900/50" : "bg-amber-950/50 text-amber-400 border-amber-900/50"}`}
                >
                  {mounted
                    ? new Date(scrubTime).toLocaleString("ru-RU")
                    : "..."}
                </span>
              </div>
            </div>

            <div className="h-[250px] md:h-[400px] bg-[#050b14] rounded-2xl border border-slate-800 mb-8 relative overflow-hidden flex items-center justify-center shadow-inner">
              <svg
                className="w-full h-full p-4 md:p-8"
                viewBox={`${mapBounds.minX} ${mapBounds.minY} ${mapBounds.w} ${mapBounds.h}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Траектория */}
                <path
                  d={svgPathData}
                  fill="none"
                  stroke="#334155"
                  strokeWidth={mapBounds.w * 0.002}
                  strokeDasharray={`${mapBounds.w * 0.005} ${mapBounds.w * 0.01}`}
                />
                <path
                  d={svgPathData}
                  fill="none"
                  stroke="url(#orbitGradient)"
                  strokeWidth={mapBounds.w * 0.004}
                  className="opacity-30"
                />

                <defs>
                  <linearGradient
                    id="orbitGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>

                {/* Земля (Координаты 0,0 после вращения) */}
                <g transform="translate(0, 0)">
                  <circle
                    r={mapBounds.w * 0.015}
                    fill="#1e3a8a"
                    stroke="#3b82f6"
                    strokeWidth={mapBounds.w * 0.002}
                  />
                  <text
                    y={mapBounds.w * 0.035}
                    fill="#64748b"
                    fontSize={mapBounds.w * 0.015}
                    textAnchor="middle"
                    className="uppercase font-bold tracking-widest"
                  >
                    Земля
                  </text>
                </g>

                {/* Луна */}
                <g transform={`translate(${moonSvgPos.x}, ${moonSvgPos.y})`}>
                  <circle r={mapBounds.w * 0.006} fill="#94a3b8" />
                  <text
                    y={mapBounds.w * 0.025}
                    fill="#64748b"
                    fontSize={mapBounds.w * 0.012}
                    textAnchor="middle"
                    className="uppercase font-bold tracking-widest"
                  >
                    Луна
                  </text>
                </g>

                {/* Корабль Орион */}
                <g
                  transform={`translate(${orionSvgPos.x}, ${orionSvgPos.y})`}
                  className="transition-all duration-75"
                >
                  <circle
                    r={mapBounds.w * 0.012}
                    fill={
                      isLiveScrub
                        ? "rgba(34, 211, 238, 0.2)"
                        : "rgba(251, 191, 36, 0.2)"
                    }
                  >
                    <animate
                      attributeName="r"
                      from={mapBounds.w * 0.01}
                      to={mapBounds.w * 0.02}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="1"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    r={mapBounds.w * 0.004}
                    fill={isLiveScrub ? "#22d3ee" : "#fbbf24"}
                  />
                  <text
                    y={-(mapBounds.w * 0.015)}
                    fill={isLiveScrub ? "#22d3ee" : "#fbbf24"}
                    fontSize={mapBounds.w * 0.015}
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    ORION
                  </text>
                </g>
              </svg>
            </div>

            {/* Ползунок времени */}
            <div className="relative h-8 flex items-center group">
              <input
                type="range"
                min={MISSION_START}
                max={MISSION_END}
                value={scrubTime}
                onChange={(e) => {
                  setIsLiveScrub(false);
                  setScrubTime(Number(e.target.value));
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
              />
              <div className="h-2.5 w-full bg-slate-900 rounded-full relative overflow-hidden border border-slate-800">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-75 ${isLiveScrub ? "bg-gradient-to-r from-cyan-600 to-cyan-300" : "bg-gradient-to-r from-amber-600 to-amber-400"}`}
                  style={{
                    width: `${Math.max(0, Math.min(100, Number(scrubProgressPercent)))}%`,
                  }}
                ></div>
              </div>
              <div
                className={`absolute w-1.5 h-6 z-10 pointer-events-none transition-all duration-75 rounded-full ${isLiveScrub ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]"}`}
                style={{
                  left: `calc(${Math.max(0, Math.min(100, Number(scrubProgressPercent)))}% - 3px)`,
                }}
              ></div>
            </div>
          </div>
        </section>

        {/* 3. ЭКИПАЖ */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">Экипаж</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              4 астронавта летят к Луне
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Рид Вайзман",
                eng: "Reid Wiseman",
                role: "Командир · NASA",
                flag: "🇺🇸",
                desc: "Капитан ВМС США, совершил полёт на МКС в 2014 году. Налетал 165 дней в космосе.",
                img: "/wiseman.jpg",
              },
              {
                name: "Виктор Гловер",
                eng: "Victor Glover",
                role: "Пилот · NASA",
                flag: "🇺🇸",
                desc: "Капитан ВМС США, летал на МКС в 2020. Первый темнокожий член лунной миссии.",
                img: "/glover.jpg",
              },
              {
                name: "Кристина Кох",
                eng: "Christina Koch",
                role: "Спец. миссии · NASA",
                flag: "🇺🇸",
                desc: "Рекордсменка по длительности полёта среди женщин — 328 дней на МКС.",
                img: "/koch.jpg",
              },
              {
                name: "Джереми Хансен",
                eng: "Jeremy Hansen",
                role: "Спец. миссии · CSA",
                flag: "🇨🇦",
                desc: "Полковник ВВС Канады, истребительный лётчик. Первый канадец у Луны.",
                img: "/hansen.jpg",
              },
            ].map((m, i) => (
              <div
                key={i}
                className="bg-[#0a1120] rounded-3xl border border-slate-800/60 p-8 flex flex-col items-center text-center hover:border-cyan-900/50 transition-colors"
              >
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-4 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] relative">
                  <img
                    src={m.img}
                    alt={`Астронавт ${m.name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Если картинка с таким именем не найдена, ставим заглушку (инициалы)
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${m.eng}&background=0D1B2A&color=4DEEEA&bold=true`;
                    }}
                  />
                </div>
                <div className="text-lg mb-1">{m.flag}</div>
                <h3 className="font-bold text-lg">{m.name}</h3>
                <div className="text-[10px] text-slate-500 mb-3">{m.eng}</div>
                <div className="text-[9px] bg-cyan-950/40 text-cyan-400 px-3 py-1 rounded-full uppercase tracking-widest border border-cyan-900/50 mb-4">
                  {m.role}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. ХРОНОЛОГИЯ МИССИИ */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">
              Хронология миссии
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest">
              Ключевые этапы Artemis II
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <div className="absolute top-0 bottom-0 left-[15px] w-[1px] bg-slate-800"></div>

            {[
              {
                date: "2 апреля 2026",
                title: "Старт",
                desc: "Запуск SLS с космодрома Кеннеди, Флорида",
                status: "done",
              },
              {
                date: "2 апреля 2026",
                title: "Отделение ускорителей",
                desc: "Твердотопливные ускорители отделились через 2 мин после старта",
                status: "done",
              },
              {
                date: "2 апреля 2026",
                title: "Выход на орбиту",
                desc: "Орион на околоземной орбите, проверка систем",
                status: "done",
              },
              {
                date: "3 апреля 2026",
                title: "TLI — Транслунный импульс",
                desc: "Двигатель ICPS разгоняет корабль к Луне",
                status: "active",
              },
              {
                date: "5 апреля 2026",
                title: "Коррекция траектории",
                desc: "Служебный модуль ESM корректирует курс",
                status: "future",
              },
              {
                date: "7 апреля 2026",
                title: "Облёт Луны",
                desc: "Пролёт в ~130 км от поверхности за обратной стороной",
                status: "future",
              },
              {
                date: "9 апреля 2026",
                title: "Обратный перелёт",
                desc: "Свободный возврат к Земле",
                status: "future",
              },
              {
                date: "12 апреля 2026",
                title: "Приводнение",
                desc: "Посадка в Тихом океане у берегов Калифорнии",
                status: "future",
              },
            ].map((step, i) => (
              <div key={i} className="relative pl-12 pb-6 group">
                <div className="absolute left-0 top-1.5 w-8 h-8 bg-[#02050A] flex items-center justify-center">
                  {step.status === "done" && (
                    <CheckCircle2 size={18} className="text-cyan-600" />
                  )}
                  {step.status === "active" && (
                    <Rocket size={18} className="text-cyan-400 rotate-45" />
                  )}
                  {step.status === "future" && (
                    <Circle size={14} className="text-slate-700" />
                  )}
                </div>

                <div
                  className={`bg-[#0a1120] rounded-2xl border p-5 transition-colors ${step.status === "active" ? "border-cyan-800/60 shadow-[0_0_15px_rgba(34,211,238,0.05)]" : "border-slate-800/60 group-hover:border-slate-700"}`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                      {step.date}
                    </span>
                    {step.status === "active" && (
                      <span className="bg-cyan-900/40 text-cyan-400 text-[8px] px-2 py-0.5 rounded uppercase tracking-widest">
                        Сейчас
                      </span>
                    )}
                  </div>
                  <h4
                    className={`text-base font-bold ${step.status === "active" ? "text-white" : "text-slate-300"} mb-1`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-2">
              Программа Artemis
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              Цель программы — вернуть людей на Луну и подготовить путь к Марсу.
              Artemis II — первый пилотируемый полёт после Artemis I
              (беспилотный, 2022).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Rocket size={20} />,
                  label: "Ракета",
                  title: "SLS Block 1",
                  desc: "Самая мощная ракета NASA — 39.1 МН тяги",
                },
                {
                  icon: <Globe size={20} />,
                  label: "Корабль",
                  title: "Orion MPCV",
                  desc: "Рассчитан на 4 человек, с модулем ESA",
                },
                {
                  icon: <Target size={20} />,
                  label: "Тип миссии",
                  title: "Пилотируемый облёт",
                  desc: "Свободный возврат без выхода на орбиту Луны",
                },
                {
                  icon: <CalendarDays size={20} />,
                  label: "Длительность",
                  title: "~10 дней",
                  desc: "Первый пилотируемый полёт к Луне с 1972 г.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-6"
                >
                  <div className="text-cyan-500 mb-4">{item.icon}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">
                    {item.label}
                  </div>
                  <div className="font-bold text-white mb-2">{item.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Картинка Луны */}
            <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 relative overflow-hidden min-h-[300px] flex items-end justify-center pb-6">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-slate-900 to-slate-300 shadow-[0_0_50px_rgba(255,255,255,0.05)] opacity-80 bg-[url('/moon_color.jpg')] bg-cover bg-center"></div>
              <span className="relative z-10 text-xs text-slate-300 bg-[#050b14]/80 border border-slate-700 px-4 py-2 rounded-full backdrop-blur-sm shadow-xl">
                Расстояние до Луны: 384 400 км
              </span>
            </div>
          </div>

          {/* Будущие миссии */}
          <div className="bg-[#0a1120] rounded-2xl border border-slate-800/60 p-8 mt-6">
            <h3 className="text-xl font-bold text-white mb-6">
              Будущие миссии
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  id: "Artemis III",
                  desc: "Посадка на южный полюс Луны с использованием лунного модуля SpaceX Starship HLS",
                },
                {
                  id: "Artemis IV",
                  desc: "Стыковка со станцией Gateway на лунной орбите",
                },
                {
                  id: "Artemis V+",
                  desc: "Регулярные экспедиции, строительство лунной базы, подготовка к Марсу",
                },
              ].map((mission, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-6 items-baseline ${i !== 2 ? "border-b border-slate-800/50 pb-4" : ""}`}
                >
                  <div className="text-cyan-500 font-bold text-sm">
                    {mission.id}
                  </div>
                  <div className="text-slate-400 text-sm">{mission.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-24 py-8 border-t border-slate-900 text-center text-slate-600 text-[10px]">
        Данные предоставляются NASA JPL Horizons API. Трекер носит
        ознакомительный характер.
        <br />
        Программа Artemis · 2026
      </footer>
    </main>
  );
}
