import { Controller, Get, Param } from "@nestjs/common";
import { DistrictsService } from "./districts.service";

@Controller("districts")
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {
    console.log(
      "✅ DistrictsController initialized with service:",
      !!districtsService,
    );
  }

  @Get("/populate")
  async populate() {
    return await this.districtsService.populate();
  }

  @Get()
  async findAll() {
    return this.districtsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.districtsService.findOne(+id);
  }
}
