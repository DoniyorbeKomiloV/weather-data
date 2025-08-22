import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { DbService } from "./db.service";
import { GetAverageTemperatureDto } from "./dto/dto";

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

  @Get("avg-temp")
  async get(@Query() dto: GetAverageTemperatureDto) {
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
}
