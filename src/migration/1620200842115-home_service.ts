import {MigrationInterface, QueryRunner} from "typeorm";

export class homeService1620200842115 implements MigrationInterface {
    name = 'homeService1620200842115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "lang" character varying(16)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lang"`);
    }

}
