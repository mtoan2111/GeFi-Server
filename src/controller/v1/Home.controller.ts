import { v4 as uuidv4 } from 'uuid';
import { Home } from '../../model/v1/home/Home.model';
import { User } from '../../model/v1/home/User.model';
import { Area } from '../../model/v1/home/Area.model';
import { Response, Request } from 'express';
import { Member } from '../../model/v1/home/Member.model';
import { Device } from '../../model/v1/home/Entity.model';
import { inject, injectable } from 'inversify';
import { getConnection, getRepository } from 'typeorm';
import { Automation } from '../../model/v1/home/Automation.model';
import { ErrorCode } from '../../response/Error.response';
import { AreaStatistical } from '../../model/v1/home/AreaStatistical.model';
import { HomeStatistical } from '../../model/v1/home/HomeStatistical.model';
import ICRUD from '../../interface/ICRUD.interface';
import ILogger from '../../interface/ILogger.interface';
import ISemaphore from 'src/interface/ISemaphore.interface';
import IResponser from '../../interface/IResponser.interface';
import ITimestamp from '../../interface/ITimestamp.Interface';
import IAutomation from '../../interface/IAutomation.interface';
/**
 * [[include:/major/Home/Home.md]]
 */

@injectable()
class HomeController implements ICRUD {
    private logger: ILogger;
    private responser: IResponser;
    private timestamp: ITimestamp;
    private semaphore: ISemaphore;
    private automation: IAutomation;

    constructor(
        @inject('Logger') logger: ILogger,
        @inject('Responser') responser: IResponser,
        @inject('Timestamp') timestamp: ITimestamp,
        @inject('Semaphore') semaphore: ISemaphore,
        @inject('Automation') automation: IAutomation,
    ) {
        this.logger = logger;
        this.responser = responser;
        this.timestamp = timestamp;
        this.semaphore = semaphore;
        this.automation = automation;
    }
    /**
     * ## Find the homes that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/home
     *
     * **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     *
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id| optional | nvarchar(128) | The id of the home that need to be searched|
     * |name | optional | nvarchar(256) | The name of the home that need to be searched|
     * |userId| required | nvarchar(128) | The userId of the home that need to be searched|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be searched|
     *
     * @param res - the response delegate of client
     *
     *
     * @returns
     *
     * - Response `HTTP Code` to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a list of areas by query|
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - List of homes will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     *      data: [{
     *          id: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          name: string
     *          userid: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          logo: string | null,
     *          position: number | null,
     *          owner: boolean,
     *          areascount: number
     *          entitiescount: number
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the home will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | string | The name of the home|
     * |userId | string | The userId of the home|
     * |logo | string or null | The logo of the home. Logo can be an url or a key or null|
     * |position | number  | The position of area will be appeared in app|
     * |owner | boolean  | Whether the user is the owner|
     * |areascount | number | the amount of areas in home|
     * |entitiescount | number | The amount of entities in home|
     *
     */
    get = async (req: Request, res: Response): Promise<void> => {
        try {
            const param: any = req.query;
            const home: any[] =
                (await getRepository(Home)
                    .createQueryBuilder('home')
                    .andWhere(typeof param.userId !== 'undefined' && param.userId !== '' ? 'home.userId = :userid' : '1 = 1', {
                        userid: param.userId,
                    })
                    .andWhere(typeof param.id !== 'undefined' && param.id !== '' ? 'home.id = :id' : '1 = 1', {
                        id: param?.id,
                    })
                    .andWhere(typeof param.name !== 'undefined' && param.name !== '' ? 'home.name = :name' : '1 = 1', {
                        name: param?.name,
                    })
                    .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                    .leftJoinAndSelect(HomeStatistical, 'homestc', 'home.id = homestc.homeId AND homestc.userId = home.userId')
                    .distinct(true)
                    .orderBy('home.position', 'ASC')
                    .select([
                        'home.id AS id',
                        'home.userId AS userId',
                        'home.name AS name',
                        'home.position AS pos',
                        'home.logo AS logo',
                        'home.isOwner AS owner',
                        'home.latitude AS lat',
                        'home.longitude AS lon',
                        'home.address AS address',
                        'homestc.cAreas AS areasCount',
                        'homestc.cEntities AS entitiesCount',
                        'homestc.cHC AS HCCount',
                    ])
                    .getRawMany()) || [];

            this.logger.Info({ path: 'Home.controller.ts', resource: 'get:home', mess: JSON.stringify(home) });

            return this.responser.Ok(res, { message: 'done', data: home });
        } catch (err) {
            this.logger.Error({ path: 'Home.controller.ts', resource: 'get:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };
    /**
     * ## Create a home
     *
     * ### The request api:
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/home
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
     * |userId | required | nvarchar(128) | The Id of user in uuid v4 format|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be created|
     * |logo | optional | nvarchar(128) | The logo of home that need to be created, ```default = null```|
     * |pos | optional | integer(-1, 127) | The location of home that need to be created, ```default = -1```|
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
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
    create = async (req: Request, res: Response): Promise<void> => {
        const param = req.body;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existedHome: Home | undefined = await getRepository(Home)
                .createQueryBuilder('home')
                .where('home.userId = :userId', { userId: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .andWhere(`LOWER(REPLACE(home.name, ' ', '')) = LOWER(REPLACE(:name, ' ', '')) `, { name: param.name })
                .getOne();

            this.logger.Info({ path: 'Home.controller.ts', resource: 'create:existedHome', mess: JSON.stringify(existedHome) });
            const existedUser: User | undefined = await getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: param.userId }).getOne();

            this.logger.Info({ path: 'Home.controller.ts', resource: 'create:existedUser', mess: JSON.stringify(existedUser) });

            if (typeof existedHome !== 'undefined') {
                this.logger.Error({ path: 'Home.controller.ts', resource: 'create:existedUser', mess: ErrorCode.NSERR_HOMEEXISTED });
                return this.responser.Conflict(res, { code: ErrorCode.NSERR_HOMEEXISTED });
            }

            let tmpHomeId: string = '';
            while (tmpHomeId == '') {
                let uId: string = uuidv4();
                const eHome = await getRepository(Home)
                    .createQueryBuilder('home')
                    .where('home.id = :id', { id: uId })
                    .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                    .getOne();
                if (typeof eHome === 'undefined') {
                    tmpHomeId = uId;
                }
            }

            const nowTimeStamp = this.timestamp.convert(Date.now());

            const homeTmp = {
                id: tmpHomeId,
                userId: param.userId,
                name: param.name,
                appCode: param.appCode,
                logo: param.logo,
                isOwner: true,
                address: param.address,
            };

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            await queryBuilder
                .insert()
                .into(HomeStatistical)
                .values({
                    homeId: tmpHomeId,
                    userId: param.userId,
                    appCode: param.appCode,
                    cAreas: 0,
                    cEntities: 0,
                    cHC: 0,
                    createdAt: nowTimeStamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryBuilder
                .insert()
                .into(Member)
                .values({
                    id: param.userId,
                    homeId: tmpHomeId,
                    email: existedUser?.email,
                    name: existedUser?.name,
                    appCode: param.appCode,
                    state: true,
                    isOwner: true,
                    createdAt: nowTimeStamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryBuilder
                .insert()
                .into(Home)
                .values({
                    ...homeTmp,
                    latitude: param?.lat,
                    longitude: param?.lon,
                    createdAt: nowTimeStamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryRunner.commitTransaction();

            this.logger.Info({ path: 'Home.controller.ts', resource: 'create:homeTmp', mess: JSON.stringify(homeTmp) });
            return this.responser.Created(res, {
                message: 'done',
                data: { ...homeTmp, pos: param.pos, lat: param.lat, lon: param.lon, areacount: 0, entitiescount: 0, hccount: 0 },
            });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Home.controller.ts', resource: 'create:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
        }
    };
    /**
     * ## Update an existed home that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/home
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The id of the home that need to be updated|
     * |userId | required | nvarchar(128) | The userId of the home that need to be updated|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be updated|
     * |name | optional | nvarchar(256) | The name of the home that need to be updated|
     * |logo | optional | nvarchar(256) | The logo of the home that need to be updated|
     * |pos | optional |  integer(-1, 127)  | The location of home that need to be updated|
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
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">404</span> | Occur if the home cound not be found in db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be display in the format as the below
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
        const param = req.body;
        const lockResource = `/home/${param.userId}/${param.homeId}/${param.appCode}/updateHome`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let isChanged: boolean = false;
            const existedHome: Home | undefined = await getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :id', { id: param.id })
                .andWhere('home.userId= :userid', { userid: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Home.controller.ts', resource: 'update:existedHome', mess: JSON.stringify(existedHome) });

            if (typeof existedHome === 'undefined') {
                this.logger.Error({ path: 'Home.controller.ts', resource: 'update:existedHome', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }

            let homeTmp = {
                id: existedHome?.id,
                name: existedHome?.name,
                logo: existedHome?.logo,
                pos: existedHome?.position,
                lat: existedHome?.latitude,
                lon: existedHome?.longitude,
                address: existedHome?.address,
            };

            if (param.name && typeof param.name !== 'undefined' && param.name !== '' && existedHome?.name !== param.name) {
                const existedNewNameHome: Home | undefined = await getRepository(Home)
                    .createQueryBuilder('home')
                    .where(`LOWER(REPLACE(home.name, ' ', '')) = LOWER(REPLACE(:name, ' ', '')) `, { name: param.name })
                    .andWhere('home.userId= :userid', { userid: param.userId })
                    .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                    .getOne();

                this.logger.Info({ path: 'Home.controller.ts', resource: 'update:existedNewNameHome', mess: JSON.stringify(existedNewNameHome) });
                if (typeof existedNewNameHome !== 'undefined') {
                    this.logger.Error({ path: 'Home.controller.ts', resource: 'update:existedNewNameHome', mess: ErrorCode.NSERR_HOMEEXISTED });
                    return this.responser.Conflict(res, { code: ErrorCode.NSERR_HOMEEXISTED });
                }
                isChanged = true;
                homeTmp.name = param.name;
            }

            if (param.logo && typeof param.logo !== 'undefined' && param.logo !== '' && existedHome!?.logo !== param.logo) {
                isChanged = true;
                homeTmp.logo = param.logo;
            }

            if (param.pos && typeof param.pos !== 'undefined' && param.pos !== '' && existedHome!?.position !== param.pos) {
                isChanged = true;
                homeTmp.pos = param.pos;
            }

            if (param.lat && typeof param.lat !== 'undefined' && param.lat !== '' && existedHome!?.latitude !== param.lat) {
                isChanged = true;
                homeTmp.lat = param.lat;
            }

            if (param.lon && typeof param.lon !== 'undefined' && param.lon !== '' && existedHome!?.longitude !== param.lon) {
                isChanged = true;
                homeTmp.lon = param.lon;
            }

            if (param.address && typeof param.address !== 'undefined' && param.address !== '' && existedHome!?.address !== param.address) {
                isChanged = true;
                homeTmp.address = param.address;
            }

            const nowTimeStamp = this.timestamp.convert(Date.now());
            const queryBuilder = connection.createQueryBuilder(queryRunner);

            if (isChanged) {
                await queryBuilder
                    .update(Home)
                    .set({
                        name: homeTmp.name,
                        logo: homeTmp.logo,
                        position: homeTmp.pos,
                        latitude: homeTmp.lat,
                        longitude: homeTmp.lon,
                        address: homeTmp.address,
                        updatedAt: nowTimeStamp,
                        updatedBy: param?.userId,
                    })
                    .where('id = :id', { id: param.id })
                    .andWhere('userId = :userid', { userid: param.userId })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryRunner.commitTransaction();

                this.logger.Info({ path: 'Home.controller.ts', resource: 'update:homeTmp', mess: JSON.stringify(homeTmp) });
                return this.responser.Ok(res, { message: 'done', data: { ...homeTmp } });
            }
            return this.responser.BadRequest(res, { code: ErrorCode.NSERR_NOTHINGTOBECHANGED });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Home.controller.ts', resource: 'update:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
    /**
     * ## Delete an existed device that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#f93e3e; padding: 2px 15px; border-radius: 5px; color: white">DELETE</span> /home/v1/home
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The id of the home that need to be deleted|
     * |userId | required | nvarchar(128) | The userId of the home that need to be deleted|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be deleted|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response `HTTP Code` detail to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">404</span> | Occur if the home cound not be found in db |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - The response message will be in the format as the below
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
     *
     */
    delete = async (req: Request, res: Response): Promise<void> => {
        const param = req.body;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existedHome: Home | undefined = await getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :id', { id: param.id })
                .andWhere('home.userId = :userId', { userId: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Home.controller.ts', resource: 'delete:existedHome', mess: JSON.stringify(existedHome) });

            if (typeof existedHome === 'undefined') {
                this.logger.Error({ path: 'Home.controller.ts', resource: 'delete:existedHome', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            if (existedHome && existedHome.isOwner === true) {
                const automationsExisted = await queryRunner.manager
                    .getRepository(Automation)
                    .createQueryBuilder('auto')
                    .where('auto.homeId = :homeId', { homeId: param.homeId })
                    .andWhere('auto.appCode = :appCode', { appCode: param.appCode })
                    .getMany();

                let autoDeletedFail: any[] = [];
                await Promise.all(
                    automationsExisted?.map(async (auto) => {
                        const deleteResult = await this.automation.delete(auto.id);
                        if (typeof deleteResult === 'undefined') {
                            autoDeletedFail.push(auto.id);
                        }
                    }),
                );

                if (autoDeletedFail.length > 0) {
                    return this.responser.BadRequest(res, { code: ErrorCode.NSERR_AUTOMATIONCOULDNOTBEDELETED });
                }

                await queryBuilder
                    .delete()
                    .from(Device)
                    .where('homeId = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder
                    .delete()
                    .from(Area)
                    .where('homeId = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder
                    .delete()
                    .from(AreaStatistical)
                    .where('homeId = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder
                    .delete()
                    .from(Member)
                    .where('homeId = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder
                    .delete()
                    .from(HomeStatistical)
                    .where('homeId = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder.delete().from(Home).where('id = :id', { id: param.id }).andWhere('appCode = :appCode', { appCode: param.appCode }).execute();

                await queryRunner.commitTransaction();

                return this.responser.Ok(res, { message: 'You have deleted home as owner' });
            }

            await queryBuilder
                .delete()
                .from(Device)
                .where('homeId = :id', { id: param.id })
                .andWhere('userId = :userId', { userId: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .delete()
                .from(Area)
                .where('homeId = :id', { id: param.id })
                .andWhere('userId = :userId', { userId: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .delete()
                .from(AreaStatistical)
                .where('homeId = :id', { id: param.id })
                .andWhere('userId = :userId', { userId: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .delete()
                .from(Member)
                .where('homeId = :id', { id: param.id })
                .andWhere('id = :userId', { userId: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .delete()
                .from(HomeStatistical)
                .where('homeId = :id', { id: param.id })
                .andWhere('userId = :userId', { userId: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .delete()
                .from(Home)
                .where('id = :id', { id: param.id })
                .andWhere('userId = :userId', { userId: param.userId })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryRunner.commitTransaction();
            return this.responser.Ok(res, { message: 'Home has been deleted' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Home.controller.ts', resource: 'delete:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
        }
    };
}

export default HomeController;
