import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { DbService } from "./db.service";
import { GetTemperatureDto } from "./dto/dto";

@Controller("db")
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Post("fetch/:year")
  async fetchAll(@Param("year") year: number) {
    await this.dbService.fetchAll(year);
    return { status: "ok" };
  }

  @Post("fix/:year")
  async findByYear(@Param("year") year: number, @Body() regions: number[]) {
    await this.dbService.fetchMissedData(year, regions);
    return { status: "fetched" };
  }

  @Get("temp/min")
  async getMin(@Query() dto: GetTemperatureDto) {
    const minTemp = await this.dbService.getMinimumTemperature(
      dto.start,
      dto.end,
      dto.region_id,
    );

    return {
      region_id: dto.region_id,
      start: dto.start,
      end: dto.end,
      minimum_temperature: minTemp,
    };
  }

  @Get("temp/avg")
  async getAvg(@Query() dto: GetTemperatureDto) {
    const avgTemp = await this.dbService.getAverageTemperature(
      dto.start,
      dto.end,
      dto.region_id,
    );

    return {
      region_id: dto.region_id,
      start: dto.start,
      end: dto.end,
      average_temperature: avgTemp,
    };
  }

  @Get("temp/max")
  async getMax(@Query() dto: GetTemperatureDto) {
    const maxTemp = await this.dbService.getMaximumTemperature(
      dto.start,
      dto.end,
      dto.region_id,
    );

    return {
      region_id: dto.region_id,
      start: dto.start,
      end: dto.end,
      maximum_temperature: maxTemp,
    };
  }

  @Get("temp/")
  async get(@Query() dto: GetTemperatureDto) {
    const Temp = await this.dbService.getTemperature(
      dto.start,
      dto.end,
      dto.region_id,
    );

    return {
      region_id: dto.region_id,
      start: dto.start,
      end: dto.end,
      minimum_temperature: Temp.min,
      average_temperature: Temp.avg,
      maximum_temperature: Temp.max,
    };
  }
}
