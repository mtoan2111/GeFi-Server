import ISocketIO from '../interface/SocketIO.interface';
import ILogger from '../interface/ILogger.interface';
import { inject, injectable } from 'inversify';

@injectable()
class SocketIO implements ISocketIO {
    constructor(@inject('Logger') public logger: ILogger) {
        
    }
}

export default SocketIO;
