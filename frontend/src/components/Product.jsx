import { useEffect, useState } from "react";
import API from "../aip/axios";
import "./Product.css";

export default function Product() {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productColor, setProductColor] = useState("");
    const [productQuantity, setProductQuantity] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const role = localStorage.getItem("role");

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

    // GET CATEGORIES

    const fetchCategories = async () => {
        try {

            const response = await API.get("/category");

            console.log("CATEGORY RESPONSE:", response.data);

            setCategories(response.data.categories || []);

        } catch (error) {

            console.log("CATEGORY ERROR:", error);
        }
    };


    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // CLEAR FORM

    const clearForm = () => {

        setProductName("");
        setProductPrice("");
        setProductCategory("");
        setProductColor("");
        setProductQuantity("");

        setEditingId(null);
        setError("");
    };


    // CREATE / UPDATE PRODUCT

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const data = {
                productName,
                productPrice: Number(productPrice),
                productCategory,
                productColor,
                productQuantity: Number(productQuantity)
            };


            // UPDATE
            if (editingId) {

                await API.put(
                    `/product/${editingId}`,
                    data
                );

                alert("Product updated successfully");

            }

            // CREATE
            else {

                await API.post(
                    "/product",
                    data
                );

                alert("Product created successfully");
            }


            clearForm();

            fetchProducts();

        } catch (error) {

            console.log("SAVE PRODUCT ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save product"
            );

        } finally {

            setLoading(false);
        }
    };

    // EDIT PRODUCT

    const handleEdit = (product) => {

        setEditingId(product._id);

        setProductName(product.productName);
        setProductPrice(product.productPrice);

        setProductCategory(
            product.productCategory?._id ||
            product.productCategory
        );

        setProductColor(product.productColor || "");

        setProductQuantity(product.productQuantity);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // DELETE PRODUCT

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await API.delete(`/product/${id}`);

            alert("Product deleted successfully");

            fetchProducts();

        } catch (error) {

            console.log("DELETE PRODUCT ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    // STOCK STATUS

    const getStockStatus = (quantity) => {

        if (quantity === 0) {
            return "Out of Stock";
        }

        if (quantity <= 10) {
            return "Low Stock";
        }

        return "In Stock";
    };


    return (
        <div className="product-page">

            <div className="product-header">

                <div>
                    <p className="product-label">
                        INVENTORY MANAGEMENT
                    </p>

                    <h1>Products</h1>

                    <p>
                        Manage products, categories and stock.
                    </p>
                </div>

                <div className="product-total">
                    <span>Total Products</span>
                    <strong>{products.length}</strong>
                </div>

            </div>


            {error && (
                <div className="product-error">
                    {error}
                </div>
            )}


            {role === "admin" && (
                <div className="product-form-card">

                    <h2>
                        {editingId
                            ? "Update Product"
                            : "Add Product"}
                    </h2>


                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div>
                                <label>Product Name</label>

                                <input
                                    type="text"
                                    placeholder="Enter product name"
                                    value={productName}
                                    onChange={(e) =>
                                        setProductName(e.target.value)
                                    }
                                    required
                                />
                            </div>


                            <div>
                                <label>Price</label>

                                <input
                                    type="number"
                                    placeholder="Enter price"
                                    value={productPrice}
                                    onChange={(e) =>
                                        setProductPrice(e.target.value)
                                    }
                                    min="0"
                                    required
                                />
                            </div>


                            <div>
                                <label>Category</label>

                                <select
                                    value={productCategory}
                                    onChange={(e) =>
                                        setProductCategory(e.target.value)
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}

                                </select>

                            </div>


                            <div>
                                <label>Color</label>

                                <input
                                    type="text"
                                    placeholder="Enter color"
                                    value={productColor}
                                    onChange={(e) =>
                                        setProductColor(e.target.value)
                                    }
                                />
                            </div>


                            <div>
                                <label>Quantity</label>

                                <input
                                    type="number"
                                    placeholder="Enter quantity"
                                    value={productQuantity}
                                    onChange={(e) =>
                                        setProductQuantity(e.target.value)
                                    }
                                    min="0"
                                    required
                                />
                            </div>

                        </div>


                        <div className="form-buttons">

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Product"
                                        : "Add Product"}
                            </button>


                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={clearForm}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>
            )}


            {/* =========================
                PRODUCT TABLE
            ========================= */}

            <div className="product-table-card">

                <div className="table-title">

                    <div>
                        <h2>Product Inventory</h2>

                        <p>
                            View current products and stock levels.
                        </p>
                    </div>

                </div>


                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>Status</th>

                                {role === "admin" && (
                                    <th>Actions</th>
                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {products.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={
                                            role === "admin" ? 7 : 6
                                        }
                                        className="empty-product"
                                    >
                                        No products found.
                                    </td>

                                </tr>

                            ) : (

                                products.map((product) => (

                                    <tr key={product._id}>

                                        <td>
                                            <strong>
                                                {product.productName}
                                            </strong>
                                        </td>


                                        <td>
                                            {product.productCategory?.name ||
                                                "Unknown"}
                                        </td>


                                        <td>
                                            ₹{product.productPrice}
                                        </td>


                                        <td>
                                            {product.productColor || "-"}
                                        </td>


                                        <td>
                                            {product.productQuantity}
                                        </td>


                                        <td>

                                            <span
                                                className={`stock-status ${
                                                    product.productQuantity === 0
                                                        ? "out-stock"
                                                        : product.productQuantity <= 10
                                                            ? "low-stock"
                                                            : "in-stock"
                                                }`}
                                            >
                                                {getStockStatus(
                                                    product.productQuantity
                                                )}
                                            </span>

                                        </td>


                                        {role === "admin" && (

                                            <td>

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(product)
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(product._id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        )}

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}