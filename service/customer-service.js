import axios from 'axios';
import FormData from 'form-data';
import { validate } from "../validation/validation.js";
import { registerCustomerValidation, getCustomerValidation, updateCustomerValidation } from "../validation/customer-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const register = async (request) => {
    const customer = validate(registerCustomerValidation, request);

    //To check if the customer is already registered
    const countCustomer = await prismaClient.customer.count({
        where: {
            fullname: customer.fullname
        }
    });

    if (countCustomer === 1) {
        throw new ResponseError(400, "The customer's already registered")
    }

    //If the customer is not registered yet => create data
    return prismaClient.customer.create({
        data: customer,
        select: {
            fullname: true,
            phone: true,
            address: true
        }
    });
}

const update = async (request) => {
    const updateRequestCustomer = validate(updateCustomerValidation, request);

    if (!updateRequestCustomer.customerID) {
        throw new ResponseError(400, "Customer ID is required for update");
    }

    const customerInDatabase = await prismaClient.customer.count({
        where: {
            customerID: updateRequestCustomer.customerID
        }
    });

    if (customerInDatabase !== 1) {
        throw new ResponseError(404, "Customer is not found");
    }

    const data = {};

    if (updateRequestCustomer.fullname) {
        data.fullname = updateRequestCustomer.fullname;
    }

    if (updateRequestCustomer.phone) {
        data.phone = updateRequestCustomer.phone;
    }

    if (updateRequestCustomer.adress) {
        data.adress = updateRequestCustomer.address;
    }

    return prismaClient.customer.update({
        where: {
            customerID: updateRequestCustomer.customerID
        },
        data: data,
        select: {
            customerID: true,
            fullname: true,
            phone: true,
            address: true
        }
    });
}

const getAllCustomer = async () => {
    const customers = await prismaClient.customer.findMany({
        select: {
            fullname: true,
            phone: true,
            address: true,
            faceImageURL: true
        }
    });

    return customers;
}

const getCertainCustomer = async (customerID) => {
    const customer = await prismaClient.customer.findUnique({
        where: {
            customerID: customerID
        },
        select: {
            customerID: true,
            fullname: true,
            phone: true,
            address: true
        }
    });

    if (!customer) {
        throw new ResponseError(404, 'Customer is not found ');
    }

    return customer;
}

const analyzeImage = async (file) => {
    try {
        const form = new FormData();
        form.append('image', file.buffer, file.originalname);

        const response = await axios.post(process.env.FLASK_API_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        return response.data;
    } catch (e) {
        throw new Error(e.message);
    }
}

export default {
    register,
    update,
    getAllCustomer,
    getCertainCustomer,
    analyzeImage
}