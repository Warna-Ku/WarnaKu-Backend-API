//Route for user who hasn't authenticated yet
import express from "express";
import userController from "../controller/user-controller.js";
import authorize from "../middleware/jwtAuth.js"; 

const userRouter = express.Router();

userRouter.post('/api/users', userController.register);
userRouter.post('/api/users/login', userController.login);

//User API
userRouter.get('/api/users/:uid', authorize, userController.getById);

export {
    userRouter
}