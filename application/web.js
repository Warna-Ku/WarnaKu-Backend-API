import express from "express";
import { userRouter } from "../routes/public-api.js";
import { ResponseError } from "../error/response-error.js";

export const web = express();
web.use(express.json());
web.use(userRouter);

//Error-handling middleware
web.use((err, req, res, next) => {
    if (err instanceof ResponseError) {
        res.status(err.status).json({
            error: true,
            message: err.message
        });
    } else {
        res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

export default web;

