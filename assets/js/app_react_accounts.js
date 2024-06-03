import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/Accounts/App.jsx";
let target = document.getElementById("account-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App
        id={target.getAttribute('data-id')}
    />
);