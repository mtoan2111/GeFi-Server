import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import ILogger from '../src/interface/ILogger.interface';
import { container } from '../inversify.config';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { initRoute } from './route/v1/route.v1';

const logger = container.get<ILogger>('Logger');
const init = (): void => {
    try {
        logger.Info({
            path: 'index.ts',
            resource: 'init',
            mess: 'init server',
        });

        !process.env.PORT && process.exit(1);
        const PORT: number = parseInt(process.env.PORT as string, 10);
        const httpServer = createServer();
        const io = new Server(httpServer, {});

        io.on('connection', (socket: Socket) => {
            logger.Info({
                path: 'index.ts',
                resource: 'init:socket:connection',
                mess: socket.id,
            });

            initRoute(socket);

            socket.on('error', (data) => {
                logger.Info({
                    path: 'index.ts',
                    resource: 'init:socket:error',
                    mess: JSON.stringify(data),
                });
            });
        });

        httpServer.listen(PORT);
    } catch (err) {
        console.log(err);
    }
};

init();
