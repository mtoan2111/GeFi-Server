import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1621928824585 implements MigrationInterface {
    name = 'serviceHome1621928824585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "area_statistical" RENAME COLUMN "cHC" TO "chc"`);
        await queryRunner.query(`ALTER TABLE "home_statistical" RENAME COLUMN "cHC" TO "chc"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "home_statistical" RENAME COLUMN "chc" TO "cHC"`);
        await queryRunner.query(`ALTER TABLE "area_statistical" RENAME COLUMN "chc" TO "cHC"`);
    }

}
