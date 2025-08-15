import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWeatherPartitions1755089646030
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS weather_data CASCADE;`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS weather_data
      (
        id            BIGSERIAL,
        city_id       INT       NOT NULL,
        datetime      TIMESTAMP NOT NULL,
        temperature   REAL,
        humidity      REAL,
        wind_speed    REAL,
        precipitation REAL,
        weather_code  SMALLINT,
        created_at    TIMESTAMP DEFAULT now(),
        updated_at    TIMESTAMP DEFAULT now(),
        PRIMARY KEY (id, datetime)
      ) PARTITION BY RANGE (datetime);
    `);
    const startYear = 1980;
    const currentYear = new Date().getFullYear();

    for (let year = startYear; year <= currentYear; year++) {
      const nextYear = year + 1;

      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS weather_data_${year} PARTITION OF weather_data
          FOR VALUES FROM ('${year}-01-01') TO ('${nextYear}-01-01');
      `);

      await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS idx_weather_city_time_${year}
          ON weather_data_${year} (city_id, datetime);
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const startYear = 1980;
    const currentYear = new Date().getFullYear();

    for (let year = startYear; year <= currentYear; year++) {
      await queryRunner.query(
        `DROP TABLE IF EXISTS weather_data_${year} CASCADE;`,
      );
    }

    await queryRunner.query(`DROP TABLE IF EXISTS weather_data CASCADE;`);
  }
}
