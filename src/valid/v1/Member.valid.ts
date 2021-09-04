import Joi from 'joi';
import { ErrorCode } from '../../response/Error.response';
// import { ValidationMethod } from '../../constant';
import { EValidationMethod } from '../../interface/IValid.interface';

class MemberValidation {
    private get = Joi.object({
        id: Joi.string()
            .optional()
            .allow(null, '')
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_MEMBERIDTYPE,
                'string.max': ErrorCode.NSERR_MEMBERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_MEMBERIDWRONGFORMAT,
            }),
        userId: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_USERIDTYPE,
                'string.max': ErrorCode.NSERR_USERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_USERIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_USERIDEMPTY,
                'any.required': ErrorCode.NSERR_USERIDREQUIRED,
            }),
        homeId: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_HOMEIDTYPE,
                'string.max': ErrorCode.NSERR_HOMEIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_HOMEIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_HOMEIDEMPTY,
                'any.required': ErrorCode.NSERR_HOMEIDREQUIRED,
            }),
        name: Joi.string().optional().allow(null, '').max(256).messages({
            'string.base': ErrorCode.NSERR_MEMBERNAMETYPE,
            'string.max': ErrorCode.NSERR_MEMBERNAMEOUTOFBOUND,
        }),
        memberEmail: Joi.string().optional().allow(null, '').max(256).email().messages({
            'string.base': ErrorCode.NSERR_MEMBEREMAILTYPE,
            'string.max': ErrorCode.NSERR_MEMBEREMAILOUTOFBOUND,
            'string.email': ErrorCode.NSERR_MEMBEREMAILWRONGFORMAT,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_APPCODETYPE,
            'string.max': ErrorCode.NSERR_APPCODEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_APPCODEEMPTY,
            'any.required': ErrorCode.NSERR_APPCODEREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
        })
        .options({
            abortEarly: true,
        });

    private create = Joi.object();

    private update = Joi.object({
        memberEmail: Joi.string().required().max(256).trim().email().messages({
            'string.base': ErrorCode.NSERR_MEMBEREMAILTYPE,
            'string.max': ErrorCode.NSERR_MEMBEREMAILOUTOFBOUND,
            'string.email': ErrorCode.NSERR_MEMBEREMAILWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_MEMBEREMAILEMPTY,
            'any.required': ErrorCode.NSERR_MEMBEREMAILREQUIRED,
        }),
        userId: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_USERIDTYPE,
                'string.max': ErrorCode.NSERR_USERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_USERIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_USERIDEMPTY,
                'any.required': ErrorCode.NSERR_USERIDREQUIRED,
            }),
        homeId: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_HOMEIDTYPE,
                'string.max': ErrorCode.NSERR_HOMEIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_HOMEIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_HOMEIDEMPTY,
                'any.required': ErrorCode.NSERR_HOMEIDREQUIRED,
            }),
        name: Joi.string().optional().allow(null, '').max(256).messages({
            'string.base': ErrorCode.NSERR_MEMBERNAMETYPE,
            'string.max': ErrorCode.NSERR_MEMBERNAMEOUTOFBOUND,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_APPCODETYPE,
            'string.max': ErrorCode.NSERR_APPCODEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_APPCODEEMPTY,
            'any.required': ErrorCode.NSERR_APPCODEREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
        })
        .options({
            abortEarly: true,
        });

    private delete = Joi.object({
        userId: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_USERIDTYPE,
                'string.max': ErrorCode.NSERR_USERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_USERIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_USERIDEMPTY,
                'any.required': ErrorCode.NSERR_USERIDREQUIRED,
            }),
        homeId: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_HOMEIDTYPE,
                'string.max': ErrorCode.NSERR_HOMEIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_HOMEIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_HOMEIDEMPTY,
                'any.required': ErrorCode.NSERR_HOMEIDREQUIRED,
            }),
        memberId: Joi.string()
            .optional()
            .allow(null, '')
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_MEMBERIDTYPE,
                'string.max': ErrorCode.NSERR_MEMBERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_MEMBERIDWRONGFORMAT,
            }),
        memberEmail: Joi.string().required().max(256).trim().email().messages({
            'string.base': ErrorCode.NSERR_MEMBEREMAILTYPE,
            'string.max': ErrorCode.NSERR_MEMBEREMAILOUTOFBOUND,
            'string.email': ErrorCode.NSERR_MEMBEREMAILWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_MEMBEREMAILEMPTY,
            'any.required': ErrorCode.NSERR_MEMBEREMAILREQUIRED,
        }),
        appCode: Joi.string().required().max(256).trim().messages({
            'string.base': ErrorCode.NSERR_APPCODETYPE,
            'string.max': ErrorCode.NSERR_APPCODEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_APPCODEEMPTY,
            'any.required': ErrorCode.NSERR_APPCODEREQUIRED,
        }),
    })
        .messages({
            'object.unknown': ErrorCode.NSERR_PARAMUNKNOWN,
        })
        .options({
            abortEarly: true,
        });

    private hashMethod = {
        [EValidationMethod.GET]: this.get,
        [EValidationMethod.CREATE]: this.create,
        [EValidationMethod.UPDATE]: this.update,
        [EValidationMethod.DELETE]: this.delete,
    };

    public getValidSchema = (method: string): Joi.ObjectSchema<any> => {
        return this.hashMethod[method];
    };
}

export default new MemberValidation();
