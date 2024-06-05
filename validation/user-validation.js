import Joi from "joi";

const registerUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    name: Joi.string().max(100).required()
});

const loginUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
});

const getUserValidation = Joi.object({
    uid: Joi.string().uuid().required() // Expecting a UUID string for uid
});

const updateUserValidation = Joi.object({
    //We will update using patch verb method (not update all the data, just some of them), so the other properties will be optional
    uid: Joi.string().uuid().required(),
    email: Joi.string().max(100).optional(),
    password: Joi.string().max(100).optional(),
    name: Joi.string().max(100).optional()
});

export {
    registerUserValidation,
    loginUserValidation,
    getUserValidation,
    updateUserValidation
}