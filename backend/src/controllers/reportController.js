import Bill from "../models/Billing.js";
import Product from "../models/product.js";
import Category from "../models/category.js";

export const dailySalesReport = async (req, res) => {
    try {
        // const today = new Date();

        // const start = new Date(today);
        // start.setHours(0, 0, 0, 0);

        // const end = new Date(today);
        // end.setHours(23, 59, 59, 999);

        const { from, to } = req.query;

        let start;
        let end;

        if (from) {
            start = new Date(from);
            start.setHours(0, 0, 0, 0);
        } else {
            start = new Date();
            start.setHours(0, 0, 0, 0);
        }

        if (to) {
            end = new Date(to);
            end.setHours(23, 59, 59, 999);
        } else {
            end = new Date();
            end.setHours(23, 59, 59, 999);
        }

        const report = await Bill.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start,
                        $lte: end,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalBills: { $sum: 1 },
                    totalSales: { $sum: "$grandTotal" },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            from: start,
            to: end,
            report: report.length ? report[0] : {
                totalBills: 0,
                totalSales: 0,
            },
        });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

export const monthlySalesreport = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();

        const report = await Bill.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalBills: { $sum: 1 },
                    totalSales: { $sum: "$grandTotal" },
                },
            },
            {
                $sort: {
                    "_id.month": 1,
                },
            },
        ]);

        res.status(200).json({
            success: true,
            report,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const lowProductCategoryReport = async (req, res) => {
    try {
        const product = await Product.find({ productQuantity: { $lte: 10 } }).select("productName productQuantity productPrice");

        res.status(200).json({
            success: true,
            total: product.length,
            product,
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

export const topSallingProduct = async (req, res) => {
    try {

        const { from, to } = req.query;

        let start;
        let end;

        if (from) {
            start = new Date(from);
            start.setHours(0, 0, 0, 0);
        }

        if (to) {
            end = new Date(to);
            end.setHours(23, 59, 59, 999);
        }

        const matchStage = {};

        if (start && end) {
            matchStage.createdAt = {
                $gte: start,
                $lte: end
            };
        }


        const report = await Bill.aggregate([

            {
                $match: matchStage
            },

            {
                $unwind: "$items"
            },

            {
                $group: {
                    _id: "$items.product",

                    totalQuantity: {
                        $sum: "$items.quantity"
                    }
                }
            },

            {
                $sort: {
                    totalQuantity: -1
                }
            },

            {
                $limit: 5
            },

            {
                $lookup: {
                    from: "products",

                    localField: "_id",

                    foreignField: "_id",

                    as: "product"
                }
            },

            {
                $unwind: "$product"
            },

            {
                $project: {
                    _id: 0,

                    productName: "$product.productName",

                    totalQuantity: 1
                }
            }

        ]);


        return res.status(200).json({
            success: true,
            report
        });


    } catch (error) {

        console.log(
            "TOP SELLING PRODUCT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

export const categorySalesReport = async (req, res) => {
    try {

        const { from, to } = req.query;

        let start;
        let end;

        if (from) {
            start = new Date(from);
            start.setHours(0, 0, 0, 0);
        }

        if (to) {
            end = new Date(to);
            end.setHours(23, 59, 59, 999);
        }

        const matchStage = {};

        if (start && end) {
            matchStage.createdAt = {
                $gte: start,
                $lte: end
            };
        }

        const report = await Bill.aggregate([

            {
                $match: matchStage
            },

            {
                $unwind: "$items"
            },

            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "product"
                }
            },

            {
                $unwind: "$product"
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "product.productCategory",
                    foreignField: "_id",
                    as: "category"
                }
            },

            {
                $unwind: "$category"
            },

            {
                $group: {
                    _id: "$category._id",

                    categoryName: {
                        $first: "$category.name"
                    },

                    totalQuantity: {
                        $sum: "$items.quantity"
                    },

                    totalSales: {
                        $sum: {
                            $multiply: [
                                "$items.quantity",
                                "$items.price"
                            ]
                        }
                    }
                }
            },

            {
                $sort: {
                    totalSales: -1
                }
            },

            {
                $project: {
                    _id: 0,
                    categoryName: 1,
                    totalQuantity: 1,
                    totalSales: 1
                }
            }

        ]);

        return res.status(200).json({
            success: true,
            report
        });

    } catch (error) {

        console.log("CATEGORY SALES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const inventoryValueReport = async (req, res) => {
    try {
        const report = await Product.aggregate([
            {
                $group: {
                    _id: null,

                    totalProducts: {
                        $sum: 1,
                    },

                    totalStockUnits: {
                        $sum: "$productQuatity"
                    },

                    inventoryValue: {
                        $sum: {
                            $multiply: [
                                "$productQuantity",
                                "$productPrice"
                            ]
                        }
                    }
                }
            }
        ]);
        return res.status(200).json({
            success: true,

            report: report.length
                ? report[0]
                : {
                    totalProducts: 0,
                    totalStockUnits: 0,
                    inventoryValue: 0
                }
        });
    }
    catch (error) {
        console.log("INVENTORY VALUE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const averageBillValueReport = async (req, res) => {
    try {

        const { from, to } = req.query;

        let start;
        let end;

        if (from) {
            start = new Date(from);
            start.setHours(0, 0, 0, 0);
        }

        if (to) {
            end = new Date(to);
            end.setHours(23, 59, 59, 999);
        }

        const matchStage = {};

        if (start && end) {
            matchStage.createdAt = {
                $gte: start,
                $lte: end
            };
        }

        const report = await Bill.aggregate([

            {
                $match: matchStage
            },

            {
                $group: {
                    _id: null,

                    averageBillValue: {
                        $avg: "$grandTotal"
                    },

                    totalBills: {
                        $sum: 1
                    },

                    totalSales: {
                        $sum: "$grandTotal"
                    }
                }
            },

            {
                $project: {
                    _id: 0,

                    averageBillValue: {
                        $round: [
                            "$averageBillValue",
                            2
                        ]
                    },

                    totalBills: 1,
                    totalSales: 1
                }
            }

        ]);

        return res.status(200).json({
            success: true,

            report: report.length
                ? report[0]
                : {
                    averageBillValue: 0,
                    totalBills: 0,
                    totalSales: 0
                }
        });

    } catch (error) {

        console.log(
            "AVERAGE BILL ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const staffSalesReport = async (req, res) => {
    try {
        const { from, to } = req.query;

        let start;
        let end;

        if (from) {
            start = new Date(from);
            start.setHours(0, 0, 0, 0);
        }

        if (to) {
            end = new Date(to);
            end.setHours(23, 59, 59, 999);
        }

        const matchStage = {};

        if (start && end) {
            matchStage.createdAt = {
                $gte: start,
                $lte: end
            };
        }

        const report = await Bill.aggregate([
            {
                $match: matchStage
            },

            {
                $group: {
                    _id: "$createdBy",

                    totalBills: {
                        $sum: 1
                    },

                    totalSales: {
                        $sum: "$grandTotal"
                    }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },

            {
                $unwind: "$user"
            },

            {
                $project: {
                    _id: 0,

                    name: "$user.fullname",

                    email: "$user.email",

                    role: "$user.role",

                    totalBills: 1,

                    totalSales: 1
                }
            },

            {
                $sort: {
                    totalSales: -1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            report
        });

    } catch (error) {

        console.log(
            "STAFF SALES ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};