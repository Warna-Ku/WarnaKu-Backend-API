//Route for user who hasn't authenticated yet
import express from "express";
import userController from "../controller/user-controller.js";
import authorize from "../middleware/jwtAuth.js";
import imgUpload from "../utils/storeToGCS.js";
import multer from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/api/users', multer.single('profile_photo_url'), imgUpload.storeToGCS, userController.register);
userRouter.post('/api/users/login', userController.login);

//User API
userRouter.get('/api/users/:uid', authorize, userController.getById);

export {
    userRouter
}