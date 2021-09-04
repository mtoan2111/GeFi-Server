import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class Area extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    userId: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    homeId: string = '';

    @Column({ type: 'character varying', length: 256 })
    name: string = '';

    @Column({ type: 'integer', nullable: true })
    position: number = 0;

    @Column({ type: 'character varying', length: 128, nullable: true })
    logo: string = '';

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';
}
