//Route for user who hasn't authenticated yet
import express from "express";
import userController from "../controller/user-controller.js";
import authorize from "../middleware/jwtAuth.js";
import imgUpload from "../utils/storeToGCS.js";
import multer from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/users', multer.single('profile_photo_url'), imgUpload.storeToGCS, userController.register);
userRouter.post('/users/login', userController.login);
userRouter.get('/users', userController.getAll);

//User API
userRouter.get('/users/:uid', authorize, userController.getById);
userRouter.delete('/users/logout', authorize, userController.logout)

export {
    userRouter
}