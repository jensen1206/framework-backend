import * as React from 'react';
import ReactDOM from "react-dom/client";
import MediaUpload from "./App/MediaUpload/MediaUpload.jsx";
let target = document.getElementById("media-upload-react-app");
const el = ReactDOM.createRoot(target);
el.render(
    <MediaUpload/>
);