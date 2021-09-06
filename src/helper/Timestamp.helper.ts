import ITimestamp from '../interface/ITimestamp.Interface';
import { injectable, inject } from 'inversify';
import ILogger from '../interface/ILogger.interface';

@injectable()
class Timestamp implements ITimestamp {
    private logger: ILogger;

    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
    }
    convert = (timestamp: number): string => {
        try {
            const dateTime = new Date(Number(timestamp));
            const year = dateTime.getFullYear();
            let month: string | number = dateTime.getUTCMonth();
            month = month < 9 ? `0${month + 1}` : month + 1;
            let date: string | number = dateTime.getUTCDate();
            date = date < 10 ? `0${date}` : date;
            let hour: string | number = dateTime.getUTCHours();
            hour = hour < 10 ? `0${hour}` : hour;
            let minute: string | number = dateTime.getUTCMinutes();
            minute = minute < 10 ? `0${minute}` : minute;
            let second: string | number = dateTime.getUTCSeconds();
            second = second < 10 ? `0${second}` : second;
            return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
        } catch (err) {
            this.logger.Error({
                path: 'Timestamp.helper',
                resource: 'convert:catch',
                mess: JSON.stringify(err),
            });
            return '1970-01-01 00:00:00';
        }
    };
}

export default Timestamp;
