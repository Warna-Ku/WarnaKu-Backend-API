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

const logout = async (req, res, next) => {
    try {
        await userService.logout(req.body);
        res.status(200).json({
            status: "Success",
            msg: "Logout successfully"
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
            msg: "All data retrieved successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAllUser();

        res.status(200).json({
            status: "Success",
            msg: "All user's data are found",
            data: users
        })
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    logout,
    getAll,
    getById
}