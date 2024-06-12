import express from "express";
import userController from "../controller/user-controller.js";
import customerController from "../controller/customer-controller.js";
import authorize from "../middleware/jwtAuth.js";
import imgUpload from "../utils/storeToGCS.js";
import multer from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/users', multer.single('profile_photo_url'), imgUpload.storeToGCS, userController.register);
userRouter.post('/users/login', userController.login);
userRouter.get('/users', userController.getAll);

//Prediction API
userRouter.post('/image-analyze', multer.single('image'), customerController.analyzeImage);

//User API
userRouter.get('/users/:uid', authorize, userController.getById);
userRouter.patch('/users/update', authorize, userController.update);
userRouter.delete('/users/logout', authorize, userController.logout);

//Customer API
userRouter.post('/customers', authorize, customerController.register);
userRouter.patch('/customers/update', authorize, customerController.update);
userRouter.get('/customers', authorize, customerController.getAll);
userRouter.get('customers/:customerID', authorize, customerController.getById);


export {
    userRouter
}