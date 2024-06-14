import customerService from "../service/customer-service.js";

const register = async (req, res, next) => {
    try {
        const result = await customerService.register(req.body);
        res.status(200).json({
            error: "False",
            message: "Customer created successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await customerService.update(req.body);
        res.status(200).json({
            error: "False",
            message: "Update successfully",
            updateResult: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const customers = await customerService.getAllCustomer();

        res.status(200).json({
            error: "False",
            message: "All Customer's data is found",
            listCustomer: customers
        })
    } catch (e) {
        next(e);
    }
}

const getById = async (req, res, next) => {
    try {
        const { customerID } = req.params;
        const result = await customerService.getCertainCustomer(customerID);

        res.status(200).json({
            error: "False",
            message: "The customer's data retrieved successfully",
            customer: result
        });
    } catch (e) {
        next(e);
    }
}

const analyzeImage = async (req, res, next) => {
    try {
        const result = await customerService.analyzeImage(req.file);

        res.status(200).json({
            error: "False",
            message: "Image analyzed successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    update,
    getAll,
    getById,
    analyzeImage
}