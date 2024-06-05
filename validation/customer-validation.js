import Joi from "joi";

const registerCustomerValidation = Joi.object({ 
    fullname: Joi.string().max(100).required(),
    phone: Joi.string().max(20).optional(),
    address: Joi.string().max(100).required()
});

const updateCustomerValidation = Joi.object({
    //We will update using patch verb method (not update all the data, just some of them), so the other properties will be optional
    customerID: Joi.number().positive().required(),
    fullname: Joi.string().max(100).optional(),
    phone: Joi.string().max(100).optional(),
    address: Joi.string().max(100).optional()
});

const getCustomerValidation = Joi.object({
    customerID: Joi.number().positive().required(),
});

export {
    registerCustomerValidation,
    updateCustomerValidation,
    getCustomerValidation
}