import { celebrate, Joi, Segments } from "celebrate";

const validator = {
    new: celebrate({
        [Segments.BODY]: Joi.object().keys({
            repeatPass: Joi.string().min(6).required(),
            email: Joi.string().email().required(),
            pass: Joi.string().min(6).required()
        })
    }),

    login: celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            pass: Joi.string().min(6).required()
        })
    }),

    updateData: celebrate({
        [Segments.BODY]: Joi.object().keys({
            shareWhatsapp: Joi.boolean().required(),
            whatsapp: Joi.string().min(10).max(11),
            us: Joi.string().length(2).required(),
            name: Joi.string().min(6).required(),
            city: Joi.string().required(),
            uid: Joi.string().required()
        })
    }),

    get: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            uid: Joi.string().required()
        })
    })
};

export default validator;