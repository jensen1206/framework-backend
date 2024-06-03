import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/Elements/App.jsx";
let target = document.getElementById("builder-elements-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);