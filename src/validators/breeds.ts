import { celebrate, Joi, Segments } from "celebrate";

const validator = {
    new: celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().min(5).required(),
            animal: Joi.string().min(3).required()
        })
    })
};

export default validator;