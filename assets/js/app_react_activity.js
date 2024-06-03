import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/Activity/App.jsx";

let target = document.getElementById("activity-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App
      id={target.getAttribute('data-id')}
      channel={target.getAttribute('data-channel')}
    />
);