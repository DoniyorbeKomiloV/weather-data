import "dotenv/config";
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { WeatherData } from "./db/entities/db.entity";
import { District } from "./districts/entities/district.entity";

dotenv.config({ path: __dirname + "/../.env" });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [WeatherData, District],
  migrations: ["dist/migrations/*.js"],
  synchronize: true,
  logging: true,
});

console.info(AppDataSource.options);
