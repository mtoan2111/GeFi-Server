import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class AreaStatistical extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    homeId: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    userId: string = '';

    @Column({ type: 'integer', nullable: true, name: 'centities' })
    cEntities: number = 0;

    @Column({ type: 'integer', nullable: true, name: 'chc' })
    cHC: number = 0;

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';
}
