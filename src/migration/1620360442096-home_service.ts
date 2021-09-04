import {MigrationInterface, QueryRunner} from "typeorm";

export class homeService1620360442096 implements MigrationInterface {
    name = 'homeService1620360442096'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ADD "state" boolean`);
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "areaId"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "areaId" character varying(128)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity" DROP COLUMN "areaId"`);
        await queryRunner.query(`ALTER TABLE "entity" ADD "areaId" character varying(256)`);
        await queryRunner.query(`ALTER TABLE "member" DROP COLUMN "state"`);
    }

}
