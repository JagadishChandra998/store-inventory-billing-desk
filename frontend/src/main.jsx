// import React from "react";
// import { createRoot } from "react-dom/client";
// import Login from "./components/Login.jsx";

// function App() {
//   return (
//     <div style={{ fontFamily: "system-ui", padding: 24 }}>
//       <Login/>
//     </div>
//   );
// }

// createRoot(document.getElementById("root")).render(<App />);

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app.jsx"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);