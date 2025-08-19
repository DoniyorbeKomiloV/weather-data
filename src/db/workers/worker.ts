import { parentPort, workerData } from "worker_threads";
import { WeatherData } from "../entities/db.entity";
import { AppDataSource } from "../../app.data-source";
import { District } from "../../districts/entities/district.entity";

async function fetchAndSave(district: District, year: number): Promise<void> {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(WeatherData);

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${district.latitude}&longitude=${district.longitude}&start_date=${year}-01-01&end_date=${year}-12-31&hourly=temperature_2m,relative_humidity_2m,precipitation,weathercode,windspeed_10m`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json?.hourly?.time) {
      const records = json.hourly.time.map((t: string, i: number) => ({
        cityId: district.id,
        datetime: new Date(t),
        temperature: json.hourly.temperature_2m?.[i] ?? null,
        humidity: json.hourly.relative_humidity_2m?.[i] ?? null,
        precipitation: json.hourly.precipitation?.[i] ?? null,
        weather_code: json.hourly.weathercode?.[i] ?? null,
        wind_speed: json.hourly.windspeed_10m?.[i] ?? null,
      }));

      // save in chunks
      await repo.save(records);

      parentPort?.postMessage(
        `💾 Saved ${records.length} records for ${district.district} in ${year}`,
      );
    }
  } catch (err) {
    console.error(
      `⚠️ Error fetching year ${year} for ${district.district}`,
      err,
    );
  }

  await AppDataSource.destroy();
  parentPort?.postMessage(`✅ Completed ${district.district}`);
}

fetchAndSave(workerData.district, workerData.year);
