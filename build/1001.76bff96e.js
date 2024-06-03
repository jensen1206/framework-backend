"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1001],{38240:(e,t,n)=>{n.d(t,{fi:()=>b,kZ:()=>w});var r=n(50400),o=n(82163),i=n(62057),a=n(62556);var s=n(96333),f=n(4063),c=n(67252),d=n(60611),p=n(138);function u(e,t,n){void 0===n&&(n=!1);var u,l,v=(0,a.Re)(t),h=(0,a.Re)(t)&&function(e){var t=e.getBoundingClientRect(),n=(0,p.NM)(t.width)/e.offsetWidth||1,r=(0,p.NM)(t.height)/e.offsetHeight||1;return 1!==n||1!==r}(t),m=(0,c.Z)(t),Z=(0,r.Z)(e,h,n),g={scrollLeft:0,scrollTop:0},y={x:0,y:0};return(v||!v&&!n)&&(("body"!==(0,s.Z)(t)||(0,d.Z)(m))&&(g=(u=t)!==(0,i.Z)(u)&&(0,a.Re)(u)?{scrollLeft:(l=u).scrollLeft,scrollTop:l.scrollTop}:(0,o.Z)(u)),(0,a.Re)(t)?((y=(0,r.Z)(t,!0)).x+=t.clientLeft,y.y+=t.clientTop):m&&(y.x=(0,f.Z)(m))),{x:Z.left+g.scrollLeft-y.x,y:Z.top+g.scrollTop-y.y,width:Z.width,height:Z.height}}var l=n(40583),v=n(63624),h=n(93779),m=n(87701);function Z(e){var t=new Map,n=new Set,r=[];function o(e){n.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach((function(e){if(!n.has(e)){var r=t.get(e);r&&o(r)}})),r.push(e)}return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){n.has(e.name)||o(e)})),r}var g={placement:"bottom",modifiers:[],strategy:"absolute"};function y(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some((function(e){return!(e&&"function"==typeof e.getBoundingClientRect)}))}function w(e){void 0===e&&(e={});var t=e,n=t.defaultModifiers,r=void 0===n?[]:n,o=t.defaultOptions,i=void 0===o?g:o;return function(e,t,n){void 0===n&&(n=i);var o,s,f={placement:"bottom",orderedModifiers:[],options:Object.assign({},g,i),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},c=[],d=!1,p={state:f,setOptions:function(n){var o="function"==typeof n?n(f.options):n;w(),f.options=Object.assign({},i,f.options,o),f.scrollParents={reference:(0,a.kK)(e)?(0,v.Z)(e):e.contextElement?(0,v.Z)(e.contextElement):[],popper:(0,v.Z)(t)};var s,d,u=function(e){var t=Z(e);return m.xs.reduce((function(e,n){return e.concat(t.filter((function(e){return e.phase===n})))}),[])}((s=[].concat(r,f.options.modifiers),d=s.reduce((function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e}),{}),Object.keys(d).map((function(e){return d[e]}))));return f.orderedModifiers=u.filter((function(e){return e.enabled})),f.orderedModifiers.forEach((function(e){var t=e.name,n=e.options,r=void 0===n?{}:n,o=e.effect;if("function"==typeof o){var i=o({state:f,name:t,instance:p,options:r}),a=function(){};c.push(i||a)}})),p.update()},forceUpdate:function(){if(!d){var e=f.elements,t=e.reference,n=e.popper;if(y(t,n)){f.rects={reference:u(t,(0,h.Z)(n),"fixed"===f.options.strategy),popper:(0,l.Z)(n)},f.reset=!1,f.placement=f.options.placement,f.orderedModifiers.forEach((function(e){return f.modifiersData[e.name]=Object.assign({},e.data)}));for(var r=0;r<f.orderedModifiers.length;r++)if(!0!==f.reset){var o=f.orderedModifiers[r],i=o.fn,a=o.options,s=void 0===a?{}:a,c=o.name;"function"==typeof i&&(f=i({state:f,options:s,name:c,instance:p})||f)}else f.reset=!1,r=-1}}},update:(o=function(){return new Promise((function(e){p.forceUpdate(),e(f)}))},function(){return s||(s=new Promise((function(e){Promise.resolve().then((function(){s=void 0,e(o())}))}))),s}),destroy:function(){w(),d=!0}};if(!y(e,t))return p;function w(){c.forEach((function(e){return e()})),c=[]}return p.setOptions(n).then((function(e){!d&&n.onFirstUpdate&&n.onFirstUpdate(e)})),p}}var b=w()},94985:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(62556);function o(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&(0,r.Zq)(n)){var o=t;do{if(o&&e.isSameNode(o))return!0;o=o.parentNode||o.host}while(o)}return!1}},50400:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(62556),o=n(138),i=n(62057),a=n(67977);function s(e,t,n){void 0===t&&(t=!1),void 0===n&&(n=!1);var s=e.getBoundingClientRect(),f=1,c=1;t&&(0,r.Re)(e)&&(f=e.offsetWidth>0&&(0,o.NM)(s.width)/e.offsetWidth||1,c=e.offsetHeight>0&&(0,o.NM)(s.height)/e.offsetHeight||1);var d=((0,r.kK)(e)?(0,i.Z)(e):window).visualViewport,p=!(0,a.Z)()&&n,u=(s.left+(p&&d?d.offsetLeft:0))/f,l=(s.top+(p&&d?d.offsetTop:0))/c,v=s.width/f,h=s.height/c;return{width:v,height:h,top:l,right:u+v,bottom:l+h,left:u,x:u,y:l}}},43062:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(62057);function o(e){return(0,r.Z)(e).getComputedStyle(e)}},67252:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(62556);function o(e){return(((0,r.kK)(e)?e.ownerDocument:e.document)||window.document).documentElement}},40583:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(50400);function o(e){var t=(0,r.Z)(e),n=e.offsetWidth,o=e.offsetHeight;return Math.abs(t.width-n)<=1&&(n=t.width),Math.abs(t.height-o)<=1&&(o=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:o}}},96333:(e,t,n)=>{function r(e){return e?(e.nodeName||"").toLowerCase():null}n.d(t,{Z:()=>r})},93779:(e,t,n)=>{n.d(t,{Z:()=>p});var r=n(62057),o=n(96333),i=n(43062),a=n(62556);function s(e){return["table","td","th"].indexOf((0,o.Z)(e))>=0}var f=n(95923),c=n(85918);function d(e){return(0,a.Re)(e)&&"fixed"!==(0,i.Z)(e).position?e.offsetParent:null}function p(e){for(var t=(0,r.Z)(e),n=d(e);n&&s(n)&&"static"===(0,i.Z)(n).position;)n=d(n);return n&&("html"===(0,o.Z)(n)||"body"===(0,o.Z)(n)&&"static"===(0,i.Z)(n).position)?t:n||function(e){var t=/firefox/i.test((0,c.Z)());if(/Trident/i.test((0,c.Z)())&&(0,a.Re)(e)&&"fixed"===(0,i.Z)(e).position)return null;var n=(0,f.Z)(e);for((0,a.Zq)(n)&&(n=n.host);(0,a.Re)(n)&&["html","body"].indexOf((0,o.Z)(n))<0;){var r=(0,i.Z)(n);if("none"!==r.transform||"none"!==r.perspective||"paint"===r.contain||-1!==["transform","perspective"].indexOf(r.willChange)||t&&"filter"===r.willChange||t&&r.filter&&"none"!==r.filter)return n;n=n.parentNode}return null}(e)||t}},95923:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(96333),o=n(67252),i=n(62556);function a(e){return"html"===(0,r.Z)(e)?e:e.assignedSlot||e.parentNode||((0,i.Zq)(e)?e.host:null)||(0,o.Z)(e)}},62057:(e,t,n)=>{function r(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}n.d(t,{Z:()=>r})},82163:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(62057);function o(e){var t=(0,r.Z)(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}},4063:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(50400),o=n(67252),i=n(82163);function a(e){return(0,r.Z)((0,o.Z)(e)).left+(0,i.Z)(e).scrollLeft}},62556:(e,t,n)=>{n.d(t,{Re:()=>i,Zq:()=>a,kK:()=>o});var r=n(62057);function o(e){return e instanceof(0,r.Z)(e).Element||e instanceof Element}function i(e){return e instanceof(0,r.Z)(e).HTMLElement||e instanceof HTMLElement}function a(e){return"undefined"!=typeof ShadowRoot&&(e instanceof(0,r.Z)(e).ShadowRoot||e instanceof ShadowRoot)}},67977:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(85918);function o(){return!/^((?!chrome|android).)*safari/i.test((0,r.Z)())}},60611:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(43062);function o(e){var t=(0,r.Z)(e),n=t.overflow,o=t.overflowX,i=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+i+o)}},63624:(e,t,n)=>{n.d(t,{Z:()=>c});var r=n(95923),o=n(60611),i=n(96333),a=n(62556);function s(e){return["html","body","#document"].indexOf((0,i.Z)(e))>=0?e.ownerDocument.body:(0,a.Re)(e)&&(0,o.Z)(e)?e:s((0,r.Z)(e))}var f=n(62057);function c(e,t){var n;void 0===t&&(t=[]);var i=s(e),a=i===(null==(n=e.ownerDocument)?void 0:n.body),d=(0,f.Z)(i),p=a?[d].concat(d.visualViewport||[],(0,o.Z)(i)?i:[]):i,u=t.concat(p);return a?u:u.concat(c((0,r.Z)(p)))}},87701:(e,t,n)=>{n.d(t,{BL:()=>c,Ct:()=>m,DH:()=>b,F2:()=>i,I:()=>o,MS:()=>j,N7:()=>Z,Pj:()=>u,XM:()=>w,YP:()=>v,bw:()=>h,cW:()=>k,d7:()=>s,ij:()=>g,iv:()=>O,k5:()=>l,mv:()=>f,r5:()=>y,t$:()=>a,ut:()=>d,wX:()=>x,we:()=>r,xs:()=>D,zV:()=>p});var r="top",o="bottom",i="right",a="left",s="auto",f=[r,o,i,a],c="start",d="end",p="clippingParents",u="viewport",l="popper",v="reference",h=f.reduce((function(e,t){return e.concat([t+"-"+c,t+"-"+d])}),[]),m=[].concat(f,[s]).reduce((function(e,t){return e.concat([t,t+"-"+c,t+"-"+d])}),[]),Z="beforeRead",g="read",y="afterRead",w="beforeMain",b="main",x="afterMain",O="beforeWrite",k="write",j="afterWrite",D=[Z,g,y,w,b,x,O,k,j]},66896:(e,t,n)=>{n.d(t,{Z:()=>u});var r=n(6206),o=n(40583),i=n(94985),a=n(93779),s=n(11516),f=n(57516),c=n(63293),d=n(33706),p=n(87701);const u={name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state,i=e.name,u=e.options,l=n.elements.arrow,v=n.modifiersData.popperOffsets,h=(0,r.Z)(n.placement),m=(0,s.Z)(h),Z=[p.t$,p.F2].indexOf(h)>=0?"height":"width";if(l&&v){var g=function(e,t){return e="function"==typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e,(0,c.Z)("number"!=typeof e?e:(0,d.Z)(e,p.mv))}(u.padding,n),y=(0,o.Z)(l),w="y"===m?p.we:p.t$,b="y"===m?p.I:p.F2,x=n.rects.reference[Z]+n.rects.reference[m]-v[m]-n.rects.popper[Z],O=v[m]-n.rects.reference[m],k=(0,a.Z)(l),j=k?"y"===m?k.clientHeight||0:k.clientWidth||0:0,D=x/2-O/2,E=g[w],M=j-y[Z]-g[b],L=j/2-y[Z]/2+D,R=(0,f.u)(E,L,M),A=m;n.modifiersData[i]=((t={})[A]=R,t.centerOffset=R-L,t)}},effect:function(e){var t=e.state,n=e.options.element,r=void 0===n?"[data-popper-arrow]":n;null!=r&&("string"!=typeof r||(r=t.elements.popper.querySelector(r)))&&(0,i.Z)(t.elements.popper,r)&&(t.elements.arrow=r)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]}},36531:(e,t,n)=>{n.d(t,{Z:()=>l});var r=n(87701),o=n(93779),i=n(62057),a=n(67252),s=n(43062),f=n(6206),c=n(14943),d=n(138),p={top:"auto",right:"auto",bottom:"auto",left:"auto"};function u(e){var t,n=e.popper,f=e.popperRect,c=e.placement,u=e.variation,l=e.offsets,v=e.position,h=e.gpuAcceleration,m=e.adaptive,Z=e.roundOffsets,g=e.isFixed,y=l.x,w=void 0===y?0:y,b=l.y,x=void 0===b?0:b,O="function"==typeof Z?Z({x:w,y:x}):{x:w,y:x};w=O.x,x=O.y;var k=l.hasOwnProperty("x"),j=l.hasOwnProperty("y"),D=r.t$,E=r.we,M=window;if(m){var L=(0,o.Z)(n),R="clientHeight",A="clientWidth";if(L===(0,i.Z)(n)&&(L=(0,a.Z)(n),"static"!==(0,s.Z)(L).position&&"absolute"===v&&(R="scrollHeight",A="scrollWidth")),c===r.we||(c===r.t$||c===r.F2)&&u===r.ut)E=r.I,x-=(g&&L===M&&M.visualViewport?M.visualViewport.height:L[R])-f.height,x*=h?1:-1;if(c===r.t$||(c===r.we||c===r.I)&&u===r.ut)D=r.F2,w-=(g&&L===M&&M.visualViewport?M.visualViewport.width:L[A])-f.width,w*=h?1:-1}var F,P=Object.assign({position:v},m&&p),V=!0===Z?function(e,t){var n=e.x,r=e.y,o=t.devicePixelRatio||1;return{x:(0,d.NM)(n*o)/o||0,y:(0,d.NM)(r*o)/o||0}}({x:w,y:x},(0,i.Z)(n)):{x:w,y:x};return w=V.x,x=V.y,h?Object.assign({},P,((F={})[E]=j?"0":"",F[D]=k?"0":"",F.transform=(M.devicePixelRatio||1)<=1?"translate("+w+"px, "+x+"px)":"translate3d("+w+"px, "+x+"px, 0)",F)):Object.assign({},P,((t={})[E]=j?x+"px":"",t[D]=k?w+"px":"",t.transform="",t))}const l={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options,r=n.gpuAcceleration,o=void 0===r||r,i=n.adaptive,a=void 0===i||i,s=n.roundOffsets,d=void 0===s||s,p={placement:(0,f.Z)(t.placement),variation:(0,c.Z)(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:o,isFixed:"fixed"===t.options.strategy};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,u(Object.assign({},p,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:a,roundOffsets:d})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,u(Object.assign({},p,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:d})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}}},82372:(e,t,n)=>{n.d(t,{Z:()=>i});var r=n(62057),o={passive:!0};const i={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,n=e.instance,i=e.options,a=i.scroll,s=void 0===a||a,f=i.resize,c=void 0===f||f,d=(0,r.Z)(t.elements.popper),p=[].concat(t.scrollParents.reference,t.scrollParents.popper);return s&&p.forEach((function(e){e.addEventListener("scroll",n.update,o)})),c&&d.addEventListener("resize",n.update,o),function(){s&&p.forEach((function(e){e.removeEventListener("scroll",n.update,o)})),c&&d.removeEventListener("resize",n.update,o)}},data:{}}},45228:(e,t,n)=>{n.d(t,{Z:()=>p});var r={left:"right",right:"left",bottom:"top",top:"bottom"};function o(e){return e.replace(/left|right|bottom|top/g,(function(e){return r[e]}))}var i=n(6206),a={start:"end",end:"start"};function s(e){return e.replace(/start|end/g,(function(e){return a[e]}))}var f=n(9966),c=n(14943),d=n(87701);const p={name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,r=e.name;if(!t.modifiersData[r]._skip){for(var a=n.mainAxis,p=void 0===a||a,u=n.altAxis,l=void 0===u||u,v=n.fallbackPlacements,h=n.padding,m=n.boundary,Z=n.rootBoundary,g=n.altBoundary,y=n.flipVariations,w=void 0===y||y,b=n.allowedAutoPlacements,x=t.options.placement,O=(0,i.Z)(x),k=v||(O===x||!w?[o(x)]:function(e){if((0,i.Z)(e)===d.d7)return[];var t=o(e);return[s(e),t,s(t)]}(x)),j=[x].concat(k).reduce((function(e,n){return e.concat((0,i.Z)(n)===d.d7?function(e,t){void 0===t&&(t={});var n=t,r=n.placement,o=n.boundary,a=n.rootBoundary,s=n.padding,p=n.flipVariations,u=n.allowedAutoPlacements,l=void 0===u?d.Ct:u,v=(0,c.Z)(r),h=v?p?d.bw:d.bw.filter((function(e){return(0,c.Z)(e)===v})):d.mv,m=h.filter((function(e){return l.indexOf(e)>=0}));0===m.length&&(m=h);var Z=m.reduce((function(t,n){return t[n]=(0,f.Z)(e,{placement:n,boundary:o,rootBoundary:a,padding:s})[(0,i.Z)(n)],t}),{});return Object.keys(Z).sort((function(e,t){return Z[e]-Z[t]}))}(t,{placement:n,boundary:m,rootBoundary:Z,padding:h,flipVariations:w,allowedAutoPlacements:b}):n)}),[]),D=t.rects.reference,E=t.rects.popper,M=new Map,L=!0,R=j[0],A=0;A<j.length;A++){var F=j[A],P=(0,i.Z)(F),V=(0,c.Z)(F)===d.BL,B=[d.we,d.I].indexOf(P)>=0,W=B?"width":"height",H=(0,f.Z)(t,{placement:F,boundary:m,rootBoundary:Z,altBoundary:g,padding:h}),I=B?V?d.F2:d.t$:V?d.I:d.we;D[W]>E[W]&&(I=o(I));var q=o(I),C=[];if(p&&C.push(H[P]<=0),l&&C.push(H[I]<=0,H[q]<=0),C.every((function(e){return e}))){R=F,L=!1;break}M.set(F,C)}if(L)for(var N=function(e){var t=j.find((function(t){var n=M.get(t);if(n)return n.slice(0,e).every((function(e){return e}))}));if(t)return R=t,"break"},T=w?3:1;T>0;T--){if("break"===N(T))break}t.placement!==R&&(t.modifiersData[r]._skip=!0,t.placement=R,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}}},19892:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(87701),o=n(9966);function i(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function a(e){return[r.we,r.F2,r.I,r.t$].some((function(t){return e[t]>=0}))}const s={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,n=e.name,r=t.rects.reference,s=t.rects.popper,f=t.modifiersData.preventOverflow,c=(0,o.Z)(t,{elementContext:"reference"}),d=(0,o.Z)(t,{altBoundary:!0}),p=i(c,r),u=i(d,s,f),l=a(p),v=a(u);t.modifiersData[n]={referenceClippingOffsets:p,popperEscapeOffsets:u,isReferenceHidden:l,hasPopperEscaped:v},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":l,"data-popper-escaped":v})}}},82122:(e,t,n)=>{n.d(t,{Z:()=>i});var r=n(6206),o=n(87701);const i={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.options,i=e.name,a=n.offset,s=void 0===a?[0,0]:a,f=o.Ct.reduce((function(e,n){return e[n]=function(e,t,n){var i=(0,r.Z)(e),a=[o.t$,o.we].indexOf(i)>=0?-1:1,s="function"==typeof n?n(Object.assign({},t,{placement:e})):n,f=s[0],c=s[1];return f=f||0,c=(c||0)*a,[o.t$,o.F2].indexOf(i)>=0?{x:c,y:f}:{x:f,y:c}}(n,t.rects,s),e}),{}),c=f[t.placement],d=c.x,p=c.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=d,t.modifiersData.popperOffsets.y+=p),t.modifiersData[i]=f}}},77421:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(72581);const o={name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,n=e.name;t.modifiersData[n]=(0,r.Z)({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}}},43920:(e,t,n)=>{n.d(t,{Z:()=>l});var r=n(87701),o=n(6206),i=n(11516);var a=n(57516),s=n(40583),f=n(93779),c=n(9966),d=n(14943),p=n(23607),u=n(138);const l={name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,l=e.name,v=n.mainAxis,h=void 0===v||v,m=n.altAxis,Z=void 0!==m&&m,g=n.boundary,y=n.rootBoundary,w=n.altBoundary,b=n.padding,x=n.tether,O=void 0===x||x,k=n.tetherOffset,j=void 0===k?0:k,D=(0,c.Z)(t,{boundary:g,rootBoundary:y,padding:b,altBoundary:w}),E=(0,o.Z)(t.placement),M=(0,d.Z)(t.placement),L=!M,R=(0,i.Z)(E),A="x"===R?"y":"x",F=t.modifiersData.popperOffsets,P=t.rects.reference,V=t.rects.popper,B="function"==typeof j?j(Object.assign({},t.rects,{placement:t.placement})):j,W="number"==typeof B?{mainAxis:B,altAxis:B}:Object.assign({mainAxis:0,altAxis:0},B),H=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,I={x:0,y:0};if(F){if(h){var q,C="y"===R?r.we:r.t$,N="y"===R?r.I:r.F2,T="y"===R?"height":"width",$=F[R],S=$+D[C],K=$-D[N],z=O?-V[T]/2:0,U=M===r.BL?P[T]:V[T],X=M===r.BL?-V[T]:-P[T],Y=t.elements.arrow,_=O&&Y?(0,s.Z)(Y):{width:0,height:0},G=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:(0,p.Z)(),J=G[C],Q=G[N],ee=(0,a.u)(0,P[T],_[T]),te=L?P[T]/2-z-ee-J-W.mainAxis:U-ee-J-W.mainAxis,ne=L?-P[T]/2+z+ee+Q+W.mainAxis:X+ee+Q+W.mainAxis,re=t.elements.arrow&&(0,f.Z)(t.elements.arrow),oe=re?"y"===R?re.clientTop||0:re.clientLeft||0:0,ie=null!=(q=null==H?void 0:H[R])?q:0,ae=$+te-ie-oe,se=$+ne-ie,fe=(0,a.u)(O?(0,u.VV)(S,ae):S,$,O?(0,u.Fp)(K,se):K);F[R]=fe,I[R]=fe-$}if(Z){var ce,de="x"===R?r.we:r.t$,pe="x"===R?r.I:r.F2,ue=F[A],le="y"===A?"height":"width",ve=ue+D[de],he=ue-D[pe],me=-1!==[r.we,r.t$].indexOf(E),Ze=null!=(ce=null==H?void 0:H[A])?ce:0,ge=me?ve:ue-P[le]-V[le]-Ze+W.altAxis,ye=me?ue+P[le]+V[le]-Ze-W.altAxis:he,we=O&&me?(0,a.q)(ge,ue,ye):(0,a.u)(O?ge:ve,ue,O?ye:he);F[A]=we,I[A]=we-ue}t.modifiersData[l]=I}},requiresIfExists:["offset"]}},72581:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(6206),o=n(14943),i=n(11516),a=n(87701);function s(e){var t,n=e.reference,s=e.element,f=e.placement,c=f?(0,r.Z)(f):null,d=f?(0,o.Z)(f):null,p=n.x+n.width/2-s.width/2,u=n.y+n.height/2-s.height/2;switch(c){case a.we:t={x:p,y:n.y-s.height};break;case a.I:t={x:p,y:n.y+n.height};break;case a.F2:t={x:n.x+n.width,y:u};break;case a.t$:t={x:n.x-s.width,y:u};break;default:t={x:n.x,y:n.y}}var l=c?(0,i.Z)(c):null;if(null!=l){var v="y"===l?"height":"width";switch(d){case a.BL:t[l]=t[l]-(n[v]/2-s[v]/2);break;case a.ut:t[l]=t[l]+(n[v]/2-s[v]/2)}}return t}},9966:(e,t,n)=>{n.d(t,{Z:()=>k});var r=n(87701),o=n(62057),i=n(67252),a=n(4063),s=n(67977);var f=n(43062),c=n(82163),d=n(138);var p=n(63624),u=n(93779),l=n(62556),v=n(50400),h=n(95923),m=n(94985),Z=n(96333);function g(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function y(e,t,n){return t===r.Pj?g(function(e,t){var n=(0,o.Z)(e),r=(0,i.Z)(e),f=n.visualViewport,c=r.clientWidth,d=r.clientHeight,p=0,u=0;if(f){c=f.width,d=f.height;var l=(0,s.Z)();(l||!l&&"fixed"===t)&&(p=f.offsetLeft,u=f.offsetTop)}return{width:c,height:d,x:p+(0,a.Z)(e),y:u}}(e,n)):(0,l.kK)(t)?function(e,t){var n=(0,v.Z)(e,!1,"fixed"===t);return n.top=n.top+e.clientTop,n.left=n.left+e.clientLeft,n.bottom=n.top+e.clientHeight,n.right=n.left+e.clientWidth,n.width=e.clientWidth,n.height=e.clientHeight,n.x=n.left,n.y=n.top,n}(t,n):g(function(e){var t,n=(0,i.Z)(e),r=(0,c.Z)(e),o=null==(t=e.ownerDocument)?void 0:t.body,s=(0,d.Fp)(n.scrollWidth,n.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),p=(0,d.Fp)(n.scrollHeight,n.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),u=-r.scrollLeft+(0,a.Z)(e),l=-r.scrollTop;return"rtl"===(0,f.Z)(o||n).direction&&(u+=(0,d.Fp)(n.clientWidth,o?o.clientWidth:0)-s),{width:s,height:p,x:u,y:l}}((0,i.Z)(e)))}function w(e,t,n,r){var o="clippingParents"===t?function(e){var t=(0,p.Z)((0,h.Z)(e)),n=["absolute","fixed"].indexOf((0,f.Z)(e).position)>=0&&(0,l.Re)(e)?(0,u.Z)(e):e;return(0,l.kK)(n)?t.filter((function(e){return(0,l.kK)(e)&&(0,m.Z)(e,n)&&"body"!==(0,Z.Z)(e)})):[]}(e):[].concat(t),i=[].concat(o,[n]),a=i[0],s=i.reduce((function(t,n){var o=y(e,n,r);return t.top=(0,d.Fp)(o.top,t.top),t.right=(0,d.VV)(o.right,t.right),t.bottom=(0,d.VV)(o.bottom,t.bottom),t.left=(0,d.Fp)(o.left,t.left),t}),y(e,a,r));return s.width=s.right-s.left,s.height=s.bottom-s.top,s.x=s.left,s.y=s.top,s}var b=n(72581),x=n(63293),O=n(33706);function k(e,t){void 0===t&&(t={});var n=t,o=n.placement,a=void 0===o?e.placement:o,s=n.strategy,f=void 0===s?e.strategy:s,c=n.boundary,d=void 0===c?r.zV:c,p=n.rootBoundary,u=void 0===p?r.Pj:p,h=n.elementContext,m=void 0===h?r.k5:h,Z=n.altBoundary,y=void 0!==Z&&Z,k=n.padding,j=void 0===k?0:k,D=(0,x.Z)("number"!=typeof j?j:(0,O.Z)(j,r.mv)),E=m===r.k5?r.YP:r.k5,M=e.rects.popper,L=e.elements[y?E:m],R=w((0,l.kK)(L)?L:L.contextElement||(0,i.Z)(e.elements.popper),d,u,f),A=(0,v.Z)(e.elements.reference),F=(0,b.Z)({reference:A,element:M,strategy:"absolute",placement:a}),P=g(Object.assign({},M,F)),V=m===r.k5?P:A,B={top:R.top-V.top+D.top,bottom:V.bottom-R.bottom+D.bottom,left:R.left-V.left+D.left,right:V.right-R.right+D.right},W=e.modifiersData.offset;if(m===r.k5&&W){var H=W[a];Object.keys(B).forEach((function(e){var t=[r.F2,r.I].indexOf(e)>=0?1:-1,n=[r.we,r.I].indexOf(e)>=0?"y":"x";B[e]+=H[n]*t}))}return B}},33706:(e,t,n)=>{function r(e,t){return t.reduce((function(t,n){return t[n]=e,t}),{})}n.d(t,{Z:()=>r})},6206:(e,t,n)=>{function r(e){return e.split("-")[0]}n.d(t,{Z:()=>r})},23607:(e,t,n)=>{function r(){return{top:0,right:0,bottom:0,left:0}}n.d(t,{Z:()=>r})},11516:(e,t,n)=>{function r(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}n.d(t,{Z:()=>r})},14943:(e,t,n)=>{function r(e){return e.split("-")[1]}n.d(t,{Z:()=>r})},138:(e,t,n)=>{n.d(t,{Fp:()=>r,NM:()=>i,VV:()=>o});var r=Math.max,o=Math.min,i=Math.round},63293:(e,t,n)=>{n.d(t,{Z:()=>o});var r=n(23607);function o(e){return Object.assign({},(0,r.Z)(),e)}},85918:(e,t,n)=>{function r(){var e=navigator.userAgentData;return null!=e&&e.brands&&Array.isArray(e.brands)?e.brands.map((function(e){return e.brand+"/"+e.version})).join(" "):navigator.userAgent}n.d(t,{Z:()=>r})},57516:(e,t,n)=>{n.d(t,{q:()=>i,u:()=>o});var r=n(138);function o(e,t,n){return(0,r.Fp)(e,(0,r.VV)(t,n))}function i(e,t,n){var r=o(e,t,n);return r>n?n:r}}}]);