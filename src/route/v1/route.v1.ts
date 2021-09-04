import MatchController from '../../controller/v1/Match.controller';
import { Socket } from 'socket.io';
import { container } from '../../../inversify.config';

const matchController = container.get<MatchController>('MatchController');

export const initRoute = async (socket: Socket): Promise<void> => {
    try {
        socket.on('match::create', matchController.create);
        socket.on('match::join', matchController.join);
        socket.on('match::play', matchController.play);
    } catch (err) {}
};
