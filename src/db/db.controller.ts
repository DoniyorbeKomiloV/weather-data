import { Body, Controller, Param, Post } from "@nestjs/common";
import { DbService } from "./db.service";

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
}
