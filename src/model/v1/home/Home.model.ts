import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class Home extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @PrimaryColumn({ type: 'character varying', length: 128 })
    userId: string = '';

    @Column({ type: 'character varying', length: 256 })
    name: string = '';

    @Column({ type: 'integer', nullable: true })
    position: number = 0;

    @Column({ type: 'character varying', length: 128, nullable: true })
    logo: string = '';

    @Column({ type: 'boolean', nullable: true })
    isOwner: boolean = true;

    @Column({ type: 'character varying', length: 50, nullable: true })
    appCode: string = '';

    @Column({ type: 'float', nullable: true })
    longitude: number = 0;

    @Column({ type: 'float', nullable: true })
    latitude: number = 0;

    @Column({ type: 'character varying', length: 1024, nullable: true })
    address: string = '';
}
