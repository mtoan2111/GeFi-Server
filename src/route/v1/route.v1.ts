import MatchController from '../../controller/v1/Match.controller';
import { Socket } from 'socket.io';
import { container } from '../../../inversify.config';

const matchController = container.get<MatchController>('MatchController');

export const initRoute = async (socket: Socket): Promise<void> => {
    try {
        socket.on('match::create', (message) => {
            matchController.create(socket, message);
        });
        socket.on('match::join', (message) => matchController.join(socket, message));
        socket.on('match::start', (message) => matchController.start(socket, message));
        socket.on('match::play', (message) => matchController.play(socket, message));
        socket.on('match::finish', (message) => matchController.finish(socket, message));
        socket.on('match::complete', (message) => matchController.complete(socket, message));
    } catch (err) {}
};
