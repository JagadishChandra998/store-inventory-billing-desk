import { useEffect, useState } from "react";
import API from "../aip/axios";
import "./Billing.css";

export default function Billing() {

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // GET PRODUCTS

    const fetchProducts = async () => {
        try {

            const response = await API.get("/product");

            console.log("PRODUCT RESPONSE:", response.data);

            setProducts(response.data.products || []);

        } catch (error) {

            console.log("PRODUCT ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load products"
            );
        }
    };


    useEffect(() => {
        fetchProducts();
        fetchBills();

    }, []);

    // ADD PRODUCT TO CART

    const addToCart = () => {

        setError("");

        if (!selectedProduct) {
            setError("Please select a product.");
            return;
        }

        const product = products.find(
            (item) => item._id === selectedProduct
        );

        if (!product) {
            setError("Product not found.");
            return;
        }

        if (quantity <= 0) {
            setError("Quantity must be greater than 0.");
            return;
        }

        if (quantity > product.productQuantity) {
            setError(
                `Only ${product.productQuantity} units available.`
            );
            return;
        }


        // Check whether product already exists in cart

        const existingProduct = cart.find(
            (item) => item.productId === product._id
        );


        if (existingProduct) {

            const newQuantity =
                existingProduct.quantity + Number(quantity);

            if (newQuantity > product.productQuantity) {
                setError(
                    `Only ${product.productQuantity} units available.`
                );
                return;
            }

            setCart(
                cart.map((item) =>
                    item.productId === product._id
                        ? {
                            ...item,
                            quantity: newQuantity,
                            total:
                                newQuantity *
                                product.productPrice
                        }
                        : item
                )
            );

        } else {

            setCart([
                ...cart,
                {
                    productId: product._id,
                    productName: product.productName,
                    price: product.productPrice,
                    quantity: Number(quantity),
                    total:
                        Number(quantity) *
                        product.productPrice
                }
            ]);
        }


        setSelectedProduct("");
        setQuantity(1);
    };

    // REMOVE FROM CART

    const removeFromCart = (productId) => {

        setCart(
            cart.filter(
                (item) => item.productId !== productId
            )
        );
    };

    // CHANGE CART QUANTITY

    const changeQuantity = (productId, newQuantity) => {

        const product = products.find(
            (item) => item._id === productId
        );

        if (!product) return;

        newQuantity = Number(newQuantity);

        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (newQuantity > product.productQuantity) {

            setError(
                `Only ${product.productQuantity} units available.`
            );

            return;
        }

        setCart(
            cart.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: newQuantity,
                        total:
                            newQuantity * item.price
                    }
                    : item
            )
        );
    };

    // CALCULATE TOTAL

    const grandTotal = cart.reduce(
        (sum, item) => sum + item.total,
        0
    );

    // CREATE BILL

    const createBill = async () => {

        setError("");

        if (cart.length === 0) {
            setError("Please add at least one product.");
            return;
        }

        if (!customerName.trim()) {
            setError("Please enter customer name.");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(customerPhone)) {
            setError("Phone number must contain 10 digits and start with 6, 7, 8, or 9.");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;

        }


        try {

            setLoading(true);


            const items = cart.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price
            }));


            const response = await API.post("/bill", {

                customerName,
                customerPhone,

                items

            });


            console.log("BILL RESPONSE:", response.data);


            alert("Bill created successfully!");


            // Clear everything

            setCart([]);
            setCustomerName("");
            setCustomerPhone("");


            // Refresh products because stock changed

            fetchProducts();
            fetchBills();


        } catch (error) {

            console.log("CREATE BILL ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to create bill"
            );

        } finally {

            setLoading(false);
        }
    };

    const fetchBills = async () => {
        try {

            const response = await API.get("/bill");

            console.log("BILLS RESPONSE:", response.data);
            console.log(
                "CREATED BY:",
                response.data.bill?.[0]?.createdBy
            );

            setBills(response.data.bill || []);

        } catch (error) {

            console.log("GET BILLS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load bills"
            );
        }
    };

    const shareBillOnWhatsApp = () => {
        const phone = selectedBill.customerPhone;

        if (!phone) {
            alert("Customer phone number is not available");
            return;
        }

        const message = `
 SMALL STORE
 Retail Sales & Inventory

 Bill ID: #${selectedBill._id.slice(-6).toUpperCase()}

 Customer: ${selectedBill.customerName || "Walk-in Customer"}
 Phone: ${selectedBill.customerPhone}

 Items:
 ${selectedBill.items?.map((item, index) => {
            const productName =
                item.product?.productName ||
                item.productName ||
                "Product";

            const price =
                Number(
                    item.price ||
                    item.product?.productPrice ||
                    0
                );

            const quantity = Number(item.quantity);

            const total = price * quantity;

            return `${index + 1}. ${productName} - ${quantity} × ₹${price.toFixed(2)} = ₹${total.toFixed(2)}`;
        }).join("\n")}

         Grand Total: ₹${Number(selectedBill.grandTotal).toFixed(2)}

       Thank you for shopping with us!
    `;

        const whatsappURL =
            `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");
    };


    return (

        <div className="billing-page">

            <div className="billing-header">

                <div>

                    <p className="billing-label">
                        SALES MANAGEMENT
                    </p>

                    <h1>Billing</h1>

                    <p>
                        Create customer bills and manage sales.
                    </p>

                </div>

            </div>


            {error && (
                <div className="billing-error">
                    {error}
                </div>
            )}


            <div className="billing-layout">

                <div className="billing-left">


                    {/* CUSTOMER */}

                    <div className="billing-card">

                        <h2>Customer Information</h2>

                        <div className="customer-grid">

                            <div>

                                <label>
                                    Customer Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter customer name"
                                    value={customerName}
                                    onChange={(e) =>
                                        setCustomerName(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div>

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={customerPhone}
                                    maxLength={10}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (/^\d*$/.test(value)) {
                                            setCustomerPhone(value);
                                        }
                                    }
                                    }


                                />

                            </div>

                        </div>

                    </div>


                    {/* ADD PRODUCT */}

                    <div className="billing-card">

                        <h2>Add Product</h2>

                        <div className="add-product-grid">

                            <div>

                                <label>
                                    Product
                                </label>

                                <select
                                    value={selectedProduct}
                                    onChange={(e) =>
                                        setSelectedProduct(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Product
                                    </option>

                                    {products
                                        .filter(
                                            (product) =>
                                                product.productQuantity > 0
                                        )
                                        .map((product) => (

                                            <option
                                                key={product._id}
                                                value={product._id}
                                            >
                                                {product.productName}
                                                {" - ₹"}
                                                {product.productPrice}
                                                {" | Stock: "}
                                                {product.productQuantity}
                                            </option>

                                        ))}

                                </select>

                            </div>


                            <div>

                                <label>
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <button
                                onClick={addToCart}
                                className="add-product-button"
                            >
                                + Add Product
                            </button>

                        </div>

                    </div>


                    {/* CART */}

                    <div className="billing-card">

                        <div className="cart-header">

                            <div>

                                <h2>Bill Items</h2>

                                <p>
                                    {cart.length} product(s)
                                </p>

                            </div>

                        </div>


                        {cart.length === 0 ? (

                            <div className="empty-cart">
                                No products added to the bill.
                            </div>

                        ) : (

                            <div className="cart-table-wrapper">

                                <table>

                                    <thead>

                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {cart.map((item) => (

                                            <tr key={item.productId}>

                                                <td>
                                                    <strong>
                                                        {item.productName}
                                                    </strong>
                                                </td>

                                                <td>
                                                    ₹{item.price}
                                                </td>

                                                <td>

                                                    <input
                                                        className="quantity-input"
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            changeQuantity(
                                                                item.productId,
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                </td>

                                                <td>
                                                    ₹{item.total}
                                                </td>

                                                <td>

                                                    <button
                                                        className="remove-button"
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.productId
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                    <div className="previous-bills">

                        <div className="previous-bills-header">

                            <div>
                                <p className="billing-label">
                                    SALES HISTORY
                                </p>

                                <h2>Previous Bills</h2>

                                <p>
                                    View and download previously created invoices.
                                </p>
                            </div>

                            <div className="bill-count">
                                {bills.length} Bills
                            </div>

                        </div>


                        {bills.length === 0 ? (

                            <div className="no-bills">
                                No bills found.
                            </div>

                        ) : (

                            <div className="bills-table-wrapper">

                                <table className="bills-table">

                                    <thead>

                                        <tr>
                                            <th>Bill ID</th>
                                            <th>Customer</th>
                                            <th>Phone</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {bills.map((bill) => (

                                            <tr key={bill._id}>

                                                <td>
                                                    #{bill._id.slice(-6).toUpperCase()}
                                                </td>

                                                <td>
                                                    {bill.customerName || "Walk-in Customer"}
                                                </td>

                                                <td>
                                                    {bill.customerPhone || "-"}
                                                </td>

                                                <td>
                                                    {bill.items?.length || 0}
                                                </td>

                                                <td>
                                                    <strong>
                                                        ₹{Number(bill.grandTotal).toFixed(2)}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {bill.createdAt
                                                        ? new Date(
                                                            bill.createdAt
                                                        ).toLocaleDateString()
                                                        : "-"
                                                    }
                                                </td>

                                                <td>

                                                    <button
                                                        className="view-bill-button"
                                                        onClick={() =>
                                                            setSelectedBill(bill)
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                        {selectedBill && (

                            <div className="invoice-overlay">

                                <div className="invoice-modal">

                                    <div className="invoice-actions">

                                        <button
                                            className="close-invoice"
                                            onClick={() => setSelectedBill(null)}
                                        >
                                            ×
                                        </button>

                                    </div>


                                    <div
                                        className="invoice"
                                        id="invoice-print"
                                    >

                                        <div className="invoice-header">

                                            <div>

                                                <h1>SMALL STORE</h1>

                                                <p>Retail Sales & Inventory</p>

                                            </div>

                                            <div className="invoice-title">

                                                <h2>Bill ID</h2>

                                                <p>
                                                    #{selectedBill._id
                                                        .slice(-6)
                                                        .toUpperCase()}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="invoice-divider"></div>


                                        <div className="invoice-info">

                                            <div>

                                                <strong>Customer info</strong>

                                                <p>
                                                    <b>Name:</b> {selectedBill.customerName ||
                                                        "Walk-in Customer"}
                                                </p>

                                                <p>
                                                    <b>Ph.No:</b> {selectedBill.customerPhone || "-"}
                                                </p>

                                            </div>


                                            <div>

                                                <strong>Date</strong>

                                                <p>
                                                    {selectedBill.createdAt
                                                        ? new Date(
                                                            selectedBill.createdAt
                                                        ).toLocaleString()
                                                        : "-"
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        <table className="invoice-table">

                                            <thead>

                                                <tr>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Qty</th>
                                                    <th>Total</th>
                                                </tr>

                                            </thead>

                                            <tbody>

                                                {selectedBill.items?.map(
                                                    (item, index) => (

                                                        <tr key={index}>

                                                            <td>
                                                                {item.product?.productName ||
                                                                    item.productName ||
                                                                    "Product"}
                                                            </td>

                                                            <td>
                                                                ₹
                                                                {Number(
                                                                    item.price ||
                                                                    item.product?.productPrice ||
                                                                    0
                                                                ).toFixed(2)}
                                                            </td>

                                                            <td>
                                                                {item.quantity}
                                                            </td>

                                                            <td>
                                                                ₹
                                                                {(
                                                                    Number(
                                                                        item.price ||
                                                                        item.product?.productPrice ||
                                                                        0
                                                                    ) *
                                                                    Number(item.quantity)
                                                                ).toFixed(2)}
                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>


                                        <div className="invoice-total">

                                            <span>Grand Total</span>

                                            <strong>
                                                ₹
                                                {Number(
                                                    selectedBill.grandTotal
                                                ).toFixed(2)}
                                            </strong>

                                        </div>


                                        <div className="invoice-footer">

                                            <p>Thank you for shopping with us!</p>
                                            <span>Bill By: {selectedBill.createdBy?.fullname || "Unknown"}</span>

                                        </div>

                                    </div>


                                    <div className="invoice-bottom-actions">

                                        <button
                                            className="print-invoice-button"
                                            onClick={() => window.print()}
                                        >
                                            🖨 Print / Save PDF
                                        </button>
                                        <button
                                            className="whatsapp-button"
                                            onClick={shareBillOnWhatsApp}
                                        >
                                            📲 Send WhatsApp
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

                <div className="billing-summary">

                    <h2>Bill Summary</h2>

                    <div className="summary-row">

                        <span>
                            Items
                        </span>

                        <strong>
                            {cart.reduce(
                                (sum, item) =>
                                    sum + item.quantity,
                                0
                            )}
                        </strong>

                    </div>


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ₹{grandTotal.toFixed(2)}
                        </strong>

                    </div>


                    <div className="summary-divider"></div>


                    <div className="grand-total">

                        <span>
                            Grand Total
                        </span>

                        <strong>
                            ₹{grandTotal.toFixed(2)}
                        </strong>

                    </div>


                    <button
                        className="create-bill-button"
                        onClick={createBill}
                        disabled={
                            loading ||
                            cart.length === 0
                        }
                    >

                        {loading
                            ? "Creating Bill..."
                            : "Create Bill"}

                    </button>

                </div>

            </div>

        </div>
    );
}