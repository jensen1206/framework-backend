import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppPosts/App.jsx";

let target = document.getElementById("posts-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App />
);