interface IETCD {
    put: <T>(topic: string, value: T) => Promise<boolean>;
    get: <T>(topic: string) => Promise<T>;
    delete: (topic: string) => Promise<boolean>;
}

export default IETCD;
