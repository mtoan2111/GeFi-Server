import { inject, injectable } from 'inversify';
import ILogger from '../interface/ILogger.interface';
import ISemaphore from '../interface/ISemaphore.interface';

@injectable()
class Semaphore implements ISemaphore {
    private logger: ILogger;
    private max: number = 1;
    private counter = {};
    private waiting = {};

    constructor(@inject('Logger') logger: ILogger) {
        this.logger = logger;
    }

    take = async (resource: string): Promise<void> => {
        try {
            if (this.waiting[resource]?.length > 0 && this.counter[resource] < this.max) {
                this.counter[resource]++;
                const promise = this.waiting[resource]?.shift?.();
                promise?.resolve?.();
            }
        } catch (err) {
            this.logger.Error({ path: 'Semaphore.helper.ts', resource: `acquire:waiting:resource`, mess: err });
        }
    };

    acquire = async (resource: string): Promise<void> => {
        try {
            if (typeof this.counter[resource] === 'undefined') {
                this.counter[resource] = 0;
            }
            this.logger.Info({ path: 'Semaphore.helper.ts', resource: `acquire:counter:resource`, mess: this.counter[resource] });
            if (this.counter[resource] < this.max) {
                this.counter[resource]++;
                return Promise.resolve();
            } else {
                return new Promise((resolve, err) => {
                    if (typeof this.waiting[resource] === 'undefined') {
                        this.waiting[resource] = [];
                    }
                    this.waiting[resource].push({ resolve, err });
                    this.logger.Info({ path: 'Semaphore.helper.ts', resource: `acquire:waiting:resource`, mess: resource });
                });
            }
        } catch (err) {
            this.logger.Error({ path: 'Semaphore.helper.ts', resource: `acquire:waiting:resource`, mess: err });
            return Promise.resolve();
        }
    };

    release = async (resource: string): Promise<void> => {
        try {
            this.counter[resource]--;
            this.take(resource);
            this.logger.Info({ path: 'EntityType.helper.ts', resource: `release:resource`, mess: resource });
        } catch (err) {
            this.logger.Error({ path: 'Semaphore.helper.ts', resource: `acquire:waiting:resource`, mess: err });
        }
    };

    purge = async (resource: string): Promise<void> => {
        try {
            this.waiting[resource]?.map?.((task) => {
                task.err('Task has ben purged');
            });

            this.counter[resource] = 0;
            this.waiting[resource] = [];
        } catch {}
    };
}

export default Semaphore;
