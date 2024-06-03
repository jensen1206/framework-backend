import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/Menu/App.jsx";
let target = document.getElementById("site-menu-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);