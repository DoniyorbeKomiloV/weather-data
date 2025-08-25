import { Type } from "class-transformer";
import { IsDate, IsInt } from "class-validator";

export class GetTemperatureDto {
  @Type(() => Date)
  @IsDate()
  start: Date;

  @Type(() => Date)
  @IsDate()
  end: Date;

  @Type(() => Number)
  @IsInt()
  region_id: number;
}
