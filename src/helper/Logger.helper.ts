import ILogger, { TLogger } from '../interface/ILogger.interface';
import { injectable } from 'inversify';

@injectable()
class Logger implements ILogger {
    red: string = '\x1b[31m';
    green: string = '\x1b[32m';
    yellow: string = '\x1b[33m';
    reset: string = '\x1b[0m';

    Warning = (option: TLogger): void => {
        try {
            const { path, resource, mess } = option;
            const logLevel = process.env.LOG_LEVEL;
            (logLevel === 'warning' || logLevel === '*') &&
                console.log(`${this.yellow}[W]${this.reset} ==> ${this.yellow}[${path}]${this.reset} ==> ${this.yellow}[${resource}]${this.reset} => ${mess}`);
        } catch {}
    };

    Info = (option: TLogger): void => {
        try {
            const { path, resource, mess } = option;
            const logLevel = process.env.LOG_LEVEL;
            (logLevel === 'info' || logLevel === '*') &&
                console.log(`${this.green}[I]${this.reset} ==> ${this.green}[${path}]${this.reset} ==> ${this.green}[${resource}]${this.reset} => ${mess}`);
        } catch {}
    };

    Error = (option: TLogger): void => {
        try {
            const { path, resource, mess } = option;
            const logLevel = process.env.LOG_LEVEL;
            (logLevel === 'error' || logLevel === '*') &&
                console.log(`${this.red}[E]${this.reset} ==> ${this.red}[${path}]${this.reset} ==> ${this.red}[${resource}]${this.reset} => ${mess}`);
        } catch {}
    };
}

export default Logger;
