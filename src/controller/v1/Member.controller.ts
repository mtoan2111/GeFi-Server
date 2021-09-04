import { Home } from '../../model/v1/home/Home.model';
import { Area } from '../../model/v1/home/Area.model';
import { User } from '../../model/v1/home/User.model';
import { Request, Response } from 'express';
import { Device } from '../../model/v1/home/Entity.model';
import { inject, injectable } from 'inversify';
import { Member } from '../../model/v1/home/Member.model';
import { Invitation } from '../../model/v1/home/Invitation.model';
import { getRepository, getConnection } from 'typeorm';
import { ErrorCode } from '../../response/Error.response';
import { AreaStatistical } from '../../model/v1/home/AreaStatistical.model';
import { HomeStatistical } from '../../model/v1/home/HomeStatistical.model';
import ICRUD from '../../interface/ICRUD.interface';
import ILogger from '../../interface/ILogger.interface';
import ISemaphore from 'src/interface/ISemaphore.interface';
import IResponser from '../../interface/IResponser.interface';
import ITimestamp from '../../interface/ITimestamp.Interface';

@injectable()
class MemberController implements ICRUD {
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
     * ## Find the member that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/member
     *
     * **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     *
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id| optional | nvarchar(128) | The id of the member that need to be searched|
     * |homeId | required | nvarchar(128) | The homeId of the member that need to be searched|
     * |name | optional | nvarchar(256) | The name of the member that need to be searched|
     * |memberEmail | optional | nvarchar(256) | The email of the member that need to be searched|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be searched|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a list of invitation by query|
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">406</span> | Occur if one of the field in request is not acceptable |
     *
     * - List of members will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     *      data: [{
     *          id: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          homeId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          name: string,
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the member will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |homeId | string | The id of the home will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |name | string | The name of the member |
     *
     */
    get = async (req: Request, res: Response): Promise<void> => {
        try {
            const param: any = req.query;
            const member: any[] =
                (await getRepository(Member)
                    .createQueryBuilder('member')
                    .where(typeof param.memberEmail !== 'undefined' && param.memberEmail !== '' ? 'member.email = :email' : '1 = 1', {
                        email: param.memberEmail,
                    })
                    .andWhere('member.homeId = :homeId', { homeId: param.homeId })
                    .andWhere(typeof param.id !== 'undefined' && param.id !== '' ? 'member.id = :id' : '1 = 1', {
                        id: param.id,
                    })
                    .andWhere(typeof param.name !== 'undefined' && param.name !== '' ? 'member.name = :name' : '1 = 1', { name: param.name })
                    .andWhere('member.appCode = :appCode', { appCode: param.appCode })
                    .leftJoinAndSelect(HomeStatistical, 'homestc', 'homestc.homeId = member.homeId and homestc.userId = member.id')
                    .distinct(true)
                    .select([
                        'member.email AS email',
                        'member.id AS id',
                        'member.homeId AS homeId',
                        'member.name AS name',
                        'member.state AS state',
                        'member.isOwner AS owner',
                        'homestc.cEntities AS entitiesCount',
                        'homestc.cHC AS HCCount',
                    ])
                    .getRawMany()) || [];

            this.logger.Info({ path: 'Member.controller.ts', resource: 'get:member', mess: JSON.stringify(member) });

            return this.responser.Ok(res, { message: 'done', data: member });
        } catch (err) {
            this.logger.Error({ path: 'Member.controller.ts', resource: 'get:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        }
    };
    create = async (_req: Request, _res: Response): Promise<void> => {};
    /**
     * ## Update an existed member that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/member
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |memberEmail | required | nvarchar(256) | The email of the member that need to be updated|
     * |userId | required | nvarchar(128) | The userId of the member that need to be updated|
     * |homeId | required | nvarchar(128) | The homeId of the member that need to be updated|
     * |name | optional | nvarchar(256) | The name of the member that need to be updated|
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
        const lockResource = `/home/${req.body.userId}/${req.body.homeId}/${req.body.appCode}/updateMember`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let isChanged: boolean = false;
            const existedMember: Member | undefined = await getRepository(Member)
                .createQueryBuilder('member')
                .where('member.email = :memberEmail', { memberEmail: param.memberEmail })
                .andWhere('member.homeId = :homeId', { homeId: param.homeId })
                .andWhere('member.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Member.controller.ts', resource: 'update:existedMember', mess: JSON.stringify(existedMember) });

            if (typeof existedMember === 'undefined') {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'update:existedMember', mess: ErrorCode.NSERR_MEMBERNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_MEMBERNOTFOUND });
            }

            let memberTmp = {
                id: existedMember?.id,
                homeId: existedMember?.homeId,
                name: existedMember?.name,
                email: existedMember?.email,
                isOwner: existedMember?.isOwner,
            };

            if (param.name && typeof param.name !== 'undefined' && param.name !== '' && existedMember!?.name !== param.name) {
                isChanged = true;
                memberTmp.name = param.name;
            }

            const nowTimeStamp = this.timestamp.convert(Date.now());
            const queryBuilder = connection.createQueryBuilder(queryRunner);
            if (isChanged) {
                await queryBuilder
                    .update(Member)
                    .set({
                        name: memberTmp.name,
                        updatedAt: nowTimeStamp,
                        updatedBy: param?.userId,
                    })
                    .where('email = :memberEmail', { memberEmail: param.memberEmail })
                    .andWhere('homeId = :homeId', { homeId: param.homeId })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();
                await queryRunner.commitTransaction();
                this.logger.Info({ path: 'Member.controller.ts', resource: 'update:memberTmp', mess: JSON.stringify(memberTmp) });
                return this.responser.Ok(res, { message: 'done', data: { ...memberTmp } });
            }
            return this.responser.BadRequest(res, { code: ErrorCode.NSERR_NOTHINGTOBECHANGED });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Member.controller.ts', resource: 'update:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };

    /**
     * ## Delete an member that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#f93e3e; padding: 2px 15px; border-radius: 5px; color: white">DELETE</span> /home/v1/member
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |memberEmail | required | nvarchar(256) | The email of the member that need to be deleted|
     * |homeId | required | nvarchar(128) | The homeId of the member that need to be deleted|
     * |userId | required | nvarchar(128) | The userId of the member that need to be deleted|
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
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let homeDetail = await getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :homeId', { homeId: param.homeId })
                .andWhere('home.userId = :userId', { userId: param.userId })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Member.controller.ts', resource: 'delete:homeDetail', mess: JSON.stringify(homeDetail) });

            if (typeof homeDetail === 'undefined') {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'delete:homeDetail', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }

            /**
             * if userId is owner and userId want to remove itself
             * or userId is member and want to remove a member from this home
             * -> False
             **/
            if ((homeDetail.isOwner && param.userId === param.memberId) || (!homeDetail?.isOwner && param.userId !== param.memberId)) {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'delete:isOwner', mess: ErrorCode.NSERR_UNAUTHORIZED });
                return this.responser.Unauthorized(res, {
                    code: ErrorCode.NSERR_UNAUTHORIZED,
                });
            }

            const existedMember: Member | undefined = await getRepository(Member)
                .createQueryBuilder('member')
                .where('member.email = :memberEmail', { memberEmail: param.memberEmail })
                .andWhere('member.homeId = :homeId', { homeId: param.homeId })
                .andWhere('member.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Member.controller.ts', resource: 'delete:existedMember', mess: JSON.stringify(existedMember) });

            if (typeof existedMember === 'undefined') {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'delete:existedMember', mess: ErrorCode.NSERR_MEMBERNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_MEMBERNOTFOUND });
            }
            const queryBuilder = connection.createQueryBuilder(queryRunner);
            await queryBuilder
                .delete()
                .from(Member)
                .where('homeId = :homeId', { homeId: param.homeId })
                .andWhere('email = :memberEmail', { memberEmail: param.memberEmail })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            await queryBuilder
                .delete()
                .from(Invitation)
                .where('homeId = :homeId', { homeId: param.homeId })
                .andWhere('memberEmail = :memberEmail', { memberEmail: param.memberEmail })
                .andWhere('appCode = :appCode', { appCode: param.appCode })
                .execute();

            const existedUser: User | undefined = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.email = :email', { email: param.memberEmail })
                .andWhere('user.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            if (existedMember.state && typeof existedUser !== 'undefined') {
                await queryBuilder
                    .delete()
                    .from(Home)
                    .where('id = :homeId', { homeId: param.homeId })
                    .andWhere('userId = :userId', { userId: existedUser.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder
                    .delete()
                    .from(Area)
                    .where('id = :homeId', { homeId: param.homeId })
                    .andWhere('userId = :userId', { userId: existedUser.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder
                    .delete()
                    .from(AreaStatistical)
                    .where('id = :homeId', { homeId: param.homeId })
                    .andWhere('userId = :userId', { userId: existedUser.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder
                    .delete()
                    .from(HomeStatistical)
                    .where('homeId = :homeId', { homeId: param.homeId })
                    .andWhere('userId = :userId', { userId: existedUser.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();

                await queryBuilder
                    .delete()
                    .from(Device)
                    .where('homeId = :homeId', { homeId: param.homeId })
                    .andWhere('userId = :userId', { userId: existedUser.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();
            }
            await queryRunner.commitTransaction();
            return this.responser.Ok(res, { message: 'Member has been deleted' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Member.controller.ts', resource: 'delete:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
        }
    };
}

export default MemberController;
