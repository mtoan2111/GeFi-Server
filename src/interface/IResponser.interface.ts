interface IResponser {
    /**
     * Ok - Response the status code 200 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    Ok: (res: any, mes: any) => void;
    /**
     * Created - Response the status code 201 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    Created: (res: any, mes: any) => void;
    /**
     * NoContent - Response the status code 203 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    NoContent: (res: any, mes: any) => void;
    /**
     * BadRequest - Response the status code 400 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    BadRequest: (res: any, mes: any) => void;
    /**
     * Unauthorized - Response the status code 401 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    Unauthorized: (res: any, mes: any) => void;
    /**
     * Forbiden - Response the status code 403 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    Forbiden: (res: any, mes: any) => void;
    /**
     * NotFound - Response the status code 404 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    NotFound: (res: any, mes: any) => void;
    /**
     * NotAcceptable - Response the status code 406 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    NotAcceptable: (res: any, mes: any) => void;
    /**
     * MethodNotAllow - Response the status code 405 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    MethodNotAllow: (res: any, mes: any) => void;
    /**
     * Conflict - Response the status code 409 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    Conflict: (res: any, mes: any) => void;
    /**
     * UnsupportedMediaType - Response the status code 415 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    UnsupportedMediaType: (res: any, mes: any) => void;
    /**
     * InternalServerError - Response the status code 500 to client
     *
     * @param res - response delegate
     * @param mes - the message will be sent to client
     * @returns void
     *
     */
    InternalServerError: (res: any, mes: any) => void;
}

export default IResponser;
