import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/AppPostsCategory/App.jsx";

let target = document.getElementById("posts-category-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <App />
);