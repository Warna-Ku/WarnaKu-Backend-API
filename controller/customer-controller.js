import customerService from "../service/customer-service.js";

const register = async (req, res, next) => {
    try {
        const result = await customerService.register(req.body);
        res.status(200).json({
            status: "Success",
            msg: "Registrate successfully",
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
            status: "Success",
            msg: "Update successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const customers = await customerService.getAllCustomer();

        res.status(200).json({
            status: "Success",
            msg: "All Customer's data is found",
            data: customers
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
            status: "Success",
            msg: "The customer's data retrieved successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const analyzeImage = async (req, res, next) => {
    try {
        const result = await customerService.analyzeImage(req.file);

        res.status(200).json({
            status: "Success",
            msg: "Image analyzed successfully",
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