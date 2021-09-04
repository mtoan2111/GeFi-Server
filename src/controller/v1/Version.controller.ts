import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Version } from '../../model/v1/home/Version.model';
import { getConnection, getRepository } from 'typeorm';
import { ErrorCode } from '../../response/Error.response';
import ICRUD from '../../interface/ICRUD.interface';
import ILogger from '../../interface/ILogger.interface';
import ISemaphore from 'src/interface/ISemaphore.interface';
import IResponser from '../../interface/IResponser.interface';
import ITimestamp from '../../interface/ITimestamp.Interface';

@injectable()
class VersionController implements ICRUD {
    private logger: ILogger;
    private responser: IResponser;
    private timestamp: ITimestamp;
    private semaphore: ISemaphore;
    constructor(
        @inject('Logger') logger: ILogger,
        @inject('Responser') responser: IResponser,
        @inject('Timestamp') timestamp: ITimestamp,
        @inject('Semaphore') semaphore: ISemaphore,
    ) {
        this.logger = logger;
        this.responser = responser;
        this.timestamp = timestamp;
        this.semaphore = semaphore;
    }
    /**
     * ## Find the version that satisfy the input conditions
     *
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/area
     *
     * **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     *
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id| optional | nvarchar(128) | The id of the area will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be searched|
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
     *      message: 'done',
     *      data: {
     *          id: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          appCode: string,
     *          version: string,
     *      }
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the version will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |appCode | string | The app name of the application |
     * |version | string | The highest version of application |
     *
     */
    get = async (req: Request, res: Response): Promise<void> => {
        try {
            const param: any = req.query;
            const version: Version | undefined = await getRepository(Version)
                .createQueryBuilder('version')
                .where(typeof param.id !== 'undefined' && param.id !== '' ? 'version.id = :id' : '1 = 1', {
                    id: param.id,
                })
                .andWhere('version.appCode = :appCode', { appCode: param.appCode })
                .select(['version.id AS id', 'version.appCode AS appCode', 'version.version AS version'])
                .getRawOne();

            this.logger.Info({ path: 'Version.controller.ts', resource: 'get:version', mess: JSON.stringify(version) });

            return this.responser.Ok(res, { message: 'done', data: version || {} });
        } catch (err) {
            this.logger.Error({ path: 'Version.controller.ts', resource: 'get:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };
    /**
     * ## Create a version
     *
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/area
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be created|
     * |verison | required | nvarchar(32) | The version of the application that need to be created|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception has been raised |
     * |<span style="color:red">401</span> | Occur if don't have permission to create area |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     * |<span style="color:red">409</span> | Occur if the area has been existed |
     *
     * - Response will be in the format as the below
     *
     * ```json
     * {
     *      message: ''
     * }
     * ```
     *
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |message | string | The message will be responsed to client|
     *
     */
    create = async (req: Request, res: Response): Promise<void> => {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const param: any = req.body;
            const existedVersion: Version | undefined = await getRepository(Version)
                .createQueryBuilder('version')
                .where('version.appCode = :appCode', { appCode: param.appCode })
                .andWhere('version.version = :version', { version: param.version })
                .getOne();

            this.logger.Info({ path: 'Version.controller.ts', resource: 'create:existedVersion', mess: JSON.stringify(existedVersion) });

            if (typeof existedVersion !== 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'create:existedVersion', mess: ErrorCode.NSERR_VERSIONEXISTED });
                return this.responser.Conflict(res, { code: ErrorCode.NSERR_VERSIONEXISTED });
            }

            const nowTimestamp = this.timestamp.convert(Date.now());

            let tmpVersionId: string = '';
            while (tmpVersionId == '') {
                let uId: string = uuidv4();
                const eVersion: Version | undefined = await getRepository(Version)
                    .createQueryBuilder('version')
                    .where('version.id = :id', { id: uId })
                    .andWhere('version.appCode = :appCode', { appCode: param.appCode })
                    .getOne();
                if (typeof eVersion === 'undefined') {
                    tmpVersionId = uId;
                }
            }

            const versionTmp = {
                id: tmpVersionId,
                appCode: param.appCode,
                version: param.version,
            };

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            await queryBuilder
                .insert()
                .into(Version)
                .values({
                    ...versionTmp,
                    createdAt: nowTimestamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryRunner.commitTransaction();
            this.logger.Info({ path: 'Version.controller.ts', resource: 'create:versionTmp', mess: JSON.stringify(versionTmp) });

            return this.responser.Created(res, { message: 'done', data: { ...versionTmp } });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Version.controller.ts', resource: 'create:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
        }
    };
    /**
     * ## Update an existed area that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/area
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The id of the area that need to be updated|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be updated|
     * |version | optional | nvarchar(32) | The version of the application that need to be updated|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception raised or nothing is changed |
     * |<span style="color:red">401</span> | Occur if don't have permission |
     * |<span style="color:red">404</span> | Occur if the version could not be found in the db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - Response will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |message | string | The message will be responsed to client|
     *
     */
    update = async (req: Request, res: Response): Promise<void> => {
        const lockResource = `/home/${req.body.id}/${req.body.appCode}/updateVersion`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const param: any = req.body;
            let isChanged: boolean = false;
            const existedVersion: Version | undefined = await getRepository(Version)
                .createQueryBuilder('version')
                .where('version.id = :id', { id: param.id })
                .andWhere('version.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Version.controller.ts', resource: 'update:existedVersion', mess: JSON.stringify(existedVersion) });

            if (typeof existedVersion === 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'update:existedVersion', mess: ErrorCode.NSERR_VERSIONNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_VERSIONNOTFOUND });
            }

            let versionTmp = {
                id: existedVersion?.id,
                version: existedVersion?.version,
                appCode: existedVersion?.appCode,
            };

            if (param.version && typeof param.version !== 'undefined' && param.version !== '' && existedVersion!?.version !== param.version) {
                if (parseFloat(param.version) <= parseFloat(existedVersion!?.version)) {
                    return this.responser.BadRequest(res, { code: ErrorCode.NSERR_VERSIONLOWER });
                }
                isChanged = true;
                versionTmp.version = param.version;
            }

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            if (isChanged) {
                const nowTimestamp = this.timestamp.convert(Date.now());
                await queryBuilder
                    .update(Version)
                    .set({
                        ...versionTmp,
                        updatedAt: nowTimestamp,
                        updatedBy: param.userId,
                    })
                    .where('id = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();
                await queryRunner.commitTransaction();
                this.logger.Info({ path: 'Version.controller.ts', resource: 'update:versionTmp', mess: JSON.stringify(versionTmp) });
                return this.responser.Ok(res, { message: 'done', data: { ...versionTmp } });
            }
            return this.responser.BadRequest(res, { code: ErrorCode.NSERR_NOTHINGTOBECHANGED });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Version.controller.ts', resource: 'update:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
    /**
     * ## Delete an existed area that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#f93e3e; padding: 2px 15px; border-radius: 5px; color: white">DELETE</span> /home/v1/area
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The id of the version that need to be deleted|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be deleted|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception raised or nothing is changed |
     * |<span style="color:red">401</span> | Occur if don't have permission to delete the version |
     * |<span style="color:red">404</span> | Occur if the version could not be found in the db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - Response will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |message | string | The message will be responsed to client|
     */
    delete = async (req: Request, res: Response): Promise<void> => {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const param: any = req.body;
            const existedVersion: Version | undefined = await getRepository(Version)
                .createQueryBuilder('version')
                .where('Version.id = :id', { id: param.id })
                .andWhere('Version.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Version.controller.ts', resource: 'delete:existedVersion', mess: JSON.stringify(existedVersion) });

            if (typeof existedVersion === 'undefined') {
                this.logger.Error({ path: 'User.controller.ts', resource: 'delete:existedVersion', mess: ErrorCode.NSERR_VERSIONNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_VERSIONNOTFOUND });
            }

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            await queryBuilder
                .delete()
                .from(Version)
                .where('id = :versionId', { versionId: param.id })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryRunner.commitTransaction();
            return this.responser.Ok(res, { message: 'Version has been deleted' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Version.controller.ts', resource: 'delete:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
        }
    };
}

export default VersionController;
