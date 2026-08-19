import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reoprtRoutes from "./routes/reportRoutes.js";


const app = express();

app.use (cors());
app.use (express.json());

app.use("/api/auth", authRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/product",productRoutes);
app.use("/api/bill",billRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reoprtRoutes);


export default app;