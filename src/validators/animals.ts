import { celebrate, Joi, Segments } from "celebrate";

const validator = {
    add: celebrate({
        [Segments.BODY]: Joi.object().keys({
            uid: Joi.string().required(),
            name: Joi.string().min(6).required(),
            description: Joi.string().min(10).required(),
            breed: Joi.string().required()
        })
    }),

    getByUser: celebrate({
        [Segments.PARAMS]: Joi.object().keys({
            uid: Joi.string().required()
        })
    }),

    search: celebrate({
        [Segments.QUERY]: {
            page: Joi.number().min(1).required(),
            breed: Joi.string().required(),
            uid: Joi.string().required(),
            uf: Joi.string().length(2),
            city: Joi.string()
        }
    }),

    delete: celebrate({
        [Segments.BODY]: Joi.object().keys({
            animal: Joi.string().required()
        })
    })
};

export default validator;
