import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/RegisterSettings/App.jsx";
let target = document.getElementById("register-settings-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);