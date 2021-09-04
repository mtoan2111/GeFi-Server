import { Column } from 'typeorm';

export abstract class Audit {
    @Column({ type: 'timestamp without time zone', nullable: true })
    createdAt: Date = new Date();

    @Column({ type: 'character varying', length: 128, nullable: true })
    createdBy: string = '';

    @Column({ type: 'timestamp without time zone', nullable: true })
    updatedAt: Date = new Date();

    @Column({ type: 'character varying', length: 128, nullable: true })
    updatedBy: string = '';
}
