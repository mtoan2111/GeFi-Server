import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Audit } from './Audit.model';

@Entity()
export class User extends Audit {
    @PrimaryColumn({ type: 'character varying', length: 128 })
    id: string = '';

    @Column({ type: 'character varying', length: 256 })
    name: string = '';

    @Column({ type: 'character varying', length: 32, nullable: true })
    phone: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    email: string = '';

    @Column({ type: 'character varying', length: 512, nullable: true })
    address: string = '';

    @Column({ type: 'character varying', length: 512, nullable: true })
    fcm: string = '';

    @Column({ type: 'character varying', length: 512, nullable: true })
    avatar: string = '';

    @Column({ type: 'character varying', length: 16, nullable: true })
    lang: string = '';

    @Column({ type: 'character varying', length: 256, nullable: true })
    appCode: string = '';
}
