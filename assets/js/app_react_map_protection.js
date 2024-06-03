import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppMapProtection/App.jsx";
let target = document.getElementById("map-protection-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App />
);