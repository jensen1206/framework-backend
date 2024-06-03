import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppCustomFields/App.jsx";
let target = document.getElementById("custom-fields-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);