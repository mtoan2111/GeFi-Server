import IETCD from '../interface/IETCD.interface';
import { inject, injectable } from 'inversify';
import ILogger from '../interface/ILogger.interface';
const { Etcd3 } = require('etcd3');

@injectable()
class ETCD implements IETCD {
    private logger: ILogger;
    private etcd3EntityClient: any;
    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
        let etcdUri: string | undefined | null = '192.168.1.44:2379';

        typeof process.env.ETCD_URL !== 'undefined' && (etcdUri = process.env.ETCD_URL);

        if (typeof process.env.ETCD_USER !== 'undefined' && typeof process.env.ECTD_USER !== 'undefined') {
            let etcdUser = 'device';
            typeof process.env.ETCD_USER !== 'undefined' && (etcdUser = process.env.ETCD_USER);

            let etcdPassword = 'xJajESfccMU8too3XKDdWaa';
            typeof process.env.ETCD_PASSWORD !== 'undefined' && (etcdPassword = process.env.ETCD_PASSWORD);

            const auth = {
                username: etcdUser,
                password: etcdPassword,
            };

            this.logger.Info({ path: 'Entity.helper.ts', resource: 'constructor:etcd:auth', mess: JSON.stringify(auth) });
            this.etcd3EntityClient = new Etcd3({
                hosts: etcdUri,
                auth,
            });
        }

        this.etcd3EntityClient = new Etcd3({
            hosts: etcdUri,
        });
    }
    get = <T>(topic: string): Promise<T> => {
        try {
            return this.etcd3EntityClient
                .get(topic)
                .then((value) => {
                    if (value) {
                        return JSON.parse(value) as T;
                    }
                    return undefined as any as T;
                })
                .catch(() => {
                    return Promise.resolve(undefined as any as T);
                });
        } catch {
            return Promise.resolve(undefined as any as T);
        }
    };

    put = <T>(topic: string, value: T): Promise<any> => {
        try {
            return this.etcd3EntityClient.put(topic).value(value);
        } catch (err) {
            return Promise.resolve(undefined);
        }
    };

    delete = (topic: string): Promise<any> => {
        try {
            return this.etcd3EntityClient.delete().key(topic);
        } catch (err) {
            return Promise.resolve(undefined);
        }
    };
}

export default ETCD;
