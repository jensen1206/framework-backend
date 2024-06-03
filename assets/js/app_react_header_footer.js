import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppHeaderFooter/App.jsx";
let target = document.getElementById("header-footer-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App
      type={target.getAttribute('data-type')}
    />
);