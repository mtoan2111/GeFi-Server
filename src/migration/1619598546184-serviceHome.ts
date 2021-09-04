import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1619598546184 implements MigrationInterface {
    name = 'serviceHome1619598546184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verify" ("createdAt" TIMESTAMP, "createdBy" character varying(128), "updatedAt" TIMESTAMP, "updatedBy" character varying(128), "id" character varying(128) NOT NULL, "email" character varying(256) NOT NULL, "token" character varying(8) NOT NULL, "flag" character varying(16) NOT NULL, "step" character varying(16) NOT NULL, CONSTRAINT "PK_c554da021aecbe3860c4b631be5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "verify"`);
    }

}
