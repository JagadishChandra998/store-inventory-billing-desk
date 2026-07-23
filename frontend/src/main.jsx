import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Niyati Template (Frontend)</h1>
      <p>If you can see this, the frontend build is working.</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
