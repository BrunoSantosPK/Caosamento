import { celebrate, Joi, Segments } from "celebrate";

const validator = {
    login: celebrate({
        [Segments.BODY]: Joi.object().keys({
            user: Joi.string().email().required(),
            pass: Joi.string().min(6).required()
        })
    }),

    resetPass: celebrate({
        [Segments.BODY]: Joi.object().keys({
            user: Joi.string().email().required()
        })
    }),

    updatePass: celebrate({
        [Segments.BODY]: Joi.object().keys({
            user: Joi.string().email().required(),
            pass: Joi.string().min(6).required(),
            newPass: Joi.string().min(6).required()
        })
    }),

    updateData: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().min(6).required(),
            phone: Joi.string().min(10).max(11),
            birthDate: Joi.string().required(),
            city: Joi.string().min(6).required(),
            us: Joi.string().length(2).required(),
            gender: Joi.string().length(1).required(),
            notifyByPhone: Joi.boolean().required()
        })
    })
};

export default validator;