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
            address: true,
            email: true
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
    if (updateRequestCustomer.fullname) data.fullname = updateRequestCustomer.fullname;
    if (updateRequestCustomer.phone) data.phone = updateRequestCustomer.phone;
    if (updateRequestCustomer.address) data.address = updateRequestCustomer.address;

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

const analyzeImage = async (file, customerID, workerID) => {
    try {
        // Convert customerID to an integer
        const customerIdInt = parseInt(customerID);

        const form = new FormData();
        form.append('image', file.buffer, file.originalname);

        const response = await axios.post(process.env.FLASK_API_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        // return response.data;

        //Extract necessary data from the response
        const { user_palette } = response.data;

        //Save color analysis report into database
        const analysisReport = await prismaClient.colorAnalysisReport.create({
            data: {
                createdAt: new Date(),
                season: user_palette,
                palette: {
                    connect: {
                        season: user_palette
                    }
                },
                customer: {
                    connect: {
                        customerID: customerIdInt
                    }
                },
                worker: {
                    connect: {
                        uid: workerID
                    }
                }
            }
        });

        return analysisReport;
    } catch (e) {
        throw new Error(e.message);
    }
}
const getAllHistoryAnalysisReports = async (workerID) => {
    const reports = await prismaClient.colorAnalysisReport.findMany({
        where: {
            workerID: workerID
        },
        include: {
            palette: {
                include: {
                    colors: true
                }
            },
            customer: true,
            worker: true
        }
    });

    return reports.map(report => ({
        season: report.season,
        createdAt: report.createdAt,
        paletteDescription: report.palette.description,
        paletteImg: report.palette.imageURL,
        colors: report.palette.colors.map(color => ({
            name: color.name,
            code: color.code,
            description: color.description,
            image: color.imageURL
        })),
        customer: {
            fullname: report.customer.fullname,
            phone: report.customer.phone,
            address: report.customer.address,
            email: report.customer.email
        },
        worker: {
            uid: report.worker.uid,
            name: report.worker.name,
            email: report.worker.email
        }
    }));
}


export default {
    register,
    update,
    getAllCustomer,
    getCertainCustomer,
    analyzeImage,
    getAllHistoryAnalysisReports
}