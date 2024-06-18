import customerService from "../service/customer-service.js";

const register = async (req, res, next) => {
    try {
        const result = await customerService.register(req.body);
        res.status(200).json({
            error: false,
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
            error: false,
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
            error: false,
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
            error: false,
            message: "The customer's data retrieved successfully",
            customer: result
        });
    } catch (e) {
        next(e);
    }
}

const analyzeImage = async (req, res, next) => {
    try {
        const { customerID } = req.body;
        const { workerID } = req.body;

        const result = await customerService.analyzeImage(req.file, customerID, workerID);

        res.status(200).json({
            error: false,
            message: "Image analyzed successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAllHistoryAnalysisReports = async (req, res, next) => {
    try {
        const { workerID } = req.body;
        const reports = await customerService.getAllHistoryAnalysisReports(workerID);

        res.status(200).json({
            error: false,
            message: "Histories retrieved successfully",
            analysisReports: reports
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
    analyzeImage,
    getAllHistoryAnalysisReports
}