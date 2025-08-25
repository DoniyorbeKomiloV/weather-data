import { Injectable } from "@nestjs/common";
import { Worker } from "worker_threads";
import { Region, uzbekistanRegions } from "src/regions";
import * as path from "path";
import { Repository } from "typeorm";
import { WeatherData } from "./entities/db.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(WeatherData)
    private readonly weatherRepo: Repository<WeatherData>,
  ) {}

  async fetchAll(year: number) {
    const workerPath = path.resolve(__dirname, "workers/worker.js");
    const spawnWorker = (region: Region) => {
      const worker = new Worker(workerPath, {
        workerData: { region: { ...region }, year: year },
      });

      worker.on("message", (msg) => {
        console.log(`📩 Worker says: ${msg}`);
      });

      worker.on("exit", () => {
        console.log(`🧹 Worker finished for ${region.name}`);
      });
    };

    // start up to 14 workers in parallel
    for (let i = 0; i < uzbekistanRegions.length; i++) {
      spawnWorker(uzbekistanRegions[i]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  async fetchMissedData(year: number, regions: number[]) {
    const workerPath = path.resolve(__dirname, "workers/worker.js");
    const spawnWorker = (region: Region) => {
      const worker = new Worker(workerPath, {
        workerData: { region: { ...region }, year: year },
      });

      worker.on("message", (msg) => {
        console.log(`📩 Worker says: ${msg}`);
      });

      worker.on("exit", () => {
        console.log(`🧹 Worker finished for ${region.name}`);
      });
    };

    // start up to 14 workers in parallel
    for (const region of regions) {
      spawnWorker(uzbekistanRegions[region - 1]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  async getAverageTemperature(
    start: Date,
    end: Date,
    region_id: number,
  ): Promise<number | null> {
    const result = await this.weatherRepo
      .createQueryBuilder("w")
      .select("AVG(w.temperature)", "avg")
      .where("w.datetime BETWEEN :start AND :end", { start, end })
      .andWhere("w.region = :region_id", { region_id })
      .getRawOne<{ avg: string }>();

    return result?.avg ? parseFloat(result.avg) : null;
  }

  async getMaximumTemperature(
    start: Date,
    end: Date,
    region_id: number,
  ): Promise<number | null> {
    const result = await this.weatherRepo
      .createQueryBuilder("w")
      .select("MAX(w.temperature)", "max")
      .where("w.datetime BETWEEN :start AND :end", { start, end })
      .andWhere("w.region = :region_id", { region_id })
      .getRawOne<{ max: string }>();

    return result?.max ? parseFloat(result.max) : null;
  }

  async getMinimumTemperature(
    start: Date,
    end: Date,
    region_id: number,
  ): Promise<number | null> {
    const result = await this.weatherRepo
      .createQueryBuilder("w")
      .select("MIN(w.temperature)", "min")
      .where("w.datetime BETWEEN :start AND :end", { start, end })
      .andWhere("w.region = :region_id", { region_id })
      .getRawOne<{ min: string }>();

    return result?.min ? parseFloat(result.min) : null;
  }

  async getTemperature(
    start: Date,
    end: Date,
    region_id: number,
  ): Promise<{ min: string | null; avg: string | null; max: string | null }> {
    const result = await this.weatherRepo
      .createQueryBuilder("w")
      .select("MIN(w.temperature)", "min")
      .select("AVG(w.temperature)", "avg")
      .select("MAX(w.temperature)", "max")
      .where("w.datetime BETWEEN :start AND :end", { start, end })
      .andWhere("w.region = :region_id", { region_id })
      .getRawOne<{ min: string; avg: string; max: string }>();

    return {
      min: result?.min ? result.min : null,
      avg: result?.avg ? result.avg : null,
      max: result?.max ? result.max : null,
    };
  }
}
