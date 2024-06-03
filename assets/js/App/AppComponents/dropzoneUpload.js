import {Dropzone} from "dropzone";

let uploadDropzone;
let dropzoneContainer;


let addIdUpload = [];
export const dropzoneUpload = (callback, optionen) => {

    let resetBtn = jQuery('.clear-dropzone');
    let previewNode = document.getElementById(optionen.template);
    let previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);
    let delete_after = optionen.delete_after || false;
    let delete_after_time = optionen.delete_after_time || 2500;

    dropzoneContainer = document.getElementById(optionen.container);
    //uploadDropzone.destroy()
    uploadDropzone = new Dropzone(dropzoneContainer, {
        url: uploadSettings.upload_url,
        //acceptedFiles: uploadSettings.accept,
        acceptedFiles: optionen.assets,
        paramName: "file",
        method: "post",
        // timeout: 180000,
        maxFilesize: 500,
        previewTemplate: previewTemplate,
        parallelUploads: 1,
        maxFiles: optionen.maxFiles || 15,  //dz-max-files-reached
        chunking: optionen.chunking || true,
        forceChunking: true,
        chunkSize: 256000,
        parallelChunkUploads: false,
        retryChunks: false,
        retryChunksLimit: 3,
        dictDefaultMessage: trans['media']['Drag & drop or click files here.'],
        dictInvalidFileType: trans['media']['You cannot upload files of this type.'],
        dictFallbackMessage: trans['media']['Your browser does not support drag n drop file uploads.'],
        dictFileTooBig: trans['media']['File is too large ({{filesize}} MB). Maximum file size {{maxFilesize}} MB'],
        dictMaxFilesExceeded: trans['media']['Maximum file size is {{maxFiles}}'],
        addRemoveLinks: false,
        autoProcessQueue: true,
        dictRemoveFile: trans['media']['Remove file'],
        clickable: ".btn-open-file",
        init: function () {
            let _this = this;
            this.on("addedfile", function (file) {

            });

            this.on("uploadprogress", function (file, progress, bytesSent) {

            });

            this.on("totaluploadprogress", function (totalBytes, progress, totalBytesSent) {
               // console.log(totalBytes,progress, totalBytesSent)
            });

            this.on("sending", function (file, xhr, formData) {

                let formComplete = {
                    'not_complete': true,
                }
                callback(formComplete, 'start_complete')

                file.previewElement.querySelector('.dz-progress').classList.add('active')
                formData.append("token", uploadSettings.token);
                formData.append("_handle", uploadSettings.handle);
                formData.append("lastModified", file.lastModified);
                formData.append("filesize", file.size);
                formData.append("filename", file.name);
                formData.append("chunkAktiv", optionen.chunking || false);
                let inputData = document.getElementById(optionen.form_id);
                let input = new FormData(inputData);
                for (let [name, value] of input) {
                    formData.append(name, value);
                }
            })

            this.on("queuecompvare", function (progress) {

            });

            this.on("complete", function (file) {

            });

            this.on("success", function (file, response) {
                file.previewElement.classList.add('upload-success');
                if (response.status) {
                    file.previewElement.querySelector('.dz-progress').remove()
                    if(delete_after) {
                        setTimeout(() => {
                            this.removeFile(file);
                        }, delete_after_time);
                    }
                    callback(response, 'upload')
                } else {
                    file.previewElement.querySelector('.dz-progress').remove()
                    file.previewElement.classList.add('upload-error')
                    file.previewElement.querySelector('.error').innerHTML = response.msg
                    setTimeout(() => {
                        this.removeFile(file);
                    }, delete_after_time);
                }
            })

            this.on("error", function (file, response) {
                file.previewElement.querySelector('.dz-progress').remove()
                file.previewElement.classList.add('upload-error')
                if(delete_after) {
                    setTimeout(() => {
                        this.removeFile(file);
                    }, delete_after_time);
                }
                let formComplete = {
                    'not_complete': false,
                }
                callback(formComplete, 'start_complete')
            })

            this.on("removedfile", function (file) {
                let formData = {
                    'id': file.upload.uuid,
                }
                callback(formData, 'delete')

                let formComplete = {
                    'not_complete': false,
                }
                callback(formComplete, 'start_complete')
            })

            this.on("queuecomplete", function (progress) {


                let formData = {
                    'not_complete': false,
                    'complete': true

                }
                callback(formData, 'start_complete')
            });
        }
    })
}