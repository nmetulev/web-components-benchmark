const isCEPolyfill=window.customElements!==undefined&&window.customElements.polyfillWrapFlushCallback!==undefined;const reparentNodes=(container,start,end=null,before=null)=>{while(start!==end){const n=start.nextSibling;container.insertBefore(start,before);start=n}};const removeNodes=(container,start,end=null)=>{while(start!==end){const n=start.nextSibling;container.removeChild(start);start=n}};const marker=`{{lit-${String(Math.random()).slice(2)}}}`;const nodeMarker=`\x3c!--${marker}--\x3e`;const markerRegex=new RegExp(`${marker}|${nodeMarker}`);const boundAttributeSuffix="$lit$";class Template{constructor(result,element){this.parts=[];this.element=element;const nodesToRemove=[];const stack=[];const walker=document.createTreeWalker(element.content,133,null,false);let lastPartIndex=0;let index=-1;let partIndex=0;const{strings:strings,values:{length:length}}=result;while(partIndex<length){const node=walker.nextNode();if(node===null){walker.currentNode=stack.pop();continue}index++;if(node.nodeType===1){if(node.hasAttributes()){const attributes=node.attributes;const{length:length}=attributes;let count=0;for(let i=0;i<length;i++){if(endsWith(attributes[i].name,boundAttributeSuffix)){count++}}while(count-- >0){const stringForPart=strings[partIndex];const name=lastAttributeNameRegex.exec(stringForPart)[2];const attributeLookupName=name.toLowerCase()+boundAttributeSuffix;const attributeValue=node.getAttribute(attributeLookupName);node.removeAttribute(attributeLookupName);const statics=attributeValue.split(markerRegex);this.parts.push({type:"attribute",index:index,name:name,strings:statics});partIndex+=statics.length-1}}if(node.tagName==="TEMPLATE"){stack.push(node);walker.currentNode=node.content}}else if(node.nodeType===3){const data=node.data;if(data.indexOf(marker)>=0){const parent=node.parentNode;const strings=data.split(markerRegex);const lastIndex=strings.length-1;for(let i=0;i<lastIndex;i++){let insert;let s=strings[i];if(s===""){insert=createMarker()}else{const match=lastAttributeNameRegex.exec(s);if(match!==null&&endsWith(match[2],boundAttributeSuffix)){s=s.slice(0,match.index)+match[1]+match[2].slice(0,-boundAttributeSuffix.length)+match[3]}insert=document.createTextNode(s)}parent.insertBefore(insert,node);this.parts.push({type:"node",index:++index})}if(strings[lastIndex]===""){parent.insertBefore(createMarker(),node);nodesToRemove.push(node)}else{node.data=strings[lastIndex]}partIndex+=lastIndex}}else if(node.nodeType===8){if(node.data===marker){const parent=node.parentNode;if(node.previousSibling===null||index===lastPartIndex){index++;parent.insertBefore(createMarker(),node)}lastPartIndex=index;this.parts.push({type:"node",index:index});if(node.nextSibling===null){node.data=""}else{nodesToRemove.push(node);index--}partIndex++}else{let i=-1;while((i=node.data.indexOf(marker,i+1))!==-1){this.parts.push({type:"node",index:-1});partIndex++}}}}for(const n of nodesToRemove){n.parentNode.removeChild(n)}}}const endsWith=(str,suffix)=>{const index=str.length-suffix.length;return index>=0&&str.slice(index)===suffix};const isTemplatePartActive=part=>part.index!==-1;const createMarker=()=>document.createComment("");const lastAttributeNameRegex=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;const walkerNodeFilter=133;function removeNodesFromTemplate(template,nodesToRemove){const{element:{content:content},parts:parts}=template;const walker=document.createTreeWalker(content,walkerNodeFilter,null,false);let partIndex=nextActiveIndexInTemplateParts(parts);let part=parts[partIndex];let nodeIndex=-1;let removeCount=0;const nodesToRemoveInTemplate=[];let currentRemovingNode=null;while(walker.nextNode()){nodeIndex++;const node=walker.currentNode;if(node.previousSibling===currentRemovingNode){currentRemovingNode=null}if(nodesToRemove.has(node)){nodesToRemoveInTemplate.push(node);if(currentRemovingNode===null){currentRemovingNode=node}}if(currentRemovingNode!==null){removeCount++}while(part!==undefined&&part.index===nodeIndex){part.index=currentRemovingNode!==null?-1:part.index-removeCount;partIndex=nextActiveIndexInTemplateParts(parts,partIndex);part=parts[partIndex]}}nodesToRemoveInTemplate.forEach(n=>n.parentNode.removeChild(n))}const countNodes=node=>{let count=node.nodeType===11?0:1;const walker=document.createTreeWalker(node,walkerNodeFilter,null,false);while(walker.nextNode()){count++}return count};const nextActiveIndexInTemplateParts=(parts,startIndex=-1)=>{for(let i=startIndex+1;i<parts.length;i++){const part=parts[i];if(isTemplatePartActive(part)){return i}}return-1};function insertNodeIntoTemplate(template,node,refNode=null){const{element:{content:content},parts:parts}=template;if(refNode===null||refNode===undefined){content.appendChild(node);return}const walker=document.createTreeWalker(content,walkerNodeFilter,null,false);let partIndex=nextActiveIndexInTemplateParts(parts);let insertCount=0;let walkerIndex=-1;while(walker.nextNode()){walkerIndex++;const walkerNode=walker.currentNode;if(walkerNode===refNode){insertCount=countNodes(node);refNode.parentNode.insertBefore(node,refNode)}while(partIndex!==-1&&parts[partIndex].index===walkerIndex){if(insertCount>0){while(partIndex!==-1){parts[partIndex].index+=insertCount;partIndex=nextActiveIndexInTemplateParts(parts,partIndex)}return}partIndex=nextActiveIndexInTemplateParts(parts,partIndex)}}}const directives=new WeakMap;const directive=f=>(...args)=>{const d=f(...args);directives.set(d,true);return d};const isDirective=o=>{return typeof o==="function"&&directives.has(o)};const noChange={};const nothing={};class TemplateInstance{constructor(template,processor,options){this.__parts=[];this.template=template;this.processor=processor;this.options=options}update(values){let i=0;for(const part of this.__parts){if(part!==undefined){part.setValue(values[i])}i++}for(const part of this.__parts){if(part!==undefined){part.commit()}}}_clone(){const fragment=isCEPolyfill?this.template.element.content.cloneNode(true):document.importNode(this.template.element.content,true);const stack=[];const parts=this.template.parts;const walker=document.createTreeWalker(fragment,133,null,false);let partIndex=0;let nodeIndex=0;let part;let node=walker.nextNode();while(partIndex<parts.length){part=parts[partIndex];if(!isTemplatePartActive(part)){this.__parts.push(undefined);partIndex++;continue}while(nodeIndex<part.index){nodeIndex++;if(node.nodeName==="TEMPLATE"){stack.push(node);walker.currentNode=node.content}if((node=walker.nextNode())===null){walker.currentNode=stack.pop();node=walker.nextNode()}}if(part.type==="node"){const part=this.processor.handleTextExpression(this.options);part.insertAfterNode(node.previousSibling);this.__parts.push(part)}else{this.__parts.push(...this.processor.handleAttributeExpressions(node,part.name,part.strings,this.options))}partIndex++}if(isCEPolyfill){document.adoptNode(fragment);customElements.upgrade(fragment)}return fragment}}const commentMarker=` ${marker} `;class TemplateResult{constructor(strings,values,type,processor){this.strings=strings;this.values=values;this.type=type;this.processor=processor}getHTML(){const l=this.strings.length-1;let html="";let isCommentBinding=false;for(let i=0;i<l;i++){const s=this.strings[i];const commentOpen=s.lastIndexOf("\x3c!--");isCommentBinding=(commentOpen>-1||isCommentBinding)&&s.indexOf("--\x3e",commentOpen+1)===-1;const attributeMatch=lastAttributeNameRegex.exec(s);if(attributeMatch===null){html+=s+(isCommentBinding?commentMarker:nodeMarker)}else{html+=s.substr(0,attributeMatch.index)+attributeMatch[1]+attributeMatch[2]+boundAttributeSuffix+attributeMatch[3]+marker}}html+=this.strings[l];return html}getTemplateElement(){const template=document.createElement("template");template.innerHTML=this.getHTML();return template}}const isPrimitive=value=>{return value===null||!(typeof value==="object"||typeof value==="function")};const isIterable=value=>{return Array.isArray(value)||!!(value&&value[Symbol.iterator])};class AttributeCommitter{constructor(element,name,strings){this.dirty=true;this.element=element;this.name=name;this.strings=strings;this.parts=[];for(let i=0;i<strings.length-1;i++){this.parts[i]=this._createPart()}}_createPart(){return new AttributePart(this)}_getValue(){const strings=this.strings;const l=strings.length-1;let text="";for(let i=0;i<l;i++){text+=strings[i];const part=this.parts[i];if(part!==undefined){const v=part.value;if(isPrimitive(v)||!isIterable(v)){text+=typeof v==="string"?v:String(v)}else{for(const t of v){text+=typeof t==="string"?t:String(t)}}}}text+=strings[l];return text}commit(){if(this.dirty){this.dirty=false;this.element.setAttribute(this.name,this._getValue())}}}class AttributePart{constructor(committer){this.value=undefined;this.committer=committer}setValue(value){if(value!==noChange&&(!isPrimitive(value)||value!==this.value)){this.value=value;if(!isDirective(value)){this.committer.dirty=true}}}commit(){while(isDirective(this.value)){const directive=this.value;this.value=noChange;directive(this)}if(this.value===noChange){return}this.committer.commit()}}class NodePart{constructor(options){this.value=undefined;this.__pendingValue=undefined;this.options=options}appendInto(container){this.startNode=container.appendChild(createMarker());this.endNode=container.appendChild(createMarker())}insertAfterNode(ref){this.startNode=ref;this.endNode=ref.nextSibling}appendIntoPart(part){part.__insert(this.startNode=createMarker());part.__insert(this.endNode=createMarker())}insertAfterPart(ref){ref.__insert(this.startNode=createMarker());this.endNode=ref.endNode;ref.endNode=this.startNode}setValue(value){this.__pendingValue=value}commit(){while(isDirective(this.__pendingValue)){const directive=this.__pendingValue;this.__pendingValue=noChange;directive(this)}const value=this.__pendingValue;if(value===noChange){return}if(isPrimitive(value)){if(value!==this.value){this.__commitText(value)}}else if(value instanceof TemplateResult){this.__commitTemplateResult(value)}else if(value instanceof Node){this.__commitNode(value)}else if(isIterable(value)){this.__commitIterable(value)}else if(value===nothing){this.value=nothing;this.clear()}else{this.__commitText(value)}}__insert(node){this.endNode.parentNode.insertBefore(node,this.endNode)}__commitNode(value){if(this.value===value){return}this.clear();this.__insert(value);this.value=value}__commitText(value){const node=this.startNode.nextSibling;value=value==null?"":value;const valueAsString=typeof value==="string"?value:String(value);if(node===this.endNode.previousSibling&&node.nodeType===3){node.data=valueAsString}else{this.__commitNode(document.createTextNode(valueAsString))}this.value=value}__commitTemplateResult(value){const template=this.options.templateFactory(value);if(this.value instanceof TemplateInstance&&this.value.template===template){this.value.update(value.values)}else{const instance=new TemplateInstance(template,value.processor,this.options);const fragment=instance._clone();instance.update(value.values);this.__commitNode(fragment);this.value=instance}}__commitIterable(value){if(!Array.isArray(this.value)){this.value=[];this.clear()}const itemParts=this.value;let partIndex=0;let itemPart;for(const item of value){itemPart=itemParts[partIndex];if(itemPart===undefined){itemPart=new NodePart(this.options);itemParts.push(itemPart);if(partIndex===0){itemPart.appendIntoPart(this)}else{itemPart.insertAfterPart(itemParts[partIndex-1])}}itemPart.setValue(item);itemPart.commit();partIndex++}if(partIndex<itemParts.length){itemParts.length=partIndex;this.clear(itemPart&&itemPart.endNode)}}clear(startNode=this.startNode){removeNodes(this.startNode.parentNode,startNode.nextSibling,this.endNode)}}class BooleanAttributePart{constructor(element,name,strings){this.value=undefined;this.__pendingValue=undefined;if(strings.length!==2||strings[0]!==""||strings[1]!==""){throw new Error("Boolean attributes can only contain a single expression")}this.element=element;this.name=name;this.strings=strings}setValue(value){this.__pendingValue=value}commit(){while(isDirective(this.__pendingValue)){const directive=this.__pendingValue;this.__pendingValue=noChange;directive(this)}if(this.__pendingValue===noChange){return}const value=!!this.__pendingValue;if(this.value!==value){if(value){this.element.setAttribute(this.name,"")}else{this.element.removeAttribute(this.name)}this.value=value}this.__pendingValue=noChange}}class PropertyCommitter extends AttributeCommitter{constructor(element,name,strings){super(element,name,strings);this.single=strings.length===2&&strings[0]===""&&strings[1]===""}_createPart(){return new PropertyPart(this)}_getValue(){if(this.single){return this.parts[0].value}return super._getValue()}commit(){if(this.dirty){this.dirty=false;this.element[this.name]=this._getValue()}}}class PropertyPart extends AttributePart{}let eventOptionsSupported=false;try{const options={get capture(){eventOptionsSupported=true;return false}};window.addEventListener("test",options,options);window.removeEventListener("test",options,options)}catch(_e){}class EventPart{constructor(element,eventName,eventContext){this.value=undefined;this.__pendingValue=undefined;this.element=element;this.eventName=eventName;this.eventContext=eventContext;this.__boundHandleEvent=(e=>this.handleEvent(e))}setValue(value){this.__pendingValue=value}commit(){while(isDirective(this.__pendingValue)){const directive=this.__pendingValue;this.__pendingValue=noChange;directive(this)}if(this.__pendingValue===noChange){return}const newListener=this.__pendingValue;const oldListener=this.value;const shouldRemoveListener=newListener==null||oldListener!=null&&(newListener.capture!==oldListener.capture||newListener.once!==oldListener.once||newListener.passive!==oldListener.passive);const shouldAddListener=newListener!=null&&(oldListener==null||shouldRemoveListener);if(shouldRemoveListener){this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options)}if(shouldAddListener){this.__options=getOptions(newListener);this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)}this.value=newListener;this.__pendingValue=noChange}handleEvent(event){if(typeof this.value==="function"){this.value.call(this.eventContext||this.element,event)}else{this.value.handleEvent(event)}}}const getOptions=o=>o&&(eventOptionsSupported?{capture:o.capture,passive:o.passive,once:o.once}:o.capture);function templateFactory(result){let templateCache=templateCaches.get(result.type);if(templateCache===undefined){templateCache={stringsArray:new WeakMap,keyString:new Map};templateCaches.set(result.type,templateCache)}let template=templateCache.stringsArray.get(result.strings);if(template!==undefined){return template}const key=result.strings.join(marker);template=templateCache.keyString.get(key);if(template===undefined){template=new Template(result,result.getTemplateElement());templateCache.keyString.set(key,template)}templateCache.stringsArray.set(result.strings,template);return template}const templateCaches=new Map;const parts=new WeakMap;const render=(result,container,options)=>{let part=parts.get(container);if(part===undefined){removeNodes(container,container.firstChild);parts.set(container,part=new NodePart(Object.assign({templateFactory:templateFactory},options)));part.appendInto(container)}part.setValue(result);part.commit()};class DefaultTemplateProcessor{handleAttributeExpressions(element,name,strings,options){const prefix=name[0];if(prefix==="."){const committer=new PropertyCommitter(element,name.slice(1),strings);return committer.parts}if(prefix==="@"){return[new EventPart(element,name.slice(1),options.eventContext)]}if(prefix==="?"){return[new BooleanAttributePart(element,name.slice(1),strings)]}const committer=new AttributeCommitter(element,name,strings);return committer.parts}handleTextExpression(options){return new NodePart(options)}}const defaultTemplateProcessor=new DefaultTemplateProcessor;(window["litHtmlVersions"]||(window["litHtmlVersions"]=[])).push("1.1.2");const html=(strings,...values)=>new TemplateResult(strings,values,"html",defaultTemplateProcessor);const getTemplateCacheKey=(type,scopeName)=>`${type}--${scopeName}`;let compatibleShadyCSSVersion=true;if(typeof window.ShadyCSS==="undefined"){compatibleShadyCSSVersion=false}else if(typeof window.ShadyCSS.prepareTemplateDom==="undefined"){console.warn(`Incompatible ShadyCSS version detected. `+`Please update to at least @webcomponents/webcomponentsjs@2.0.2 and `+`@webcomponents/shadycss@1.3.1.`);compatibleShadyCSSVersion=false}const shadyTemplateFactory=scopeName=>result=>{const cacheKey=getTemplateCacheKey(result.type,scopeName);let templateCache=templateCaches.get(cacheKey);if(templateCache===undefined){templateCache={stringsArray:new WeakMap,keyString:new Map};templateCaches.set(cacheKey,templateCache)}let template=templateCache.stringsArray.get(result.strings);if(template!==undefined){return template}const key=result.strings.join(marker);template=templateCache.keyString.get(key);if(template===undefined){const element=result.getTemplateElement();if(compatibleShadyCSSVersion){window.ShadyCSS.prepareTemplateDom(element,scopeName)}template=new Template(result,element);templateCache.keyString.set(key,template)}templateCache.stringsArray.set(result.strings,template);return template};const TEMPLATE_TYPES=["html","svg"];const removeStylesFromLitTemplates=scopeName=>{TEMPLATE_TYPES.forEach(type=>{const templates=templateCaches.get(getTemplateCacheKey(type,scopeName));if(templates!==undefined){templates.keyString.forEach(template=>{const{element:{content:content}}=template;const styles=new Set;Array.from(content.querySelectorAll("style")).forEach(s=>{styles.add(s)});removeNodesFromTemplate(template,styles)})}})};const shadyRenderSet=new Set;const prepareTemplateStyles=(scopeName,renderedDOM,template)=>{shadyRenderSet.add(scopeName);const templateElement=!!template?template.element:document.createElement("template");const styles=renderedDOM.querySelectorAll("style");const{length:length}=styles;if(length===0){window.ShadyCSS.prepareTemplateStyles(templateElement,scopeName);return}const condensedStyle=document.createElement("style");for(let i=0;i<length;i++){const style=styles[i];style.parentNode.removeChild(style);condensedStyle.textContent+=style.textContent}removeStylesFromLitTemplates(scopeName);const content=templateElement.content;if(!!template){insertNodeIntoTemplate(template,condensedStyle,content.firstChild)}else{content.insertBefore(condensedStyle,content.firstChild)}window.ShadyCSS.prepareTemplateStyles(templateElement,scopeName);const style=content.querySelector("style");if(window.ShadyCSS.nativeShadow&&style!==null){renderedDOM.insertBefore(style.cloneNode(true),renderedDOM.firstChild)}else if(!!template){content.insertBefore(condensedStyle,content.firstChild);const removes=new Set;removes.add(condensedStyle);removeNodesFromTemplate(template,removes)}};const render$1=(result,container,options)=>{if(!options||typeof options!=="object"||!options.scopeName){throw new Error("The `scopeName` option is required.")}const scopeName=options.scopeName;const hasRendered=parts.has(container);const needsScoping=compatibleShadyCSSVersion&&container.nodeType===11&&!!container.host;const firstScopeRender=needsScoping&&!shadyRenderSet.has(scopeName);const renderContainer=firstScopeRender?document.createDocumentFragment():container;render(result,renderContainer,Object.assign({templateFactory:shadyTemplateFactory(scopeName)},options));if(firstScopeRender){const part=parts.get(renderContainer);parts.delete(renderContainer);const template=part.value instanceof TemplateInstance?part.value.template:undefined;prepareTemplateStyles(scopeName,renderContainer,template);removeNodes(container,container.firstChild);container.appendChild(renderContainer);parts.set(container,part)}if(!hasRendered&&needsScoping){window.ShadyCSS.styleElement(container.host)}};var _a;window.JSCompiler_renameProperty=((prop,_obj)=>prop);const defaultConverter={toAttribute(value,type){switch(type){case Boolean:return value?"":null;case Object:case Array:return value==null?value:JSON.stringify(value)}return value},fromAttribute(value,type){switch(type){case Boolean:return value!==null;case Number:return value===null?null:Number(value);case Object:case Array:return JSON.parse(value)}return value}};const notEqual=(value,old)=>{return old!==value&&(old===old||value===value)};const defaultPropertyDeclaration={attribute:true,type:String,converter:defaultConverter,reflect:false,hasChanged:notEqual};const STATE_HAS_UPDATED=1;const STATE_UPDATE_REQUESTED=1<<2;const STATE_IS_REFLECTING_TO_ATTRIBUTE=1<<3;const STATE_IS_REFLECTING_TO_PROPERTY=1<<4;const finalized="finalized";class UpdatingElement extends HTMLElement{constructor(){super();this._updateState=0;this._instanceProperties=undefined;this._updatePromise=new Promise(res=>this._enableUpdatingResolver=res);this._changedProperties=new Map;this._reflectingProperties=undefined;this.initialize()}static get observedAttributes(){this.finalize();const attributes=[];this._classProperties.forEach((v,p)=>{const attr=this._attributeNameForProperty(p,v);if(attr!==undefined){this._attributeToPropertyMap.set(attr,p);attributes.push(attr)}});return attributes}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const superProperties=Object.getPrototypeOf(this)._classProperties;if(superProperties!==undefined){superProperties.forEach((v,k)=>this._classProperties.set(k,v))}}}static createProperty(name,options=defaultPropertyDeclaration){this._ensureClassProperties();this._classProperties.set(name,options);if(options.noAccessor||this.prototype.hasOwnProperty(name)){return}const key=typeof name==="symbol"?Symbol():`__${name}`;const descriptor=this.getPropertyDescriptor(name,key,options);if(descriptor!==undefined){Object.defineProperty(this.prototype,name,descriptor)}}static getPropertyDescriptor(name,key,_options){return{get(){return this[key]},set(value){const oldValue=this[name];this[key]=value;this._requestUpdate(name,oldValue)},configurable:true,enumerable:true}}static getPropertyOptions(name){return this._classProperties&&this._classProperties.get(name)||defaultPropertyDeclaration}static finalize(){const superCtor=Object.getPrototypeOf(this);if(!superCtor.hasOwnProperty(finalized)){superCtor.finalize()}this[finalized]=true;this._ensureClassProperties();this._attributeToPropertyMap=new Map;if(this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const props=this.properties;const propKeys=[...Object.getOwnPropertyNames(props),...typeof Object.getOwnPropertySymbols==="function"?Object.getOwnPropertySymbols(props):[]];for(const p of propKeys){this.createProperty(p,props[p])}}}static _attributeNameForProperty(name,options){const attribute=options.attribute;return attribute===false?undefined:typeof attribute==="string"?attribute:typeof name==="string"?name.toLowerCase():undefined}static _valueHasChanged(value,old,hasChanged=notEqual){return hasChanged(value,old)}static _propertyValueFromAttribute(value,options){const type=options.type;const converter=options.converter||defaultConverter;const fromAttribute=typeof converter==="function"?converter:converter.fromAttribute;return fromAttribute?fromAttribute(value,type):value}static _propertyValueToAttribute(value,options){if(options.reflect===undefined){return}const type=options.type;const converter=options.converter;const toAttribute=converter&&converter.toAttribute||defaultConverter.toAttribute;return toAttribute(value,type)}initialize(){this._saveInstanceProperties();this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((_v,p)=>{if(this.hasOwnProperty(p)){const value=this[p];delete this[p];if(!this._instanceProperties){this._instanceProperties=new Map}this._instanceProperties.set(p,value)}})}_applyInstanceProperties(){this._instanceProperties.forEach((v,p)=>this[p]=v);this._instanceProperties=undefined}connectedCallback(){this.enableUpdating()}enableUpdating(){if(this._enableUpdatingResolver!==undefined){this._enableUpdatingResolver();this._enableUpdatingResolver=undefined}}disconnectedCallback(){}attributeChangedCallback(name,old,value){if(old!==value){this._attributeToProperty(name,value)}}_propertyToAttribute(name,value,options=defaultPropertyDeclaration){const ctor=this.constructor;const attr=ctor._attributeNameForProperty(name,options);if(attr!==undefined){const attrValue=ctor._propertyValueToAttribute(value,options);if(attrValue===undefined){return}this._updateState=this._updateState|STATE_IS_REFLECTING_TO_ATTRIBUTE;if(attrValue==null){this.removeAttribute(attr)}else{this.setAttribute(attr,attrValue)}this._updateState=this._updateState&~STATE_IS_REFLECTING_TO_ATTRIBUTE}}_attributeToProperty(name,value){if(this._updateState&STATE_IS_REFLECTING_TO_ATTRIBUTE){return}const ctor=this.constructor;const propName=ctor._attributeToPropertyMap.get(name);if(propName!==undefined){const options=ctor.getPropertyOptions(propName);this._updateState=this._updateState|STATE_IS_REFLECTING_TO_PROPERTY;this[propName]=ctor._propertyValueFromAttribute(value,options);this._updateState=this._updateState&~STATE_IS_REFLECTING_TO_PROPERTY}}_requestUpdate(name,oldValue){let shouldRequestUpdate=true;if(name!==undefined){const ctor=this.constructor;const options=ctor.getPropertyOptions(name);if(ctor._valueHasChanged(this[name],oldValue,options.hasChanged)){if(!this._changedProperties.has(name)){this._changedProperties.set(name,oldValue)}if(options.reflect===true&&!(this._updateState&STATE_IS_REFLECTING_TO_PROPERTY)){if(this._reflectingProperties===undefined){this._reflectingProperties=new Map}this._reflectingProperties.set(name,options)}}else{shouldRequestUpdate=false}}if(!this._hasRequestedUpdate&&shouldRequestUpdate){this._updatePromise=this._enqueueUpdate()}}requestUpdate(name,oldValue){this._requestUpdate(name,oldValue);return this.updateComplete}async _enqueueUpdate(){this._updateState=this._updateState|STATE_UPDATE_REQUESTED;try{await this._updatePromise}catch(e){}const result=this.performUpdate();if(result!=null){await result}return!this._hasRequestedUpdate}get _hasRequestedUpdate(){return this._updateState&STATE_UPDATE_REQUESTED}get hasUpdated(){return this._updateState&STATE_HAS_UPDATED}performUpdate(){if(this._instanceProperties){this._applyInstanceProperties()}let shouldUpdate=false;const changedProperties=this._changedProperties;try{shouldUpdate=this.shouldUpdate(changedProperties);if(shouldUpdate){this.update(changedProperties)}else{this._markUpdated()}}catch(e){shouldUpdate=false;this._markUpdated();throw e}if(shouldUpdate){if(!(this._updateState&STATE_HAS_UPDATED)){this._updateState=this._updateState|STATE_HAS_UPDATED;this.firstUpdated(changedProperties)}this.updated(changedProperties)}}_markUpdated(){this._changedProperties=new Map;this._updateState=this._updateState&~STATE_UPDATE_REQUESTED}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(_changedProperties){return true}update(_changedProperties){if(this._reflectingProperties!==undefined&&this._reflectingProperties.size>0){this._reflectingProperties.forEach((v,k)=>this._propertyToAttribute(k,this[k],v));this._reflectingProperties=undefined}this._markUpdated()}updated(_changedProperties){}firstUpdated(_changedProperties){}}_a=finalized;UpdatingElement[_a]=true;const supportsAdoptingStyleSheets="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype;(window["litElementVersions"]||(window["litElementVersions"]=[])).push("2.3.1");const renderNotImplemented={};class LitElement extends UpdatingElement{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this))){return}const userStyles=this.getStyles();if(userStyles===undefined){this._styles=[]}else if(Array.isArray(userStyles)){const addStyles=(styles,set)=>styles.reduceRight((set,s)=>Array.isArray(s)?addStyles(s,set):(set.add(s),set),set);const set=addStyles(userStyles,new Set);const styles=[];set.forEach(v=>styles.unshift(v));this._styles=styles}else{this._styles=[userStyles]}}initialize(){super.initialize();this.constructor._getUniqueStyles();this.renderRoot=this.createRenderRoot();if(window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot){this.adoptStyles()}}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const styles=this.constructor._styles;if(styles.length===0){return}if(window.ShadyCSS!==undefined&&!window.ShadyCSS.nativeShadow){window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(s=>s.cssText),this.localName)}else if(supportsAdoptingStyleSheets){this.renderRoot.adoptedStyleSheets=styles.map(s=>s.styleSheet)}else{this._needsShimAdoptedStyleSheets=true}}connectedCallback(){super.connectedCallback();if(this.hasUpdated&&window.ShadyCSS!==undefined){window.ShadyCSS.styleElement(this)}}update(changedProperties){const templateResult=this.render();super.update(changedProperties);if(templateResult!==renderNotImplemented){this.constructor.render(templateResult,this.renderRoot,{scopeName:this.localName,eventContext:this})}if(this._needsShimAdoptedStyleSheets){this._needsShimAdoptedStyleSheets=false;this.constructor._styles.forEach(s=>{const style=document.createElement("style");style.textContent=s.cssText;this.renderRoot.appendChild(style)})}}render(){return renderNotImplemented}}LitElement["finalized"]=true;LitElement.render=render$1;const createAndInsertPart=(containerPart,beforePart)=>{const container=containerPart.startNode.parentNode;const beforeNode=beforePart===undefined?containerPart.endNode:beforePart.startNode;const startNode=container.insertBefore(createMarker(),beforeNode);container.insertBefore(createMarker(),beforeNode);const newPart=new NodePart(containerPart.options);newPart.insertAfterNode(startNode);return newPart};const updatePart=(part,value)=>{part.setValue(value);part.commit();return part};const insertPartBefore=(containerPart,part,ref)=>{const container=containerPart.startNode.parentNode;const beforeNode=ref?ref.startNode:containerPart.endNode;const endNode=part.endNode.nextSibling;if(endNode!==beforeNode){reparentNodes(container,part.startNode,endNode,beforeNode)}};const removePart=part=>{removeNodes(part.startNode.parentNode,part.startNode,part.endNode.nextSibling)};const generateMap=(list,start,end)=>{const map=new Map;for(let i=start;i<=end;i++){map.set(list[i],i)}return map};const partListCache=new WeakMap;const keyListCache=new WeakMap;const repeat=directive((items,keyFnOrTemplate,template)=>{let keyFn;if(template===undefined){template=keyFnOrTemplate}else if(keyFnOrTemplate!==undefined){keyFn=keyFnOrTemplate}return containerPart=>{if(!(containerPart instanceof NodePart)){throw new Error("repeat can only be used in text bindings")}const oldParts=partListCache.get(containerPart)||[];const oldKeys=keyListCache.get(containerPart)||[];const newParts=[];const newValues=[];const newKeys=[];let index=0;for(const item of items){newKeys[index]=keyFn?keyFn(item,index):index;newValues[index]=template(item,index);index++}let newKeyToIndexMap;let oldKeyToIndexMap;let oldHead=0;let oldTail=oldParts.length-1;let newHead=0;let newTail=newValues.length-1;while(oldHead<=oldTail&&newHead<=newTail){if(oldParts[oldHead]===null){oldHead++}else if(oldParts[oldTail]===null){oldTail--}else if(oldKeys[oldHead]===newKeys[newHead]){newParts[newHead]=updatePart(oldParts[oldHead],newValues[newHead]);oldHead++;newHead++}else if(oldKeys[oldTail]===newKeys[newTail]){newParts[newTail]=updatePart(oldParts[oldTail],newValues[newTail]);oldTail--;newTail--}else if(oldKeys[oldHead]===newKeys[newTail]){newParts[newTail]=updatePart(oldParts[oldHead],newValues[newTail]);insertPartBefore(containerPart,oldParts[oldHead],newParts[newTail+1]);oldHead++;newTail--}else if(oldKeys[oldTail]===newKeys[newHead]){newParts[newHead]=updatePart(oldParts[oldTail],newValues[newHead]);insertPartBefore(containerPart,oldParts[oldTail],oldParts[oldHead]);oldTail--;newHead++}else{if(newKeyToIndexMap===undefined){newKeyToIndexMap=generateMap(newKeys,newHead,newTail);oldKeyToIndexMap=generateMap(oldKeys,oldHead,oldTail)}if(!newKeyToIndexMap.has(oldKeys[oldHead])){removePart(oldParts[oldHead]);oldHead++}else if(!newKeyToIndexMap.has(oldKeys[oldTail])){removePart(oldParts[oldTail]);oldTail--}else{const oldIndex=oldKeyToIndexMap.get(newKeys[newHead]);const oldPart=oldIndex!==undefined?oldParts[oldIndex]:null;if(oldPart===null){const newPart=createAndInsertPart(containerPart,oldParts[oldHead]);updatePart(newPart,newValues[newHead]);newParts[newHead]=newPart}else{newParts[newHead]=updatePart(oldPart,newValues[newHead]);insertPartBefore(containerPart,oldPart,oldParts[oldHead]);oldParts[oldIndex]=null}newHead++}}}while(newHead<=newTail){const newPart=createAndInsertPart(containerPart,newParts[newTail+1]);updatePart(newPart,newValues[newHead]);newParts[newHead++]=newPart}while(oldHead<=oldTail){const oldPart=oldParts[oldHead++];if(oldPart!==null){removePart(oldPart)}}partListCache.set(containerPart,newParts);keyListCache.set(containerPart,newKeys)}});let nextId=0;class MyTodo extends LitElement{static get properties(){return{list:{type:Array}}}constructor(){super();this.list=[{id:nextId++,text:"my initial todo",checked:false},{id:nextId++,text:"Learn about Web Components",checked:true}]}render(){return html`
<style>
h1 {
    font-size: 100px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
}

section {
    background: #fff;
    margin: 130px 0 40px 0;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

#list-container {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid #e6e6e6;
}
</style>
<h1>Todos WC</h1>
<section>
    <todo-input @submit=${this.addItem}></todo-input>
    <ul id="list-container">
        ${repeat(this.list,item=>item.id,(item,index)=>html`
                <todo-item 
                    .text="${item.text}" 
                    .checked="${item.checked}" 
                    .index="${index}" 
                    @removed=${this.removeItem}
                    @checked=${this.toggleItem}>
                </todo-item>`)}
    </ul>
</section>`}addItem(e){this.list.splice(this.list.length,0,{id:nextId++,text:e.detail,checked:false});this.requestUpdate()}removeItem(e){this.list.splice(e.detail,1);this.requestUpdate()}toggleItem(e){const item=this.list[e.detail];item.checked=!item.checked;this.requestUpdate()}}window.customElements.define("my-todo",MyTodo);class TodoInput extends LitElement{render(){return html`
<style>
    #new-todo-form {
        position: relative;
        font-size: 24px;
        border-bottom: 1px solid #ededed;
    }

    #new-todo {
        padding: 16px 16px 16px 60px;
        border: none;
        background: rgba(0, 0, 0, 0.003);
        position: relative;
        margin: 0;
        width: 100%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        outline: none;
        color: inherit;
        padding: 6px;
        border: 1px solid #CCC;
        box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
    }
</style>
<form id="new-todo-form" @submit=${this.handleSubmit}>
    <input id="new-todo" type="text" placeholder="What needs to be done?"/>
</form>`}handleSubmit(e){e.preventDefault();const input=this.shadowRoot.querySelector("#new-todo");this.dispatchEvent(new CustomEvent("submit",{detail:input.value}));input.value="";input.blur()}}window.customElements.define("todo-input",TodoInput);class TodoItem extends LitElement{static get properties(){return{checked:{type:Boolean},index:{type:Number},text:{}}}constructor(){super();this.checked=false;this.text="";this.index=0}render(){const{checked:checked,text:text}=this;return html`
<style>
    :host {
        display: block;
    }

    li.item {
        font-size: 24px;
        display: block;
        position: relative;
        border-bottom: 1px solid #ededed;
    }

    li.item input {
        text-align: center;
        width: 40px;
        /* auto, since non-WebKit browsers doesn't support input styling */
        height: auto;
        position: absolute;
        top: 9px;
        bottom: 0;
        margin: auto 0;
        border: none;
        /* Mobile Safari */
        -webkit-appearance: none;
        appearance: none;
    }

    li.item input:after {
        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>');
    }

    li.item input:checked:after {
        content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
    }

    li.item label {
        white-space: pre;
        word-break: break-word;
        padding: 15px 60px 15px 15px;
        margin-left: 45px;
        display: block;
        line-height: 1.2;
        transition: color 0.4s;
    }

    li.item.completed label {
        color: #d9d9d9;
        text-decoration: line-through;
    }

    li.item button,
        li.item input[type="checkbox"] {
        outline: none;
    }

    li.item button {
        margin: 0;
        padding: 0;
        border: 0;
        background: none;
        font-size: 100%;
        vertical-align: baseline;
        font-family: inherit;
        font-weight: inherit;
        color: inherit;
        -webkit-appearance: none;
        appearance: none;
        -webkit-font-smoothing: antialiased;
        -moz-font-smoothing: antialiased;
        font-smoothing: antialiased;
    }

    li.item .destroy {
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        width: 40px;
        height: 40px;
        margin: auto 0;
        font-size: 30px;
        color: #cc9a9a;
        margin-bottom: 11px;
        transition: color 0.2s ease-out;
    }

    li.item .destroy:hover {
        color: #af5b5e;
    }
</style>
<li class="item ${checked?"completed":""}">
    <input type="checkbox" .checked=${checked} @change=${this.handleOnChecked}>
    <label>${text}</label>
    <button class="destroy" @click=${this.handleOnRemoved}>x</button>
</li>`}handleOnRemoved(e){this.dispatchEvent(new CustomEvent("removed",{detail:this.index}))}handleOnChecked(e){this.dispatchEvent(new CustomEvent("checked",{detail:this.index}))}}window.customElements.define("todo-item",TodoItem);