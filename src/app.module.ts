import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppDataSource } from "./app.data-source";
import { DbModule } from "./db/db.module";
import { DistrictsModule } from "./districts/districts.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options),
    DbModule,
    DistrictsModule,
  ],
})
export class AppModule {}
