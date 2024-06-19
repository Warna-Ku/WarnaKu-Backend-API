import express from "express";
import userController from "../controller/user-controller.js";
import customerController from "../controller/customer-controller.js";
import authorize from "../middleware/jwtAuth.js";
import multer from "../middleware/multer.js";
import imgUpload from "../utils/storeToGCS.js";

const userRouter = express.Router();

userRouter.post('/users', multer.single('profile_photo_url'), userController.register);
userRouter.post('/users/login', userController.login);
userRouter.get('/users', userController.getAll);

//Prediction API
userRouter.post('/image-analyze', multer.single('image'), (req, res, next) => {
    imgUpload.storeToGCS(req, res, next, 'customers/');
}, customerController.analyzeImage);

//User API
userRouter.get('/users/:uid', authorize, userController.getById);
userRouter.patch('/users/update', authorize, userController.update);
userRouter.delete('/users/logout', authorize, userController.logout);

//Customer API
userRouter.post('/customers', authorize, customerController.register);
userRouter.patch('/customers/update', authorize, customerController.update);
userRouter.get('/customers', authorize, customerController.getAll);
userRouter.get('/customers/:customerID', authorize, customerController.getById);
userRouter.post('/customers/history', authorize, customerController.getAllHistoryAnalysisReports);


export {
    userRouter
}