import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            status: "Success",
            msg: "Login successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getById = async (req, res, next) => {
    try {
        const { uid } = req.params; // Extract/ Destructure uid from req.params
        const result = await userService.getCertainUser(uid); // Pass the uid to the service function

        res.status(200).json({
            status: "Success",
            msg: "User's data is found",
            data: result
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    login,
    getById
}