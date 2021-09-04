import { Socket } from 'socket.io';

interface ICRUD {
    get: (socket: Socket, ..._message: any[]) => void;
    create: (socket: Socket, ..._message: any[]) => Promise<boolean>;
    update: (socket: Socket, ..._message: any[]) => Promise<void>;
    delete: (socket: Socket, ..._message: any[]) => void;
}

export default ICRUD;
