import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppBackups/App.jsx";
let target = document.getElementById("backup-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);