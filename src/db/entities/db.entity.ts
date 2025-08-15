import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "weather_data" })
@Index(["cityId", "datetime"])
export class WeatherData {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "city_id", type: "int" })
  cityId: number;

  @Column({ type: "timestamp" })
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
