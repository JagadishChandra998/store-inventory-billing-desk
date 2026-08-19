import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    dailySalesReport,
    monthlySalesreport,
    lowProductCategoryReport,
    topSallingProduct,
    categorySalesReport,
    averageBillValueReport,
    inventoryValueReport,
    staffSalesReport
} from "../controllers/reportController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const routes = express.Router();

routes.get("/daily", authMiddleware, adminMiddleware, dailySalesReport);
routes.get("/monthly", authMiddleware, adminMiddleware, monthlySalesreport);
routes.get("/low-quantity", authMiddleware, adminMiddleware, lowProductCategoryReport);
routes.get("/top-selling-products", authMiddleware, adminMiddleware, topSallingProduct);
routes.get("/category-sales", authMiddleware, adminMiddleware, categorySalesReport);
routes.get("/average-bill", authMiddleware,adminMiddleware, averageBillValueReport);
routes.get("/inventory-value", authMiddleware, adminMiddleware, inventoryValueReport);
routes.get("/staff-sales", authMiddleware, adminMiddleware, staffSalesReport);

export default routes;