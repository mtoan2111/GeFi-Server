import { v4 as uuidv4 } from 'uuid';
import { Home } from '../../model/v1/home/Home.model';
import { User } from '../../model/v1/home/User.model';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Member } from '../../model/v1/home/Member.model';
import { getConnection, getRepository } from 'typeorm';
import { Invitation } from '../../model/v1/home/Invitation.model';
import { HomeStatistical } from '../../model/v1/home/HomeStatistical.model';
import { EMailTemplate, EMailI18n } from '../../model/v1/mail/Mail.model';
import ICRUD from '../../interface/ICRUD.interface';
import IEmail from '../../interface/IEmail.interface';
import ILogger from '../../interface/ILogger.interface';
import INotify from '../../interface/INotify.interface';
import { ErrorCode } from '../../response/Error.response';
import ISemaphore from 'src/interface/ISemaphore.interface';
import IResponser from '../../interface/IResponser.interface';
import ITimestamp from '../../interface/ITimestamp.Interface';

@injectable()
class InvitationController implements ICRUD {
    private logger: ILogger;
    private responser: IResponser;
    private timestamp: ITimestamp;
    private notify: INotify;
    private email: IEmail;
    private semaphore: ISemaphore;

    constructor(
        @inject('Logger') logger: ILogger,
        @inject('Responser') responser: IResponser,
        @inject('Timestamp') timestamp: ITimestamp,
        @inject('Notify') notify: INotify,
        @inject('Email') email: IEmail,
        @inject('Semaphore') semaphore: ISemaphore,
    ) {
        this.logger = logger;
        this.responser = responser;
        this.timestamp = timestamp;
        this.notify = notify;
        this.email = email;
        this.semaphore = semaphore;
    }
    /**
     * ## Find the invitation that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#61affe; padding: 2px 15px; border-radius: 5px; color: white">GET</span> /home/v1/invitation
     *
     * **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     *
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id| optional | nvarchar(128) | The id of the invitation that need to be searched|
     * |homeId | optional | nvarchar(128) | The homeId of the invitation that need to be searched|
     * |memberId | optional | nvarchar(256) | The memberId of the invitation that need to be searched|
     * |state | optional | integer(-1,1) | The state of the invitation that need to be searched. <ul style="list-style-type: circle;"><li style="padding-bottom: 10px">-1: waiting</li><li style="padding-bottom: 10px">0: deny</li><li style="padding-bottom: 10px">1: accept</li></ul>|
     * |isRead | optional | boolean | The reading state of the invitation that need to be searched|
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
     * - List of invitation will be in the format as the below
     *
     * ```json
     * {
     *      message: '',
     *      data: [{
     *          id: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          ownerId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          memberId: 'xxxxxxx-xxxx-xxxx-xxxxxx',
     *          note: string,
     *          state: number,
     *          isread: boolean,
     *      }]
     * }
     * ```
     * - response detail
     *
     * |Parameters|Type|Detail|
     * |----------|----|------|
     * |id | string | The id of the invitation will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |ownerId | string | The id of the owner will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |memberId | string | The id of the member will be in <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">uuid_v4</a> format|
     * |note | string or null | The message of the owner would like to text for member|
     * |state | number  | The state of invitation <ul style="list-style-type: circle;"><li style="padding-bottom: 10px">-1: waiting</li><li style="padding-bottom: 10px">0: deny</li><li style="padding-bottom: 10px">1: accept</li></ul>|
     * |isread | boolean  | Whether the inivitation is read|
     *
     */
    get = async (req: Request, res: Response): Promise<void> => {
        try {
            const param: any = req.query;
            const invitation: any[] =
                (await getRepository(Invitation)
                    .createQueryBuilder('ivt')
                    .where(typeof param.id !== 'undefined' && param.id !== '' ? 'ivt.id = :id' : '1 = 1', {
                        id: param.id,
                    })
                    .andWhere(typeof param.ownerId !== 'undefined' && param.ownerId !== '' ? 'ivt.ownerId = :ownerId' : '1 = 1', { ownerId: param.ownerId })
                    .andWhere(typeof param.homeId !== 'undefined' && param.homeId !== '' ? 'ivt.homeId = :homeId' : '1 = 1', { homeId: param.homeId })
                    .andWhere(typeof param.userId !== 'undefined' && param.userId !== '' ? 'ivt.memberId = :memberId' : '1 = 1', {
                        memberId: param.userId,
                    })
                    .andWhere(typeof param.state !== 'undefined' && param.state !== '' ? 'ivt.state = :state' : '1 = 1', { state: param.state })
                    .andWhere(typeof param.isRead !== 'undefined' && param.isRead !== '' ? 'ivt.isRead = :isRead' : '1 = 1', { isRead: param.isRead })
                    .andWhere('ivt.appCode = :appCode', { appCode: param.appCode })
                    .leftJoinAndSelect(User, 'user', 'user.id = ivt.ownerId')
                    .leftJoinAndSelect(Home, 'home', 'home.id = ivt.homeId')
                    .distinct(true)
                    .select([
                        'ivt.id AS id',
                        'ivt.ownerId AS ownerId',
                        'user.name AS ownerName',
                        'user.email AS ownerEmail',
                        'home.id AS homeId',
                        'home.name AS homeName',
                        'ivt.memberId AS memberId',
                        'ivt.state AS state',
                        'ivt.isRead AS isRead',
                        'ivt.note AS note',
                        'ivt.createdAt AS createdat',
                        'ivt.appCode AS appCode',
                    ])
                    .getRawMany()) || [];

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'get:invitation', mess: JSON.stringify(invitation) });

            return this.responser.Ok(res, { message: 'done', data: invitation });
        } catch (err) {
            this.logger.Error(err);
            return this.responser.BadRequest(res, { message: err });
        }
    };
    /**
     * ## Create an invitation
     *
     * ### The request api:
     * ### <span style="background-color:#49cc90; padding: 2px 15px; border-radius: 5px; color: white">POST</span> /home/v1/invitation
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |ownerId | required | nvarchar(128) | The ownerId of the invitation that need to be created|
     * |homeId | required | nvarchar(128) | The homeId of the invitation that need to be created|
     * |memberEmail | required | nvarchar(256)  | The list of member email of the invitation that need to be created|
     * |note | optional | nvarchar(512)  | The reading state of the invitation that need to be created|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be created|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response to client as follow
     *
     * |Code|Detail|
     * |----|------|
     * |<span style="color:green">200</span> | Return a successful message|
     * |<span style="color:red">400</span> | Occur if an exception raised |
     * |<span style="color:red">401</span> | Occur if doesn't have permission |
     * |<span style="color:red">406</span> | Occur if one of the fields in request is not acceptable |
     * |<span style="color:red">406</span> | Occur if one of the resources has been existed before |
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
        const param: any = req.body;
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

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'create:homeDetail', mess: JSON.stringify(homeDetail) });

            if (typeof homeDetail === 'undefined') {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'create:homeDetail', mess: ErrorCode.NSERR_HOMENOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_HOMENOTFOUND });
            }
            if (homeDetail && homeDetail.isOwner !== true) {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'create:isOwner', mess: ErrorCode.NSERR_UNAUTHORIZED });
                return this.responser.Unauthorized(res, { code: ErrorCode.NSERR_UNAUTHORIZED });
            }

            const member: User | undefined = await getRepository(User)
                .createQueryBuilder('user')
                .where('user.email = :email', { email: param.memberEmail })
                .andWhere('user.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'create:member', mess: JSON.stringify(member) });

            let existedMember: Home | undefined = await getRepository(Home)
                .createQueryBuilder('home')
                .where('home.id = :homeId', { homeId: param.homeId })
                .andWhere('home.userId = :id', { id: member?.id })
                .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'create:existedMember', mess: JSON.stringify(existedMember) });

            if (typeof existedMember !== 'undefined') {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'create:existedMember', mess: ErrorCode.NSERR_MEMBEREXISTED });
                return this.responser.Conflict(res, { mcode: ErrorCode.NSERR_MEMBEREXISTED });
            }

            const existedInvitation: Invitation | undefined = await getRepository(Invitation)
                .createQueryBuilder('ivt')
                .where('ivt.memberEmail = :email', { email: param?.memberEmail })
                .andWhere('ivt.homeId= :homeId', { homeId: param.homeId })
                .andWhere('ivt.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'create:existedInvitation', mess: JSON.stringify(existedInvitation) });

            if (existedInvitation && existedInvitation.state === -1) {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'create:existedInvitation', mess: ErrorCode.NSERR_INVITATIONEXISTED });
                return this.responser.Conflict(res, { code: ErrorCode.NSERR_INVITATIONEXISTED });
            }

            if (typeof member === 'undefined') {
                this.email.send(param?.memberEmail, EMailTemplate.INVITATION, '', EMailI18n.en, param.appCode);
            } else {
                this.notify.publish(member?.fcm, `You have a new invitation!. Please check your notication in app`);
                this.email.send(member?.email, EMailTemplate.INVITATION, '', member.lang as EMailI18n, param.appCode);
            }

            let tmpInvitationId: string = '';
            while (tmpInvitationId == '') {
                let uId: string = uuidv4();
                const eIvt: Invitation | undefined = await getRepository(Invitation)
                    .createQueryBuilder('ivt')
                    .where('ivt.id = :id', { id: uId })
                    .andWhere('ivt.appCode = :appCode', { appCode: param.appCode })
                    .getOne();
                if (typeof eIvt === 'undefined') {
                    tmpInvitationId = uId;
                }
            }

            const nowTimestamp = this.timestamp.convert(Date.now());

            const invitationTmp = {
                id: tmpInvitationId,
                ownerId: param.userId,
                homeId: param.homeId,
                memberId: member?.id,
                memberEmail: param?.memberEmail,
                appCode: param.appCode,
                note: param.note,
                isRead: false,
                state: -1,
            };
            const queryBuilder = connection.createQueryBuilder(queryRunner);

            const memberTmp = {
                email: param.memberEmail,
                homeId: param.homeId,
                appCode: param.appCode,
                id: member?.id,
                name: member?.name,
                state: false,
            };

            await queryBuilder
                .insert()
                .into(Invitation)
                .values({
                    ...invitationTmp,
                    createdAt: nowTimestamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryBuilder
                .insert()
                .into(Member)
                .values({
                    ...memberTmp,
                    createdAt: nowTimestamp,
                    createdBy: param.userId,
                })
                .execute();

            await queryRunner.commitTransaction();

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'create:memberTmp', mess: JSON.stringify(memberTmp) });

            return this.responser.Created(res, {
                message: 'done',
                data: {
                    ...memberTmp,
                    id: tmpInvitationId,
                    ownerId: param.userId,
                    homeId: param.homeId,
                    memberId: member?.id,
                    note: param.note,
                },
            });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Invitation.controller.ts', resource: 'create:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
        }
    };

    /**
     * ## Update an existed invitation that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#fca130; padding: 2px 15px; border-radius: 5px; color: white">PUT</span> /home/v1/invitation
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id| required | nvarchar(128) | The id of the invitation that need to be updated|
     * |state | required | integer(0, 1) | The ownerId of the invitation that need to be updated <ul style="list-style-type: circle;"><li style="padding-bottom: 10px">0: deny</li><li style="padding-bottom: 10px">1: accept</li></ul>|
     * |isRead | required | boolean | The homeId of the invitation that need to be updated|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be updated|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response to client as follow
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
        const lockResource = `/home/${param.id}}/${param.appCode}/updateInvitation`;
        await this.semaphore.acquire(lockResource);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existedInvitation: Invitation | undefined = await getRepository(Invitation)
                .createQueryBuilder('ivt')
                .where('ivt.id = :id', { id: param.id })
                .andWhere('ivt.memberId = :userId', { userId: param.userId })
                .andWhere('ivt.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'update:existedInvitation', mess: JSON.stringify(existedInvitation) });

            if (typeof existedInvitation === 'undefined') {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'update:existedInvitation', mess: ErrorCode.NSERR_INVITATIONNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_INVITATIONNOTFOUND });
            }

            if (typeof existedInvitation.memberId === 'undefined' || existedInvitation.memberId === null || existedInvitation.memberId === '') {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'update:memberId', mess: ErrorCode.NSERR_MEMBERNOTFOUND });
                return this.responser.BadRequest(res, { code: ErrorCode.NSERR_MEMBERNOTFOUND });
            }

            const nowTimestamp = this.timestamp.convert(Date.now());

            const queryBuilder = connection.createQueryBuilder(queryRunner);
            if (typeof param.state !== 'undefined' && param.state !== -1 && existedInvitation.state === -1) {
                switch (param.state) {
                    case 0:
                        await queryBuilder
                            .update(Invitation)
                            .set({
                                isRead: true,
                                state: 0,
                                updatedAt: nowTimestamp,
                                updatedBy: param?.userId,
                            })
                            .where('id = :id', { id: param.id })
                            .andWhere('memberId = :memberId', { memberId: param.userId })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                        await queryBuilder
                            .delete()
                            .from(Member)
                            .where('email = :email', { email: existedInvitation.memberEmail })
                            .andWhere('homeId = :homeId', { homeId: existedInvitation.homeId })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                        break;
                    case 1:
                        const existedHome: Home | undefined = await getRepository(Home)
                            .createQueryBuilder('home')
                            .where('home.id = :homeId', { homeId: existedInvitation.homeId })
                            .andWhere('home.appCode = :appCode', { appCode: param.appCode })
                            .getOne();

                        this.logger.Info({ path: 'Invitation.controller.ts', resource: 'update:existedHome', mess: JSON.stringify(existedHome) });

                        const existedUser = await getRepository(User)
                            .createQueryBuilder('user')
                            .where('user.id = :memberId', { memberId: existedInvitation.memberId })
                            .getOne();

                        this.logger.Info({ path: 'Invitation.controller.ts', resource: 'update:existedUser', mess: JSON.stringify(existedUser) });

                        await queryBuilder
                            .update(Member)
                            .set({
                                id: existedUser?.id,
                                homeId: existedInvitation.homeId,
                                name: existedUser?.name,
                                email: existedUser?.email,
                                isOwner: false,
                                state: true,
                                createdAt: nowTimestamp,
                                createdBy: param.userId,
                            })
                            .where('email = :email', { email: existedUser?.email })
                            .andWhere('homeId = :homeId', { homeId: existedHome?.id })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();

                        await queryBuilder
                            .insert()
                            .into(Home)
                            .values({
                                id: existedHome?.id,
                                userId: existedUser?.id,
                                name: existedHome?.name,
                                appCode: param.appCode,
                                isOwner: false,
                                createdAt: nowTimestamp,
                                createdBy: param.userId,
                            })
                            .execute();

                        await queryBuilder
                            .insert()
                            .into(HomeStatistical)
                            .values({
                                homeId: existedHome?.id,
                                userId: existedUser?.id,
                                appCode: param.appCode,
                                cAreas: 0,
                                cEntities: 0,
                                cHC: 0,
                                createdAt: nowTimestamp,
                                createdBy: param.userId,
                            })
                            .execute();

                        await queryBuilder
                            .update(Invitation)
                            .set({
                                isRead: true,
                                state: 1,
                                updatedAt: nowTimestamp,
                                updatedBy: param?.userId,
                            })
                            .where('id = :id', { id: param.id })
                            .andWhere('memberId = :memberId', { memberId: param.userId })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                        break;
                    default:
                        break;
                }
            } else {
                await queryBuilder
                    .update(Invitation)
                    .set({
                        isRead: true,
                        updatedAt: nowTimestamp,
                        updatedBy: param?.userId,
                    })
                    .where('id = :id', { id: param.id })
                    .andWhere('appCode = :appCode', { appCode: param.appCode })
                    .execute();
            }
            await queryRunner.commitTransaction();
            return this.responser.Ok(res, { message: 'Invitation has been updated' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Invitation.controller.ts', resource: 'update:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
            await this.semaphore.release(lockResource);
        }
    };
    /**
     * ## Delete an existed invitation that satisfy the input conditions
     *
     * ### The request api:
     * ### <span style="background-color:#f93e3e; padding: 2px 15px; border-radius: 5px; color: white">DELETE</span> /home/v1/invitation
     *
     * - **Note:** The parameter will be sent in the body of request
     * - **Note:** Need to be set the `DEBUG_LEVEL` to `debug` in **.env** file for using `ILogger`
     *
     * @param req - the request delegate of client
     * `req` will be include a limited fields
     *
     * |Parameters|Required/Optional|Type|Detail|
     * |----------|-----------------|----|------|
     * |id | required | nvarchar(128) | The id of the invitation that need to be deleted|
     * |appCode | required | nvarchar(256) | The app name of the application that need to be deleted|
     *
     * @param res - the response delegate of client
     *
     * @returns
     *
     * - Response detail to client as follow
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
     */
    delete = async (req: Request, res: Response): Promise<void> => {
        const param = req.body;
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existedInvitation: Invitation | undefined = await getRepository(Invitation)
                .createQueryBuilder('ivt')
                .where('ivt.id= :id', { id: param.id })
                .andWhere('ivt.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'delete:existedInvitation', mess: JSON.stringify(existedInvitation) });

            if (typeof existedInvitation === 'undefined') {
                this.logger.Error({ path: 'Invitation.controller.ts', resource: 'delete:existedInvitation', mess: ErrorCode.NSERR_INVITATIONNOTFOUND });
                return this.responser.NotFound(res, { code: ErrorCode.NSERR_INVITATIONNOTFOUND });
            }

            const queryBuilder = connection.createQueryBuilder(queryRunner);

            const owner = await getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: existedInvitation.ownerId }).getOne();

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'delete:owner', mess: JSON.stringify(owner) });

            const member = await getRepository(Member)
                .createQueryBuilder('member')
                .where('member.email = :email', { email: existedInvitation.memberEmail })
                .andWhere('member.homeId = :homeId', { homeId: existedInvitation.homeId })
                .andWhere('member.appCode = :appCode', { appCode: param.appCode })
                .getOne();

            this.logger.Info({ path: 'Invitation.controller.ts', resource: 'delete:member', mess: JSON.stringify(member) });

            if (typeof owner !== 'undefined' && typeof member !== 'undefined') {
                if (existedInvitation.memberId === param.userId || existedInvitation.ownerId === param.userId) {
                    await queryBuilder
                        .delete()
                        .from(Invitation)
                        .where('id = :id', { id: existedInvitation.id })
                        .andWhere('appCode = :appCode', { appCode: param.appCode })
                        .execute();
                    if (member?.state === false) {
                        await queryBuilder
                            .delete()
                            .from(Member)
                            .where('email = :email', { email: existedInvitation.memberEmail })
                            .andWhere('homeId = :homeId', { homeId: existedInvitation.homeId })
                            .andWhere('appCode = :appCode', { appCode: param.appCode })
                            .execute();
                    }
                    if (existedInvitation.memberId === param.userId) {
                        this.notify.publish(owner?.fcm, 'member has rejected your invitation');
                    }
                } else {
                    return this.responser.Unauthorized(res, {
                        code: ErrorCode.NSERR_UNAUTHORIZED,
                    });
                }
            }
            await queryRunner.commitTransaction();
            return this.responser.Ok(res, { message: 'Invitation has been deleted' });
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.Error({ path: 'Invitation.controller.ts', resource: 'delete:catch', mess: err });
            return this.responser.BadRequest(res, { message: err });
        } finally {
            await queryRunner.release();
        }
    };
}

export default InvitationController;
