import { inject, injectable } from 'inversify';
import { Socket } from 'socket.io';
import ILogger from '../../interface/ILogger.interface';
import ICRUD from '../../interface/ICRUD.interface';
import IValidation, { EValidationController, EValidationMethod, TValidationReponse } from '../../interface/IValid.interface';
import IStorage from '../../interface/IStorage.interface';
import { Match } from '../../model/v1/Match.model';
// import { ILogger } from '../../interface/ILogger.interface';
// import { inject } from 'inversify';

@injectable()
class MatchController implements ICRUD {
    constructor(
        @inject('Logger') private logger: ILogger,
        @inject('Validation') private validation: IValidation,
        @inject('Storage') private storage: IStorage,
    ) {}

    get = (..._message: any[]): void => {};

    create = async (socket: Socket, ...message: any): Promise<boolean> => {
        try {
            this.logger.Info({
                path: 'Match.controller',
                resource: 'create:request',
                mess: JSON.stringify(message),
            });

            const validResult: TValidationReponse = this.validation.valid({
                controller: EValidationController.MATCH,
                method: EValidationMethod.CREATE,
                param: message,
            });

            if (validResult.isValid) {
                return socket.emit('error', {
                    code: validResult.reason,
                    resource: 'createMatch',
                });
            }

            const existedMatch = this.storage.contains(message?.matchId);
            if (existedMatch) {
                return socket.emit('error', {
                    code: validResult.reason,
                    resource: 'createMatch',
                });
            }

            this.storage.set<Match>(message?.matchId, {
                id: message?.matchId,
                player: [message?.accountId],
            });

            await socket.join(message?.matchId);

            return socket.emit('response', {
                resource: 'createMatch',
                message: 'done',
                data: '',
            });
        } catch {
            return false;
        }
    };

    join = async (socket: Socket, ...message: any): Promise<boolean> => {
        try {
            this.logger.Info({
                path: 'Match.controller',
                resource: 'create:request',
                mess: JSON.stringify(message),
            });

            const validResult: TValidationReponse = this.validation.valid({
                controller: EValidationController.MATCH,
                method: EValidationMethod.JOIN,
                param: message,
            });

            if (validResult.isValid) {
                return socket.emit('error', {
                    code: validResult.reason,
                    resource: 'joinMatch',
                });
            }

            const existedMatch = this.storage.get<Match | undefined>(message?.matchId);
            if (typeof existedMatch === 'undefined') {
                return socket.emit('error', {
                    code: validResult.reason,
                    resource: 'joinMatch',
                });
            }

            if (existedMatch.player.includes(message.accountId)) {
                return socket.emit('error', {
                    code: validResult.reason,
                    resource: 'joinMatch',
                });
            }

            await socket.join(message?.matchId);

            socket.to(message?.macthId).emit('joined', {
                matchId: message?.matchId,
                accountId: message?.accountId,
            });

            return socket.emit('response', {
                resource: 'joinMatch',
                message: 'done',
                data: '',
            });
        } catch {
            return false;
        }
    };

    play = (..._message: any[]): void => {};
    update = async (..._message: any[]): Promise<void> => {};
    delete = (..._message: any[]): void => {};
}

export default MatchController;
