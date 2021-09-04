import { inject, injectable } from 'inversify';
import ILogger from '../interface/ILogger.interface';
import IResponser from '../interface/IResponser.interface';

@injectable()
class Response implements IResponser {
    private logger: ILogger;
    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
    }
    Ok = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(200)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    Created = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(201)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    NoContent = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(204)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    BadRequest = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(400)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    Unauthorized = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(401)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    Forbiden = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(403)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    NotFound = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(404)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    MethodNotAllow = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(405)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    NotAcceptable = (res: any, mes: any = {}): void => {
        try{
            if (typeof res !== 'undefined'){
                res?.status?.(406)?.json?.(mes)
            }
        } catch (err) {
            this.logger.Error(err);
        }
    }

    Conflict = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(409)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    UnsupportedMediaType = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(415)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };

    InternalServerError = (res: any, mes: any = {}): void => {
        try {
            if (typeof res !== 'undefined') {
                res?.status?.(500)?.json?.(mes);
            }
        } catch (err) {
            this.logger.Error(err);
        }
    };
}

export default Response;
