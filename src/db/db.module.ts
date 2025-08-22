import { Module } from "@nestjs/common";
import { DbService } from "./db.service";
import { DbController } from "./db.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeatherData } from "./entities/db.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WeatherData])],
  controllers: [DbController],
  providers: [DbService],
})
export class DbModule {}
