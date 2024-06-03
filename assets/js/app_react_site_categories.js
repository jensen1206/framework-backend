import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppSiteCategories/App.jsx";
let target = document.getElementById("site-categories-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);