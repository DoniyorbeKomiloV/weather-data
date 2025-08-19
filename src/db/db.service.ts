import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { District } from "src/districts/entities/district.entity";
import { Worker } from "worker_threads";
import * as path from "path";

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  async fetchAll() {
    const districts = await this.districtRepository.find();

    const maxThreads = 14;
    let activeWorkers: number = 0;
    const queue = [...districts];
    const workerPath = path.resolve(__dirname, "workers/worker.js");
    const spawnWorker = (district: District) => {
      activeWorkers = activeWorkers + 1;
      const worker = new Worker(workerPath, {
        workerData: { district },
      });

      worker.on("message", (msg) => {
        console.log(`📩 Worker says: ${msg}`);
      });

      worker.on("exit", () => {
        activeWorkers = activeWorkers - 1;
        console.log(`🧹 Worker finished for ${district.district}`);
        if (queue.length > 0) {
          spawnWorker(queue.shift()!);
        }
      });
    };

    // start up to 14 workers in parallel
    for (let i = 0; i < maxThreads && queue.length > 0; i++) {
      spawnWorker(queue.shift()!);
    }
  }
}
