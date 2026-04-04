export type TelemetryPoint = {
  time: number;
  x: number;
  y: number;
  z: number;
  distance: number;
  speed: number;
};

// ТОЧНЫЕ ДАННЫЕ СТАРТА И ФИНИША ИЗ ТВОЕЙ ССЫЛКИ НАСА
export const MISSION_START = new Date("2026-04-02T01:58:32.305Z").getTime();
export const MISSION_END = new Date("2026-04-10T23:54:37.562Z").getTime();

export async function fetchTrajectoryData(): Promise<TelemetryPoint[]> {
  const res = await fetch("/api/horizons");
  if (!res.ok) throw new Error("Ошибка загрузки данных");
  const nasaData = await res.json();

  return nasaData.map((point: any) => {
    const speed = Math.sqrt(point.vx ** 2 + point.vy ** 2 + point.vz ** 2);
    const distance = Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);

    return {
      time: point.time,
      x: point.x,
      y: point.y,
      z: point.z,
      distance,
      speed,
    };
  });
}

export function getInterpolatedTelemetry(
  points: TelemetryPoint[],
  targetTime: number,
): TelemetryPoint | null {
  if (!points || points.length === 0) return null;
  if (targetTime <= points[0].time) return points[0];
  if (targetTime >= points[points.length - 1].time)
    return points[points.length - 1];

  for (let i = 0; i < points.length - 1; i++) {
    if (targetTime >= points[i].time && targetTime <= points[i + 1].time) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const t = (targetTime - p1.time) / (p2.time - p1.time);

      return {
        time: targetTime,
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
        z: p1.z + (p2.z - p1.z) * t,
        distance: p1.distance + (p2.distance - p1.distance) * t,
        speed: p1.speed + (p2.speed - p1.speed) * t,
      };
    }
  }
  return null;
}
