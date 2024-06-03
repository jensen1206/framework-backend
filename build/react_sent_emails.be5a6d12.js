/*! For license information please see react_sent_emails.be5a6d12.js.LICENSE.txt */
"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[2109],{54565:(t,e,n)=>{var r=n(67294),o=n(20745),a=(n(41517),n(5399),n(88052),n(60228),n(76034),n(30050),n(21057),n(68932),n(51013),n(40739),n(69373),n(59903),n(59749),n(86544),n(79288),n(73964),n(84254),n(752),n(21694),n(76265),n(58373),n(66793),n(7629),n(77509),n(49693),n(70560),n(47522),n(34284),n(93374),n(89730),n(71257)),i=n(32657),l=n(86455),s=n.n(l),c=n(77630),u=n.n(c),f=n(52939),p=n(48178),h=(n(64043),n(57267),n(34338),n(45700),n(30991),n(83550),n(86957),n(78336),n(25053),n(13142),n(50635),n(59258)),d=n(75147),m=n(19755);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function b(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,v(r.key),r)}}function v(t){var e=function(t,e){if("object"!=y(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!=y(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==y(e)?e:String(e)}function g(t,e){return g=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},g(t,e)}function w(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=S(t);if(e){var o=S(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return function(t,e){if(e&&("object"===y(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t)}(this,n)}}function S(t){return S=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},S(t)}var E,x=n(55733);window.JSZip=x;var _=[{orderable:!1,targets:[8,9]},{targets:[0,1,2,3,4,5,6,7],className:"align-middle"},{targets:[8,9],className:"align-middle text-center"},{targets:[2,3,4],className:"text-nowrap"},{targets:["_all"],className:"fw-normal"}],T=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&g(t,e)}(i,t);var e,n,o,a=w(i);function i(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),(e=a.call(this,t)).props=t,e.tableEmailSent=r.createRef(),e.state={data:[]},e}return e=i,(n=[{key:"componentDidMount",value:function(){this.sentEmailTable()}},{key:"sentEmailTable",value:function(){this.props;var t=this;(E=m(this.tableEmailSent.current).DataTable({language:(0,h.Z)(),data:[],order:[[0,"desc"]],lengthMenu:[[5,10,15,20,30,50,100,-1],[5,10,15,20,30,50,100,trans.All]],searching:!0,pageLength:15,paging:!0,autoWidth:!1,processing:!0,serverSide:!0,dom:"Blfrtip",buttons:[{extend:"copy",exportOptions:{columns:[0,1,2,3,4,5,6,7],format:{body:function(t,e,n,r){return t.replace(/(<([^>]+)>)/gi,"")}}},className:"btn btn-secondary dark btn-sm btn-table",text:'<i class="bi bi-files me-1"></i> '.concat(trans.Copy),sheetName:"".concat(publicSettings.site_name," ").concat(trans.system["Sent emails"]),title:function(){return"".concat(publicSettings.site_name," ").concat(trans.system["Sent emails"]).concat(trans.system["Sent emails"])}},{extend:"csvHtml5",exportOptions:{columns:[0,1,2,3,4,5,6,7],format:{body:function(t,e,n,r){return t.replace(/(<([^>]+)>)/gi,"")}}},className:"btn btn-secondary dark btn-sm btn-table",text:'<i class="bi bi-filetype-csv me-1"></i>'.concat(trans.CSV),sheetName:"".concat(publicSettings.site_name," ").concat(trans.system["Sent emails"]),title:function(){return"".concat(publicSettings.site_name," ").concat(trans.system["Sent emails"])}},{extend:"excelHtml5",exportOptions:{columns:[0,1,2,3,4,5,6,7],format:{body:function(t,e,n,r){return t.replace(/(<([^>]+)>)/gi,"")}}},excelStyles:[{cells:"1",height:"35",style:{alignment:{vertical:"center"},font:{name:"Arial",size:"14",color:"FFFFFF",b:!0},fill:{pattern:{color:"ff8c00"}}}},{cells:"2",style:{font:{name:"Arial",size:"11",color:"FFFFFF",b:!0},fill:{pattern:{color:"6fb320"}}}}],className:"btn btn-secondary dark btn-sm btn-table",text:'<i class="bi bi-filetype-xls me-1"></i>'.concat(trans.Excel),sheetName:"".concat(publicSettings.site_name,"  ").concat(trans.system["Sent emails"]),title:function(){return"".concat(publicSettings.site_name," ").concat(trans.system["Sent emails"])}}],columns:[{title:trans.email.Sent,width:"5%"},{title:trans.Type,width:"5%"},{title:trans.email["From user"],width:"10%"},{title:trans.email["Sent from"],width:"10%"},{title:trans.email["Sent to"],width:"10%"},{title:"Cc",width:"10%"},{title:"Bcc",width:"10%"},{title:trans.email.Subject,width:"18%"},{title:'<i title="'.concat(trans.email["Show email"],'" class="bi bi-envelope-paper"></i>'),width:"3%",data:null,defaultContent:'<button title="'.concat(trans.email["Show email"],'" class="btn-show btn btn-switch-blue text-nowrap dark btn-sm"><i class="bi bi-envelope-paper"></i></button>'),targets:-1},{title:'<i title="'.concat(trans.Delete,'" class="bi bi-trash"></i>'),width:"3%",data:null,defaultContent:'<button title="'.concat(trans.Delete,'" class="btn-trash btn text-nowrap dark btn-sm btn-danger"><i class="bi bi-trash"></i></button>'),targets:-1}],columnDefs:_,ajax:{url:emailSettings.ajax_url,type:"POST",data:{method:"email_sent_table",token:emailSettings.token,_handle:emailSettings.handle},dataSrc:function(e){return t.props.onSetRecordsTotal(e.recordsTotal),e.data}},destroy:!0})).on("click","button.btn-show",(function(e){var n=E.row(e.target.closest("tr")).data();t.props.onGetShowEmail(n[8])})),E.on("click","button.btn-trash",(function(e){var n=E.row(e.target.closest("tr")).data(),r={title:"".concat(trans.swal["Delete email"],"?"),msg:trans.swal["All data will be deleted. The deletion cannot be reversed."],btn:trans.swal["Delete email"]},o={method:"delete_email",id:n[9]};t.props.onDeleteSwalHandle(o,r)}))}},{key:"componentDidUpdate",value:function(t,e,n){this.props.drawSentTable&&(m(this.tableEmailSent.current).DataTable().draw("page"),this.props.onSetDrawSentTable(!1))}},{key:"componentWillUnmount",value:function(){m(this.tableEmailSent.current).DataTable().destroy()}},{key:"render",value:function(){return r.createElement(r.Fragment,null,r.createElement("h3",{className:"fw-semibold text-body pb-3"},trans.system["Sent emails"],r.createElement("small",{className:"d-block fw-normal mt-2 text-secondary small-lg"},r.createElement("i",{className:"bi bi-caret-right me-1"}),trans.Overview)),r.createElement("hr",null),r.createElement(d.Z,{responsive:!0,ref:this.tableEmailSent,className:"w-100 h-100",striped:!0,bordered:!0}),r.createElement("hr",null),r.createElement("button",{onClick:this.props.onDeleteAllEmails,className:"btn  dark ".concat(this.props.recordsTotal>0?"btn-danger":"btn-outline-secondary disabled"),type:"button"},r.createElement("i",{className:"bi bi-trash me-2"}),trans.email["Delete all emails"]))}}])&&b(e.prototype,n),o&&b(e,o),Object.defineProperty(e,"prototype",{writable:!1}),i}(r.Component),O=n(36537),j=n(48481);function k(t){return k="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},k(t)}function D(){D=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,o=Object.defineProperty||function(t,e,n){t[e]=n.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",l=a.asyncIterator||"@@asyncIterator",s=a.toStringTag||"@@toStringTag";function c(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(t){c=function(t,e,n){return t[e]=n}}function u(t,e,n,r){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),l=new N(r||[]);return o(i,"_invoke",{value:O(t,n,l)}),i}function f(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=u;var p="suspendedStart",h="suspendedYield",d="executing",m="completed",y={};function b(){}function v(){}function g(){}var w={};c(w,i,(function(){return this}));var S=Object.getPrototypeOf,E=S&&S(S(C([])));E&&E!==n&&r.call(E,i)&&(w=E);var x=g.prototype=b.prototype=Object.create(w);function _(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function T(t,e){function n(o,a,i,l){var s=f(t[o],t,a);if("throw"!==s.type){var c=s.arg,u=c.value;return u&&"object"==k(u)&&r.call(u,"__await")?e.resolve(u.__await).then((function(t){n("next",t,i,l)}),(function(t){n("throw",t,i,l)})):e.resolve(u).then((function(t){c.value=t,i(c)}),(function(t){return n("throw",t,i,l)}))}l(s.arg)}var a;o(this,"_invoke",{value:function(t,r){function o(){return new e((function(e,o){n(t,r,e,o)}))}return a=a?a.then(o,o):o()}})}function O(e,n,r){var o=p;return function(a,i){if(o===d)throw new Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:t,done:!0}}for(r.method=a,r.arg=i;;){var l=r.delegate;if(l){var s=j(l,r);if(s){if(s===y)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===p)throw o=m,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=d;var c=f(e,n,r);if("normal"===c.type){if(o=r.done?m:h,c.arg===y)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(o=m,r.method="throw",r.arg=c.arg)}}}function j(e,n){var r=n.method,o=e.iterator[r];if(o===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,j(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),y;var a=f(o,e.iterator,n.arg);if("throw"===a.type)return n.method="throw",n.arg=a.arg,n.delegate=null,y;var i=a.arg;return i?i.done?(n[e.resultName]=i.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,y):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,y)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function L(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function C(e){if(e||""===e){var n=e[i];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function n(){for(;++o<e.length;)if(r.call(e,o))return n.value=e[o],n.done=!1,n;return n.value=t,n.done=!0,n};return a.next=a}}throw new TypeError(k(e)+" is not iterable")}return v.prototype=g,o(x,"constructor",{value:g,configurable:!0}),o(g,"constructor",{value:v,configurable:!0}),v.displayName=c(g,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,c(t,s,"GeneratorFunction")),t.prototype=Object.create(x),t},e.awrap=function(t){return{__await:t}},_(T.prototype),c(T.prototype,l,(function(){return this})),e.AsyncIterator=T,e.async=function(t,n,r,o,a){void 0===a&&(a=Promise);var i=new T(u(t,n,r,o),a);return e.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},_(x),c(x,s,"Generator"),c(x,i,(function(){return this})),c(x,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=C,N.prototype={constructor:N,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(L),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(r,o){return l.type="throw",l.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],l=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var s=r.call(i,"catchLoc"),c=r.call(i,"finallyLoc");if(s&&c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,y):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),y},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),L(n),y}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;L(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:C(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),y}},e}function P(t,e,n,r,o,a,i){try{var l=t[a](i),s=l.value}catch(t){return void n(t)}l.done?e(s):Promise.resolve(s).then(r,o)}function L(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,N(r.key),r)}}function N(t){var e=function(t,e){if("object"!=k(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!=k(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==k(e)?e:String(e)}function C(t,e){return C=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t},C(t,e)}function F(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=A(t);if(e){var o=A(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return function(t,e){if(e&&("object"===k(e)||"function"==typeof e))return e;if(void 0!==e)throw new TypeError("Derived constructors may only return object or undefined");return R(t)}(this,n)}}function R(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function A(t){return A=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},A(t)}var G=u()(s()),Z="1a1cdafe-b469-11ee-8bec-325096b39f47",B=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),Object.defineProperty(t,"prototype",{writable:!1}),e&&C(t,e)}(u,t);var e,n,o,l,s,c=F(u);function u(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),(e=c.call(this,t)).props=t,e.state={data:{},drawSentTable:!1,collapseSentTable:!1,collapseSentShow:!1,isSingle:!1,recordsTotal:0,load_email_data:!1,id:""},e.onSetDrawSentTable=e.onSetDrawSentTable.bind(R(e)),e.onToggleSeCollapse=e.onToggleSeCollapse.bind(R(e)),e.onSetRecordsTotal=e.onSetRecordsTotal.bind(R(e)),e.onGetShowEmail=e.onGetShowEmail.bind(R(e)),e.onSetGetEmailData=e.onSetGetEmailData.bind(R(e)),e.onDeleteSwalHandle=e.onDeleteSwalHandle.bind(R(e)),e.sendAxiosFormdata=e.sendAxiosFormdata.bind(R(e)),e.onDeleteAllEmails=e.onDeleteAllEmails.bind(R(e)),e}return e=u,n=[{key:"componentDidMount",value:function(){var t,e,n;this.props.id?(t=!0,e=this.props.id,n=!0,this.onToggleSeCollapse("show")):(this.onToggleSeCollapse("table"),t=!1),this.setState({isSingle:t,id:e,load_email_data:n})}},{key:"sendAxiosFormdata",value:(l=D().mark((function t(e){var n,r,o=this,l=arguments;return D().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=l.length>1&&void 0!==l[1]&&l[1],r=l.length>2&&void 0!==l[2]?l[2]:emailSettings.ajax_url,!e){t.next=5;break}return t.next=5,a.Z.post(r,(0,i.Z)(e,n,emailSettings)).then((function(){var t=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}).data,e=void 0===t?{}:t;switch(e.type){case"delete_email":case"delete_all_email":e.status&&o.setState({drawSentTable:!0}),j.od(e)}})).catch((function(t){return console.error(t)}));case 5:case"end":return t.stop()}}),t)})),s=function(){var t=this,e=arguments;return new Promise((function(n,r){var o=l.apply(t,e);function a(t){P(o,n,r,a,i,"next",t)}function i(t){P(o,n,r,a,i,"throw",t)}a(void 0)}))},function(t){return s.apply(this,arguments)})},{key:"onDeleteAllEmails",value:function(){var t={title:"".concat(trans.swal["Delete all emails"],"?"),msg:trans.swal["All data will be deleted. The deletion cannot be reversed."],btn:trans.swal["Delete all emails"]};this.onDeleteSwalHandle({method:"delete_all_email"},t)}},{key:"onDeleteSwalHandle",value:function(t,e){var n=this;G.fire({title:e.title,reverseButtons:!0,html:'<span class="swal-delete-body">'.concat(e.msg,"</span>"),confirmButtonText:e.btn,cancelButtonText:trans.swal.Cancel,customClass:{popup:"swal-delete-container"},hideClass:{popup:"animate__animated animate__fadeOutUp"}}).then((function(e){e.isConfirmed&&n.sendAxiosFormdata(t).then()}))}},{key:"onSetRecordsTotal",value:function(t){this.setState({recordsTotal:t})}},{key:"onGetShowEmail",value:function(t){this.setState({id:t,load_email_data:!0}),this.onToggleSeCollapse("show")}},{key:"onSetGetEmailData",value:function(t){this.setState({load_email_data:t})}},{key:"onToggleSeCollapse",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=!0,r=!1;switch(t){case"table":n=!0,r=!1;break;case"show":n=!1,r=!0}this.setState({drawSentTable:e,collapseSentTable:n,collapseSentShow:r})}},{key:"onSetDrawSentTable",value:function(t){this.setState({drawSentTable:t})}},{key:"render",value:function(){return r.createElement(r.Fragment,null,r.createElement(f.Z,{in:this.state.collapseSentTable},r.createElement("div",{id:(0,p.Z)("collapseSentTable",Z)},r.createElement(T,{drawSentTable:this.state.drawSentTable,recordsTotal:this.state.recordsTotal,onSetDrawSentTable:this.onSetDrawSentTable,onSetRecordsTotal:this.onSetRecordsTotal,onGetShowEmail:this.onGetShowEmail,onDeleteSwalHandle:this.onDeleteSwalHandle,onDeleteAllEmails:this.onDeleteAllEmails}))),r.createElement(f.Z,{in:this.state.collapseSentShow},r.createElement("div",{id:(0,p.Z)("collapseSentShow",Z)},r.createElement(O.Z,{id:this.state.id,isSingle:this.state.isSingle,load_email_data:this.state.load_email_data,onToggleSeCollapse:this.onToggleSeCollapse,onSetGetEmailData:this.onSetGetEmailData}))))}}],n&&L(e.prototype,n),o&&L(e,o),Object.defineProperty(e,"prototype",{writable:!1}),u}(r.Component),H=document.getElementById("email-react-app");o.createRoot(H).render(r.createElement(B,{id:H.getAttribute("data-id")}))},52939:(t,e,n)=>{n.d(e,{Z:()=>y});var r=n(44036),o=n.n(r),a=n(73164),i=n(67294),l=n(52131),s=n(93825);const c=function(...t){return t.filter((t=>null!=t)).reduce(((t,e)=>{if("function"!=typeof e)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===t?e:function(...n){t.apply(this,n),e.apply(this,n)}}),null)};var u=n(34509),f=n(9337),p=n(85893);const h={height:["marginTop","marginBottom"],width:["marginLeft","marginRight"]};function d(t,e){const n=e[`offset${t[0].toUpperCase()}${t.slice(1)}`],r=h[t];return n+parseInt((0,a.Z)(e,r[0]),10)+parseInt((0,a.Z)(e,r[1]),10)}const m={[l.Wj]:"collapse",[l.Ix]:"collapsing",[l.d0]:"collapsing",[l.cn]:"collapse show"},y=i.forwardRef((({onEnter:t,onEntering:e,onEntered:n,onExit:r,onExiting:a,className:l,children:h,dimension:y="height",in:b=!1,timeout:v=300,mountOnEnter:g=!1,unmountOnExit:w=!1,appear:S=!1,getDimensionValue:E=d,...x},_)=>{const T="function"==typeof y?y():y,O=(0,i.useMemo)((()=>c((t=>{t.style[T]="0"}),t)),[T,t]),j=(0,i.useMemo)((()=>c((t=>{const e=`scroll${T[0].toUpperCase()}${T.slice(1)}`;t.style[T]=`${t[e]}px`}),e)),[T,e]),k=(0,i.useMemo)((()=>c((t=>{t.style[T]=null}),n)),[T,n]),D=(0,i.useMemo)((()=>c((t=>{t.style[T]=`${E(T,t)}px`,(0,u.Z)(t)}),r)),[r,E,T]),P=(0,i.useMemo)((()=>c((t=>{t.style[T]=null}),a)),[T,a]);return(0,p.jsx)(f.Z,{ref:_,addEndListener:s.Z,...x,"aria-expanded":x.role?b:null,onEnter:O,onEntering:j,onEntered:k,onExit:D,onExiting:P,childRef:h.ref,in:b,timeout:v,mountOnEnter:g,unmountOnExit:w,appear:S,children:(t,e)=>i.cloneElement(h,{...e,className:o()(l,h.props.className,m[t],"width"===T&&"collapse-horizontal")})})}))},34338:(t,e,n)=>{var r=n(79989),o=n(3689),a=n(92297),i=n(48999),l=n(90690),s=n(6310),c=n(55565),u=n(76522),f=n(27120),p=n(29042),h=n(44201),d=n(3615),m=h("isConcatSpreadable"),y=d>=51||!o((function(){var t=[];return t[m]=!1,t.concat()[0]!==t})),b=function(t){if(!i(t))return!1;var e=t[m];return void 0!==e?!!e:a(t)};r({target:"Array",proto:!0,arity:1,forced:!y||!p("concat")},{concat:function(t){var e,n,r,o,a,i=l(this),p=f(i,0),h=0;for(e=-1,r=arguments.length;e<r;e++)if(b(a=-1===e?i:arguments[e]))for(o=s(a),c(h+o),n=0;n<o;n++,h++)n in a&&u(p,h,a[n]);else c(h+1),u(p,h++,a);return p.length=h,p}})},50886:(t,e,n)=>{var r=n(79989),o=n(2960).map;r({target:"Array",proto:!0,forced:!n(29042)("map")},{map:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})}},t=>{t.O(0,[9755,5669,6805,4987,8503,2228,2599,1999],(()=>{return e=54565,t(t.s=e);var e}));t.O()}]);