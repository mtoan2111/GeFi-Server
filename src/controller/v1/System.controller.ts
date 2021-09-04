import { Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import Package from '../../../package.json';
import ICRUD from '../../interface/ICRUD.interface';
import ILogger from '../../interface/ILogger.interface';
import IResponser from '../../interface/IResponser.interface';

@injectable()
class EntityTypeController implements ICRUD {
    private logger: ILogger;
    private responser: IResponser;

    constructor(@inject('Logger') logger: ILogger, @inject('Responser') responser: IResponser) {
        this.logger = logger;
        this.responser = responser;
    }
    /**
     * ## Find the users that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/entity-type
     *
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`.
     * - **Note:** Need to add `jwt token` into the header to bypass gateway.
     *
     * ```js
     *      headers['Authorization'] = `${jwt_token}`
     * ```
     *
     * @param req - the request delegate of client
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a list of areas by query|
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if don't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - List of areas will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     *      data: [{
     *          catId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          catName: string,
     *          catLogo: string,
     *          type: [
     *              {
     *                  typeId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *                  typeName: string
     *                  familyId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *                  familyName: string
     *                  connectionId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *                  connectionName: string
     *                  catId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *                  catName: string
     *                  catLogo: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *              }
     *          ]
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |catId | string | The id of the category will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |catName | string | The name of the category |
     * |catLogo | string | The logo of the category |
     * |type | array | The list of the device type |
     * |typeId | string | The id of device type|
     * |typeName | string | The name of device type|
     *
     */
    get = async (_req: Request, _res: Response): Promise<void> => {};
    create = async (_req: Request, _res: Response): Promise<void> => {};
    update = async (_req: any = {}, _res: any = {}): Promise<void> => {};
    delete = async (_req: any = {}, _res: any = {}): Promise<void> => {};
    ping = async (_req: Request, res: Response): Promise<void> => {
        try {
            const version = Package.version;
            const env = process.env.NODE_ENV;
            const message = {
                message: 'pong',
                env,
                version,
            };

            return this.responser.Ok(res, { ...message });
        } catch (err) {
            this.logger.Error(err);
            return this.responser.BadRequest(res, { message: err });
        }
    };
}

export default EntityTypeController;
