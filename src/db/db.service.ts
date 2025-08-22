import { Injectable } from "@nestjs/common";
import { Worker } from "worker_threads";
import { Region, uzbekistanRegions } from "src/regions";
import * as path from "path";

@Injectable()
export class DbService {
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
}
