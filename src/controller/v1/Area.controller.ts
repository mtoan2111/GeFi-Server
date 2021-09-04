import { v4 as uuidv4 } from 'uuid';
import { Home } from '../../model/v1/home/Home.model';
import { User } from '../../model/v1/home/User.model';
import { Area } from '../../model/v1/home/Area.model';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Device } from '../../model/v1/home/Entity.model';
import { getConnection, getRepository } from 'typeorm';
import { ErrorCode } from '../../response/Error.response';
import { HomeStatistical } from '../../model/v1/home/HomeStatistical.model';
import { AreaStatistical } from '../../model/v1/home/AreaStatistical.model';
import ICRUD from '../../interface/ICRUD.interface';
import ILogger from '../../interface/ILogger.interface';
import IResponser from '../../interface/IResponser.interface';
import ISemaphore from '../../interface/ISemaphore.interface';
import ITimestamp from '../../interface/ITimestamp.Interface';

/**
 * [[include:/major/Area/Area.md]]
 */

@injectable()
class AreaController implements ICRUD {
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
     * ## Find the areas that satisfy the input conditions
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
     * |name | optional | nvarchar(256) | The name of the area that need to be searched|
     * |homeId | required | nvarchar(128) | The homeId of the area that need to be searched|
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
     *      message: '',
     *      data: [{
     *          id: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          homeid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          userid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          name: string,
     *          logo: string | null,
     *          position: number | null,
     *          entitiescount: number
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the area will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |homeId | string | The home id of the area will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | string | The name of the area |
     * |logo | string or null | The logo of the area. Logo can be an url or a key or null|
     * |position | number  | The position of area will be appeared in app|
     * |entitiescount | string | The amount of entities in area|
     *
     */
    get = async (req: Request, res: Response): Promise<void> => {
        try {
            let param: any = req.query;
            const existedHome: Home | undefined = await getConnection()
                .getRepository(Home)
                .createQueryBuilder('home')
                .where('home.userId = :userid', { userid: param.userId })
                .andWhere('home.id = :homeid', { homeid: param.homeId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Area.controller.ts', resource: 'get:existedHome', mess: JSON.stringify(existedHome) });

            if (typeof existedHome === 'undefined') {
                this.logger.Error({ path: 'Area.controller.ts', resource: 'get:existedHome', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }

            const area: any[] =
                (await getRepository(Area)
                    .createQueryBuilder('area')
                    .where(typeof param.id !== 'undefined' && param.id !== '' ? 'area.id = :id' : '1 = 1', {
                        id: param.id,
                    })
                    .andWhere('area.userId = :userid', { userid: param.userId })
                    .andWhere('area.homeId = :homeid', { homeid: param.homeId })
                    .andWhere('area.appCode = :appCode', { appCode: param.appCode })
                    .andWhere(typeof param.name !== 'undefined' && param.name !== '' ? 'area.name = :name' : '1 = 1', {
                        name: param.name,
                    })
                    .leftJoinAndSelect(AreaStatistical, 'areastc', 'areastc.id = area.id AND areastc.userId = area.userId')
                    .orderBy('area.position', 'ASC')
                    .select([
                        'area.id AS id',
                        'area.homeId AS homeId',
                        'area.userId AS userId',
                        'area.name AS name',
                        'area.logo AS logo',
                        'area.position AS pos',
                        'areastc.cEntities AS entitiesCount',
                        'areastc.cHC AS HCCount',
                    ])
                    .distinct(true)
                    .getRawMany()) || [];

            this.logger.Info({ path: 'Area.controller.ts', resource: 'get:area', mess: JSON.stringify(area || {}) });

            return this.responser.Ok(res, { message: 'done', data: area });
        } catch (err) {
            this.logger.Error({ path: 'Area.controller.ts', resource: 'get:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };
    /**
     * ## Create a area
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
     * |name | required | nvarchar(256) | The name of the home that need to be created|
     * |homeId | required | nvarchar(128) | The homeId of the home that need to be created|
     * |logo | optional | nvarchar(128) | The logo of home that need to be created|
     * |pos | optional | number(-1,127) | The position will be displayed in app of area that need to be created|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be created|
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
     * |<span style="color:red">404</span> | Occur if the dependencies data could not be found |
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
        const param: any = req.body;
        const lockResource = `/home/${param.userId}/${param.homeId}/${param.appCode}/createArea`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user: User | undefined = await getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: param.userId }).getOne();

            this.logger.Info({ path: 'Area.controller.ts', resource: 'create:user', mess: JSON.stringify(user) });

            if (typeof user === 'undefined') {
                this.logger.Error({ path: 'Area.controller.ts', resource: 'create:user', mess: ErrorCode.NSERR_USERNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_USERNOTFOUND });
            }

            const home: Home | undefined = await getRepository(Home)
                .createQueryBuilder('homeuser')
                .where('homeuser.id = :id', { id: param.homeId })
                .andWhere('homeuser.userId = :userid', { userid: param.userId })
                .andWhere('homeuser.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Area.controller.ts', resource: 'create:home', mess: JSON.stringify(home) });

            if (typeof home === 'undefined') {
                this.logger.Error({ path: 'Area.controller.ts', resource: 'create:home', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }

            const existedArea: Area | undefined = await getRepository(Area)
                .createQueryBuilder('area')
                .where(`LOWER(REPLACE(area.name, ' ', '')) = LOWER(REPLACE(:name, ' ', '')) `, { name: param.name })
                .andWhere('area.homeId = :homeId', { homeId: param.homeId })
                .andWhere('area.userId = :userId', { userId: param.userId })
                .andWhere('area.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Area.controller.ts', resource: 'create:existedArea', mess: JSON.stringify(existedArea) });

            if (typeof existedArea !== 'undefined') {
                this.logger.Error({ path: 'Area.controller.ts', resource: 'create:existedArea', mess: ErrorCode.NSERR_AREAEXISTED });
                return this.responser.Conflict(res, { code: ErrorCode.NSERR_AREAEXISTED });
            }

            const nowTimestamp = this.timestamp.convert(Date.now());

            let tmpAreaId: string = '';
            while (tmpAreaId == '') {
                let uId: string = uuidv4();
                const eArea: Area | undefined = await getRepository(Area)
                    .createQueryBuilder('area')
                    .where('area.id = :id', { id: uId })
                    .andWhere('area.appCode = :appCode', { appCode: param.appCode })
                    .getOne();
                if (typeof eArea === 'undefined') {
                    tmpAreaId = uId;
                }
            }

            const areaTmp = {
                id: tmpAreaId,
                homeId: param.homeId,
                userId: param.userId,
                appCode: param.appCode,
                name: param.name,
                logo: param.logo,
                position: param.pos || -1,
            };

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            await queryBuilder
                .insert()
                .into(Area)
                .values({
                    ...areaTmp,
                    createdAt: nowTimestamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryBuilder
                .insert()
                .into(AreaStatistical)
                .values({
                    id: tmpAreaId,
                    userId: param.userId,
                    homeId: param.homeId,
                    appCode: param.appCode,
                    cEntities: 0,
                    cHC: 0,
                    createdAt: nowTimestamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryBuilder
                .update(HomeStatistical)
                .set({
                    cAreas: () => 'cAreas+1',
                    updatedAt: nowTimestamp,
                    updatedBy: param?.userId,
                })
                .where('homeId = :id', { id: param.homeId })
                .andWhere('userId = :userid', { userid: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryRunner.commitTransaction();

            this.logger.Info({ path: 'Area.controller.ts', resource: 'create:area', mess: JSON.stringify(areaTmp) });
            return this.responser.Created(res, { message: 'done', data: { ...areaTmp } });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Area.controller.ts', resource: 'create:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
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
     * |homeId | required | nvarchar(128) | The homeId of the area that need to be updated|
     * |name | optional | nvarchar(256) | The logo of the area that need to be updated|
     * |logo | optional | nvarchar(128) | The logo of the area that need to be updated|
     * |pos | optional | integer(-1,127) | The position of area that need to be updated|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be updated|
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
     * |<span style="color:red">404</span> | Occur if the area could not be found in the db |
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
        const param: any = req.body;
        const lockResource = `/home/${param.userId}/${param.homeId}/${param.appCode}/createEntity`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let isChanged: boolean = false;
            const existedArea: Area | undefined = await getRepository(Area)
                .createQueryBuilder('area')
                .where('area.id = :id', { id: param.id })
                .andWhere('area.homeId = :homeid', { homeid: param.homeId })
                .andWhere('area.userId = :userid', { userid: param.userId })
                .andWhere('area.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Area.controller.ts', resource: 'update:existedArea', mess: JSON.stringify(existedArea) });

            if (typeof existedArea === 'undefined') {
                this.logger.Error({ path: 'Area.controller.ts', resource: 'update:existedArea', mess: ErrorCode.NSERR_AREANOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_AREANOTFOUND });
            }

            let areaTmp = {
                id: existedArea?.id,
                name: existedArea?.name,
                logo: existedArea?.logo,
                pos: existedArea?.position,
            };

            if (param.name && typeof param.name !== 'undefined' && param.name !== '' && existedArea!?.name !== param.name) {
                const existedNewNameArea: Area | undefined = await getRepository(Area)
                    .createQueryBuilder('area')
                    .andWhere('area.homeId = :homeid', { homeid: param.homeId })
                    .andWhere('area.userId = :userid', { userid: param.userId })
                    .andWhere('area.appCode = :appCode', { appCode: param.appCode })
                    .andWhere(`LOWER(REPLACE(area.name, ' ', '')) = LOWER(REPLACE(:name, ' ', '')) `, {
                        name: param.name,
                    })
                    .getOne();
                if (typeof existedNewNameArea !== 'undefined') {
                    this.logger.Error({ path: 'Area.controller.ts', resource: 'update:existedNewNameArea', mess: ErrorCode.NSERR_AREAEXISTED });
                    return this.responser.Conflict(res, { code: ErrorCode.NSERR_AREAEXISTED });
                }
                isChanged = true;
                areaTmp.name = param.name;
            }

            if (param.logo && typeof param.logo !== 'undefined' && param.logo !== '' && existedArea!?.logo !== param.logo) {
                isChanged = true;
                areaTmp.logo = param.logo;
            }

            if (param.pos && typeof param.pos !== 'undefined' && param.pos !== '' && existedArea!?.position !== param.pos) {
                isChanged = true;
                areaTmp.pos = param.pos;
            }

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            if (isChanged) {
                const nowTimestamp = this.timestamp.convert(Date.now());
                await queryBuilder
                    .update(Area)
                    .set({
                        name: areaTmp.name,
                        logo: areaTmp.logo,
                        position: areaTmp.pos,
                        updatedAt: nowTimestamp,
                        updatedBy: param.userId,
                    })
                    .where('id = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();
                await queryRunner.commitTransaction();
                this.logger.Info({ path: 'Area.controller.ts', resource: 'update:areaTmp', mess: JSON.stringify(areaTmp) });
                return this.responser.Ok(res, { message: 'done', data: { ...areaTmp } });
            }

            return this.responser.BadRequest(res, { code: ErrorCode.NSERR_NOTHINGTOBECHANGED });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Area.controller.ts', resource: 'update:catch', mess: err });
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
     * |id | required | nvarchar(128) | The id of the area that need to be deleted|
     * |homeId | required | nvarchar(128) | The homeId of the area that need to be deleted|
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
     * |<span style="color:red">401</span> | Occur if don't have permission to delete the area |
     * |<span style="color:red">404</span> | Occur if the area could not be found in the db |
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
        const param = req.body;
        const lockResource = `/home/${param.userId}/${param.homeId}/deleteArea`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existedArea: Area | undefined = await getRepository(Area)
                .createQueryBuilder('area')
                .where('area.id = :id', { id: param.id })
                .andWhere('area.homeId = :homeId', { homeId: param.homeId })
                .andWhere('area.userId = :userId', { userId: param.userId })
                .andWhere('area.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Area.controller.ts', resource: 'delete:existedArea', mess: JSON.stringify(existedArea) });

            if (typeof existedArea === 'undefined') {
                this.logger.Error({ path: 'Area.controller.ts', resource: 'delete:existedArea', mess: ErrorCode.NSERR_AREANOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_AREANOTFOUND });
            }

            const nowTimestamp = this.timestamp.convert(Date.now());

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            await queryBuilder
                .update(Device)
                .set({
                    areaId: '',
                    updatedBy: param.userId,
                    updatedAt: nowTimestamp,
                })
                .where('areaId = :areaid', { areaid: param.id })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .delete()
                .from(AreaStatistical)
                .where('id = :areaid', { areaid: param.id })
                .andWhere('homeId = :homeId', { homeId: param.homeId })
                .andWhere('userId = :userId', { userId: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .delete()
                .from(Area)
                .where('id = :id', { id: param.id })
                .andWhere('homeId = :homeId', { homeId: param.homeId })
                .andWhere('userId = :userId', { userId: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .update(HomeStatistical)
                .set({
                    cAreas: () => 'cAreas - 1',
                    updatedAt: nowTimestamp,
                    updatedBy: param?.userId,
                })
                .where('homeId = :id', { id: existedArea.homeId })
                .andWhere('userId = :userid', { userid: param?.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryRunner.commitTransaction();
            return this.responser.Ok(res, { message: 'Area has been deleted' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Area.controller.ts', resource: 'delete:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
}

export default AreaController;
