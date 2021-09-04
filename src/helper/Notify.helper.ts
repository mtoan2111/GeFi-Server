import INotify from '../interface/INotify.interface';
import ILogger from '../interface/ILogger.interface';
import { injectable, inject } from 'inversify';
// import FCM from 'fcm-node';
var FCM = require('fcm-node');

@injectable()
class Notify implements INotify {
    private logger: ILogger;
    private fcm: any;
    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
        // this.fcm = new FCM(process.env.FCM_KEY);
        this.fcm = new FCM(
            'AAAAj29las8:APA91bFy3RiCEUdiBPxvcts-JdRbj9ukKs_UlM3tgmkQBOk6c06HjwJfo2OFfgqy23LJqRNN1YnesbNCcmwbTGsJ-31HO8OIfiyhtpRHuwNMaRHXqZ0fuC2AMzx8y5kiJHMTMSO47g77',
        );
    }

    publish = (to: string, message: string): void => {
        try {
            const payload = {
                to,
                notification: {
                    title: 'Phenikaa Life',
                    body: message,
                },
            };

            this.fcm.send(payload, (err, response) => {
                if (err) {
                    this.logger.Error({ path: 'Notify.helper.ts', resource: 'publish:send:catch', mess: err });
                } else {
                    this.logger.Info({ path: 'Notify.helper.ts', resource: 'publish:send:success', mess: response });
                }
            });
        } catch (err) {
            this.logger.Error({ path: 'Notify.helper.ts', resource: 'publish:catch', mess: err });
        }
    };
}

export default Notify;
