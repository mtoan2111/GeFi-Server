import {MigrationInterface, QueryRunner} from "typeorm";

export class serviceHome1626545665232 implements MigrationInterface {
    name = 'serviceHome1626545665232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "GMT"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "GMT" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "automation" DROP COLUMN "GMT"`);
        await queryRunner.query(`ALTER TABLE "automation" ADD "GMT" integer`);
    }

}
