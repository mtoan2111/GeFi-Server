import Joi from 'joi';
import { EValidationMethod } from '../../interface/IValid.interface';
import { ErrorCode } from '../../response/Error.response';
// import { ValidationMethod } from '../../constant';

class UserValidation {
    private get = Joi.object({
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
        name: Joi.string().optional().allow(null, '').max(256).messages({
            'string.base': ErrorCode.NSERR_USERNAMETYPE,
            'string.max': ErrorCode.NSERR_USERNAMEOUTOFBOUND,
        }),
        phone: Joi.string().optional().allow(null, '').max(32).messages({
            'string.base': ErrorCode.NSERR_USERPHONETYPE,
            'string.max': ErrorCode.NSERR_USERPHONEOUTOFBOUND,
        }),
        email: Joi.string().optional().allow(null, '').max(256).email().lowercase().messages({
            'string.base': ErrorCode.NSERR_USEREMAILTYPE,
            'string.max': ErrorCode.NSERR_USERNAMEOUTOFBOUND,
        }),
        address: Joi.string().optional().allow(null, '').max(512).messages({
            'string.base': ErrorCode.NSERR_USERADDRESSTYPE,
            'string.max': ErrorCode.NSERR_USERADDRESSOUTOFBOUND,
        }),
        fcm: Joi.string().optional().allow(null, '').max(512).messages({
            'string.base': ErrorCode.NSERR_USEREMAILTYPE,
            'string.max': ErrorCode.NSERR_USERNAMEOUTOFBOUND,
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
            .optional()
            .allow(null, '')
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_USERIDTYPE,
                'string.empty': ErrorCode.NSERR_USERIDEMPTY,
                'string.max': ErrorCode.NSERR_USERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_USERIDWRONGFORMAT,
            }),
        name: Joi.string().required().trim().max(256).messages({
            'string.base': ErrorCode.NSERR_USERNAMETYPE,
            'string.max': ErrorCode.NSERR_USERNAMEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_USERNAMEEMPTY,
            'any.required': ErrorCode.NSERR_USERNAMEREQUIRED,
        }),
        phone: Joi.string().optional().allow(null, '').max(32).trim().messages({
            'string.base': ErrorCode.NSERR_USERPHONETYPE,
            'string.max': ErrorCode.NSERR_USERPHONEOUTOFBOUND,
        }),
        email: Joi.string().required().max(256).trim().email().lowercase().messages({
            'string.base': ErrorCode.NSERR_USEREMAILTYPE,
            'string.max': ErrorCode.NSERR_USEREMAILOUTOFBOUND,
            'string.email': ErrorCode.NSERR_USEREMAILWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_USEREMAILEMPTY,
            'any.required': ErrorCode.NSERR_USEREMAILREQUIRIED,
        }),
        fcm: Joi.string().required().trim().max(512).messages({
            'string.base': ErrorCode.NSERR_USEREMAILTYPE,
            'string.max': ErrorCode.NSERR_USERNAMEOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_USERFCMEMPTY,
            'any.required': ErrorCode.NSERR_USERFCMREQUIRED,
        }),
        avatar: Joi.string().optional().allow(null, '').trim().max(512).messages({
            'string.base': ErrorCode.NSERR_USERAVATARTYPE,
            'string.max': ErrorCode.NSERR_USERAVATAROUTOFBOUND,
        }),
        password: Joi.string()
            .required()
            .min(6)
            .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*^?&])[A-Za-z\d@$!#%^*?&]{6,}$/))
            .messages({
                'string.base': ErrorCode.NSERR_USERPWDTYPE,
                'string.min': ErrorCode.NSERR_USERPWDOUTOFBOUND,
                'string.max': ErrorCode.NSERR_USERPWDOUTOFBOUND,
                'string.empty': ErrorCode.NSERR_USERPWDEMPTY,
                'string.pattern.base': ErrorCode.NSERR_USERPWDWRONGFORMAT,
                'any.required': ErrorCode.NSERR_USERPWDREQUIRED,
            }),
        password_cfm: Joi.string().required().min(6).valid(Joi.ref('password')).messages({
            'string.base': ErrorCode.NSERR_USERPWDCFTYPE,
            'string.min': ErrorCode.NSERR_USERPWDCFOUTOFBOUND,
            'string.max': ErrorCode.NSERR_USERPWDCFOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_USERPWDCFEMPTY,
            'any.required': ErrorCode.NSERR_USERPWDCFREQUIRED,
            'any.only': ErrorCode.NSERR_USERPWDCFNOTMATCH,
        }),
        token: Joi.string().required().trim().alphanum().length(4).messages({
            'string.base': ErrorCode.NSERR_USERCODETYPE,
            'string.empty': ErrorCode.NSERR_USERCODEEMPTY,
            'string.length': ErrorCode.NSERR_USERCODEOUTOFBOUND,
            'string.alphanum': ErrorCode.NSERR_USERCODETYPE,
            'any.required': ErrorCode.NSERR_USERCODEREQUIRED,
        }),
        address: Joi.string().optional().allow(null, '').max(512).trim().messages({
            'string.base': ErrorCode.NSERR_USERADDRESSTYPE,
            'string.max': ErrorCode.NSERR_USERADDRESSOUTOFBOUND,
        }),
        lang: Joi.string().optional().allow(null, '').trim().max(16).valid('vi', 'en').messages({
            'string.base': ErrorCode.NSERR_USERLANGTYPE,
            'string.max': ErrorCode.NSERR_USERLANGOUTOFBOUND,
            'any.only': ErrorCode.NSERR_USERLANGWRONGFORMAT,
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

    private verifyEmail = Joi.object({
        userId: Joi.string()
            .optional()
            .allow(null, '')
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
            }),
        email: Joi.string().required().max(50).trim().email().lowercase().messages({
            'string.base': ErrorCode.NSERR_USEREMAILTYPE,
            'string.max': ErrorCode.NSERR_USEREMAILOUTOFBOUND,
            'string.email': ErrorCode.NSERR_USEREMAILWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_USEREMAILEMPTY,
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

    private forgotPassword = Joi.object({
        userId: Joi.string()
            .optional()
            .allow(null, '')
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
            }),

        email: Joi.string().required().max(50).trim().email().lowercase().messages({
            'string.base': ErrorCode.NSERR_USEREMAILTYPE,
            'string.max': ErrorCode.NSERR_USEREMAILOUTOFBOUND,
            'string.email': ErrorCode.NSERR_USEREMAILWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_USEREMAILEMPTY,
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

    private newPassword = Joi.object({
        userId: Joi.string()
            .optional()
            .allow(null, '')
            .max(128)
            .trim()
            .uuid({
                version: 'uuidv4',
                separator: '-',
            })
            .messages({
                'string.base': ErrorCode.NSERR_USERIDTYPE,
                'string.empty': ErrorCode.NSERR_USERIDEMPTY,
                'string.max': ErrorCode.NSERR_USERIDOUTOFBOUND,
                'string.guid': ErrorCode.NSERR_USERIDWRONGFORMAT,
            }),
        email: Joi.string().required().max(50).trim().email().lowercase().messages({
            'string.base': ErrorCode.NSERR_USEREMAILTYPE,
            'string.max': ErrorCode.NSERR_USEREMAILOUTOFBOUND,
            'string.email': ErrorCode.NSERR_USEREMAILWRONGFORMAT,
            'string.empty': ErrorCode.NSERR_USEREMAILEMPTY,
            'any.required': ErrorCode.NSERR_USEREMAILREQUIRIED,
        }),
        token: Joi.string().required().trim().alphanum().length(4).messages({
            'string.base': ErrorCode.NSERR_USERCODETYPE,
            'string.empty': ErrorCode.NSERR_USERCODEEMPTY,
            'string.length': ErrorCode.NSERR_USERCODEOUTOFBOUND,
            'string.alphanum': ErrorCode.NSERR_USERCODETYPE,
            'any.required': ErrorCode.NSERR_USERCODEREQUIRED,
        }),
        password: Joi.string()
            .required()
            .min(6)
            .max(255)
            .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*^?&])[A-Za-z\d@$!#%^*?&]{6,255}$/))
            .messages({
                'string.base': ErrorCode.NSERR_USERPWDTYPE,
                'string.min': ErrorCode.NSERR_USERPWDOUTOFBOUND,
                'string.max': ErrorCode.NSERR_USERPWDOUTOFBOUND,
                'string.empty': ErrorCode.NSERR_USERPWDEMPTY,
                'string.pattern.base': ErrorCode.NSERR_USERPWDWRONGFORMAT,
                'any.required': ErrorCode.NSERR_USERPWDREQUIRED,
            }),
        password_cfm: Joi.string().required().min(6).max(255).valid(Joi.ref('password')).messages({
            'string.base': ErrorCode.NSERR_USERPWDCFTYPE,
            'string.min': ErrorCode.NSERR_USERPWDCFOUTOFBOUND,
            'string.max': ErrorCode.NSERR_USERPWDCFOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_USERPWDCFEMPTY,
            'any.required': ErrorCode.NSERR_USERPWDCFREQUIRED,
            'any.only': ErrorCode.NSERR_USERPWDCFNOTMATCH,
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

    private updatePassword = Joi.object({
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
        password_old: Joi.string().required().min(6).max(255).messages({
            'string.base': ErrorCode.NSERR_USEROLDPWDTYPE,
            'string.min': ErrorCode.NSERR_USEROLDPWDOUTOFBOUND,
            'string.max': ErrorCode.NSERR_USEROLDPWDOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_USEROLDPWDEMPTY,
            'any.required': ErrorCode.NSERR_USEROLDPWDREQUIRED,
        }),
        password: Joi.string()
            .required()
            .min(6)
            .max(255)
            .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*^?&])[A-Za-z\d@$!#%^*?&]{6,255}$/))
            .messages({
                'string.base': ErrorCode.NSERR_USERPWDTYPE,
                'string.min': ErrorCode.NSERR_USERPWDOUTOFBOUND,
                'string.max': ErrorCode.NSERR_USERPWDOUTOFBOUND,
                'string.empty': ErrorCode.NSERR_USERPWDEMPTY,
                'any.required': ErrorCode.NSERR_USERPWDREQUIRED,
                'string.pattern.base': ErrorCode.NSERR_USERPWDWRONGFORMAT,
            }),
        password_cfm: Joi.string().required().min(6).max(255).valid(Joi.ref('password')).messages({
            'string.base': ErrorCode.NSERR_USERPWDCFTYPE,
            'string.min': ErrorCode.NSERR_USERPWDCFOUTOFBOUND,
            'string.max': ErrorCode.NSERR_USERPWDCFOUTOFBOUND,
            'string.empty': ErrorCode.NSERR_USERPWDCFEMPTY,
            'any.required': ErrorCode.NSERR_USERPWDCFREQUIRED,
            'any.only': ErrorCode.NSERR_USERPWDCFNOTMATCH,
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
        name: Joi.string().optional().allow(null, '').trim().max(256).messages({
            'string.base': ErrorCode.NSERR_USERNAMETYPE,
            'string.max': ErrorCode.NSERR_USERNAMEOUTOFBOUND,
        }),
        phone: Joi.string().optional().allow(null, '').max(32).trim().messages({
            'string.base': ErrorCode.NSERR_USERPHONETYPE,
            'string.max': ErrorCode.NSERR_USERPHONEOUTOFBOUND,
        }),
        address: Joi.string().optional().allow(null, '').max(512).trim().messages({
            'string.base': ErrorCode.NSERR_USERADDRESSTYPE,
            'string.max': ErrorCode.NSERR_USERADDRESSOUTOFBOUND,
        }),
        fcm: Joi.string().optional().allow(null, '').trim().max(512).messages({
            'string.base': ErrorCode.NSERR_USERFCMTYPE,
            'string.max': ErrorCode.NSERR_USERFCMOUTOFBOUND,
        }),
        avatar: Joi.string().optional().allow(null, '').trim().max(512).messages({
            'string.base': ErrorCode.NSERR_USERAVATARTYPE,
            'string.max': ErrorCode.NSERR_USERAVATAROUTOFBOUND,
        }),
        lang: Joi.string().optional().allow(null, '').trim().max(16).valid('vi', 'en').messages({
            'string.base': ErrorCode.NSERR_USERLANGTYPE,
            'string.max': ErrorCode.NSERR_USERLANGOUTOFBOUND,
            'any.only': ErrorCode.NSERR_USERLANGWRONGFORMAT,
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

    private delete = Joi.object({});

    private hashMethod = {
        [EValidationMethod.GET]: this.get,
        [EValidationMethod.CREATE]: this.create,
        [EValidationMethod.UPDATE]: this.update,
        [EValidationMethod.DELETE]: this.delete,
        [EValidationMethod.VERIFYEMAIL]: this.verifyEmail,
        [EValidationMethod.NEWPASSWORD]: this.newPassword,
        [EValidationMethod.FORGOTPASSWORD]: this.forgotPassword,
        [EValidationMethod.UPDATEPASSWORD]: this.updatePassword,
    };

    public getValidSchema = (method: string): Joi.ObjectSchema<any> => {
        return this.hashMethod[method];
    };
}

export default new UserValidation();
