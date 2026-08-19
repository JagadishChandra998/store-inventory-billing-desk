// const apiBaseCandidates = [
//   window.__NIYATI_TEMPLATE_API_BASE__,
//   localStorage.getItem('niyati.templateApiBase'),
//   'http://localhost:5000'
// ].filter(Boolean);

// const apiBase = String(apiBaseCandidates[0] || '').replace(//$/, '');
// document.getElementById('apiBase').textContent = apiBase || '(same origin)';

// const badge = document.getElementById('healthBadge');
// const versionText = document.getElementById('versionText');

// async function check() {
//   try {
//     const healthResp = await fetch(apiBase + '/health');
//     if (!healthResp.ok) throw new Error('health ' + healthResp.status);
//     const health = await healthResp.json();
//     badge.textContent = health.ok ? 'Healthy' : 'Unhealthy';
//     badge.className = health.ok ? 'ok' : 'fail';

//     const versionResp = await fetch(apiBase + '/api/version');
//     if (!versionResp.ok) throw new Error('version ' + versionResp.status);
//     const version = await versionResp.json();
//     versionText.textContent = JSON.stringify(version);
//   } catch (err) {
//     badge.textContent = 'Offline';
//     badge.className = 'fail';
//     versionText.textContent = err.message;
//   }
// }

// check();




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