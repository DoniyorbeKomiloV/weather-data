import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DbModule } from "./db/db.module";
import { ConfigModule } from "@nestjs/config";
import { AppDataSource } from "./app.data-source";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options),
    DbModule,
  ],
})
export class AppModule {}
