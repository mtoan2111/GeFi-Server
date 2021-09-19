import Joi from 'joi';
import { ErrorCode } from '../../response/Error.response';
import { EValidationMethod } from '../../interface/IValid.interface';
// import { ValidationMethod } from '../../constant';

class AreaValidation {
    private create = Joi.object({
        accountId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ACCOUNTIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_ACCOUNTIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_ACCOUNTIDEMPTY,
            'any.required': ErrorCode.NSERR_ACCOUNTIDREQUIRE,
        }),

        matchId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_MATCHIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_MATCHIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_MATCHIDEMPTY,
            'any.required': ErrorCode.NSERR_MATCHIDREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_INVALIDPARAM,
        })
        .options({
            abortEarly: true,
        });

    private join = Joi.object({
        accountId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ACCOUNTIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_ACCOUNTIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_ACCOUNTIDEMPTY,
            'any.required': ErrorCode.NSERR_ACCOUNTIDREQUIRE,
        }),

        matchId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_MATCHIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_MATCHIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_MATCHIDEMPTY,
            'any.required': ErrorCode.NSERR_MATCHIDREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_INVALIDPARAM,
        })
        .options({
            abortEarly: true,
        });

    private start = Joi.object({
        matchId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_MATCHIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_MATCHIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_MATCHIDEMPTY,
            'any.required': ErrorCode.NSERR_MATCHIDREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_INVALIDPARAM,
        })
        .options({
            abortEarly: true,
        });

    private play = Joi.object({
        accountId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_ACCOUNTIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_ACCOUNTIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_ACCOUNTIDEMPTY,
            'any.required': ErrorCode.NSERR_ACCOUNTIDREQUIRE,
        }),

        matchId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_MATCHIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_MATCHIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_MATCHIDEMPTY,
            'any.required': ErrorCode.NSERR_MATCHIDREQUIRED,
        }),

        x: Joi.number().required().min(0).max(19).messages({
            'string.base': ErrorCode.NSERR_XAXISWRONGTYPE,
            'string.max': ErrorCode.NSERR_XAXISWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_XAXISEMPTY,
            'any.required': ErrorCode.NSERR_XAXISREQUIRED,
        }),

        y: Joi.number().required().min(0).max(19).messages({
            'string.base': ErrorCode.NSERR_YAXISWRONGTYPE,
            'string.max': ErrorCode.NSERR_YAXISOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_YAXISEMPTY,
            'any.required': ErrorCode.NSERR_YAXISREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_INVALIDPARAM,
        })
        .options({
            abortEarly: true,
        });

    private finish = Joi.object({
        matchId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_MATCHIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_MATCHIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_MATCHIDEMPTY,
            'any.required': ErrorCode.NSERR_MATCHIDREQUIRED,
        }),

        reason: Joi.string().required().max(128).valid('CANCEL', 'WINNING').trim().messages({
            'string.base': ErrorCode.NSERR_REASONEMPTY,
            'string.max': ErrorCode.NSERR_REASONOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_REASONEMPTY,
            'any.required': ErrorCode.NSERR_REASONREQUIRED,
        }),

        winner: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_WINNEREMPTY,
            'string.max': ErrorCode.NSERR_WINNEROUTOFBOUND,
            'string.empty': ErrorCode.NSERR_WINNEREMPTY,
            'any.required': ErrorCode.NSERR_WINNERREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_INVALIDPARAM,
        })
        .options({
            abortEarly: true,
        });

    private complete = Joi.object({
        matchId: Joi.string().required().max(128).trim().messages({
            'string.base': ErrorCode.NSERR_MATCHIDWRONGTYPE,
            'string.max': ErrorCode.NSERR_MATCHIDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_MATCHIDEMPTY,
            'any.required': ErrorCode.NSERR_MATCHIDREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_INVALIDPARAM,
        })
        .options({
            abortEarly: true,
        });

    private hashMethod = {
        [EValidationMethod.CREATE]: this.create,
        [EValidationMethod.JOIN]: this.join,
        [EValidationMethod.START]: this.start,
        [EValidationMethod.PLAY]: this.play,
        [EValidationMethod.FINISH]: this.finish,
        [EValidationMethod.COMPLETE]: this.complete,
    };

    public getValidSchema = (method: string): Joi.ObjectSchema<any> => {
        return this.hashMethod[method];
    };
}

export default new AreaValidation();
