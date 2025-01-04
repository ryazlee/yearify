"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[298],{5118:(e,t,r)=>{r.d(t,{a:()=>d,ge:()=>l,fT:()=>o,YH:()=>p,l:()=>n,cY:()=>c,SQ:()=>u});var n=function(e){var t=e.top,r=e.right,n=e.bottom,o=e.left;return{top:t,right:r,bottom:n,left:o,width:r-o,height:n-t,x:o,y:t,center:{x:(r+o)/2,y:(n+t)/2}}},o=function(e,t){return{top:e.top-t.top,left:e.left-t.left,bottom:e.bottom+t.bottom,right:e.right+t.right}},i=function(e,t){return{top:e.top+t.top,left:e.left+t.left,bottom:e.bottom-t.bottom,right:e.right-t.right}},a={top:0,right:0,bottom:0,left:0},l=function(e){var t=e.borderBox,r=e.margin,l=void 0===r?a:r,s=e.border,c=void 0===s?a:s,u=e.padding,d=void 0===u?a:u,p=n(o(t,l)),f=n(i(t,c)),h=n(i(f,d));return{marginBox:p,borderBox:n(t),paddingBox:f,contentBox:h,margin:l,border:c,padding:d}},s=function(e){var t=e.slice(0,-2);if("px"!==e.slice(-2))return 0;var r=Number(t);return isNaN(r)&&function(e,t){if(!e)throw Error("Invariant failed")}(!1),r},c=function(e,t){var r=e.borderBox,n=e.border,o=e.margin,i=e.padding;return l({borderBox:{top:r.top+t.y,left:r.left+t.x,bottom:r.bottom+t.y,right:r.right+t.x},border:n,margin:o,padding:i})},u=function(e,t){return void 0===t&&(t={x:window.pageXOffset,y:window.pageYOffset}),c(e,t)},d=function(e,t){return l({borderBox:e,margin:{top:s(t.marginTop),right:s(t.marginRight),bottom:s(t.marginBottom),left:s(t.marginLeft)},padding:{top:s(t.paddingTop),right:s(t.paddingRight),bottom:s(t.paddingBottom),left:s(t.paddingLeft)},border:{top:s(t.borderTopWidth),right:s(t.borderRightWidth),bottom:s(t.borderBottomWidth),left:s(t.borderLeftWidth)}})},p=function(e){return d(e.getBoundingClientRect(),window.getComputedStyle(e))}},1811:(e,t,r)=>{r.d(t,{A:()=>i});var n=Number.isNaN||function(e){return"number"==typeof e&&e!=e};function o(e,t){if(e.length!==t.length)return!1;for(var r,o,i=0;i<e.length;i++)if(!((r=e[i])===(o=t[i])||n(r)&&n(o)))return!1;return!0}let i=function(e,t){void 0===t&&(t=o);var r,n,i=[],a=!1;return function(){for(var o=[],l=0;l<arguments.length;l++)o[l]=arguments[l];return a&&r===this&&t(o,i)||(n=e.apply(this,o),a=!0,r=this,i=o),n}}},9806:(e,t,r)=>{r.d(t,{A:()=>i});var n=r(8448),o=r(4848);let i=(0,n.A)((0,o.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"}),"Delete")},4622:(e,t,r)=>{r.d(t,{A:()=>i});var n=r(8448),o=r(4848);let i=(0,n.A)((0,o.jsx)("path",{d:"M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z"}),"Launch")},3421:(e,t,r)=>{r.d(t,{A:()=>i});var n=r(8448),o=r(4848);let i=(0,n.A)((0,o.jsx)("path",{d:"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5"}),"Link")},8435:(e,t,r)=>{r.d(t,{A:()=>i});var n=r(6540);let o=n.createContext(void 0);function i(){return n.useContext(o)}},4122:(e,t,r)=>{r.d(t,{A:()=>S});var n=r(6540),o=r(4164),i=r(5659),a=r(8435),l=r(3552),s=r(186),c=r(8301),u=r(6247),d=r(7306),p=r(8413),f=r(1609);function h(e){return(0,f.Ay)("MuiFormControlLabel",e)}let v=(0,p.A)("MuiFormControlLabel",["root","labelPlacementStart","labelPlacementTop","labelPlacementBottom","disabled","label","error","required","asterisk"]);var m=r(7982),g=r(4848);let b=e=>{let{classes:t,disabled:r,labelPlacement:n,error:o,required:a}=e,l={root:["root",r&&"disabled",`labelPlacement${(0,d.A)(n)}`,o&&"error",a&&"required"],label:["label",r&&"disabled"],asterisk:["asterisk",o&&"error"]};return(0,i.A)(l,h,t)},y=(0,l.Ay)("label",{name:"MuiFormControlLabel",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:r}=e;return[{[`& .${v.label}`]:t.label},t.root,t[`labelPlacement${(0,d.A)(r.labelPlacement)}`]]}})((0,s.A)(e=>{let{theme:t}=e;return{display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16,[`&.${v.disabled}`]:{cursor:"default"},[`& .${v.label}`]:{[`&.${v.disabled}`]:{color:(t.vars||t).palette.text.disabled}},variants:[{props:{labelPlacement:"start"},style:{flexDirection:"row-reverse",marginRight:-11}},{props:{labelPlacement:"top"},style:{flexDirection:"column-reverse"}},{props:{labelPlacement:"bottom"},style:{flexDirection:"column"}},{props:e=>{let{labelPlacement:t}=e;return"start"===t||"top"===t||"bottom"===t},style:{marginLeft:16}}]}})),w=(0,l.Ay)("span",{name:"MuiFormControlLabel",slot:"Asterisk",overridesResolver:(e,t)=>t.asterisk})((0,s.A)(e=>{let{theme:t}=e;return{[`&.${v.error}`]:{color:(t.vars||t).palette.error.main}}})),S=n.forwardRef(function(e,t){let r=(0,c.b)({props:e,name:"MuiFormControlLabel"}),{checked:i,className:l,componentsProps:s={},control:d,disabled:p,disableTypography:f,inputRef:h,label:v,labelPlacement:S="end",name:k,onChange:E,required:A,slots:x={},slotProps:C={},value:P,...O}=r,$=(0,a.A)(),j=p??d.props.disabled??$?.disabled,N=A??d.props.required,R={disabled:j,required:N};["checked","name","onChange","value","inputRef"].forEach(e=>{void 0===d.props[e]&&void 0!==r[e]&&(R[e]=r[e])});let M=function(e){let{props:t,states:r,muiFormControl:n}=e;return r.reduce((e,r)=>(e[r]=t[r],n&&void 0===t[r]&&(e[r]=n[r]),e),{})}({props:r,muiFormControl:$,states:["error"]}),T={...r,disabled:j,labelPlacement:S,required:N,error:M.error},L=b(T),D={slots:x,slotProps:{...s,...C}},[B,q]=(0,m.A)("typography",{elementType:u.A,externalForwardedProps:D,ownerState:T}),z=v;return null==z||z.type===u.A||f||(z=(0,g.jsx)(B,{component:"span",...q,className:(0,o.A)(L.label,q?.className),children:z})),(0,g.jsxs)(y,{className:(0,o.A)(L.root,l),ownerState:T,ref:t,...O,children:[n.cloneElement(d,R),N?(0,g.jsxs)("div",{children:[z,(0,g.jsxs)(w,{ownerState:T,"aria-hidden":!0,className:L.asterisk,children:[" ","*"]})]}):z]})})},6994:(e,t,r)=>{r.d(t,{A:()=>D});var n=r(6540),o=r(4164),i=r(8473),a=r(1609),l=r(5659);let s=(0,r(8351).Ay)();var c=r(7340),u=r(973),d=r(9599),p=r(2370);let f=(e,t)=>e.filter(e=>t.includes(e)),h=(e,t,r)=>{let n=e.keys[0];Array.isArray(t)?t.forEach((t,n)=>{r((t,r)=>{n<=e.keys.length-1&&(0===n?Object.assign(t,r):t[e.up(e.keys[n])]=r)},t)}):t&&"object"==typeof t?(Object.keys(t).length>e.keys.length?e.keys:f(e.keys,Object.keys(t))).forEach(o=>{if(e.keys.includes(o)){let i=t[o];void 0!==i&&r((t,r)=>{n===o?Object.assign(t,r):t[e.up(o)]=r},i)}}):("number"==typeof t||"string"==typeof t)&&r((e,t)=>{Object.assign(e,t)},t)};function v(e){return`--Grid-${e}Spacing`}function m(e){return`--Grid-parent-${e}Spacing`}let g="--Grid-columns",b="--Grid-parent-columns",y=({theme:e,ownerState:t})=>{let r={};return h(e.breakpoints,t.size,(e,t)=>{let n={};"grow"===t&&(n={flexBasis:0,flexGrow:1,maxWidth:"100%"}),"auto"===t&&(n={flexBasis:"auto",flexGrow:0,flexShrink:0,maxWidth:"none",width:"auto"}),"number"==typeof t&&(n={flexGrow:0,flexBasis:"auto",width:`calc(100% * ${t} / var(${b}) - (var(${b}) - ${t}) * (var(${m("column")}) / var(${b})))`}),e(r,n)}),r},w=({theme:e,ownerState:t})=>{let r={};return h(e.breakpoints,t.offset,(e,t)=>{let n={};"auto"===t&&(n={marginLeft:"auto"}),"number"==typeof t&&(n={marginLeft:0===t?"0px":`calc(100% * ${t} / var(${b}) + var(${m("column")}) * ${t} / var(${b}))`}),e(r,n)}),r},S=({theme:e,ownerState:t})=>{if(!t.container)return{};let r={[g]:12};return h(e.breakpoints,t.columns,(e,t)=>{let n=t??12;e(r,{[g]:n,"> *":{[b]:n}})}),r},k=({theme:e,ownerState:t})=>{if(!t.container)return{};let r={};return h(e.breakpoints,t.rowSpacing,(t,n)=>{let o="string"==typeof n?n:e.spacing?.(n);t(r,{[v("row")]:o,"> *":{[m("row")]:o}})}),r},E=({theme:e,ownerState:t})=>{if(!t.container)return{};let r={};return h(e.breakpoints,t.columnSpacing,(t,n)=>{let o="string"==typeof n?n:e.spacing?.(n);t(r,{[v("column")]:o,"> *":{[m("column")]:o}})}),r},A=({theme:e,ownerState:t})=>{if(!t.container)return{};let r={};return h(e.breakpoints,t.direction,(e,t)=>{e(r,{flexDirection:t})}),r},x=({ownerState:e})=>({minWidth:0,boxSizing:"border-box",...e.container&&{display:"flex",flexWrap:"wrap",...e.wrap&&"wrap"!==e.wrap&&{flexWrap:e.wrap},gap:`var(${v("row")}) var(${v("column")})`}}),C=e=>{let t=[];return Object.entries(e).forEach(([e,r])=>{!1!==r&&void 0!==r&&t.push(`grid-${e}-${String(r)}`)}),t},P=(e,t="xs")=>{function r(e){return void 0!==e&&("string"==typeof e&&!Number.isNaN(Number(e))||"number"==typeof e&&e>0)}if(r(e))return[`spacing-${t}-${String(e)}`];if("object"==typeof e&&!Array.isArray(e)){let t=[];return Object.entries(e).forEach(([e,n])=>{r(n)&&t.push(`spacing-${e}-${String(n)}`)}),t}return[]},O=e=>void 0===e?[]:"object"==typeof e?Object.entries(e).map(([e,t])=>`direction-${e}-${t}`):[`direction-xs-${String(e)}`];var $=r(4848);let j=(0,p.A)(),N=s("div",{name:"MuiGrid",slot:"Root",overridesResolver:(e,t)=>t.root});function R(e){return function({props:e,name:t,defaultTheme:r,themeId:n}){let o=(0,u.A)(r);return n&&(o=o[n]||o),(0,c.A)({theme:o,name:t,props:e})}({props:e,name:"MuiGrid",defaultTheme:j})}var M=r(3552),T=r(8301),L=r(2907);let D=function(e={}){let{createStyledComponent:t=N,useThemeProps:r=R,useTheme:s=u.A,componentName:c="MuiGrid"}=e,p=(e,t)=>{let{container:r,direction:n,spacing:o,wrap:i,size:s}=e,u={root:["root",r&&"container","wrap"!==i&&`wrap-xs-${String(i)}`,...O(n),...C(s),...r?P(o,t.breakpoints.keys[0]):[]]};return(0,l.A)(u,e=>(0,a.Ay)(c,e),{})};function f(e,t,r=()=>!0){let n={};return null===e||(Array.isArray(e)?e.forEach((e,o)=>{null!==e&&r(e)&&t.keys[o]&&(n[t.keys[o]]=e)}):"object"==typeof e?Object.keys(e).forEach(t=>{let o=e[t];null!=o&&r(o)&&(n[t]=o)}):n[t.keys[0]]=e),n}let h=t(S,E,k,y,A,x,w),v=n.forwardRef(function(e,t){let a=s(),l=r(e),c=(0,d.A)(l),{className:u,children:v,columns:m=12,container:g=!1,component:b="div",direction:y="row",wrap:w="wrap",size:S={},offset:k={},spacing:E=0,rowSpacing:A=E,columnSpacing:x=E,unstable_level:C=0,...P}=c,O=f(S,a.breakpoints,e=>!1!==e),j=f(k,a.breakpoints),N=e.columns??(C?void 0:m),R=e.spacing??(C?void 0:E),M=e.rowSpacing??e.spacing??(C?void 0:A),T=e.columnSpacing??e.spacing??(C?void 0:x),L={...c,level:C,columns:N,container:g,direction:y,wrap:w,spacing:R,rowSpacing:M,columnSpacing:T,size:O,offset:j},D=p(L,a);return(0,$.jsx)(h,{ref:t,as:b,ownerState:L,className:(0,o.A)(D.root,u),...P,children:n.Children.map(v,e=>n.isValidElement(e)&&(0,i.A)(e,["Grid"])&&g&&e.props.container?n.cloneElement(e,{unstable_level:e.props?.unstable_level??C+1}):e)})});return v.muiName="Grid",v}({createStyledComponent:(0,M.Ay)("div",{name:"MuiGrid2",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:r}=e;return[t.root,r.container&&t.container]}}),componentName:"MuiGrid2",useThemeProps:e=>(0,T.b)({props:e,name:"MuiGrid2"}),useTheme:L.A})},2170:(e,t,r)=>{r.d(t,{A:()=>N});var n=r(6540),o=r(4164),i=r(5659),a=r(4136),l=r(7306),s=r(172),c=r(4891),u=r(3552);let d=function({controlled:e,default:t,name:r,state:o="value"}){let{current:i}=n.useRef(void 0!==e),[a,l]=n.useState(t),s=n.useCallback(e=>{i||l(e)},[]);return[i?e:a,s]};var p=r(8435),f=r(6703),h=r(8413),v=r(1609);function m(e){return(0,v.Ay)("PrivateSwitchBase",e)}(0,h.A)("PrivateSwitchBase",["root","checked","disabled","input","edgeStart","edgeEnd"]);var g=r(4848);let b=e=>{let{classes:t,checked:r,disabled:n,edge:o}=e,a={root:["root",r&&"checked",n&&"disabled",o&&`edge${(0,l.A)(o)}`],input:["input"]};return(0,i.A)(a,m,t)},y=(0,u.Ay)(f.A)({padding:9,borderRadius:"50%",variants:[{props:{edge:"start",size:"small"},style:{marginLeft:-3}},{props:e=>{let{edge:t,ownerState:r}=e;return"start"===t&&"small"!==r.size},style:{marginLeft:-12}},{props:{edge:"end",size:"small"},style:{marginRight:-3}},{props:e=>{let{edge:t,ownerState:r}=e;return"end"===t&&"small"!==r.size},style:{marginRight:-12}}]}),w=(0,u.Ay)("input",{shouldForwardProp:c.A})({cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}),S=n.forwardRef(function(e,t){let{autoFocus:r,checked:n,checkedIcon:i,className:a,defaultChecked:l,disabled:s,disableFocusRipple:c=!1,edge:u=!1,icon:f,id:h,inputProps:v,inputRef:m,name:S,onBlur:k,onChange:E,onFocus:A,readOnly:x,required:C=!1,tabIndex:P,type:O,value:$,...j}=e,[N,R]=d({controlled:n,default:!!l,name:"SwitchBase",state:"checked"}),M=(0,p.A)(),T=s;M&&void 0===T&&(T=M.disabled);let L="checkbox"===O||"radio"===O,D={...e,checked:N,disabled:T,disableFocusRipple:c,edge:u},B=b(D);return(0,g.jsxs)(y,{component:"span",className:(0,o.A)(B.root,a),centerRipple:!0,focusRipple:!c,disabled:T,tabIndex:null,role:void 0,onFocus:e=>{A&&A(e),M&&M.onFocus&&M.onFocus(e)},onBlur:e=>{k&&k(e),M&&M.onBlur&&M.onBlur(e)},ownerState:D,ref:t,...j,children:[(0,g.jsx)(w,{autoFocus:r,checked:n,defaultChecked:l,className:B.input,disabled:T,id:L?h:void 0,name:S,onChange:e=>{if(e.nativeEvent.defaultPrevented)return;let t=e.target.checked;R(t),E&&E(e,t)},readOnly:x,ref:m,required:C,ownerState:D,tabIndex:P,type:O,..."checkbox"===O&&void 0===$?{}:{value:$},...v}),N?i:f]})});var k=r(186),E=r(8301);function A(e){return(0,v.Ay)("MuiSwitch",e)}let x=(0,h.A)("MuiSwitch",["root","edgeStart","edgeEnd","switchBase","colorPrimary","colorSecondary","sizeSmall","sizeMedium","checked","disabled","input","thumb","track"]),C=e=>{let{classes:t,edge:r,size:n,color:o,checked:a,disabled:s}=e,c={root:["root",r&&`edge${(0,l.A)(r)}`,`size${(0,l.A)(n)}`],switchBase:["switchBase",`color${(0,l.A)(o)}`,a&&"checked",s&&"disabled"],thumb:["thumb"],track:["track"],input:["input"]},u=(0,i.A)(c,A,t);return{...t,...u}},P=(0,u.Ay)("span",{name:"MuiSwitch",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:r}=e;return[t.root,r.edge&&t[`edge${(0,l.A)(r.edge)}`],t[`size${(0,l.A)(r.size)}`]]}})({display:"inline-flex",width:58,height:38,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"},variants:[{props:{edge:"start"},style:{marginLeft:-8}},{props:{edge:"end"},style:{marginRight:-8}},{props:{size:"small"},style:{width:40,height:24,padding:7,[`& .${x.thumb}`]:{width:16,height:16},[`& .${x.switchBase}`]:{padding:4,[`&.${x.checked}`]:{transform:"translateX(16px)"}}}}]}),O=(0,u.Ay)(S,{name:"MuiSwitch",slot:"SwitchBase",overridesResolver:(e,t)=>{let{ownerState:r}=e;return[t.switchBase,{[`& .${x.input}`]:t.input},"default"!==r.color&&t[`color${(0,l.A)(r.color)}`]]}})((0,k.A)(e=>{let{theme:t}=e;return{position:"absolute",top:0,left:0,zIndex:1,color:t.vars?t.vars.palette.Switch.defaultColor:`${"light"===t.palette.mode?t.palette.common.white:t.palette.grey[300]}`,transition:t.transitions.create(["left","transform"],{duration:t.transitions.duration.shortest}),[`&.${x.checked}`]:{transform:"translateX(20px)"},[`&.${x.disabled}`]:{color:t.vars?t.vars.palette.Switch.defaultDisabledColor:`${"light"===t.palette.mode?t.palette.grey[100]:t.palette.grey[600]}`},[`&.${x.checked} + .${x.track}`]:{opacity:.5},[`&.${x.disabled} + .${x.track}`]:{opacity:t.vars?t.vars.opacity.switchTrackDisabled:`${"light"===t.palette.mode?.12:.2}`},[`& .${x.input}`]:{left:"-100%",width:"300%"}}}),(0,k.A)(e=>{let{theme:t}=e;return{"&:hover":{backgroundColor:t.vars?`rgba(${t.vars.palette.action.activeChannel} / ${t.vars.palette.action.hoverOpacity})`:(0,a.X4)(t.palette.action.active,t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},variants:[...Object.entries(t.palette).filter((0,s.A)(["light"])).map(e=>{let[r]=e;return{props:{color:r},style:{[`&.${x.checked}`]:{color:(t.vars||t).palette[r].main,"&:hover":{backgroundColor:t.vars?`rgba(${t.vars.palette[r].mainChannel} / ${t.vars.palette.action.hoverOpacity})`:(0,a.X4)(t.palette[r].main,t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${x.disabled}`]:{color:t.vars?t.vars.palette.Switch[`${r}DisabledColor`]:`${"light"===t.palette.mode?(0,a.a)(t.palette[r].main,.62):(0,a.e$)(t.palette[r].main,.55)}`}},[`&.${x.checked} + .${x.track}`]:{backgroundColor:(t.vars||t).palette[r].main}}}})]}})),$=(0,u.Ay)("span",{name:"MuiSwitch",slot:"Track",overridesResolver:(e,t)=>t.track})((0,k.A)(e=>{let{theme:t}=e;return{height:"100%",width:"100%",borderRadius:7,zIndex:-1,transition:t.transitions.create(["opacity","background-color"],{duration:t.transitions.duration.shortest}),backgroundColor:t.vars?t.vars.palette.common.onBackground:`${"light"===t.palette.mode?t.palette.common.black:t.palette.common.white}`,opacity:t.vars?t.vars.opacity.switchTrack:`${"light"===t.palette.mode?.38:.3}`}})),j=(0,u.Ay)("span",{name:"MuiSwitch",slot:"Thumb",overridesResolver:(e,t)=>t.thumb})((0,k.A)(e=>{let{theme:t}=e;return{boxShadow:(t.vars||t).shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"}})),N=n.forwardRef(function(e,t){let r=(0,E.b)({props:e,name:"MuiSwitch"}),{className:n,color:i="primary",edge:a=!1,size:l="medium",sx:s,...c}=r,u={...r,color:i,edge:a,size:l},d=C(u),p=(0,g.jsx)(j,{className:d.thumb,ownerState:u});return(0,g.jsxs)(P,{className:(0,o.A)(d.root,n),sx:s,ownerState:u,children:[(0,g.jsx)(O,{type:"checkbox",icon:p,checkedIcon:p,ref:t,ownerState:u,...c,classes:{...d,root:d.switchBase}}),(0,g.jsx)($,{className:d.track,ownerState:u})]})})},629:(e,t,r)=>{r.d(t,{A:()=>n});let n=function(e){var t=[],r=null,n=function(){for(var n=arguments.length,o=Array(n),i=0;i<n;i++)o[i]=arguments[i];t=o,r||(r=requestAnimationFrame(function(){r=null,e.apply(void 0,t)}))};return n.cancel=function(){r&&(cancelAnimationFrame(r),r=null)},n}},6595:e=>{var t=Object.defineProperty,r=Object.defineProperties,n=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyDescriptors,i=Object.getOwnPropertyNames,a=Object.getOwnPropertySymbols,l=Object.prototype.hasOwnProperty,s=Object.prototype.propertyIsEnumerable,c=(e,r,n)=>r in e?t(e,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[r]=n,u=(e,t)=>{for(var r in t||(t={}))l.call(t,r)&&c(e,r,t[r]);if(a)for(var r of a(t))s.call(t,r)&&c(e,r,t[r]);return e},d=(e,t)=>r(e,o(t)),p=(e,t,r)=>new Promise((n,o)=>{var i=e=>{try{l(r.next(e))}catch(e){o(e)}},a=e=>{try{l(r.throw(e))}catch(e){o(e)}},l=e=>e.done?n(e.value):Promise.resolve(e.value).then(i,a);l((r=r.apply(e,t)).next())}),f={};((e,r)=>{for(var n in r)t(e,n,{get:r[n],enumerable:!0})})(f,{default:()=>h}),e.exports=((e,r,o,a)=>{if(r&&"object"==typeof r||"function"==typeof r)for(let s of i(r))l.call(e,s)||s===o||t(e,s,{get:()=>r[s],enumerable:!(a=n(r,s))||a.enumerable});return e})(t({},"__esModule",{value:!0}),f);var h=class{constructor(e){this.config=e,this.tokenClient=null,this.onLoadCallback=null,this.calendar="primary";try{this.initGapiClient=this.initGapiClient.bind(this),this.handleSignoutClick=this.handleSignoutClick.bind(this),this.handleAuthClick=this.handleAuthClick.bind(this),this.createEvent=this.createEvent.bind(this),this.listUpcomingEvents=this.listUpcomingEvents.bind(this),this.listEvents=this.listEvents.bind(this),this.createEventFromNow=this.createEventFromNow.bind(this),this.onLoad=this.onLoad.bind(this),this.setCalendar=this.setCalendar.bind(this),this.updateEvent=this.updateEvent.bind(this),this.deleteEvent=this.deleteEvent.bind(this),this.getEvent=this.getEvent.bind(this),this.handleClientLoad()}catch(e){console.log(e)}}get sign(){return!!this.tokenClient}initGapiClient(){gapi.client.init({apiKey:this.config.apiKey,discoveryDocs:this.config.discoveryDocs,hosted_domain:this.config.hosted_domain}).then(()=>{this.onLoadCallback&&this.onLoadCallback()}).catch(e=>{console.log(e)})}handleClientLoad(){let e=document.createElement("script"),t=document.createElement("script");e.src="https://accounts.google.com/gsi/client",e.async=!0,e.defer=!0,t.src="https://apis.google.com/js/api.js",t.async=!0,t.defer=!0,document.body.appendChild(t),document.body.appendChild(e),t.onload=()=>{gapi.load("client",this.initGapiClient)},e.onload=()=>p(this,null,function*(){this.tokenClient=yield google.accounts.oauth2.initTokenClient({client_id:this.config.clientId,scope:this.config.scope,prompt:"",callback:()=>{}})})}handleAuthClick(){return p(this,null,function*(){return gapi&&this.tokenClient?new Promise((e,t)=>{this.tokenClient.callback=r=>{r.error?t(r):e(r)},this.tokenClient.error_callback=e=>{t(e)},null===gapi.client.getToken()?this.tokenClient.requestAccessToken({prompt:"consent"}):this.tokenClient.requestAccessToken({prompt:""})}):(console.error("Error: this.gapi not loaded"),Promise.reject(Error("Error: this.gapi not loaded")))})}setCalendar(e){this.calendar=e}onLoad(e){gapi?e():this.onLoadCallback=e}handleSignoutClick(){if(gapi){let e=gapi.client.getToken();null!==e&&(google.accounts.id.disableAutoSelect(),google.accounts.oauth2.revoke(e.access_token,()=>{}),gapi.client.setToken(null))}else console.error("Error: this.gapi not loaded")}listUpcomingEvents(e,t=this.calendar){return gapi?gapi.client.calendar.events.list({calendarId:t,timeMin:new Date().toISOString(),showDeleted:!1,singleEvents:!0,maxResults:e,orderBy:"startTime"}):(console.error("Error: this.gapi not loaded"),!1)}listEvents(e,t=this.calendar){return gapi?gapi.client.calendar.events.list(u({calendarId:t},e)):(console.error("Error: gapi not loaded"),!1)}createEventFromNow({time:e,summary:t,description:r=""},n=this.calendar,o="Europe/Paris"){let i={summary:t,description:r,start:{dateTime:new Date().toISOString(),timeZone:o},end:{dateTime:new Date(new Date().getTime()+6e4*e).toISOString(),timeZone:o}};return this.createEvent(i,n)}createEvent(e,t=this.calendar,r="none"){return gapi.client.getToken()?gapi.client.calendar.events.insert({calendarId:t,resource:e,sendUpdates:r,conferenceDataVersion:1}):(console.error("Error: this.gapi not loaded"),!1)}createEventWithVideoConference(e,t=this.calendar,r="none"){return this.createEvent(d(u({},e),{conferenceData:{createRequest:{requestId:crypto.randomUUID(),conferenceSolutionKey:{type:"hangoutsMeet"}}}}),t,r)}deleteEvent(e,t=this.calendar){return gapi?gapi.client.calendar.events.delete({calendarId:t,eventId:e}):(console.error("Error: gapi is not loaded use onLoad before please."),null)}updateEvent(e,t,r=this.calendar,n="none"){return gapi?gapi.client.calendar.events.patch({calendarId:r,eventId:t,resource:e,sendUpdates:n}):(console.error("Error: gapi is not loaded use onLoad before please."),null)}getEvent(e,t=this.calendar){return gapi?gapi.client.calendar.events.get({calendarId:t,eventId:e}):(console.error("Error: gapi is not loaded use onLoad before please."),null)}listCalendars(){return gapi?gapi.client.calendar.calendarList.list():(console.error("Error: gapi is not loaded use onLoad before please."),null)}createCalendar(e){return gapi?gapi.client.calendar.calendars.insert({summary:e}):(console.error("Error: gapi is not loaded use onLoad before please."),null)}}},8321:(e,t,r)=>{r.d(t,{Kq:()=>c,Ng:()=>z});var n=r(6540),o=n.createContext(null),i=function(e){e()},a={notify:function(){},get:function(){return[]}};function l(e,t){var r,n=a;function o(){s.onStateChange&&s.onStateChange()}function l(){if(!r){var a,l,s;r=t?t.addNestedSub(o):e.subscribe(o),a=i,l=null,s=null,n={clear:function(){l=null,s=null},notify:function(){a(function(){for(var e=l;e;)e.callback(),e=e.next})},get:function(){for(var e=[],t=l;t;)e.push(t),t=t.next;return e},subscribe:function(e){var t=!0,r=s={callback:e,next:null,prev:s};return r.prev?r.prev.next=r:l=r,function(){t&&null!==l&&(t=!1,r.next?r.next.prev=r.prev:s=r.prev,r.prev?r.prev.next=r.next:l=r.next)}}}}}var s={addNestedSub:function(e){return l(),n.subscribe(e)},notifyNestedSubs:function(){n.notify()},handleChangeWrapper:o,isSubscribed:function(){return!!r},trySubscribe:l,tryUnsubscribe:function(){r&&(r(),r=void 0,n.clear(),n=a)},getListeners:function(){return n}};return s}var s="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement?n.useLayoutEffect:n.useEffect;let c=function(e){var t=e.store,r=e.context,i=e.children,a=(0,n.useMemo)(function(){var e=l(t);return{store:t,subscription:e}},[t]),c=(0,n.useMemo)(function(){return t.getState()},[t]);return s(function(){var e=a.subscription;return e.onStateChange=e.notifyNestedSubs,e.trySubscribe(),c!==t.getState()&&e.notifyNestedSubs(),function(){e.tryUnsubscribe(),e.onStateChange=null}},[a,c]),n.createElement((r||o).Provider,{value:a},i)};var u=r(8168),d=r(8587),p=r(4146),f=r.n(p),h=r(4737),v=["getDisplayName","methodName","renderCountProp","shouldHandleStateChanges","storeKey","withRef","forwardRef","context"],m=["reactReduxForwardedRef"],g=[],b=[null,null];function y(e,t){var r=e[1];return[t.payload,r+1]}function w(e,t,r){s(function(){return e.apply(void 0,t)},r)}function S(e,t,r,n,o,i,a){e.current=n,t.current=o,r.current=!1,i.current&&(i.current=null,a())}function k(e,t,r,n,o,i,a,l,s,c){if(e){var u=!1,d=null,p=function(){if(!u){var e,r,p=t.getState();try{e=n(p,o.current)}catch(e){r=e,d=e}r||(d=null),e===i.current?a.current||s():(i.current=e,l.current=e,a.current=!0,c({type:"STORE_UPDATED",payload:{error:r}}))}};return r.onStateChange=p,r.trySubscribe(),p(),function(){if(u=!0,r.tryUnsubscribe(),r.onStateChange=null,d)throw d}}}var E=function(){return[null,0]};function A(e,t){void 0===t&&(t={});var r=t,i=r.getDisplayName,a=void 0===i?function(e){return"ConnectAdvanced("+e+")"}:i,s=r.methodName,c=void 0===s?"connectAdvanced":s,p=r.renderCountProp,A=void 0===p?void 0:p,x=r.shouldHandleStateChanges,C=void 0===x||x,P=r.storeKey,O=void 0===P?"store":P,$=(r.withRef,r.forwardRef),j=void 0!==$&&$,N=r.context,R=(0,d.A)(r,v),M=void 0===N?o:N;return function(t){var r=t.displayName||t.name||"Component",o=a(r),i=(0,u.A)({},R,{getDisplayName:a,methodName:c,renderCountProp:A,shouldHandleStateChanges:C,storeKey:O,displayName:o,wrappedComponentName:r,WrappedComponent:t}),s=R.pure,p=s?n.useMemo:function(e){return e()};function v(r){var o=(0,n.useMemo)(function(){var e=r.reactReduxForwardedRef,t=(0,d.A)(r,m);return[r.context,e,t]},[r]),a=o[0],s=o[1],c=o[2],f=(0,n.useMemo)(function(){return a&&a.Consumer&&(0,h.isContextConsumer)(n.createElement(a.Consumer,null))?a:M},[a,M]),v=(0,n.useContext)(f),A=!!r.store&&!!r.store.getState&&!!r.store.dispatch;v&&v.store;var x=A?r.store:v.store,P=(0,n.useMemo)(function(){return e(x.dispatch,i)},[x]),O=(0,n.useMemo)(function(){if(!C)return b;var e=l(x,A?null:v.subscription),t=e.notifyNestedSubs.bind(e);return[e,t]},[x,A,v]),$=O[0],j=O[1],N=(0,n.useMemo)(function(){return A?v:(0,u.A)({},v,{subscription:$})},[A,v,$]),R=(0,n.useReducer)(y,g,E),T=R[0][0],L=R[1];if(T&&T.error)throw T.error;var D=(0,n.useRef)(),B=(0,n.useRef)(c),q=(0,n.useRef)(),z=(0,n.useRef)(!1),_=p(function(){return q.current&&c===B.current?q.current:P(x.getState(),c)},[x,T,c]);w(S,[B,D,z,c,_,q,j]),w(k,[C,x,$,P,B,D,z,q,j,L],[x,$,P]);var I=(0,n.useMemo)(function(){return n.createElement(t,(0,u.A)({},_,{ref:s}))},[s,t,_]);return(0,n.useMemo)(function(){return C?n.createElement(f.Provider,{value:N},I):I},[f,I,N])}var x=s?n.memo(v):v;if(x.WrappedComponent=t,x.displayName=v.displayName=o,j){var P=n.forwardRef(function(e,t){return n.createElement(x,(0,u.A)({},e,{reactReduxForwardedRef:t}))});return P.displayName=o,P.WrappedComponent=t,f()(P,t)}return f()(x,t)}}function x(e,t){return e===t?0!==e||0!==t||1/e==1/t:e!=e&&t!=t}function C(e,t){if(x(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;var r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(var o=0;o<r.length;o++)if(!Object.prototype.hasOwnProperty.call(t,r[o])||!x(e[r[o]],t[r[o]]))return!1;return!0}function P(e){return function(t,r){var n=e(t,r);function o(){return n}return o.dependsOnOwnProps=!1,o}}function O(e){return null!==e.dependsOnOwnProps&&void 0!==e.dependsOnOwnProps?!!e.dependsOnOwnProps:1!==e.length}function $(e,t){return function(t,r){r.displayName;var n=function(e,t){return n.dependsOnOwnProps?n.mapToProps(e,t):n.mapToProps(e)};return n.dependsOnOwnProps=!0,n.mapToProps=function(t,r){n.mapToProps=e,n.dependsOnOwnProps=O(e);var o=n(t,r);return"function"==typeof o&&(n.mapToProps=o,n.dependsOnOwnProps=O(o),o=n(t,r)),o},n}}let j=[function(e){return"function"==typeof e?$(e,"mapDispatchToProps"):void 0},function(e){return e?void 0:P(function(e){return{dispatch:e}})},function(e){return e&&"object"==typeof e?P(function(t){return function(e,t){var r={};for(var n in e)!function(n){var o=e[n];"function"==typeof o&&(r[n]=function(){return t(o.apply(void 0,arguments))})}(n);return r}(e,t)}):void 0}],N=[function(e){return"function"==typeof e?$(e,"mapStateToProps"):void 0},function(e){return e?void 0:P(function(){return{}})}];function R(e,t,r){return(0,u.A)({},r,e,t)}let M=[function(e){return"function"==typeof e?function(t,r){r.displayName;var n,o=r.pure,i=r.areMergedPropsEqual,a=!1;return function(t,r,l){var s=e(t,r,l);return a?o&&i(s,n)||(n=s):(a=!0,n=s),n}}:void 0},function(e){return e?void 0:function(){return R}}];var T=["initMapStateToProps","initMapDispatchToProps","initMergeProps"];function L(e,t){var r=t.initMapStateToProps,n=t.initMapDispatchToProps,o=t.initMergeProps,i=(0,d.A)(t,T),a=r(e,i),l=n(e,i),s=o(e,i);return(i.pure?function(e,t,r,n,o){var i,a,l,s,c,u=o.areStatesEqual,d=o.areOwnPropsEqual,p=o.areStatePropsEqual,f=!1;return function(o,h){var v,m,g,b;return f?(g=!d(h,a),b=!u(o,i,h,a),(i=o,a=h,g&&b)?(l=e(i,a),t.dependsOnOwnProps&&(s=t(n,a)),c=r(l,s,a)):g?(e.dependsOnOwnProps&&(l=e(i,a)),t.dependsOnOwnProps&&(s=t(n,a)),c=r(l,s,a)):(b&&(m=!p(v=e(i,a),l),l=v,m&&(c=r(l,s,a))),c)):(l=e(i=o,a=h),s=t(n,a),c=r(l,s,a),f=!0,c)}}:function(e,t,r,n){return function(o,i){return r(e(o,i),t(n,i),i)}})(a,l,s,e,i)}var D=["pure","areStatesEqual","areOwnPropsEqual","areStatePropsEqual","areMergedPropsEqual"];function B(e,t,r){for(var n=t.length-1;n>=0;n--){var o=t[n](e);if(o)return o}return function(t,n){throw Error("Invalid value of type "+typeof e+" for "+r+" argument when connecting component "+n.wrappedComponentName+".")}}function q(e,t){return e===t}let z=function(e){var t={},r=t.connectHOC,n=void 0===r?A:r,o=t.mapStateToPropsFactories,i=void 0===o?N:o,a=t.mapDispatchToPropsFactories,l=void 0===a?j:a,s=t.mergePropsFactories,c=void 0===s?M:s,p=t.selectorFactory,f=void 0===p?L:p;return function(e,t,r,o){void 0===o&&(o={});var a=o,s=a.pure,p=a.areStatesEqual,h=a.areOwnPropsEqual,v=void 0===h?C:h,m=a.areStatePropsEqual,g=void 0===m?C:m,b=a.areMergedPropsEqual,y=void 0===b?C:b,w=(0,d.A)(a,D),S=B(e,i,"mapStateToProps"),k=B(t,l,"mapDispatchToProps"),E=B(r,c,"mergeProps");return n(f,(0,u.A)({methodName:"connect",getDisplayName:function(e){return"Connect("+e+")"},shouldHandleStateChanges:!!e,initMapStateToProps:S,initMapDispatchToProps:k,initMergeProps:E,pure:void 0===s||s,areStatesEqual:void 0===p?q:p,areOwnPropsEqual:v,areStatePropsEqual:g,areMergedPropsEqual:y},w))}}();i=r(961).unstable_batchedUpdates},8989:(e,t)=>{var r=60103,n=60106,o=60107,i=60108,a=60114,l=60109,s=60110,c=60112,u=60113,d=60120,p=60115,f=60116;if("function"==typeof Symbol&&Symbol.for){var h=Symbol.for;r=h("react.element"),n=h("react.portal"),o=h("react.fragment"),i=h("react.strict_mode"),a=h("react.profiler"),l=h("react.provider"),s=h("react.context"),c=h("react.forward_ref"),u=h("react.suspense"),d=h("react.suspense_list"),p=h("react.memo"),f=h("react.lazy"),h("react.block"),h("react.server.block"),h("react.fundamental"),h("react.debug_trace_mode"),h("react.legacy_hidden")}t.isContextConsumer=function(e){return function(e){if("object"==typeof e&&null!==e){var t=e.$$typeof;switch(t){case r:switch(e=e.type){case o:case a:case i:case u:case d:return e;default:switch(e=e&&e.$$typeof){case s:case c:case f:case p:case l:return e;default:return t}}case n:return t}}}(e)===s}},4737:(e,t,r)=>{e.exports=r(8989)},8771:(e,t,r)=>{function n(e){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach(function(t){!function(e,t,r){var o;(o=function(e,t){if("object"!=n(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,t||"default");if("object"!=n(o))return o;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"),(t="symbol"==n(o)?o:o+"")in e)?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r}(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function a(e){return"Minified Redux error #"+e+"; visit https://redux.js.org/Errors?code="+e+" for the full message or use the non-minified dev environment for full errors. "}r.d(t,{Tw:()=>h,zH:()=>p,Zz:()=>f,y$:()=>u});var l="function"==typeof Symbol&&Symbol.observable||"@@observable",s=function(){return Math.random().toString(36).substring(7).split("").join(".")},c={INIT:"@@redux/INIT"+s(),REPLACE:"@@redux/REPLACE"+s(),PROBE_UNKNOWN_ACTION:function(){return"@@redux/PROBE_UNKNOWN_ACTION"+s()}};function u(e,t,r){if("function"==typeof t&&"function"==typeof r||"function"==typeof r&&"function"==typeof arguments[3])throw Error(a(0));if("function"==typeof t&&void 0===r&&(r=t,t=void 0),void 0!==r){if("function"!=typeof r)throw Error(a(1));return r(u)(e,t)}if("function"!=typeof e)throw Error(a(2));var n,o=e,i=t,s=[],d=s,p=!1;function f(){d===s&&(d=s.slice())}function h(){if(p)throw Error(a(3));return i}function v(e){if("function"!=typeof e)throw Error(a(4));if(p)throw Error(a(5));var t=!0;return f(),d.push(e),function(){if(t){if(p)throw Error(a(6));t=!1,f();var r=d.indexOf(e);d.splice(r,1),s=null}}}function m(e){if(!function(e){if("object"!=typeof e||null===e)return!1;for(var t=e;null!==Object.getPrototypeOf(t);)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}(e))throw Error(a(7));if(void 0===e.type)throw Error(a(8));if(p)throw Error(a(9));try{p=!0,i=o(i,e)}finally{p=!1}for(var t=s=d,r=0;r<t.length;r++)(0,t[r])();return e}return m({type:c.INIT}),(n={dispatch:m,subscribe:v,getState:h,replaceReducer:function(e){if("function"!=typeof e)throw Error(a(10));o=e,m({type:c.REPLACE})}})[l]=function(){var e;return(e={subscribe:function(e){if("object"!=typeof e||null===e)throw Error(a(11));function t(){e.next&&e.next(h())}return t(),{unsubscribe:v(t)}}})[l]=function(){return this},e},n}function d(e,t){return function(){return t(e.apply(this,arguments))}}function p(e,t){if("function"==typeof e)return d(e,t);if("object"!=typeof e||null===e)throw Error(a(16));var r={};for(var n in e){var o=e[n];"function"==typeof o&&(r[n]=d(o,t))}return r}function f(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return 0===t.length?function(e){return e}:1===t.length?t[0]:t.reduce(function(e,t){return function(){return e(t.apply(void 0,arguments))}})}function h(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return function(e){return function(){var r=e.apply(void 0,arguments),n=function(){throw Error(a(15))},o={getState:r.getState,dispatch:function(){return n.apply(void 0,arguments)}},l=t.map(function(e){return e(o)});return n=f.apply(void 0,l)(r.dispatch),i(i({},r),{},{dispatch:n})}}}},2737:(e,t,r)=>{r.d(t,{Kr:()=>i,hb:()=>a});var n=r(6540);function o(e,t){var r=(0,n.useState)(function(){return{inputs:t,result:e()}})[0],o=(0,n.useRef)(!0),i=(0,n.useRef)(r),a=o.current||t&&i.current.inputs&&function(e,t){if(e.length!==t.length)return!1;for(var r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0}(t,i.current.inputs)?i.current:{inputs:t,result:e()};return(0,n.useEffect)(function(){o.current=!1,i.current=a},[a]),a.result}var i=o,a=function(e,t){return o(function(){return e},t)}}}]);