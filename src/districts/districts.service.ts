import { Injectable } from "@nestjs/common";
import { uzbekistanDistricts } from "../regions";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { District } from "./entities/district.entity";

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
  ) {}

  async populate() {
    for (let i = 0; i < uzbekistanDistricts.length; i++) {
      const district = this.districtRepo.create(uzbekistanDistricts[i]);
      await this.districtRepo.save(district);
    }
    return await this.districtRepo.find();
  }

  async findAll(): Promise<District[]> {
    return await this.districtRepo.find();
  }

  async findOne(id: number): Promise<District | null> {
    return await this.districtRepo.findOneBy({ id });
  }
}
