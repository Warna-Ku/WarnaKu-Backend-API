import { ResponseError } from "../error/response-error.js";
import Joi from "joi";

const validate = (schema, request) => {

    const result = schema.validate(request, {
        abortEarly: false, //used to validate all of the properties, if it's not set up as a false value, then only the username that will be checked
        allowUnknown: false //To reject if someone input unknown field
    });

    if (result.error) {
        throw new ResponseError(400, result.error.message);
    } else {
        return result.value;
    }
}

export {
    validate
}