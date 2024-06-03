import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AccountsOverview/App.jsx";
let target = document.getElementById("account-overview-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App />
);