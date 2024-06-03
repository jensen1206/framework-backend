import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppMedienConverter/App.jsx";
let target = document.getElementById("medien-converter-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App />
);