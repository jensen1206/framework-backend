import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppForms/App.jsx";

let target = document.getElementById("forms-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App />
);