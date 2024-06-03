import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppInstall/App.jsx";

let target = document.getElementById("install-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);