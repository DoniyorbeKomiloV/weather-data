import { Controller, Post } from "@nestjs/common";
import { DbService } from "./db.service";

@Controller("db")
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Post("fetch")
  async fetchAll() {
    await this.dbService.fetchAll();
    return { status: "ok" };
  }
}
