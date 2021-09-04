import Joi from 'joi';
import { ErrorCode } from '../../response/Error.response';
// import { ValidationMethod } from '../../constant';
import { EValidationMethod } from '../../interface/IValid.interface';

class InvitationValidation {
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
                'string.base': ErrorCode.NSERR_INVITATIONIDTYPE,
                'string.max': ErrorCode.NSERR_INVITATIONIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_INVITATIONIDWRONGFORMAT,
            }),
        homeId: Joi.string()
            .optional()
            .allow(null, '')
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
        userId: Joi.string()
            .optional()
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
        state: Joi.number().integer().allow(null, -1).min(-1).max(1).optional().messages({
            'number.base': ErrorCode.NSERR_INVITATIONSTATETYPE,
            'number.max': ErrorCode.NSERR_INVITATIONSTATEOUTOFBOUND,
            'number.min': ErrorCode.NSERR_INVITATIONSTATEOUTOFBOUND,
        }),
        isRead: Joi.boolean().allow(null, '').optional().messages({
            'boolean.base': ErrorCode.NSERR_INVITATIONISREADTYPE,
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

    private create = Joi.object({
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
        memberEmail: Joi.string().required().trim().max(256).email().messages({
            'string.base': ErrorCode.NSERR_MEMBEREMAILTYPE,
            'string.max': ErrorCode.NSERR_MEMBEREMAILOUTOFBOUND,
            'string.email': ErrorCode.NSERR_MEMBEREMAILWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_MEMBERIDEMPTY,
            'any.required': ErrorCode.NSERR_MEMBEREMAILREQUIRED,
        }),
        note: Joi.string().optional().allow(null, '').max(512).messages({
            'string.base': ErrorCode.NSERR_INVITATIONNOTETYPE,
            'string.max': ErrorCode.NSERR_INVITATIONNOTEOUTOFBOUND,
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

    private update = Joi.object({
        id: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_INVITATIONIDTYPE,
                'string.max': ErrorCode.NSERR_INVITATIONIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_INVITATIONIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_INVITATIONIDEMPTY,
                'any.required': ErrorCode.NSERR_INVITATIONIDREQUIRED,
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
        state: Joi.number().integer().allow(null, -1).min(-1).max(1).required().messages({
            'number.base': ErrorCode.NSERR_INVITATIONSTATETYPE,
            'number.max': ErrorCode.NSERR_INVITATIONSTATEOUTOFBOUND,
            'number.min': ErrorCode.NSERR_INVITATIONSTATEOUTOFBOUND,
            'any.required': ErrorCode.NSERR_INVITATIONSTATEREQUIRED,
        }),
        isRead: Joi.boolean().required().messages({
            'boolean.base': ErrorCode.NSERR_INVITATIONISREADTYPE,
            'any.required': ErrorCode.NSERR_INVITATIONISREADREQUIRED,
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
        id: Joi.string()
            .required()
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_INVITATIONIDTYPE,
                'string.max': ErrorCode.NSERR_INVITATIONIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_INVITATIONIDWRONGFORMAT,
                'string.empty': ErrorCode.NSERR_INVITATIONIDEMPTY,
                'any.required': ErrorCode.NSERR_INVITATIONIDREQUIRED,
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

export default new InvitationValidation();
