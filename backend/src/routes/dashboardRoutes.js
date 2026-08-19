import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getDashboard, getSalesTrend } from "../controllers/dashboardController.js";

const routes = express.Router();

routes.get("/", authMiddleware, getDashboard);
routes.get("/sales-trend", authMiddleware, getSalesTrend);


export default routes;