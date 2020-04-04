!function(){"use strict";function e(e,t){!function(e,t,n){const l=g(),u=i,a=null===r;l.owner=s,s=l,i=n?null:l,t=a?function(e,t){r=o,o.changes.reset(),o.updates.reset();try{return e(t)}finally{s=i=r=null}}(e,t):e(t);s=l.owner,i=u;var c=y(l,e,t,!1);a&&function(e,t){if(o.changes.count>0||o.updates.count>0){o.time++;try{_(o)}finally{r=null,s=e,i=t}}}(s,u);p.node=c?null:l,p.value=t}(e,t,!1)}class t{constructor(e){this.value=e,this.pending=a,this.log=null}current(){return null!==i&&(null===this.log&&(this.log={node1:null,node1slot:0,nodes:null,nodeslots:null}),function(e){let t,n=i,l=null===n.source1?-1:null===n.sources?0:n.sources.length;if(null===e.node1)e.node1=n,e.node1slot=l,t=-1;else if(null===e.nodes){if(e.node1===n)return;e.nodes=[n],e.nodeslots=[l],t=0}else{if(t=e.nodes.length,e.nodes[t-1]===n)return;e.nodes.push(n),e.nodeslots.push(l)}null===n.source1?(n.source1=e,n.source1slot=t):null===n.sources?(n.sources=[e],n.sourceslots=[t]):(n.sources.push(e),n.sourceslots.push(t))}(this.log)),this.value}next(e){if(null!==r)if(this.pending!==a){if(e!==this.pending)throw new Error("conflicting changes: "+e+" !== "+this.pending)}else this.pending=e,o.changes.add(this);else null!==this.log?(this.pending=e,o.changes.add(this),b()):this.value=e;return e}}function n(){return{fn:null,age:-1,state:c,source1:null,source1slot:0,sources:null,sourceslots:null,owner:null,owned:null,log:null,value:void 0,context:void 0,cleanups:null}}class l{constructor(){this.items=[],this.count=0}reset(){this.count=0}add(e){this.items[this.count++]=e}run(e){let t=this.items;for(let n=0;n<this.count;n++)e(t[n]),t[n]=null;this.count=0}}let o={time:0,changes:new l,updates:new l,disposes:new l},r=null,i=null,s=null,u=null,a={},c=0,f=1,d=2,h=n();var p={node:null,value:void 0};function g(){let e=u;return null===e?e=n():u=null,e}function y(e,t,n,l){let r,i=l||null===s||s===h?null:s,a=!e.noRecycle&&null===e.source1&&(null===e.owned&&null===e.cleanups||null!==i);if(a){if(u=e,e.owner=null,null!==i){if(null!==e.owned){if(null===i.owned)i.owned=e.owned;else for(r=0;r<e.owned.length;r++)i.owned.push(e.owned[r]);e.owned=null}if(null!==e.cleanups){if(null===i.cleanups)i.cleanups=e.cleanups;else for(r=0;r<e.cleanups.length;r++)i.cleanups.push(e.cleanups[r]);e.cleanups=null}}}else e.fn=t,e.value=n,e.age=o.time,null!==i&&(null===i.owned?i.owned=[e]:i.owned.push(e));return a}function b(){let e=s;o.updates.reset(),o.time++;try{_(o)}finally{r=i=null,s=e}}function _(e){let t=r,n=0;for(r=e,e.disposes.reset();0!==e.changes.count||0!==e.updates.count||0!==e.disposes.count;)if(n>0&&e.time++,e.changes.run(v),e.updates.run(w),e.disposes.run(x),n++>1e5)throw new Error("Runaway clock detected");r=t}function v(e){e.value=e.pending,e.pending=a,e.log&&m(e.log)}function m(e){let t=e.node1,n=e.nodes;if(null!==t&&C(t),null!==n)for(let e=0,t=n.length;e<t;e++)C(n[e])}function C(e){let t=o.time;e.age<t&&(e.age=t,e.state=f,o.updates.add(e),null!==e.owned&&function e(t){for(let n=0;n<t.length;n++){let l=t[n];l.age=o.time,l.state=c,null!==l.owned&&e(l.owned)}}(e.owned),null!==e.log&&m(e.log))}function w(e){if(e.state===f){let t=s,n=i;s=i=e,e.state=d,A(e,!1),e.value=e.fn(e.value),e.state=c,s=t,i=n}}function A(e,t){let n,l,o=e.source1,r=e.sources,i=e.sourceslots,s=e.cleanups,u=e.owned;if(null!==s){for(n=0;n<s.length;n++)s[n](t);e.cleanups=null}if(null!==u){for(n=0;n<u.length;n++)x(u[n]);e.owned=null}if(null!==o&&(k(o,e.source1slot),e.source1=null),null!==r)for(n=0,l=r.length;n<l;n++)k(r.pop(),i.pop())}function k(e,t){let n,l,o=e.nodes,r=e.nodeslots;-1===t?e.node1=null:(n=o.pop(),l=r.pop(),t!==o.length&&(o[t]=n,r[t]=l,-1===l?n.source1slot=t:n.sourceslots[l]=t))}function x(e){e.fn=null,e.owner=null,e.log=null,A(e,!0)}const j=Symbol("solid-node"),O=Symbol("solid-proxy");function E(e){return e[O]||(e[O]=new Proxy(e,z))}function N(e){return null!==e&&"object"==typeof e&&(e.__proto__===Object.prototype||Array.isArray(e))}function S(e){let t,n,l;if(t=null!=e&&e._state)return t;if(!N(e))return e;if(Array.isArray(e)){Object.isFrozen(e)&&(e=e.slice(0));for(let t=0,o=e.length;t<o;t++)(n=S(l=e[t]))!==l&&(e[t]=n)}else{Object.isFrozen(e)&&(e=Object.assign({},e));let t=Object.keys(e);for(let o=0,r=t.length;o<r;o++)(n=S(l=e[t[o]]))!==l&&(e[t[o]]=n)}return e}function P(e){let t=e[j];return t||(e[j]=t={}),t}const z={get(e,n){if("_state"===n)return e;if(n===O||n===j)return;const l=e[n],o=N(l);if(null!==i&&"function"!=typeof l){let r,i;o&&(r=P(l))&&(i=r._||(r._=new t)).current(),(i=(r=P(e))[n]||(r[n]=new t)).current()}return o?E(l):l},set:()=>!0,deleteProperty:()=>!0};function T(e,t,n){if(n=S(n),e[t]===n)return;const l=Array.isArray(e)||!(t in e);void 0===n?delete e[t]:e[t]=n;let o,r=P(e);(o=r[t])&&o.next(),l&&(o=r._)&&o.next()}function L(e,t){const n=Object.keys(t);for(let l=0;l<n.length;l+=1){const o=n[l];T(e,o,t[o])}}function B(e,t,n=[]){if(1===t.length){let l=t[0];if("function"==typeof l&&void 0===(l=l(E(e),n)))return;return void L(e,l)}const l=t.shift(),o=typeof l,r=Array.isArray(e);if(Array.isArray(l))for(let o=0;o<l.length;o++)B(e,[l[o]].concat(t),n.concat([l[o]]));else if(r&&"function"===o)for(let o=0;o<e.length;o++)l(e[o],o)&&B(e,[o].concat(t),n.concat([o]));else if(r&&"object"===o){const{from:o=0,to:r=e.length-1,by:i=1}=l;for(let l=o;l<=r;l+=i)B(e,[l].concat(t),n.concat([l]))}else if(1===t.length){let o=t[0];if("function"==typeof o){const t=e[l];o=o(N(t)?E(t):t,n.concat([l]))}N(e[l])&&N(o)&&!Array.isArray(o)?L(e[l],o):T(e,l,o)}else B(e[l],t,n.concat([l]))}function R(e){return[E(e=S(e||{})),function(...t){!function(e){let t=void 0;if(null!==r)t=e();else{(r=o).changes.reset();try{t=e(),b()}finally{r=null}}}(()=>{if(Array.isArray(t[0]))for(let n=0;n<t.length;n+=1)B(e,t[n]);else B(e,t)})}]}const $=new Set;function M(e){const t=document.createElement("template");if(t.innerHTML=e,t.innerHTML!==e)throw new Error(`Template html does not match input:\n${t.innerHTML}\n${e}`);return t}function H(t,n,l,o){if(void 0===l||o||(o=[]),"function"==typeof n)e((e=o)=>J(t,n(),e,l));else{if(!Array.isArray(n)||!function e(t){for(let n=0,l=t.length;n<l;n++){const l=t[n];if(Array.isArray(l)&&e(l)||"function"==typeof l)return!0}return!1}(n))return J(t,n,o,l);e((e=o)=>J(t,n,e,l))}}function F(e){return e&&(e.model||F(e.host||e.parentNode))}function D(e){const t=`__${e.type}`;let n=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==n&&Object.defineProperty(e,"target",{configurable:!0,value:n}),Object.defineProperty(e,"currentTarget",{configurable:!0,get:()=>n});null!==n;){const l=n[t];if(l){if(l(e,l.length>1?F(n):void 0),e.cancelBubble)return}n=n.host&&n.host instanceof Node?n.host:n.parentNode}}function q(e,t,n){for(let l=0,o=t.length;l<o;l++)e.insertBefore(t[l],n)}function I(e,t,n,l){if(void 0===n)return e.textContent="";const o=l||document.createTextNode("");if(t.length){o!==t[0]&&e.replaceChild(o,t[0]);for(let n=t.length-1;n>0;n--)e.removeChild(t[n])}else e.insertBefore(o,n);return[o]}function J(t,n,l,o){if(n===l)return l;const r=typeof n,i=void 0!==o;if(t=i&&l[0]&&l[0].parentNode||t,"string"===r||"number"===r)if("number"===r&&(n=n.toString()),i){let e=l[0];e&&3===e.nodeType?e.data=n:e=document.createTextNode(n),l=I(t,l,o,e)}else l=""!==l&&"string"==typeof l?t.firstChild.data=n:t.textContent=n;else if(null==n||"boolean"===r)l=I(t,l,o);else if("function"===r)e(()=>l=J(t,n(),l,o));else if(Array.isArray(n)){const e=function e(t,n){for(let l=0,o=n.length;l<o;l++){let o,r=n[l];if(r instanceof Node)t.push(r);else if(null==r||!0===r||!1===r);else if(Array.isArray(r))e(t,r);else if("string"==(o=typeof r))t.push(document.createTextNode(r));else if("function"===o){const n=r();e(t,Array.isArray(n)?n:[n])}else t.push(document.createTextNode(r.toString()))}return t}([],n);if(0===e.length){if(l=I(t,l,o),i)return l}else Array.isArray(l)?0===l.length?q(t,e,o):V(t,l,e):null==l||""===l?q(t,e):V(t,i&&l||[t.firstChild],e);l=e}else if(n instanceof Node){if(Array.isArray(l)){if(i)return l=I(t,l,o,n);I(t,l,null,n)}else null==l||""===l?t.appendChild(n):t.replaceChild(n,t.firstChild);l=n}return l}var U=-1;function V(e,t,n){var l,o=n.length,r=0,i=t.length-1,s=0,u=o-1,a=t[r],c=n[s],f=t[i],d=n[u],h=f.nextSibling,p=!0;e:for(;p;){for(p=!1;c===a;){if(r++,++s>u||r>i)break e;c=n[s],a=t[r]}for(;d===f;){if(h=f,i--,s>--u||r>i)break e;d=n[u],f=t[i]}for(;c===f;){if(p=!0,e.insertBefore(f,a),i--,++s>u||r>i)break e;c=n[s],f=t[i]}for(;d===a;){if(p=!0,null===h?e.appendChild(a):e.insertBefore(a,h),h=a,r++,s>--u||r>i)break e;d=n[u],a=t[r]}}if(s>u){for(;r<=i;)e.removeChild(t[i]),i--;return}if(r>i){for(;s<=u;)e.insertBefore(n[s],h),s++;return}const g=new Array(u-s+1);for(let e=s;e<=u;e++)g[e]=U;const y=new Map;for(let e=s;e<=u;e++)y.set(n[e],e);let b=s+n.length-1-u,_=[];for(let e=r;e<=i;e++)y.has(t[e])?(g[y.get(t[e])]=e,b++):_.push(e);if(0!==b){var v,m=function(e,t){let n=[],l=[],o=-1,r=new Array(e.length);for(let i=t,s=e.length;i<s;i++){let t=e[i];if(t<0)continue;let s=Z(n,t);-1!==s&&(r[i]=l[s]),s===o?(n[++o]=t,l[o]=i):t<n[s+1]&&(n[s+1]=t,l[s+1]=i)}for(let e=l[o];o>=0;e=r[e],o--)n[o]=e;return n}(g,s),C=[],w=t[r],A=m.length-1;for(let e=r;e<=i;e++)C[e]=w,w=w.nextSibling;for(let t=0;t<_.length;t++)e.removeChild(C[_[t]]);for(let t=u;t>=s;t--)m[A]===t?(h=C[g[m[A]]],A--):(v=g[t]===U?n[t]:C[g[t]],e.insertBefore(v,h),h=v)}else{if(a!==e.firstChild||f!==e.lastChild){for(l=r;l<=i;l++)e.removeChild(t[l]);for(;s<=u;)e.insertBefore(n[s],h),s++;return}for(e.textContent="";s<=u;)e.appendChild(n[s]),s++}}function Z(e,t){var n=-1,l=e.length;if(l>0&&e[l-1]<=t)return l-1;for(;l-n>1;){var o=Math.floor((n+l)/2);e[o]>t?l=o:n=o}return n}function G(e){return Object.keys(e).reduce((t,n)=>{const l=e[n];return t[n]=Object.assign({},l),!W(l.value)||function(e){return"[object Function]"===Object.prototype.toString.call(e)}(l.value)||Array.isArray(l.value)||(t[n].value=Object.assign({},l.value)),Array.isArray(l.value)&&(t[n].value=l.value.slice(0)),t},{})}document.createElement("div").attachShadow;function K(e){if(!e)return;let t;try{t=JSON.parse(e)}catch(n){t=e}return"string"!=typeof t?t:/^[0-9]*$/.test(t)?+t:t}function Q(e,t,n){if(W(n))return;let l=n&&"function"==typeof n.toString?n.toString():void 0;l&&"false"!==l?(e.__updating[t]=!0,"true"===l&&(l=""),e.setAttribute(t,l),Promise.resolve().then(()=>delete e.__updating[t])):e.removeAttribute(t)}function W(e){return null!=e&&("object"==typeof e||"function"==typeof e)}function X(e){if("isConnected"in e)return e.isConnected;const t=e.ownerDocument;if(!t)return!1;if(t.body.contains(e))return!0;for(;e&&e!==t.documentElement;)e=e.parentNode||e.host;return e===t.documentElement}let Y;function ee(e,t){const n=Object.keys(t);return class extends e{static get observedAttributes(){return n.map(e=>t[e].attribute)}constructor(){super(),this.__initializing=!1,this.__initialized=!1,this.__released=!1,this.__releaseCallbacks=[],this.__propertyChangedCallbacks=[],this.__updating={},this.props={}}connectedCallback(){if(!X(this)||this.__initializing||this.__initialized)return;this.__releaseCallbacks=[],this.__propertyChangedCallbacks=[],this.__updating={},this.props=function(e,t){const n=G(t);return Object.keys(t).forEach(t=>{const l=n[t],o=e.getAttribute(l.attribute),r=e[t];o&&(l.value=K(o)),null!=r&&(l.value=Array.isArray(r)?r.slice(0):r),Q(e,l.attribute,l.value),Object.defineProperty(e,t,{get:()=>l.value,set(e){const n=l.value;l.value=e,Q(this,l.attribute,l.value);for(let l=0,o=this.__propertyChangedCallbacks.length;l<o;l++)this.__propertyChangedCallbacks[l](t,e,n)},enumerable:!0,configurable:!0})}),n}(this,t);const e=function(e){return Object.keys(e).reduce((t,n)=>(t[n]=e[n].value,t),{})}(this.props),n=this.Component,l=Y;try{this.__initializing=!0,Y=this,"function"==typeof(r=n)&&0===r.toString().indexOf("class")?new n(e,{element:this}):n(e,{element:this})}catch(e){console.error(`Error creating component ${o=this.nodeName.toLowerCase(),o.toLowerCase().replace(/(^|-)([a-z])/g,e=>e.toUpperCase().replace("-",""))}:`,e)}finally{Y=l,delete this.__initializing}var o,r;this.__initialized=!0}async disconnectedCallback(){if(await Promise.resolve(),X(this))return;this.__propertyChangedCallbacks.length=0;let e=null;for(;e=this.__releaseCallbacks.pop();)e(this);delete this.__initialized,this.__released=!0}attributeChangedCallback(e,n,l){if(this.__initialized&&!this.__updating[e]&&(e=this.lookupProp(e))in t){if(null==l&&!this[e])return;this[e]=K(l)}}reloadComponent(){let e=null;for(;e=this.__releaseCallbacks.pop();)e(this);delete this.__initialized,this.renderRoot().textContent="",this.connectedCallback()}lookupProp(e){if(t)return n.find(n=>e===n||e===t[n].attribute)}renderRoot(){return this.shadowRoot||this.attachShadow({mode:"open"})}setProperty(e,t){if(!(e in this.props))return;const n=this.props[e],l=n.value;this[e]=t,n.notify&&this.trigger("propertychange",{detail:{value:t,oldValue:l,name:e}})}trigger(e,{detail:t,bubbles:n=!0,cancelable:l=!0,composed:o=!0}={}){const r=new CustomEvent(e,{detail:t,bubbles:n,cancelable:l,composed:o});let i=!1;return this["on"+e]&&(i=!1===this["on"+e](r)),i&&r.preventDefault(),this.dispatchEvent(r),r}addReleaseCallback(e){this.__releaseCallbacks.push(e)}addPropertyChangedCallback(e){this.__propertyChangedCallbacks.push(e)}}}function te(e,t={},n={}){const{BaseElement:l=HTMLElement,extension:o}=n;return n=>{if(!e)throw new Error("tag is required to register a Component");let r=customElements.get(e);return r?(r.prototype.Component=n,r):((r=ee(l,function(e){return e?Object.keys(e).reduce((t,n)=>{const l=e[n];return t[n]=W(l)&&"value"in l?l:{value:l},null!=t[n].notify||(t[n].notify=!1),t[n].attribute||(t[n].attribute=function(e){return e.replace(/\.?([A-Z]+)/g,(e,t)=>"-"+t.toLowerCase()).replace("_","-").replace(/^-/,"")}(n)),t},{}):{}}(t))).prototype.Component=n,r.prototype.registeredTag=e,customElements.define(e,r,o),r)}}function ne(e){return(t,n)=>{const{element:l}=n;return function(e,t){let n,l=0===e.length?null:function(){null===u||(null!==r?o.disposes.add(u):x(u))},u=null===l?h:g(),a=i,c=t||s;u!==c&&(u.owner=c),s=u;try{i=null,n=null===l?e():e(l)}finally{i=a,s=u.owner}return null!==l&&y(u,null,void 0,!0)&&(u=null),n}(o=>{const[r,i]=R(t);return l.addPropertyChangedCallback((e,t)=>i({[e]:t})),l.addReleaseCallback(()=>o()),H(l.renderRoot(),e(r,n))},l.assignedSlot&&l.assignedSlot._context||l._context)}}function le(e,t,n){return 2===arguments.length&&(n=t,t={}),te(e,t)(ne(n))}const oe=M("<span></span>");le("triangle-item",{text:""},({text:e})=>(function(){const t=oe.content.firstChild.cloneNode(!0);return t.textContent=e,t})());const re=M('<div><button data-value="10">Load 10</button><button data-value="100">Load 100</button><button data-value="500">Load 500</button></div>'),ie=M("<div></div>"),se=M("<triangle-item></triangle-item>");function ue(e){const t=e,n=[];n[0]=[1],n[1]=[1,1];for(let e=2;e<t;e++){n[e]=[1];for(let t=1;t<=e-1;t++){const l=n[e-1];n[e][t]=l[t]+l[t-1],n[e].push(1)}}return n}le("pascal-triangle",()=>{const[e,n]=function(e,n){const l=new t(e);let r;if(n){let t=-1;r=r=>{if(!n(e,r)){const n=o.time;if(n===t)throw new Error(`Conflicting value update: ${r} is not the same as ${e}`);t=n,e=r,l.next(r)}}}else r=l.next.bind(l);return[l.current.bind(l),r]}(ue(100)),l=({target:e})=>{let t=parseInt(e.getAttribute("data-value"));n(ue(t))};return[(()=>{const e=re.content.firstChild.cloneNode(!0),t=e.firstChild,n=t.nextSibling,o=n.nextSibling;return t.__click=l,n.__click=l,o.__click=l,e})(),(()=>{const t=ie.content.firstChild.cloneNode(!0);return H(t,()=>e().map(e=>(function(){const t=ie.content.firstChild.cloneNode(!0);return H(t,e.map(e=>(function(){const t=se.content.firstChild.cloneNode(!0);return t.text=e,t})())),t})())),t})()]}),function(e){for(let t=0,n=e.length;t<n;t++){const n=e[t];$.has(n)||($.add(n),document.addEventListener(n,D))}}(["click"])}();
