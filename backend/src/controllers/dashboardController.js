import Category from "../models/category.js";
import Product from "../models/product.js";
import Bill from "../models/Billing.js";

export const getDashboard = async (req, res) => {
    try {
        const totalCategories = await Category.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalBills = await Bill.countDocuments();

        const sales = await Bill.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: {
                        $sum: "$grandTotal"
                    },
                },
            },
        ]);

        const totalSales = sales.length > 0 ? sales[0].totalSales : 0;

        const averageBillValue = totalBills > 0
            ? totalSales / totalBills
            : 0;

        const lowProductQuantities = await Product.find({ productQuantity: {$lte :10}}).select(" productName productQuantity " );

        res.status(200).json({
            success:true,
            dashboard :{
                totalCategories,
                totalProducts,
                totalBills,
                totalSales,
                averageBillValue,
                lowProductQuantity: lowProductQuantities.length,
                lowProductQuantities
            }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getSalesTrend = async (req, res) => {
    try {

        const salesTrend = await Bill.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$billDate"
                        }
                    },

                    totalSales: {
                        $sum: "$grandTotal"
                    },

                    totalBills: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    "_id": 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            salesTrend
        });

    } catch (error) {

        console.log("SALES TREND ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};