
import { useEffect, useState } from "react";
import API from "../aip/axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");
    const [salesTrend, setSalesTrend] = useState([]);


    useEffect(() => {

        const getDashboard = async () => {
            try {

                const response = await API.get("/dashboard/");

                console.log(
                    "DASHBOARD RESPONSE:",
                    response.data,
                );

                setDashboard(response.data.dashboard);

            } catch (error) {

                console.error(
                    "DASHBOARD ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard"
                );
            }
        };


        const getSalesTrend = async () => {
            try {

                const response = await API.get(
                    "/dashboard/sales-trend"
                );

                console.log(
                    "SALES TREND RESPONSE:",
                    response.data
                );

                setSalesTrend(
                    response.data.salesTrend
                );

            } catch (error) {

                console.error(
                    "SALES TREND ERROR:",
                    error
                );
            }
        };


        getDashboard();
        getSalesTrend();

    }, []);

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!dashboard) {
        return <h2>Loading dashboard...</h2>;
    }

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <h1>Store Dashboard</h1>

                <p>
                    Monitor sales, inventory and business performance.
                </p>
            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Categories</h3>
                    <p>{dashboard.totalCategories}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Products</h3>
                    <p>{dashboard.totalProducts}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Bills</h3>
                    <p>{dashboard.totalBills}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Sales</h3>
                    <p>₹{dashboard.totalSales}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Average Bill Value</h3>
                    <p>₹{dashboard.averageBillValue.toFixed(2)}</p>
                </div>

            </div>

            <div className="sales-chart">

                <h2>Sales Trend</h2>

                {salesTrend.length === 0 ? (
                    <p>No sales data available.</p>
                ) : (

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <LineChart
                            data={salesTrend}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            // stroke="#ee6103"

                            />

                            <XAxis
                                dataKey="_id"
                                stroke="#64748b"
                            />

                            <YAxis
                                stroke="#64748b"
                            />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    // border: "1px solid #e2e8f0",
                                    border: "1px solid #5b84bb",

                                    borderRadius: "10px",
                                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                                }}
                            />

                            <Line
                                type="monotone"
                                dataKey="totalSales"
                                stroke="#4f46e5"
                                strokeWidth={4}
                                dot={{
                                    r: 5,
                                    fill: "#4f46e5"
                                }}
                                activeDot={{
                                    r: 8
                                }}
                            />
                        </LineChart>

                    </ResponsiveContainer>

                )}

            </div>

            <div className="low-stock">

                <div className="low-stock-header">

                    <div>
                        <h2>Low Stock Products</h2>

                        <p>
                            Products that need restocking
                        </p>
                    </div>

                    <span className="stock-warning">
                        {dashboard.lowProductQuantity} Items
                    </span>

                </div>


                {dashboard.lowProductQuantities.length === 0 ? (

                    <div className="no-stock">
                        <span>✓</span>
                        <p>All products have sufficient stock.</p>
                    </div>

                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {dashboard.lowProductQuantities.map(
                                (product) => (

                                    <tr key={product._id}>

                                        <td>
                                            {product.productName}
                                        </td>

                                        <td>
                                            <span className="quantity-badge">
                                                {product.productQuantity}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="stock-danger">
                                                Low Stock
                                            </span>
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}