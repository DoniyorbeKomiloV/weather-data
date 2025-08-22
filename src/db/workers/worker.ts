import { parentPort, workerData } from "worker_threads";
import { WeatherData } from "../entities/db.entity";
import { AppDataSource } from "../../app.data-source";
import { Region } from "../../regions";
import * as process from "node:process";

export interface OpenMeteoResponse {
  hourly: {
    time: string[];
    temperature_2m?: number[];
    relative_humidity_2m?: number[];
    precipitation?: number[];
    weathercode?: number[];
    windspeed_10m?: number[];
  };
}

async function fetchAndSave(region: Region, year: number): Promise<void> {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(WeatherData);

  try {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${region.lat}&longitude=${region.lon}&start_date=${year}-01-01&end_date=${year}-12-31&hourly=temperature_2m,relative_humidity_2m,precipitation,weathercode,windspeed_10m`;

    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    const json: unknown = await res.json();

    if (typeof json === "object" && json !== null && "hourly" in json) {
      const data = json as OpenMeteoResponse;

      const records = data.hourly.time.map((t, i) => ({
        datetime: new Date(t),
        region: region.id,
        temperature: data.hourly.temperature_2m?.[i] ?? undefined,
        humidity: data.hourly.relative_humidity_2m?.[i] ?? undefined,
        precipitation: data.hourly.precipitation?.[i] ?? undefined,
        weather_code: data.hourly.weathercode?.[i] ?? undefined,
        wind_speed: data.hourly.windspeed_10m?.[i] ?? undefined,
      }));

      for (let i = 0; i < records.length; i += 5000) {
        await repo.save(records);
      }

      parentPort?.postMessage(
        `💾 Saved ${records.length} records for ${region.name}`,
      );
    }
  } catch (err) {
    console.error(`⚠️ Error fetching data for ${region.name}`, err, region);
  }

  await AppDataSource.destroy();
  parentPort?.postMessage(`✅ Completed ${region.name}`);
}

const data = workerData as { region: Region; year: number };

fetchAndSave(data.region, data.year).catch((err) => {
  console.error("Worker failed:", err);
  parentPort?.postMessage(`❌ Failed ${data.region?.name ?? "Unknown Region"}`);
  process.exit(1);
});
