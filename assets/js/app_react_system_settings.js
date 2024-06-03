import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppSystemSettings/App.jsx";
let target = document.getElementById("system-settings-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);