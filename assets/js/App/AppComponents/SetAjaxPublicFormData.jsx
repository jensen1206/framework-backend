export default function SetAjaxPublicFormData(data, is_formular = true, settings) {
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

    formData.append('_handle', settings.form_handle);
    formData.append('token', settings.form_token);

    return formData;
}