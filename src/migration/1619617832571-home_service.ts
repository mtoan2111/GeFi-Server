import { MigrationInterface, QueryRunner } from 'typeorm';

export class homeService1619617832571 implements MigrationInterface {
    name = 'homeService1619617832571';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Entity"`);
        await queryRunner.query(
            `CREATE TABLE "entity" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "homeId" character varying(256) NOT NULL, "userId" character varying(128) NOT NULL, "areaId" character varying(256) NOT NULL, "name" character varying(256) NOT NULL, "logo" character varying(512), "parent" character varying(128), "mac" character varying(64) NOT NULL, "fig" character varying(128) NOT NULL, "typeId" character varying(128) NOT NULL, "categoryId" character varying(128) NOT NULL, "connection" character varying(128) NOT NULL, "extra" character varying(1024) NOT NULL, CONSTRAINT "PK_8aaff3129506dac1dcdccc56563" PRIMARY KEY ("id", "homeId", "userId"))`,
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthday"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "birthday" TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "entity"`);
    }
}
