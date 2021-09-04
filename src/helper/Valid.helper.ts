import UserValidation from '../valid/v1/User.valid';
import HomeValidation from '../valid/v1/Home.valid';
import AreaValidation from '../valid/v1/Area.valid';
import EntityValidation from '../valid/v1/Entity.valid';
import EntityTypeValidation from '../valid/v1/EntityType.valid';
import InvitationValidation from '../valid/v1/Invitation.valid';
import MemberValidation from '../valid/v1/Member.valid';
import VersionValidation from '../valid/v1/Version.valid';
import AutomationValidation from '../valid/v1/Automation.valid';
import IValidation, { TValidation, EValidationController } from '../interface/IValid.interface';
import Joi from 'joi';
import { injectable, inject } from 'inversify';
import ILogger from '../interface/ILogger.interface';
import IResponser from '../interface/IResponser.interface';
import { ErrorCode } from '../response/Error.response';

@injectable()
class Validation implements IValidation {
    hashValid = {
        [EValidationController.USER]: UserValidation,
        [EValidationController.HOME]: HomeValidation,
        [EValidationController.AREA]: AreaValidation,
        [EValidationController.ENTITY]: EntityValidation,
        [EValidationController.ENTITYTYPE]: EntityTypeValidation,
        [EValidationController.INVITATION]: InvitationValidation,
        [EValidationController.MEMBER]: MemberValidation,
        [EValidationController.VERSION]: VersionValidation,
        [EValidationController.AUTOMATION]: AutomationValidation,
    };
    private logger: ILogger;
    private responser: IResponser;
    constructor(@inject('Logger') logger: ILogger, @inject('Responser') responser: IResponser) {
        this.logger = logger;
        this.responser = responser;
    }

    valid = (option: TValidation): void => {
        try {
            const { request, response, next, valid } = option;
            const { controller, method } = valid;
            const isGET: boolean = request.method === 'GET';
            let param: any = isGET ? request.query : request.body;

            this.logger.Info({ path: `${controller}.controller.ts`, resource: `${method}:param`, mess: JSON.stringify(param) });

            const validResult: Joi.ValidationResult = this.hashValid[controller]?.getValidSchema?.(method)?.validate?.(param);

            this.logger.Info({ path: `${controller}.controller.ts`, resource: `${method}:valid`, mess: JSON.stringify(validResult) });

            if (validResult?.error) {
                let errorDetail: string = validResult?.error?.details?.[0]?.message;
                return this.responser.NotAcceptable(response, { code: errorDetail });
            }

            isGET ? (request.query = validResult?.value) : (request.body = validResult?.value);
            next();
        } catch (err) {
            this.logger.Error({ path: `${option?.valid?.controller}.controller.ts`, resource: `${option?.valid?.method}:param`, mess: err });
            return this.responser.NotAcceptable(option.response, { code: ErrorCode.NSERR_UNKNOWN });
        }
    };
}

export default Validation;
