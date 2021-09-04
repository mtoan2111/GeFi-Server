import EntityRoute from './Entity.route';
import HomeRoute from './Home.route';
import AreaRoute from './Area.route';
import UserRoute from './User.route';
import InvitationRoute from './Invitation.route';
import MemberRoute from './Member.route';
import EntityTypeRoute from './EntityType.route';
import VersionRoute from './Version.route';
import SystemRoute from './System.router';
import AutomationRoute from './Automation.route';
import { container } from '../../../inversify.config';
import IEntityType from '../../interface/IEntityType.interface';
import IResponser from '../../interface/IResponser.interface';
import ILogger from '../../interface/ILogger.interface';
import { ErrorCode } from '../../response/Error.response';

const entityType = container.get<IEntityType>('EntityType');
const responser = container.get<IResponser>('Responser');
const logger = container.get<ILogger>('Logger');

let checkAppCode = async (req, res, next) => {
    // next();
    let appCode = '';
    if (req.method === 'GET') {
        appCode = req.query.appCode;
    } else {
        appCode = req.body.appCode;
    }

    logger.Info({ path: 'route.v1.ts', resource: 'checkAppCode:verifyAppCode:timer:start', mess: Date.now() });
    const verifyAppCode = await entityType.verifyAppCode(appCode);
    logger.Info({ path: 'route.v1.ts', resource: 'checkAppCode:verifyAppCode:timer:stop', mess: Date.now() });
    logger.Info({ path: 'route.v1.ts', resource: 'checkAppCode:verifyAppCode', mess: verifyAppCode });

    if (!verifyAppCode) {
        return responser.NotFound(res, {
            code: ErrorCode.NSERR_APPCODENOTFOUND,
        });
    }
    next();
};

export const initRoute = (server: any = {}): void => {
    try {
        /**
         * @swagger
         * components:
         *   securitySchemes:
         *     authorizationHeader:
         *       type: apiKey
         *       in: header
         *       name: Authorization
         *
         * @swagger
         * tags:
         *   name: Entity
         *   description: API to manage entity.
         */
        server.use(`/v1/entity`, checkAppCode, EntityRoute);
        /**
         * @swagger
         * tags:
         *   name: User
         *   description: API to manage user.
         */
        server.use(`/v1/user`, checkAppCode, UserRoute);
        /**
         * @swagger
         * tags:
         *   name: Home
         *   description: API to manage home.
         */
        server.use(`/v1/home`, checkAppCode, HomeRoute);
        /**
         * @swagger
         * tags:
         *   name: Area
         *   description: API to manage area.
         */
        server.use(`/v1/area`, checkAppCode, AreaRoute);
        /**
         * @swagger
         * tags:
         *   name: Invitation
         *   description: API to manage invitation.
         */
        server.use(`/v1/invitation`, checkAppCode, InvitationRoute);
        /**
         * @swagger
         * tags:
         *   name: Member
         *   description: API to manage member.
         */
        server.use('/v1/member', checkAppCode, MemberRoute);
        /**
         * @swagger
         * tags:
         *   name: EntityType
         *   description: API to manage entity type.
         */
        server.use('/v1/entity-type', checkAppCode, EntityTypeRoute);
        /**
         * @swagger
         * tags:
         *   name: Version
         *   description: API to manage version.
         */
        server.use(`/v1/version`, checkAppCode, VersionRoute);
        /**
         * @swagger
         * tags:
         *   name: Automation
         *   description: API to manage automation.
         */
        server.use(`/v1/automation`, checkAppCode, AutomationRoute);
        /**
         * @swagger
         * tags:
         *   name: System
         *   description: API to manage system.
         */
        server.use(`/v1/system`, SystemRoute);
    } catch (err) {}
};
