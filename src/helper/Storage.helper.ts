import { injectable } from 'inversify';
import IStorage from '../interface/IStorage.interface';

@injectable()
class Storage implements IStorage {
    private store = {};

    get = <T>(key: string): T => {
        if (!(key in this.store)) {
            return undefined as any as T;
        }
        return this.store[key] as T;
    };

    set = <T>(key: string, value: T): void => {
        this.store[key] = {
            ...value,
        };
    };

    delete = <T>(key: string): T => {
        let value: T = undefined as any as T;
        if (key in this.store) {
            value = this.store[key];
            delete this.store[key];
        }
        return value;
    };

    contains = (key: string): boolean => {
        return key in this.store;
    };
}

export default Storage;
