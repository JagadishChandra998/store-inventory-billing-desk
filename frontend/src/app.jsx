

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/login.jsx";
import Profile from "./components/Profile.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Layout from "./components/Layout.jsx";
import Category from "./components/Category.jsx";
import Product from "./components/Product.jsx";
import Billing from "./components/Billing.jsx";
import Reports from "./components/Reports.jsx";


const role = localStorage.getItem("role");


// function Reports() {
//   return <h1>Reports</h1>;
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}


        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/categories"
            element={<Category />}
          />

          <Route
            path="/products"
            element={<Product />}
          />

          <Route
            path="/billing"
            element={<Billing />}
          />

          {role === "admin" && (
            <Route
              path="/reports"
              element={<Reports />}
            />
          )}


          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>




      </Routes>
    </BrowserRouter>
  );
}

export default App;