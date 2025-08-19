import { Module } from "@nestjs/common";
import { DbService } from "./db.service";
import { DbController } from "./db.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { District } from "../districts/entities/district.entity";
import { WeatherData } from "./entities/db.entity";

@Module({
  imports: [TypeOrmModule.forFeature([District, WeatherData])],
  controllers: [DbController],
  providers: [DbService],
})
export class DbModule {}
