import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT as string),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: false,
    logging: ['error'],
    entities: ['src/model/**/*{.ts,.js}'],
    migrations: ['src/migration/**/*{.ts,.js}'],
    subscribers: ['src/subscriber/**/*{.ts,.js}'],
    cli: {
        entitiesDir: 'src/model',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
};

export = config;
