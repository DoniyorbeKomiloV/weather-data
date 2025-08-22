import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "weather_data" })
export class WeatherData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("timestamp without time zone")
  datetime: Date;

  @Column("smallint")
  region: number;

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
