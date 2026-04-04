import { NextResponse } from "next/server";

export async function GET() {
  // ТВОЯ ИДЕАЛЬНАЯ ССЫЛКА НА АРТЕМИДУ-2 (-1024)
  const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='-1024'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@399'&START_TIME='2026-APR-02%2001:58:32.3050'&STOP_TIME='2026-APR-10%2023:54:37.5626'&STEP_SIZE='1%20h'&CSV_FORMAT='YES'`;

  try {
    // Кэшируем на 1 час, бережем сервера NASA!
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const textData = await res.text();

    if (!textData.includes("$$SOE")) {
      throw new Error("НАСА не вернуло данные");
    }

    const lines = textData.split("\n");
    let isData = false;
    const ephemeris = [];

    for (const line of lines) {
      if (line.includes("$$EOE")) isData = false;

      if (isData) {
        const cols = line.split(",").map((c) => c.trim());
        if (cols.length >= 8) {
          // Время УЖЕ правильное! Просто берем его.
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

    return NextResponse.json(ephemeris);
  } catch (error) {
    console.error("Ошибка API:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
