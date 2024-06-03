import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/MedienSlider/App.jsx";
let target = document.getElementById("medien-slider-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App/>
);