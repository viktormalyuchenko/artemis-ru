import { NextResponse } from "next/server";

export async function GET() {
  // 1. Задаем намеренно ШИРОКИЙ диапазон (с запасом в обе стороны)
  let startTime = "2026-04-01";
  let stopTime = "2026-04-15";

  const baseUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='-1024'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@399'&STEP_SIZE='1%20h'&CSV_FORMAT='YES'`;

  try {
    let url = `${baseUrl}&START_TIME='${startTime}'&STOP_TIME='${stopTime}'`;
    let res = await fetch(url, { next: { revalidate: 3600 } }); // Кэшируем на час
    let textData = await res.text();

    // 2. АВТО-ИСПРАВЛЕНИЕ (Self-Healing)
    // Если НАСА ругается, что мы запросили данные за пределами полета корабля,
    // мы читаем текст их ошибки и берем ИДЕАЛЬНЫЕ даты прямо из нее!
    if (textData.includes("No ephemeris for target")) {
      // Ищем совпадения: "prior to A.D. 2026-APR-02 01:58:32.3050 TDB"
      const priorMatch = textData.match(/prior to A\.D\.\s+(.*?)\s+TDB/);
      const afterMatch = textData.match(/after A\.D\.\s+(.*?)\s+TDB/);

      // Вытаскиваем даты и заменяем пробелы на %20 для URL
      if (priorMatch) startTime = priorMatch[1].trim().replace(/\s+/g, "%20");
      if (afterMatch) stopTime = afterMatch[1].trim().replace(/\s+/g, "%20");

      console.log(
        `[API] Авто-коррекция дат НАСА: Старт=${startTime}, Финиш=${stopTime}`,
      );

      // 3. Делаем повторный запрос с идеальными датами
      url = `${baseUrl}&START_TIME='${startTime}'&STOP_TIME='${stopTime}'`;
      res = await fetch(url, { next: { revalidate: 3600 } });
      textData = await res.text();
    }

    if (!textData.includes("$$SOE")) {
      throw new Error("НАСА не вернуло данные эфемерид");
    }

    const lines = textData.split("\n");
    let isData = false;
    const ephemeris = [];

    for (const line of lines) {
      if (line.includes("$$EOE")) isData = false;

      if (isData) {
        const cols = line.split(",").map((c) => c.trim());
        if (cols.length >= 8) {
          const time = new Date(cols[1].replace("A.D. ", "")).getTime();
          ephemeris.push({
            time,
            x: parseFloat(cols[2]),
            y: parseFloat(cols[3]),
            z: parseFloat(cols[4]),
            vx: parseFloat(cols[5]),
            vy: parseFloat(cols[6]),
            vz: parseFloat(cols[7]),
          });
        }
      }

      if (line.includes("$$SOE")) isData = true;
    }

    if (ephemeris.length === 0) throw new Error("Пустой массив данных");

    return NextResponse.json(ephemeris);
  } catch (error) {
    console.error("Критическая ошибка API NASA:", error);
    return NextResponse.json(
      { error: "Failed to fetch spacecraft telemetry" },
      { status: 500 },
    );
  }
}
