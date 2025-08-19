import {
  Entity,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@Entity({ name: "weather_data" })
@Index(["cityId", "datetime"]) // useful for queries, but PK already ensures uniqueness
export class WeatherData {
  @PrimaryColumn({ name: "city_id", type: "int" })
  cityId: number;

  @PrimaryColumn({ type: "timestamp" })
  datetime: Date;

  @Column({ type: "real", nullable: true })
  temperature: number;

  @Column({ type: "real", nullable: true })
  humidity: number;

  @Column({ type: "real", nullable: true })
  wind_speed: number;

  @Column({ type: "real", nullable: true })
  precipitation: number;

  @Column({ type: "smallint", nullable: true })
  weather_code: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
