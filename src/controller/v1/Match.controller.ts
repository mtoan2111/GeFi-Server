import { inject, injectable } from 'inversify';
import { Socket } from 'socket.io';
import ILogger from '../../interface/ILogger.interface';
import ICRUD from '../../interface/ICRUD.interface';
import IValidation, { EValidationController, EValidationMethod, TValidationReponse } from '../../interface/IValid.interface';
import IStorage from '../../interface/IStorage.interface';
import { Match } from '../../model/v1/Match.model';
import { ErrorCode } from '../../response/Error.response';

@injectable()
class MatchController implements ICRUD {
    constructor(
        @inject('Logger') private logger: ILogger,
        @inject('Validation') private validation: IValidation,
        @inject('Storage') private storage: IStorage,
    ) {}

    get = (..._message: any[]): void => {};

    create = async (socket: Socket, message: any): Promise<boolean> => {
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

            if (!validResult.isValid) {
                return socket.emit('error', {
                    code: validResult.reason,
                    resource: 'createMatch',
                });
            }

            const existedMatch = this.storage.contains(message?.matchId);
            this.logger.Info({
                path: 'Match.controller',
                resource: 'create:existedMatch',
                mess: JSON.stringify(existedMatch),
            });
            if (existedMatch) {
                return socket.emit('error', {
                    code: ErrorCode.NSERR_MATCHEXISTED,
                    resource: 'createMatch',
                });
            }

            this.storage.set<Match>(message?.matchId, {
                id: message?.matchId,
                player: [message?.accountId],
            });

            await socket.join(message?.matchId);

            this.logger.Info({
                path: 'Match.controller',
                resource: 'create:existedMatch',
                mess: JSON.stringify(existedMatch),
            });

            return socket.emit('response', {
                resource: 'match::create',
                message: 'done',
                data: '',
            });
        } catch (err) {
            return false;
        }
    };

    join = async (socket: Socket, message: any): Promise<boolean> => {
        try {
            this.logger.Info({
                path: 'Match.controller',
                resource: 'join:request',
                mess: JSON.stringify(message),
            });

            const validResult: TValidationReponse = this.validation.valid({
                controller: EValidationController.MATCH,
                method: EValidationMethod.JOIN,
                param: message,
            });

            this.logger.Info({
                path: 'Match.controller',
                resource: 'join:validResult',
                mess: JSON.stringify(validResult),
            });

            if (!validResult.isValid) {
                return socket.emit('error', {
                    code: validResult.reason,
                    resource: 'match::join',
                });
            }

            const existedMatch = this.storage.get<Match | undefined>(message?.matchId);

            this.logger.Info({
                path: 'Match.controller',
                resource: 'join:existedMatch',
                mess: JSON.stringify(existedMatch),
            });

            if (typeof existedMatch === 'undefined') {
                return socket.emit('error', {
                    code: ErrorCode.NSERR_MATCHNOTFOUND,
                    resource: 'match::join',
                });
            }

            if (existedMatch.player.includes(message.accountId)) {
                return socket.emit('error', {
                    code: ErrorCode.NSERR_USERNOTFOUND,
                    resource: 'match::join',
                });
            }

            if (existedMatch.player.length > 2) {
                return socket.emit('error', {
                    code: ErrorCode.NSERR_USERENOUGH,
                    resource: 'match::join',
                });
            }

            this.storage.set<Match>(existedMatch.id, {
                ...existedMatch,
                player: [existedMatch.player[0], message?.accountId],
            });

            await socket.join(message?.matchId);

            socket.to(message?.matchId).emit('response', {
                resource: 'match::join',
                message: 'done',
                data: {
                    player: [existedMatch.player[0], message?.accountId],
                    canStart: true,
                    first: existedMatch.player[0],
                },
            });

            return socket.emit('response', {
                resource: 'match::join',
                message: 'done',
                data: {
                    player: [existedMatch.player[0], message?.accountId],
                    canStart: true,
                    first: existedMatch.player[0],
                },
            });
        } catch {
            return false;
        }
    };

    start = async (socket: Socket, message: any): Promise<boolean> => {
        try {
            this.logger.Info({
                path: 'Match.controller',
                resource: 'start:request',
                mess: JSON.stringify(message),
            });

            const validResult: TValidationReponse = this.validation.valid({
                controller: EValidationController.MATCH,
                method: EValidationMethod.START,
                param: message,
            });

            if (!validResult.isValid) {
                return socket.emit('error', {
                    code: validResult.reason,
                    resource: 'match::start',
                });
            }

            const existedMatch = this.storage.get<Match | undefined>(message?.matchId);

            this.logger.Info({
                path: 'Match.controller',
                resource: 'start:existedMatch',
                mess: JSON.stringify(existedMatch),
            });

            if (typeof existedMatch === 'undefined') {
                return socket.emit('error', {
                    code: ErrorCode.NSERR_MATCHNOTFOUND,
                    resource: 'match::start',
                });
            }

            if (existedMatch.player.length !== 2) {
                return socket.emit('error', {
                    code: ErrorCode.NSERR_USERNOTENOUGH,
                    resource: 'match::start',
                });
            }

            socket.to(existedMatch.id).emit('response', {
                resource: 'match::start',
                message: 'done',
                data: {
                    player: existedMatch.player,
                    first: existedMatch.player[0],
                },
            });

            return socket.emit('response', {
                resource: 'match::start',
                message: 'done',
                data: {
                    player: existedMatch.player,
                    first: existedMatch.player[0],
                },
            });
        } catch (err) {
            return false;
        }
    };

    play = (socket, message: any): void => {
        this.logger.Info({
            path: 'Match.controller',
            resource: 'play:request',
            mess: JSON.stringify(message),
        });

        const validResult: TValidationReponse = this.validation.valid({
            controller: EValidationController.MATCH,
            method: EValidationMethod.PLAY,
            param: message,
        });

        this.logger.Info({
            path: 'Match.controller',
            resource: 'play:validResult',
            mess: JSON.stringify(validResult),
        });

        if (!validResult.isValid) {
            return socket.emit('error', {
                code: validResult.reason,
                resource: 'match::play',
            });
        }

        const existedMatch = this.storage.get<Match | undefined>(message?.matchId);

        this.logger.Info({
            path: 'Match.controller',
            resource: 'play:existedMatch',
            mess: JSON.stringify(existedMatch),
        });

        if (typeof existedMatch === 'undefined') {
            return socket.emit('error', {
                code: ErrorCode.NSERR_MATCHNOTFOUND,
                resource: 'match::play',
            });
        }

        if (!existedMatch.player.includes(message.accountId)) {
            return socket.emit('error', {
                code: ErrorCode.NSERR_USERNOTFOUND,
                resource: 'match::play',
            });
        }

        socket.to(message?.matchId).emit('response', {
            resource: 'match::play',
            message: 'done',
            data: {
                player: message?.accountId,
                matchId: message?.matchId,
                coordinate: {
                    x: message?.x,
                    y: message?.y,
                },
            },
        });

        return socket.emit('response', {
            resource: 'match::play',
            message: 'done',
            data: {
                player: message?.accountId,
                matchId: message?.matchId,
                coordinate: {
                    x: message?.x,
                    y: message?.y,
                },
            },
        });
    };

    finish = async (socket, message: any): Promise<boolean> => {
        this.logger.Info({
            path: 'Match.controller',
            resource: 'finish:request',
            mess: JSON.stringify(message),
        });

        const validResult: TValidationReponse = this.validation.valid({
            controller: EValidationController.MATCH,
            method: EValidationMethod.FINISH,
            param: message,
        });

        this.logger.Info({
            path: 'Match.controller',
            resource: 'finish:validResult',
            mess: JSON.stringify(validResult),
        });

        if (!validResult.isValid) {
            return socket.emit('error', {
                code: validResult.reason,
                resource: 'match::finish',
            });
        }

        const existedMatch = this.storage.get<Match | undefined>(message?.matchId);

        this.logger.Info({
            path: 'Match.controller',
            resource: 'finish:existedMatch',
            mess: JSON.stringify(existedMatch),
        });

        if (typeof existedMatch === 'undefined') {
            return socket.emit('error', {
                code: ErrorCode.NSERR_MATCHNOTFOUND,
                resource: 'match::finish',
            });
        }

        socket.to(message?.matchId).emit('response', {
            resource: 'match::finish',
            message: 'done',
            data: {
                reason: message?.reason,
                matchId: message?.matchId,
                winner: message?.winner,
            },
        });

        return socket.emit('response', {
            resource: 'match::finish',
            message: 'done',
            data: {
                reason: message?.reason,
                matchId: message?.matchId,
                winner: message?.winner,
            },
        });
    };

    complete = async (socket, message: any): Promise<boolean> => {
        this.logger.Info({
            path: 'Match.controller',
            resource: 'complete:request',
            mess: JSON.stringify(message),
        });

        const validResult: TValidationReponse = this.validation.valid({
            controller: EValidationController.MATCH,
            method: EValidationMethod.COMPLETE,
            param: message,
        });

        this.logger.Info({
            path: 'Match.controller',
            resource: 'complete:validResult',
            mess: JSON.stringify(validResult),
        });

        if (!validResult.isValid) {
            return socket.emit('error', {
                code: validResult.reason,
                resource: 'match::finish',
            });
        }

        const existedMatch = this.storage.get<Match | undefined>(message?.matchId);

        this.logger.Info({
            path: 'Match.controller',
            resource: 'finish:existedMatch',
            mess: JSON.stringify(existedMatch),
        });

        if (typeof existedMatch === 'undefined') {
            return socket.emit('error', {
                code: validResult.reason,
                resource: 'match::finish',
            });
        }

        socket.to(message?.matchId).emit('response', {
            resource: 'match::finish',
            message: 'done',
            data: {
                reason: message?.reason,
                matchId: message?.matchId,
                winner: message?.winner,
            },
        });

        return socket.emit('response', {
            resource: 'match::finish',
            message: 'done',
            data: {
                reason: message?.reason,
                matchId: message?.matchId,
                winner: message?.winner,
            },
        });
    };

    delete = (..._message: any[]): void => {};
    update = async (..._message: any[]): Promise<void> => {};
}

export default MatchController;
