import express from "express";
import { userRouter } from "../routes/public-api.js";

export const web = express();
web.use(express.json());
web.use(userRouter);