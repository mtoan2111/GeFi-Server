import {MigrationInterface, QueryRunner} from "typeorm";

export class homeService1619665931982 implements MigrationInterface {
    name = 'homeService1619665931982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entity" ALTER COLUMN "areaId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "entity"."areaId" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "entity"."areaId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "entity" ALTER COLUMN "areaId" SET NOT NULL`);
    }

}
