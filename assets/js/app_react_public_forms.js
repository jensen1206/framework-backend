import * as React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App/PublicForms/App.jsx";

let appFormBuilder = document.querySelectorAll('.app-formular-builder');
if(appFormBuilder) {
    let appFormularEvent = Array.prototype.slice.call(appFormBuilder, 0);
    appFormularEvent.forEach(function (form) {
        const el = ReactDOM.createRoot(document.getElementById(form.id));
        let builderId =  form.getAttribute('data-builder');
        el.render(
            <App
                builder_id={builderId}
            />
        );
    })
}
