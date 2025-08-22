import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppDataSource } from "./app.data-source";
import { DbModule } from "./db/db.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options),
    DbModule,
  ],
})
export class AppModule {}
