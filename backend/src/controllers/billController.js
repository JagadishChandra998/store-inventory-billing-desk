import Bill from "../models/Billing.js";
import Product from "../models/product.js";

export const createBill = async (req, res) => {
    try {
        const { customerName, items, customerPhone } = req.body;

        if (!customerName || !items || items.length === 0 || !customerPhone) {
            return res.status(400).json({
                success: false,
                message: "Customer name and items are required",
            });
        }

        let grandTotal = 0;
        const billItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "product not found",
                });
            }

            if (product.productQuantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `${product.productName} is out of stock`,
                });
            }

            const total = product.productPrice * item.quantity;
            grandTotal += total;

            billItems.push({
                product: product.id,
                quantity: item.quantity,
                price: product.productPrice,
                total,
            });

            product.productQuantity -= item.quantity;
            await product.save();
        }

        const bill = await Bill.create({
            customerName,
            customerPhone,
            items: billItems,
            grandTotal,
            createdBy: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Bill generated successfully",
            bill,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getBills = async (req, res) => {
    try {
        const bill = await Bill.find()
            .populate({ path: "items.product", select: "productName productPrice" })
            .populate("createdBy", "fullname email role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: bill.length,
            bill,
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

export const getBillById = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id)
            .populate("createdBy", "name email").populate("items.product", "productName productPrice");

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found",
            });
        }

        res.status(200).json({
            success: true,
            bill,
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

export const deleteBill = async (req, res) => {
    try {
        const bill = await Bill.findByIdAndDelete(req.params.id);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Bill delete successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        })
    };
}