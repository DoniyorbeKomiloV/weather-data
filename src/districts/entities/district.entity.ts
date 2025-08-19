import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("districts")
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  district: string;

  @Column("varchar")
  region_name: string;

  @Column("varchar")
  region_type: string;

  @Column("float")
  latitude: number;

  @Column("float")
  longitude: number;
}
