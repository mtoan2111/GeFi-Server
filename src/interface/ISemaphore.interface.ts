interface ISemaphore {
    take: (resource: string) => void;
    acquire: (resource: string) => Promise<void>;
    release: (resource: string) => void;
    purge: (resource: string) => void;
}

export default ISemaphore;
