"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7809],{58786:(e,t,r)=>{r.d(t,{Z:()=>l});var n=r(67294),a=r(72178),o=r(48178),i="955dcdf4-b53b-11ee-a786-325096b39f47";const l=function(e){var t=e.readonly,r=void 0===t?null:t;return n.createElement(n.Fragment,null,n.createElement(a.Z.Check,{inline:!0,className:"no-blur ".concat(r?"pe-none":""),label:"Public",name:"show_filemanager",type:"radio",defaultChecked:!0,defaultValue:1,id:(0,o.Z)("publicRadio",i)}),n.createElement(a.Z.Check,{inline:!0,className:"no-blur ".concat(r?"pe-none":""),label:"Private",name:"show_filemanager",defaultValue:0,type:"radio",id:(0,o.Z)("privateRadio",i)}),n.createElement(a.Z.Text,{className:"d-block"},trans.system["If Public is active, the file is displayed in the file manager and is visible to all registered users."]))}},57636:(e,t,r)=>{r.d(t,{Z:()=>l});r(50886);var n=r(67294),a=r(72178),o=r(48178),i=r(74119);const l=function(e){var t=e.selectCategories,r=e.readonly,l=void 0===r?null:r;return n.createElement(n.Fragment,null,n.createElement(i.Z,{controlId:(0,o.Z)("selectCategory","ea616b86-79e9-4898-82bd-f11af3d2f557"),label:"".concat(trans.media.Category," *")},n.createElement(a.Z.Select,{className:"no-blur ".concat(l?"pe-none":""),name:"media_category","aria-label":trans.media.Category},t.map((function(e,t){return n.createElement("option",{key:t,value:e.id},e.label)})))))}},44191:(e,t,r)=>{r.d(t,{Z:()=>g});r(60228),r(73964),r(96869),r(41517),r(5399),r(88052),r(76034),r(30050),r(21057),r(68932),r(51013),r(40739),r(69373),r(59903),r(59749),r(86544),r(79288),r(84254),r(752),r(21694),r(76265);var n,a=r(67294),o=(r(34284),r(89730),r(30024),r(12826),r(77049),r(64043),r(7409),r(63975),r(70560),r(20247)),i=r(19755);function l(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o,i,l=[],s=!0,c=!1;try{if(o=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;s=!1}else for(;!(s=(n=o.call(r)).done)&&(l.push(n.value),l.length!==t);s=!0);}catch(e){c=!0,a=e}finally{try{if(!s&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(c)throw a}}return l}}(e,t)||s(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e,t){if(e){if("string"==typeof e)return c(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(e,t):void 0}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var u=function(e,t){i(".clear-dropzone");var r=document.getElementById(t.template),a=r.parentNode.innerHTML;r.parentNode.removeChild(r);var c=t.delete_after||!1,u=t.delete_after_time||2500;n=document.getElementById(t.container),new o.f(n,{url:uploadSettings.upload_url,acceptedFiles:t.assets,paramName:"file",method:"post",maxFilesize:500,previewTemplate:a,parallelUploads:1,maxFiles:t.maxFiles||15,chunking:t.chunking||!0,forceChunking:!0,chunkSize:256e3,parallelChunkUploads:!1,retryChunks:!1,retryChunksLimit:3,dictDefaultMessage:trans.media["Drag & drop or click files here."],dictInvalidFileType:trans.media["You cannot upload files of this type."],dictFallbackMessage:trans.media["Your browser does not support drag n drop file uploads."],dictFileTooBig:trans.media["File is too large ({{filesize}} MB). Maximum file size {{maxFilesize}} MB"],dictMaxFilesExceeded:trans.media["Maximum file size is {{maxFiles}}"],addRemoveLinks:!1,autoProcessQueue:!0,dictRemoveFile:trans.media["Remove file"],clickable:".btn-open-file",init:function(){this.on("addedfile",(function(e){})),this.on("uploadprogress",(function(e,t,r){})),this.on("totaluploadprogress",(function(e,t,r){})),this.on("sending",(function(r,n,a){e({not_complete:!0},"start_complete"),r.previewElement.querySelector(".dz-progress").classList.add("active"),a.append("token",uploadSettings.token),a.append("_handle",uploadSettings.handle),a.append("lastModified",r.lastModified),a.append("filesize",r.size),a.append("filename",r.name),a.append("chunkAktiv",t.chunking||!1);var o,i=document.getElementById(t.form_id),c=function(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=s(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,a=function(){};return{s:a,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,l=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return i=e.done,e},e:function(e){l=!0,o=e},f:function(){try{i||null==r.return||r.return()}finally{if(l)throw o}}}}(new FormData(i));try{for(c.s();!(o=c.n()).done;){var u=l(o.value,2),d=u[0],p=u[1];a.append(d,p)}}catch(e){c.e(e)}finally{c.f()}})),this.on("queuecompvare",(function(e){})),this.on("complete",(function(e){})),this.on("success",(function(t,r){var n=this;t.previewElement.classList.add("upload-success"),r.status?(t.previewElement.querySelector(".dz-progress").remove(),c&&setTimeout((function(){n.removeFile(t)}),u),e(r,"upload")):(t.previewElement.querySelector(".dz-progress").remove(),t.previewElement.classList.add("upload-error"),t.previewElement.querySelector(".error").innerHTML=r.msg,setTimeout((function(){n.removeFile(t)}),u))})),this.on("error",(function(t,r){var n=this;t.previewElement.querySelector(".dz-progress").remove(),t.previewElement.classList.add("upload-error"),c&&setTimeout((function(){n.removeFile(t)}),u);e({not_complete:!1},"start_complete")})),this.on("removedfile",(function(t){var r={id:t.upload.uuid};e(r,"delete");e({not_complete:!1},"start_complete")})),this.on("queuecomplete",(function(t){e({not_complete:!1,complete:!0},"start_complete")}))}})},d=r(3001);function p(e){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}function m(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,f(n.key),n)}}function f(e){var t=function(e,t){if("object"!=p(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=p(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==p(t)?t:String(t)}function v(e,t){return v=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},v(e,t)}function b(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=h(e);if(t){var a=h(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return function(e,t){if(t&&("object"===p(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return y(e)}(this,r)}}function y(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(e){return h=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},h(e)}var g=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&v(e,t)}(i,e);var t,r,n,o=b(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=o.call(this,e)).props=e,t.dropZoneContainer=a.createRef(),t.dropZoneTemplate=a.createRef(),t.state={data:{}},t.onDropzoneCallback=t.onDropzoneCallback.bind(y(t)),t}return t=i,(r=[{key:"onDropzoneCallback",value:function(e,t){switch(t){case"delete":this.props.onMediathekCallback(e,"delete");break;case"upload":this.props.onMediathekCallback(e,"upload");break;case"start_complete":this.props.onMediathekCallback(e,"start_complete")}}},{key:"componentDidMount",value:function(){var e={maxFiles:this.props.maxFiles,chunking:this.props.chunking||!1,assets:this.props.assets,container:this.dropZoneContainer.current.id,template:this.dropZoneTemplate.current.id,form_id:this.props.form_id,delete_after:this.props.delete_after||!1,delete_after_time:this.props.delete_after_time||2500};u(this.onDropzoneCallback,e)}},{key:"render",value:function(){return a.createElement("div",{className:"media-upload"},a.createElement("div",{className:"upload-inner position-relative"},a.createElement("div",{className:"upload-wrapper btn-open-file",ref:this.dropZoneContainer,id:(0,d.Z)()},a.createElement("div",{ref:this.dropZoneTemplate,id:(0,d.Z)(),className:"file-row position-relative"},a.createElement("div",{className:" upload-box me-2 d-flex align-items-center"},a.createElement("span",{className:"preview me-2"},a.createElement("img",{className:"preview-img img-fluid",alt:"","data-dz-thumbnail":""})),a.createElement("div",{className:"upload-success"},a.createElement("i",{className:"bi bi-check2-circle me-2 text-success"})),a.createElement("div",{"data-dz-default":"",className:"dz-message dz-default"},a.createElement("span",null)),a.createElement("div",{className:"name","data-dz-name":""}),a.createElement("div",{className:"ms-auto"},a.createElement("div",{className:"d-flex align-items-center"},a.createElement("div",{className:"dz-size","data-dz-size":""}),a.createElement("div",{"data-dz-remove":"",className:"dz-remove position-absolute- ms-2"},a.createElement("i",{className:"bi bi-x-circle cursor-pointer"}))))),a.createElement("b",{className:"error text-center text-danger fw-semibold","data-dz-errormessage":""}),a.createElement("div",{className:"progress dz-progress progress-stacked",role:"progressbar","aria-valuemin":"0","aria-valuemax":"100","aria-valuenow":"0"},a.createElement("div",{className:"progress-bar progress-bar-striped progress-bar-animated bg-success",style:{width:"0%"},"data-dz-uploadprogress":""})))),a.createElement("div",{className:"upload-message position-absolute p-3 d-flex align-items-center w-100 h-100 justify-content-center"},trans.media["Drag & drop or click files here."])))}}])&&m(t.prototype,r),n&&m(t,n),Object.defineProperty(t,"prototype",{writable:!1}),i}(a.Component)}}]);