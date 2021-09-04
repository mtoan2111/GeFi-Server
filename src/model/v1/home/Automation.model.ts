import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class Automation extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    userId: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    homeId: string = '';

    @Column({ type: 'character varying', length: 128, nullable: true })
    hcId: string = '';

    @Column({ type: 'boolean', nullable: true })
    owner: boolean = true;

    @Column({ type: 'character varying', length: 32, nullable: true })
    logic: string = '';

    @Column({ type: 'boolean', nullable: true })
    active: boolean = true;

    @Column({ type: 'character varying', length: 32, nullable: true })
    type: string = '';

    @Column({ type: 'jsonb', default: {} })
    trigger: any = {};

    // @Column({ type: 'jsonb', default: {} })
    // input: object = {};

    // @Column({ type: 'jsonb', default: {} })
    // output: object = {};

    @Column({ type: 'jsonb', default: {} })
    hcInfo: any = {};

    @Column({ type: 'jsonb', default: {} })
    raw: any = {};

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';

    @Column({ type: 'character varying', length: 128, nullable: true })
    logo: string = '';

    @Column({ type: 'integer', nullable: true })
    position: number = 0;

    @Column({ type: 'character varying', length: 256, nullable: true })
    name: string = '';

    @Column({ type: 'character varying', length: 128, nullable: true, array: true, default: {} })
    inputIds: string[] = [];

    @Column({ type: 'character varying', length: 128, nullable: true, array: true, default: {} })
    outputIds: string[] = [];

    @Column({ type: 'float', nullable: true })
    GMT: number = 0;
}
