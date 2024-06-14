import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            status: "Success",
            message: "User added Successfully, please login",
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
            message: "Login successfully",
            loginResult: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await userService.update(req.body);
        res.status(200).json({
            status: "Success",
            message: "Update successfully",
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logout(req);
        res.status(200).json({
            status: "Success",
            message: "Logout successfully"
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
            message: "The user's data retrieved successfully",
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
            message: "All user's data is found",
            data: users
        })
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    update,
    logout,
    getAll,
    getById
}