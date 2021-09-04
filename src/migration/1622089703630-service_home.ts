import { MigrationInterface, QueryRunner } from 'typeorm';

export class serviceHome1622089703630 implements MigrationInterface {
    name = 'serviceHome1622089703630';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "automation" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "userId" character varying(128) NOT NULL, "homeId" character varying(128) NOT NULL, "owner" boolean, "logic" character varying, "active" boolean, "typeId" integer, "trigger" text NOT NULL DEFAULT '{}', "input" text NOT NULL DEFAULT '{}', "output" text NOT NULL DEFAULT '{}', CONSTRAINT "PK_8354ba0a05221dc1b8c91e4a796" PRIMARY KEY ("id", "userId", "homeId"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "automation"`);
    }
}
