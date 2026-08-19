import { useEffect, useState } from "react";
import API from "../aip/axios";
import "./Category.css";

export default function Category() {

    const role = localStorage.getItem("role");

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    // GET ALL CATEGORIES

    const fetchCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get("/category");

            console.log("CATEGORY RESPONSE:", response.data);

            setCategories(response.data.categories || []);

        } catch (error) {

            console.log("CATEGORY ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load categories"
            );

        } finally {

            setLoading(false);

        }
    };

    // LOAD CATEGORIES

    useEffect(() => {

        fetchCategories();

    }, []);

    // CREATE / UPDATE CATEGORY

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        if (!name.trim()) {

            setError("Please enter category name.");

            return;
        }


        try {

            setLoading(true);


            if (editingId) {

                // UPDATE

                const response = await API.put(
                    `/category/${editingId}`,
                    {
                        name: name.trim()
                    }
                );

                setMessage(
                    response.data.message ||
                    "Category updated successfully"
                );

            } else {

                // CREATE

                const response = await API.post(
                    "/category",
                    {
                        name: name.trim()
                    }
                );

                setMessage(
                    response.data.message ||
                    "Category created successfully"
                );
            }


            setName("");
            setEditingId(null);

            await fetchCategories();


        } catch (error) {

            console.log("CATEGORY SAVE ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to save category"
            );

        } finally {

            setLoading(false);

        }
    };

    // EDIT

    const handleEdit = (category) => {

        setName(category.name);

        setEditingId(category._id);

        setMessage("");
        setError("");
    };

    // CANCEL EDIT

    const handleCancel = () => {

        setName("");

        setEditingId(null);

        setError("");
        setMessage("");
    };

    // DELETE

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            setError("");
            setMessage("");

            const response = await API.delete(
                `/category/${id}`
            );

            setMessage(
                response.data.message ||
                "Category deleted successfully"
            );

            await fetchCategories();


        } catch (error) {

            console.log("CATEGORY DELETE ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to delete category"
            );
        }
    };


    return (
        <div className="category-page">

            {/* HEADER */}

            <div className="category-header">

                <div>
                    <h1>Categories</h1>

                    <p>
                        Manage product categories for your store.
                    </p>
                </div>

                <div className="category-count">

                    {categories.length}

                    <span>
                        Categories
                    </span>

                </div>

            </div>


            {/* FORM */}

            {role === "admin" && (
                <div className="category-form-card">

                    <h2>
                        {editingId
                            ? "Update Category"
                            : "Add Category"
                        }
                    </h2>


                    <form onSubmit={handleSubmit}>

                        <div className="category-input-group">

                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                            />

                            <button
                                type="submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Category"
                                        : "Add Category"
                                }

                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>


                    {error && (
                        <p className="category-error">
                            {error}
                        </p>
                    )}


                    {message && (
                        <p className="category-success">
                            {message}
                        </p>
                    )}

                </div>
            )}



            {/* CATEGORY LIST */}

            <div className="category-list-card">

                <div className="category-list-header">

                    <div>
                        <h2>All Categories</h2>

                        <p>
                            Manage your store categories
                        </p>
                    </div>

                </div>


                {loading && categories.length === 0 ? (

                    <div className="category-loading">
                        Loading categories...
                    </div>

                ) : categories.length === 0 ? (

                    <div className="category-empty">

                        <div>
                            📦
                        </div>

                        <h3>
                            No Categories Found
                        </h3>

                        <p>
                            Add your first category above.
                        </p>

                    </div>

                ) : (

                    <div className="category-table-wrapper">

                        <table className="category-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Category Name
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        No.of products
                                    </th>

                                    {role === "admin" && (
                                        <th>
                                            Actions
                                        </th>
                                    )}

                                </tr>

                            </thead>


                            <tbody>

                                {categories.map(
                                    (category, index) => (

                                        <tr
                                            key={category._id}
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>

                                                <div className="category-name">

                                                    <span className="category-icon">
                                                        {category.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </span>

                                                    <strong>
                                                        {category.name}
                                                    </strong>

                                                </div>

                                            </td>

                                            <td>
                                                {
                                                    new Date(category.createdAt).toLocaleDateString()
                                                }
                                            </td>

                                            <td>
                                                {category.productCount}
                                            </td>
                                            <td>
                                                {role === "admin" && (
                                                    <div className="category-actions">

                                                        <button
                                                            className="edit-button"
                                                            onClick={() =>
                                                                handleEdit(category)
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    category._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>
                                                )}


                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}