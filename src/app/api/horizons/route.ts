import { NextResponse } from "next/server";

// Кэшируем ТОЛЬКО успешный итоговый ответ нашего API на 1 час (спасает серверы НАСА)
export const revalidate = 3600;

export async function GET() {
  // Начальные примерные даты (даже если они неточные, код сам их исправит)
  let startTime = "2026-04-02";
  let stopTime = "2026-04-15";

  const baseUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='-1024'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@399'&STEP_SIZE='1%20h'&CSV_FORMAT='YES'`;

  let textData = "";
  let success = false;

  // Делаем до 3-х попыток, так как НАСА выдает только одну ошибку за раз (сначала prior, потом after)
  for (let i = 0; i < 3; i++) {
    const url = `${baseUrl}&START_TIME='${startTime}'&STOP_TIME='${stopTime}'`;

    // cache: 'no-store' ОЧЕНЬ ВАЖНО здесь! НАСА отдает 200 OK даже при ошибке текста.
    // Если мы закэшируем этот ответ, мы закэшируем ошибку.
    const res = await fetch(url, { cache: "no-store" });
    textData = await res.text();

    if (textData.includes("$$SOE")) {
      success = true;
      break; // Данные получены, выходим из цикла!
    }

    if (textData.includes("No ephemeris for target")) {
      const priorMatch = textData.match(/prior to A\.D\.\s+(.*?)\s+TDB/);
      const afterMatch = textData.match(/after A\.D\.\s+(.*?)\s+TDB/);

      if (priorMatch) startTime = priorMatch[1].trim().replace(/\s+/g, "%20");
      if (afterMatch) stopTime = afterMatch[1].trim().replace(/\s+/g, "%20");

      console.log(
        `[API] Коррекция НАСА (Попытка ${i + 1}): Старт=${startTime}, Финиш=${stopTime}`,
      );
    } else {
      // Какая-то другая техническая ошибка НАСА
      console.error("Неизвестный ответ НАСА:", textData.substring(0, 200));
      break;
    }
  }

  // Если за 3 попытки так и не получили данные - отдаем 500 ошибку
  if (!success) {
    return NextResponse.json(
      { error: "Failed to fetch spacecraft telemetry" },
      { status: 500 },
    );
  }

  const lines = textData.split("\n");
  let isData = false;
  const ephemeris = [];

  for (const line of lines) {
    if (line.includes("$$EOE")) isData = false;

    if (isData) {
      const cols = line.split(",").map((c) => c.trim());
      if (cols.length >= 8) {
        // Обязательно добавляем ' UTC', чтобы сервер Vercel идеально точно распарсил время
        const timeStr = cols[1].replace("A.D. ", "").trim() + " UTC";
        const time = new Date(timeStr).getTime();

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

  return NextResponse.json(ephemeris);
}
