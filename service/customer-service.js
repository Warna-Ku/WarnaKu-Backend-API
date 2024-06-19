import axios from 'axios';
import FormData from 'form-data';
import imgUpload from '../utils/storeToGCS.js';
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
            customerID: true,
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

    if (!customers.length) {
        throw new ResponseError(404, "No customers found");
    }

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

const uploadImageToGCS = async (file, folderPath) => {
    const req = { file };
    const res = {};
    await imgUpload.storeToGCS(req, res, () => {}, folderPath);

    if (req.file.cloudStorageError) {
        throw new ResponseError(500, 'Failed to upload image to GCS')
    }

    return req.file.cloudStoragePublicUrl;
}

const analyzeImage = async (file, customerID, workerID) => {
    if (!file) {
        throw new ResponseError(400, "File is required for analysis");
    }
    if (!customerID) {
        throw new ResponseError(400, "Customer ID is required for analysis");
    }
    if (!workerID) {
        throw new ResponseError(400, "Worker ID is required for analysis");
    }

    try {
        // Convert customerID to an integer
        const customerIdInt = parseInt(customerID);

        //Upload the image to Google Cloud Storage
        const imageURL = await uploadImageToGCS(file, 'customers/');

        console.log('Image URL:', imageURL); // Logging image URL

        // Update the customer's faceImageURL in the database
        console.log('Updating customer with ID:', customerIdInt, 'with imageURL:', imageURL);

        //update the customer's faceImageURL in the database
        const updatedCustomer= await prismaClient.customer.update({
            where: {
                customerID: customerIdInt
            },
            data: {
                faceImageURL: imageURL
            }, select: {
                faceImageURL: true
            }
        });

        console.log('Updated Customer:', updatedCustomer);


        if (!updatedCustomer || !updatedCustomer.faceImageURL) {
            throw new ResponseError(500, 'Failed to update faceImageURL in the database');
        }

        const form = new FormData();
        form.append('image', file.buffer, file.originalname);

        const response = await axios.post(process.env.FLASK_API_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        if (!response.data || !response.data.user_palette) {
            throw new ResponseError(500, "Failed to analyze the image");
        }

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

        // Return the structured data
        return {
            createdAt: analysisReport.createdAt,
            season: analysisReport.season,
            paletteDescription: analysisReport.palette.description,
            paletteImg: analysisReport.palette.imageURL,
            colors: analysisReport.palette.colors.map(color => ({
                name: color.name,
                code: color.code,
                description: color.description,
                image: color.imageURL
            })),
            customer: {
                fullname: analysisReport.customer.fullname,
                phone: analysisReport.customer.phone,
                address: analysisReport.customer.address,
                email: analysisReport.customer.email,
                faceImageURL: analysisReport.customer.faceImageURL
            },
            worker: {
                uid: analysisReport.worker.uid,
                name: analysisReport.worker.name,
                email: analysisReport.worker.email
            }
        }
    } catch (e) {
        throw new ResponseError(500, e.message);
    }
}

const getAllHistoryAnalysisReports = async (workerID) => {
    if (!workerID) {
        throw new ResponseError(400, "Worker ID is required");
    }

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

    if (!reports.length) {
        throw new ResponseError(404, "No analysis reports found");
    }

    return reports.map(report => (
        {
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
                email: report.customer.email,
                faceImageURL: report.customer.faceImageURL
            },
            worker: {
                uid: report.worker.uid,
                name: report.worker.name,
                email: report.worker.email
            }
        }
    ));
}


export default {
    register,
    update,
    getAllCustomer,
    getCertainCustomer,
    analyzeImage,
    getAllHistoryAnalysisReports
}