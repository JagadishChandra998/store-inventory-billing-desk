import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css"

export default function Layout() {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/");
    };

    return (
        <div className="app-layout">

            <nav className="sidebar">

                <div className="sidebar-logo">
                    <div className="logo-icon">
                        SS
                    </div>

                    <div>
                        <h2>Small Store</h2>
                        <span>Inventory & Analytics</span>
                    </div>
                </div>


                <div className="nav-links">

                    <Link to="/dashboard">
                        <span>▦</span>
                        Dashboard
                    </Link>


                    {/* {role === "admin" && ( */}
                        <Link to="/categories">
                            <span>▤</span>
                            Categories
                        </Link>
                    {/* // )} */}


                    <Link to="/products">
                        <span>▣</span>
                        Products
                    </Link>


                    <Link to="/billing">
                        <span>▤</span>
                        Billing
                    </Link>


                    {role === "admin" && (
                        <Link to="/reports">
                            <span>▥</span>
                            Reports
                        </Link>
                    )}


                    <Link to="/profile">
                        <span>◉</span>
                        Profile
                    </Link>

                </div>


                <div className="sidebar-bottom">

                    <div className="user-role">
                        <div className="user-avatar">
                            {role === "admin" ? "A" : "S"}
                        </div>

                        <div>
                            <strong>
                                {role === "admin" ? "Administrator" : "Staff"}
                            </strong>

                            <small>
                                {role}
                            </small>
                        </div>
                    </div>


                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </nav>


            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}