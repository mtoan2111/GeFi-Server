export interface TLogger {
    path: string | undefined | null;
    resource: string | undefined | null;
    mess: any;
}

interface ILogger {
    /**
     * Push a debug information to stdin
     *
     * @remarks
     * Need to be set the DEBUG_LEVEL to 'debug' in .env file
     *
     * @param mes - the message will be shown in stdin
     * @returns void
     *
     */
    Info: (option: TLogger) => void;
    /**
     * Push a debug warning to stdin
     *
     * @remarks
     * Need to be set the DEBUG_LEVEL to 'debug' in .env file
     *
     * @param mes - the message will be shown in stdin
     * @returns void
     *
     */
    Warning: (option: TLogger) => void;
    /**
     * Push a debug warning to stdin
     *
     * @remarks
     * Need to be set the DEBUG_LEVEL to 'debug' in .env file
     *
     * @param mes - the message will be shown in stdin
     * @returns void
     *
     */
    Error: (option: TLogger) => void;
}

export default ILogger;
