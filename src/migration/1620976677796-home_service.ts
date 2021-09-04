import { MigrationInterface, QueryRunner } from 'typeorm';

export class homeService1620976677796 implements MigrationInterface {
    name = 'homeService1620976677796';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "version" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "appName" character varying(256) NOT NULL, "version" character varying(32) NOT NULL, CONSTRAINT "PK_ba07c9f6d7f3b8e965e5abd805f" PRIMARY KEY ("id", "appName"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "version"`);
    }
}
