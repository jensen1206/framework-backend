import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppMedien/App.jsx";
let target = document.getElementById("medien-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App />
);