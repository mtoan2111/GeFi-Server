interface IStorage {
    get: <T>(key: string) => T;
    set: <T>(key: string, value: T) => void;
    delete: <T>(key: string) => T;
    contains: (key: string) => boolean;
}

export default IStorage;
