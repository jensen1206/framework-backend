import * as React from "react";
export default function setAjaxData(data, is_formular = true, content= ''){
    let formData = new FormData();
    if (is_formular) {
        let input = new FormData(data);
        for (let [name, value] of input) {
            formData.append(name, value);
        }
    } else {
        for (let [name, value] of Object.entries(data)) {
            formData.append(name, value);
        }
    }
    if(content){
        formData.append('content', content);
    }
    formData.append('action', 'BSFormBuilderPublic');
    formData.append('_ajax_nonce', BSFBPublic.nonce);

    return formData;
}