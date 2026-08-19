import React, { useEffect, useState } from "react";
import API from "../aip/axios.jsx";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

import "./Reports.css"

const Reports = () => {


    const [dailySales, setDailySales] = useState(null);
    const [monthlySales, setMonthlySales] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [averageBill, setAverageBill] = useState(null);
    const [categorySales, setCategorySales] = useState([]);
    const [inventoryValue, setInventoryValue] = useState(null);
    const [staffSales, setStaffSales] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");


    const fetchReports = async (selectedFrom = fromDate,
        selectedTo = toDate) => {
        try {
            setLoading(true);
            setError("");

            const dateParams = {};

            if (selectedFrom) {
                dateParams.from = selectedFrom;
            }

            if (selectedTo) {
                dateParams.to = selectedTo;
            }

            console.log("DATE PARAMS:", dateParams);

            const [
                dailyResponse,
                monthlyResponse,
                topProductResponse,
                lowStockResponse,
                averageResponse,
                categoryResponse,
                inventoryResponse,
                staffResponse
            ] = await Promise.all([

                API.get("/reports/daily", { params: dateParams }),
                API.get("/reports/monthly"),
                API.get("/reports/top-selling-products", { params: dateParams }),
                API.get("/reports/low-quantity"),
                API.get("/reports/average-bill", { params: dateParams }),
                API.get("/reports/category-sales", { params: dateParams }),
                API.get("/reports/inventory-value"),
                API.get("/reports/staff-sales", { params: dateParams })

            ]);
            console.log(
                "FILTERED DAILY RESPONSE:",
                dailyResponse.data
            );

            setDailySales(
                dailyResponse.data.report
            );

            setMonthlySales(
                monthlyResponse.data.report || []
            );

            setTopProducts(
                topProductResponse.data.report || []
            );

            setLowStock(
                lowStockResponse.data.product || []
            );

            setAverageBill(
                averageResponse.data.report
            );

            setCategorySales(
                categoryResponse.data.report || []
            );

            setInventoryValue(
                inventoryResponse.data.report
            );

            setStaffSales(
                staffResponse.data.report || []
            );

        } catch (error) {

            console.log("REPORTS ERROR:", error);

            setError("Failed to load reports.");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchReports();

    }, []);


    const monthlyChartData = monthlySales.map((item) => ({
        month: `Month ${item._id.month}`,
        sales: item.totalSales
    }));

    const topProductsChartData = topProducts.map((item) => ({
        product: item.productName,
        quantity: item.totalQuantity
    }));

    const categoryChartData = categorySales.map((item) => ({
        name: item.categoryName,
        value: item.totalSales
    }));

    // LOADING

    if (loading) {

        return (
            <div className="reports-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading reports...
                </p>

            </div>
        );

    }

    // ERROR

    if (error) {

        return (
            <div className="reports-error">

                <h2>
                    Unable to load reports
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );

    }

    // MAIN UI

    return (

        <div className="reports-page">


            {/* HEADER */}

            <div className="reports-header">

                <div>

                    <h1>
                        Reports & Analytics
                    </h1>

                    <p>
                        Analyze sales, products,
                        categories and inventory
                    </p>

                </div>

            </div>

            <div className="report-filter">

                <div className="filter-group">

                    <label>
                        From Date
                    </label>

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />

                </div>


                <div className="filter-group">

                    <label>
                        To Date
                    </label>

                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />

                </div>


                <button
                    onClick={fetchReports}
                    className="filter-button"
                >
                    Apply Filter
                </button>


                <button
                    onClick={() => {
                        setFromDate("");
                        setToDate("");
                        fetchReports("", "");

                        API.get("/reports/daily")
                            .then((response) => {
                                setDailySales(response.data.report);
                            })
                            .catch((error) => {
                                console.log("CLEAR FILTER ERROR:", error);
                            });
                    }}
                    className="clear-button"
                >
                    Clear
                </button>

            </div>

            {/* KPI CARDS */}

            <div className="reports-kpi-grid">


                <div className="report-card sales-card">

                    <span>
                        Sales for Selected Period
                    </span>

                    <h2>
                        ₹
                        {Number(
                            dailySales?.totalSales || 0
                        ).toLocaleString("en-IN")}
                    </h2>

                    <p>
                        {dailySales?.totalBills || 0}
                        {" "}
                        {/* bills today */}
                    </p>

                </div>



                <div className="report-card bills-card">

                    <span>
                        Bills for Selected Period
                    </span>

                    <h2>
                        {dailySales?.totalBills || 0}
                    </h2>

                    <p>
                        Transactions
                    </p>

                </div>



                <div className="report-card average-card">

                    <span>
                        Average Bill Value
                    </span>

                    <h2>
                        ₹
                        {Number(
                            averageBill?.averageBillValue || 0
                        ).toLocaleString("en-IN")}
                    </h2>

                    <p>
                        Average transaction
                    </p>

                </div>



                <div className="report-card inventory-card">

                    <span>
                        Inventory Value
                    </span>

                    <h2>
                        ₹
                        {Number(
                            inventoryValue?.inventoryValue || 0
                        ).toLocaleString("en-IN")}
                    </h2>

                    <p>
                        Current stock value
                    </p>

                </div>

            </div>


            {/* TOP PRODUCTS */}

            <div className="report-section">

                <div className="section-title">

                    <h2>
                        Top Selling Products
                    </h2>

                    <span>
                        Top 5
                    </span>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Rank
                                </th>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Quantity Sold
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {topProducts.length > 0 ? (

                                topProducts.map(
                                    (product, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>

                                                <span className="rank">
                                                    #{index + 1}
                                                </span>

                                            </td>

                                            <td>
                                                {product.productName}
                                            </td>

                                            <td>
                                                {product.totalQuantity}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="empty"
                                    >
                                        No sales data available
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                <h2>
                    Top Selling Products Chart
                </h2>

                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <BarChart
                            data={topProductsChartData}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="product"
                            />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="quantity"
                                fill="#4f46e5"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>



            {/* CATEGORY SALES */}

            <div className="report-section">

                <div className="section-title">

                    <h2>
                        Category-wise Sales
                    </h2>

                </div>


                <div className="category-grid">

                    {categorySales.length > 0 ? (

                        categorySales.map(
                            (category, index) => (

                                <div
                                    className="category-card"
                                    key={index}
                                >

                                    <h3>
                                        {category.categoryName}
                                    </h3>

                                    <strong>
                                        ₹
                                        {Number(
                                            category.totalSales || 0
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                    <p>
                                        {category.totalQuantity}
                                        {" "}
                                        units sold
                                    </p>

                                </div>

                            )
                        )

                    ) : (

                        <p>
                            No category sales available.
                        </p>

                    )}

                </div>

                <h2>
                    Category-wise Sales Chart
                </h2>

                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <PieChart>

                            <Pie
                                data={categoryChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                innerRadius={65}
                                paddingAngle={3}
                                label
                            >

                                {categoryChartData.map(
                                    (entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={[
                                                "#4f46e5",
                                                "#16a34a",
                                                "#ea580c",
                                                "#dc2626",
                                                "#0891b2",
                                                "#9333ea"
                                            ][index % 6]}
                                        />
                                    )
                                )}

                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* MONTHLY SALES */}

            <div className="report-section">

                <div className="section-title">

                    <h2>
                        Monthly Sales
                    </h2>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Month
                                </th>

                                <th>
                                    Bills
                                </th>

                                <th>
                                    Sales
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {monthlySales.length > 0 ? (

                                monthlySales.map(
                                    (month, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>
                                                Month{" "}
                                                {month._id?.month}
                                            </td>

                                            <td>
                                                {month.totalBills}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    month.totalSales || 0
                                                ).toLocaleString("en-IN")}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="empty"
                                    >
                                        No monthly data available
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                <h2>
                    Monthly Sales Trend Chart
                </h2>

                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={350}

                    >

                        <LineChart
                            data={monthlyChartData}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="month"
                                stroke="rgb(111, 133, 204)"
                            />

                            <YAxis
                                stroke="rgb(111, 133, 204)"

                            />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#4f46e5"
                                strokeWidth={5}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

                {/* </div> */}

            </div>

            {/* LOW STOCK */}

            <div className="report-section">

                <div className="section-title">

                    <h2>
                        Low Stock Products
                    </h2>

                    <span className="warning-label">
                        Attention Required
                    </span>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Product
                                </th>

                                <th>
                                    Current Stock
                                </th>

                                <th>
                                    Price
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {lowStock.length > 0 ? (

                                lowStock.map(
                                    (product, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>
                                                {product.productName}
                                            </td>

                                            <td>

                                                <span className="stock-warning">

                                                    {product.productQuantity}

                                                    {" "}
                                                    left

                                                </span>

                                            </td>

                                            <td>
                                                ₹
                                                {product.productPrice}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="3"
                                        className="empty"
                                    >
                                        No low-stock products.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* STAFF SALES */}

            <div className="report-section">

                <div className="section-title">

                    <h2>
                        Staff Sales Performance
                    </h2>

                </div>


                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Staff
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Bills
                                </th>

                                <th>
                                    Sales
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {staffSales.length > 0 ? (

                                staffSales.map(
                                    (staff, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>
                                                {staff.name}
                                            </td>

                                            <td>
                                                {staff.role}
                                            </td>

                                            <td>
                                                {staff.totalBills}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    staff.totalSales || 0
                                                ).toLocaleString("en-IN")}
                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="empty"
                                    >
                                        No staff sales data.
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


        </div>

    );
};

export default Reports;