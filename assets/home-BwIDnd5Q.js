import{j as e,r as c,f as U,p as ee,c as le,E as re,e as ne,N as ie,h as m,d as oe,L as G,g as B,o as K,i as ce,s as de,k as f,F as pe}from"./Nav-BjssxG-_.js";import{P as he,S as F,b as xe,E as ue,C as we}from"./Section-DldjscBR.js";import{S as me}from"./SystemFeature-BKwh48tO.js";const H={start:{x:96,y:268,type:"jug",r:-8},l1:{x:66,y:226,type:"crimp",r:14},l2:{x:78,y:188,type:"crimp",r:-9},l3:{x:54,y:150,type:"crimp",r:18},l4:{x:82,y:112,type:"pinch",r:-12},c1:{x:120,y:214,type:"pinch",r:10},c2:{x:132,y:162,type:"sloper",r:-6},c3:{x:116,y:92,type:"jug",r:16},r1:{x:150,y:232,type:"crimp",r:-16},r2:{x:196,y:200,type:"jug",r:8},r3:{x:214,y:156,type:"pinch",r:-14},r4:{x:182,y:116,type:"crimp",r:12},rest:{x:140,y:66,type:"jug",r:-5},finish:{x:132,y:28,type:"jug",r:6}},se=[{x:244,y:262,type:"sloper",r:24},{x:30,y:274,type:"pinch",r:-21},{x:246,y:96,type:"crimp",r:11},{x:34,y:62,type:"jug",r:17},{x:252,y:210,type:"crimp",r:-16},{x:40,y:200,type:"sloper",r:-8}],ye=Object.keys(H).length+se.length,ge=[["start","l1","l2","l3","l4","rest","finish"],["start","c1","c2","c3","rest","finish"],["start","r1","r2","r3","r4","rest","finish"]],fe={jug:"M -13 4 C -14 -3 -9 -9 -2 -9 C 6 -10 13 -5 13 2 C 13 6 9 9 3 9 C -4 10 -12 8 -13 4 Z",crimp:"M -11 2 C -11 -2 -6 -5 0 -5 C 6 -5 11 -2 11 2 C 11 5 6 7 0 7 C -6 7 -11 5 -11 2 Z",sloper:"M -12 5 C -12 -4 -6 -10 0 -10 C 7 -10 12 -4 12 5 C 12 8 6 9 0 9 C -6 9 -12 8 -12 5 Z",pinch:"M -7 8 C -8 0 -6 -9 0 -9 C 6 -9 8 0 7 8 C 6 10 -6 10 -7 8 Z"},be=300,ke=300,Q="M 20 300 L 30 118 L 272 112 L 284 300 Z",Z="M 30 118 L 46 16 L 258 12 L 272 112 Z",te=[];for(let s=28;s<296;s+=24)for(let t=32;t<280;t+=24)te.push({x:t,y:s});function je(s){return s.map((t,i)=>`${i===0?"M":"L"} ${H[t].x} ${H[t].y}`).join(" ")}function z({hold:s,onRoute:t}){const i=fe[s.type];return e.jsxs("g",{className:`boulder-hold${t?" boulder-hold-on":" boulder-hold-off"}`,transform:`translate(${s.x} ${s.y}) rotate(${s.r})`,children:[e.jsx("path",{className:"boulder-hold-shadow",d:i,transform:"translate(0.5 2)"}),e.jsx("path",{className:"boulder-hold-body",d:i}),e.jsx("circle",{className:"boulder-bolt",cx:"0",cy:"0",r:"1.6"})]})}function ve(){return e.jsxs("figure",{className:"plate boulder",children:[e.jsx("p",{className:"plate-label",children:"Bouldering"}),e.jsxs("svg",{className:"boulder-svg",viewBox:`0 0 ${be} ${ke}`,role:"img","aria-label":`A drawn bouldering wall with ${ye} holds, and three different sequences of holds leading to the same finishing hold at the top.`,children:[e.jsx("defs",{children:e.jsxs("clipPath",{id:"boulder-face-clip",children:[e.jsx("path",{d:Q}),e.jsx("path",{d:Z})]})}),e.jsx("path",{className:"boulder-face",d:Q}),e.jsx("path",{className:"boulder-face boulder-face-upper",d:Z}),e.jsx("g",{className:"boulder-tnuts",clipPath:"url(#boulder-face-clip)","aria-hidden":"true",children:te.map(s=>e.jsx("circle",{className:"boulder-tnut",cx:s.x,cy:s.y,r:"0.9"},`${s.x}-${s.y}`))}),e.jsxs("g",{className:"boulder-seams","aria-hidden":"true",children:[e.jsx("path",{className:"boulder-seam",d:"M 30 118 L 272 112"}),e.jsx("path",{className:"boulder-seam",d:"M 24 210 L 277 206"}),e.jsx("path",{className:"boulder-seam",d:"M 150 300 L 152 116"}),e.jsx("path",{className:"boulder-seam",d:"M 152 116 L 152 14"})]}),e.jsx("g",{className:"boulder-routes","aria-hidden":"true",children:ge.map((s,t)=>e.jsx("path",{className:`boulder-path boulder-path-${t+1}`,d:je(s)},t))}),se.map(s=>e.jsx(z,{hold:s,onRoute:!1},`off-${s.x}-${s.y}`)),Object.entries(H).map(([s,t])=>e.jsx(z,{hold:t,onRoute:!0},s))]}),e.jsx("figcaption",{className:"boulder-caption",children:"One boulder, three ways up."})]})}const C=[[{id:"grave",legend:"`",sub:"~"},{id:"1",legend:"1",sub:"!"},{id:"2",legend:"2",sub:"@"},{id:"3",legend:"3",sub:"#"},{id:"4",legend:"4",sub:"$"},{id:"5",legend:"5",sub:"%"},{id:"6",legend:"6",sub:"^"},{id:"7",legend:"7",sub:"&"},{id:"8",legend:"8",sub:"*"},{id:"9",legend:"9",sub:"("},{id:"0",legend:"0",sub:")"},{id:"minus",legend:"-",sub:"_"},{id:"equal",legend:"=",sub:"+"},{id:"bksp",legend:"delete",u:2,type:"mod"},{id:"del",legend:"del",type:"mod"}],[{id:"tab",legend:"tab",u:1.5,type:"mod"},{id:"q",legend:"Q"},{id:"w",legend:"W"},{id:"e",legend:"E"},{id:"r",legend:"R"},{id:"t",legend:"T"},{id:"y",legend:"Y"},{id:"u",legend:"U"},{id:"i",legend:"I"},{id:"o",legend:"O"},{id:"p",legend:"P"},{id:"lbracket",legend:"[",sub:"{"},{id:"rbracket",legend:"]",sub:"}"},{id:"backslash",legend:"\\",u:1.5,sub:"|",type:"mod"},{id:"pgup",legend:"pg↑",type:"mod"}],[{id:"caps",legend:"caps",u:1.75,type:"mod"},{id:"a",legend:"A"},{id:"s",legend:"S"},{id:"d",legend:"D"},{id:"f",legend:"F"},{id:"g",legend:"G"},{id:"h",legend:"H"},{id:"j",legend:"J"},{id:"k",legend:"K"},{id:"l",legend:"L"},{id:"semicolon",legend:";",sub:":"},{id:"quote",legend:"'",sub:'"'},{id:"enter",legend:"return",u:2.25,type:"mod"},{id:"pgdn",legend:"pg↓",type:"mod"}],[{id:"lshift",legend:"shift",u:2.25,type:"mod"},{id:"z",legend:"Z"},{id:"x",legend:"X"},{id:"c",legend:"C"},{id:"v",legend:"V"},{id:"b",legend:"B"},{id:"n",legend:"N"},{id:"m",legend:"M"},{id:"comma",legend:",",sub:"<"},{id:"period",legend:".",sub:">"},{id:"slash",legend:"/",sub:"?"},{id:"rshift",legend:"shift",u:1.75,type:"mod"},{id:"up",legend:"↑",type:"mod"},{id:"end",legend:"end",type:"mod"}],[{id:"lctrl",legend:"ctrl",u:1.25,type:"mod"},{id:"lmeta",legend:"cmd",u:1.25,type:"mod"},{id:"lalt",legend:"alt",u:1.25,type:"mod"},{id:"space",legend:"",u:6.25},{id:"ralt",legend:"alt",u:1.25,type:"mod"},{id:"fn",legend:"fn",u:1.75,type:"mod"},{id:"left",legend:"←",type:"mod"},{id:"down",legend:"↓",type:"mod"},{id:"right",legend:"→",type:"mod"}]],q=new Map;for(const s of C)for(const t of s)t.type!=="mod"&&(t.legend.length===1&&(q.set(t.legend.toUpperCase(),t.id),t.legend!==t.legend.toUpperCase()&&q.set(t.legend,t.id)),t.sub&&t.sub.length===1&&q.set(t.sub,t.id));q.set(" ","space");const Ne=190,N=34,R=3,b=14,W=N,V=16*N,M=V+b*2,D=C.length*W+b*2,v=(()=>{const s=[];C.forEach((i,x)=>{let y=b;i.forEach((u,g)=>{const w=(u.u??1)*N-R,L=y+w/2;s.push({id:u.id,legend:u.legend,row:x,col:g,left:y/M*100,top:(b+x*W)/D*100,width:w/M*100,height:(N-R)/D*100,a11yLabel:L<b+V/2?"left":"right"}),y+=(u.u??1)*N})});const t=new Map;for(const i of s)t.set(i.legend||"space",(t.get(i.legend||"space")??0)+1);for(const i of s){const x=i.legend||"space";i.a11yLabel=(t.get(x)??0)>1?`${i.a11yLabel} ${x}`:x}return s})();function Le(s){const t=s;return!t||typeof t.tagName!="string"?!1:t.isContentEditable||t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"}function Ee(){const[s,t]=c.useState([]),[i,x]=c.useState(!1),[y,u]=c.useState(!1),[g,w]=c.useState(null),L=c.useRef(new Map),k=c.useRef([]),j=c.useCallback(a=>{t(n=>n.includes(a)?n:[...n,a])},[]),S=c.useCallback(a=>{t(n=>n.filter(l=>l!==a))},[]),T=c.useCallback(a=>{j(a);const n=L.current,l=n.get(a);l!==void 0&&window.clearTimeout(l),n.set(a,window.setTimeout(()=>{n.delete(a),S(a)},Ne))},[j,S]);c.useEffect(()=>{const a=L.current;return()=>{for(const n of a.values())window.clearTimeout(n);a.clear()}},[]);const r=c.useCallback(a=>{var $;const n=g??0,l=v[n],d=l.left+l.width/2,E=h=>v.filter(I=>I.row===h),P=h=>{const I=E(h);return I.length?I.reduce((_,O)=>Math.abs(O.left+O.width/2-d)<Math.abs(_.left+_.width/2-d)?O:_):null};let p=null;switch(a.key){case"ArrowRight":p=Math.min(n+1,v.length-1);break;case"ArrowLeft":p=Math.max(n-1,0);break;case"ArrowDown":{const h=P(Math.min(l.row+1,C.length-1));p=h?v.indexOf(h):null;break}case"ArrowUp":{const h=P(Math.max(l.row-1,0));p=h?v.indexOf(h):null;break}case"Home":p=v.indexOf(E(l.row)[0]);break;case"End":{const h=E(l.row);p=v.indexOf(h[h.length-1]);break}case"Enter":case" ":a.preventDefault(),w(n),T(l.id);return;default:return}p!==null&&(a.preventDefault(),w(p),($=k.current[p])==null||$.focus())},[g,T]),o=i||y;return c.useEffect(()=>{if(!o)return;const a=l=>{if(l.metaKey||l.ctrlKey||l.altKey||l.repeat||Le(l.target))return;const d=q.get(l.key.length===1?l.key.toUpperCase():l.key);d&&j(d)},n=l=>{const d=q.get(l.key.length===1?l.key.toUpperCase():l.key);d&&S(d)};return document.addEventListener("keydown",a),document.addEventListener("keyup",n),()=>{document.removeEventListener("keydown",a),document.removeEventListener("keyup",n),t([])}},[o,j,S]),e.jsxs("figure",{className:"kb",style:{"--kb-aspect":`${M} / ${D}`},onPointerEnter:()=>x(!0),onPointerLeave:()=>x(!1),onFocus:()=>u(!0),onBlur:a=>{a.currentTarget.contains(a.relatedTarget)||u(!1)},children:[e.jsxs("svg",{className:"kb-svg",viewBox:`0 0 ${M} ${D}`,role:"img","aria-label":"A drawn 60% keyboard. Activate a key, or type while the pointer is over it, to press that key.",children:[e.jsx("rect",{className:"kb-case",x:"1",y:"1",width:M-2,height:D-2,rx:"7"}),e.jsx("rect",{className:"kb-well",x:b-5,y:b-5,width:V+10,height:C.length*W+10,rx:"3"}),C.map((a,n)=>{let l=b;return e.jsx("g",{className:"kb-row",children:a.map(d=>{const E=(d.u??1)*N-R,P=b+n*W,p=N-R,$=s.includes(d.id),h=e.jsxs("g",{className:`kb-key${d.type==="mod"?" kb-key-mod":""}${$?" is-down":""}`,transform:`translate(${l} ${P})`,children:[e.jsx("rect",{className:"kb-cap",width:E,height:p,rx:"3.5"}),e.jsx("rect",{className:"kb-top",x:"2.5",y:"1.5",width:Math.max(E-5,2),height:Math.max(p-6,2),rx:"2.5"}),d.sub?e.jsxs(e.Fragment,{children:[e.jsx("text",{className:"kb-sub",x:"6",y:"12",children:d.sub}),e.jsx("text",{className:"kb-legend kb-legend-dual",x:"6",y:p-6,children:d.legend})]}):e.jsx("text",{className:"kb-legend",x:E/2,y:p/2+3.5,children:d.legend})]},d.id);return l+=(d.u??1)*N,h})},n)})]}),e.jsx("div",{className:"kb-hit",role:"grid","aria-label":"Keycaps. Use the arrow keys to move between keys, then Enter or Space to press one.",tabIndex:0,onFocus:a=>{a.target===a.currentTarget&&g===null&&w(0)},onKeyDown:r,children:v.map((a,n)=>e.jsx("button",{type:"button",className:"kb-hit-btn",style:{left:`${a.left}%`,top:`${a.top}%`,width:`${a.width}%`,height:`${a.height}%`},onClick:()=>{w(n),T(a.id)},tabIndex:-1,ref:l=>{k.current[n]=l},"aria-label":a.a11yLabel},a.id))}),e.jsxs("figcaption",{className:"kb-caption",children:["65% layout, drawn to unit width: 1u alphas, 1.75u caps, 6.25u space, and the right-hand column an arrow cluster needs.",""]})]})}const ae=[{series:"IVF-PQ",setting:"nprobe=32",recall:"0.9747",qps:"1229",qpsDisplay:"1,229",readout:"nprobe=32 · recall 0.9747 · 1,229 q/s · single core"},{series:"IVF-PQ",setting:"nprobe=16",recall:"0.9747",qps:"2305",qpsDisplay:"2,305",readout:"nprobe=16 · recall 0.9747 · 2,305 q/s · single core"},{series:"IVF-PQ",setting:"nprobe=8",recall:"0.9748",qps:"4110",qpsDisplay:"4,110",readout:"nprobe=8 · recall 0.9748 · 4,110 q/s · single core"},{series:"IVF-PQ",setting:"nprobe=4",recall:"0.9409",qps:"6128",qpsDisplay:"6,128",readout:"nprobe=4 · recall 0.9409 · 6,128 q/s · single core"},{series:"HNSW",setting:"ef=256",recall:"1.0000",qps:"8898",qpsDisplay:"8,898",readout:"ef=256 · recall 1.0000 · 8,898 q/s · single core"},{series:"IVF-PQ",setting:"nprobe=1",recall:"0.4850",qps:"9797",qpsDisplay:"9,797",readout:"nprobe=1 · recall 0.4850 · 9,797 q/s · single core"},{series:"HNSW",setting:"ef=128",recall:"1.0000",qps:"13514",qpsDisplay:"13,514",readout:"ef=128 · recall 1.0000 · 13,514 q/s · single core"},{series:"HNSW",setting:"ef=64",recall:"0.9964",qps:"20946",qpsDisplay:"20,946",readout:"ef=64 · recall 0.9964 · 20,946 q/s · single core"},{series:"HNSW",setting:"ef=32",recall:"0.9759",qps:"31845",qpsDisplay:"31,845",readout:"ef=32 · recall 0.9759 · 31,845 q/s · single core"},{series:"HNSW",setting:"ef=16",recall:"0.8996",qps:"47335",qpsDisplay:"47,335",readout:"ef=16 · recall 0.8996 · 47,335 q/s · single core"}],Se=ae[8],X={qpsDisplay:"971",note:"parallel, full corpus scan"},A={nDisplay:"50,000",dim:"128",k:"10"},J={name:"bench_50k_128d.txt",href:"https://github.com/iwang-1/lodestone/blob/main/benchmarks/raw/bench_50k_128d.txt"},Ce=`<svg class="sweep-plot" viewBox="0 0 680 360" role="img" aria-label="Recall at k=10 against queries per second on a log scale, drawn as a force-travel trace. HNSW is the solid trace and trades recall for throughput at a knee at ef=32; IVF-PQ is the dashed trace and holds lower throughput at comparable recall.">
  <style>
    .sweep-plot { font-family: var(--font-mono); }
    .sweep-plot .sweep-frame { fill: none; stroke: var(--rule); stroke-width: 1; }
    .sweep-plot .sweep-grid line { stroke: var(--rule-soft); stroke-width: 1; }
    .sweep-plot .sweep-axis line { stroke: var(--rule); stroke-width: 1; }
    .sweep-plot .sweep-reference { stroke: var(--ink-secondary); stroke-width: 1; stroke-dasharray: 5 4; }
    .sweep-plot .sweep-reference-label,
    .sweep-plot .sweep-tick text,
    .sweep-plot .sweep-legend text,
    .sweep-plot .sweep-oracle text,
    .sweep-plot .sweep-block text,
    .sweep-plot .sweep-samples text { font-size: 10px; letter-spacing: 0.02em; fill: var(--ink-secondary); }
    .sweep-plot .sweep-axis-title { font-size: 11px; letter-spacing: 0.09em; text-anchor: middle; fill: var(--ink-secondary); }
    .sweep-plot .sweep-tick-x text { text-anchor: middle; }
    .sweep-plot .sweep-tick-y text { text-anchor: end; }
    .sweep-plot .sweep-legend text,
    .sweep-plot .sweep-oracle text { text-anchor: start; }
    .sweep-plot .sweep-legend line { stroke: var(--ink-data); stroke-width: 2; }
    .sweep-plot .sweep-legend-ivf { stroke-dasharray: 6 4; }
    .sweep-plot .sweep-legend-oracle { fill: none; stroke: var(--ink-secondary); stroke-width: 1; }
    .sweep-plot .sweep-oracle path { fill: none; stroke: var(--ink-secondary); stroke-width: 1; }
    .sweep-plot .sweep-block rect { fill: var(--surface-figure); stroke: none; }
    .sweep-plot .sweep-block-rule { stroke: var(--rule); stroke-width: 1; }
    .sweep-plot .sweep-block-key { letter-spacing: 0.09em; }
    .sweep-plot .sweep-line { fill: none; stroke: var(--ink-data); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
    .sweep-plot .sweep-line-ivf { stroke-dasharray: 6 4; }
    .sweep-plot .sweep-samples text { text-anchor: middle; }
    .sweep-plot .sweep-label-end { text-anchor: end; }
    .sweep-plot .sweep-label-start { text-anchor: start; }
    .sweep-plot .sweep-sample circle { stroke: var(--ink-data); stroke-width: 1.5; }
    .sweep-plot .sweep-sample-hnsw circle { fill: var(--ink-data); }
    .sweep-plot .sweep-sample-ivf circle { fill: var(--surface-figure); }
    .sweep-plot .sweep-callout-ring { fill: none; stroke: var(--ink-accent); stroke-width: 1.5; }
    .sweep-plot .sweep-callout-leader { fill: none; stroke: var(--ink-accent); stroke-width: 1; }
    .sweep-plot .sweep-callout-label { font-size: 12px; letter-spacing: 0.02em; text-anchor: end; fill: var(--ink-accent); }

    /* THE WALK. A measurement cursor stepping the five HNSW samples on one
       10s linear pass, forever, in CSS, inside the SVG: no script and no SMIL,
       so it runs with JavaScript fully disabled. It is enhancement only, and every
       number it visits is already in the static markup and in the transcription
       table below the drawing, so nothing it does constitutes proof. */
    .sweep-plot .sweep-walk {
      fill: none;
      stroke: var(--ink-accent);
      stroke-width: 1.5;
      pointer-events: none;
      transform: translate(507.3px, 79.3px);
      animation: sweep-walk 10s linear infinite;
    }

    @keyframes sweep-walk {
      0%, 16.57% { transform: translate(368.6px, 69.2px); }
      16.67%, 33.23% { transform: translate(414px, 69.2px); }
      33.33%, 49.9% { transform: translate(461.7px, 70.7px); }
      50%, 66.57% { transform: translate(507.3px, 79.3px); }
      66.67%, 83.23% { transform: translate(550.4px, 111.4px); }
      83.33%, 100% { transform: translate(507.3px, 79.3px); }
    }

    /* A reader who takes over the cursor is not competing with it. Pure CSS, so
       the pause costs nothing and exists on the no-script render too. */
    .sweep:hover .sweep-plot .sweep-walk,
    .sweep:focus-within .sweep-plot .sweep-walk { animation-play-state: paused; }

    /* REDUCED MOTION: the walk stops and the cursor parks on the annotated
       default sample, which is where the static figure already points. The
       figure loses a moving dot and no evidence. */
    @media (prefers-reduced-motion: reduce) {
      .sweep-plot .sweep-walk { animation: none; transform: translate(507.3px, 79.3px); }
    }

    @media print {
      .sweep-plot .sweep-walk { display: none; }
    }

    /* Forced colours: mirrored from Sweep.css at this file's specificity, or
       these rules would paint over a user's own scheme. The two series keep
       their dash difference, which is why they are readable here at all. */
    @media (forced-colors: active) {
      .sweep-plot .sweep-reference-label,
      .sweep-plot .sweep-tick text,
      .sweep-plot .sweep-legend text,
      .sweep-plot .sweep-oracle text,
      .sweep-plot .sweep-block text,
      .sweep-plot .sweep-samples text,
      .sweep-plot .sweep-axis-title { fill: CanvasText; }
      .sweep-plot .sweep-callout-label { fill: LinkText; }
      .sweep-plot .sweep-frame,
      .sweep-plot .sweep-grid line,
      .sweep-plot .sweep-axis line,
      .sweep-plot .sweep-reference,
      .sweep-plot .sweep-line { stroke: CanvasText; }
      .sweep-plot .sweep-sample circle { fill: Canvas; stroke: CanvasText; }
      .sweep-plot .sweep-sample-hnsw circle { fill: CanvasText; }
      .sweep-plot .sweep-callout-ring,
      .sweep-plot .sweep-callout-leader,
      .sweep-plot .sweep-walk { stroke: LinkText; }
    }
  </style>

  <!-- the field: a closed frame with an interior grid, the way a datasheet
       boxes its measurement area -->
  <g class="sweep-grid">
    <line x1="92" y1="69.2" x2="596" y2="69.2" />
    <line x1="92" y1="90.2" x2="596" y2="90.2" />
    <line x1="92" y1="111.2" x2="596" y2="111.2" />
    <line x1="92" y1="153.2" x2="596" y2="153.2" />
    <line x1="92" y1="195.2" x2="596" y2="195.2" />
    <line x1="92" y1="237.2" x2="596" y2="237.2" />
    <line x1="92" y1="279.2" x2="596" y2="279.2" />
    <line x1="206.2" y1="44" x2="206.2" y2="296" />
    <line x1="305.9" y1="44" x2="305.9" y2="296" />
    <line x1="381.3" y1="44" x2="381.3" y2="296" />
    <line x1="456.7" y1="44" x2="456.7" y2="296" />
    <line x1="556.3" y1="44" x2="556.3" y2="296" />
  </g>
  <rect class="sweep-frame" x="92" y="44" width="504" height="252" />

  <!-- the reference level, dashed and named: a datasheet marks actuation and
       bottom-out this way. The fast end of the solid trace crosses BELOW it,
       which is the honest part of this figure. -->
  <line class="sweep-reference" x1="92" y1="111.2" x2="596" y2="111.2" />
  <text class="sweep-reference-label" x="100" y="124">recall 0.90 floor ·<tspan x="100" dy="11">ef=16 falls below it</tspan></text>

  <!-- inward ticks -->
  <g class="sweep-axis">
    <line x1="206.2" y1="296" x2="206.2" y2="291" />
    <line x1="305.9" y1="296" x2="305.9" y2="291" />
    <line x1="381.3" y1="296" x2="381.3" y2="291" />
    <line x1="456.7" y1="296" x2="456.7" y2="291" />
    <line x1="556.3" y1="296" x2="556.3" y2="291" />
    <line x1="92" y1="69.2" x2="97" y2="69.2" />
    <line x1="92" y1="90.2" x2="97" y2="90.2" />
    <line x1="92" y1="111.2" x2="97" y2="111.2" />
    <line x1="92" y1="153.2" x2="97" y2="153.2" />
    <line x1="92" y1="195.2" x2="97" y2="195.2" />
    <line x1="92" y1="237.2" x2="97" y2="237.2" />
    <line x1="92" y1="279.2" x2="97" y2="279.2" />
  </g>

  <g class="sweep-tick sweep-tick-x">
    <text x="206.2" y="314">2K</text>
    <text x="305.9" y="314">5K</text>
    <text x="381.3" y="314">10K</text>
    <text x="456.7" y="314">20K</text>
    <text x="556.3" y="314">50K</text>
  </g>
  <g class="sweep-tick sweep-tick-y">
    <text x="82" y="72.7">1.00</text>
    <text x="82" y="93.7">0.95</text>
    <text x="82" y="114.7">0.90</text>
    <text x="82" y="156.7">0.80</text>
    <text x="82" y="198.7">0.70</text>
    <text x="82" y="240.7">0.60</text>
    <text x="82" y="282.7">0.50</text>
  </g>
  <text class="sweep-axis-title" x="344" y="340">Throughput (queries per second, log scale)</text>
  <text class="sweep-axis-title" x="26" y="169.8" transform="rotate(-90 26 169.8)">Recall (at k=10, 0 to 1)</text>

  <!-- the legend. Rows and label strings come from LEGEND_ROWS, which the
       collision solver above also reads, so the drawn legend and the obstacle it
       represents can never be two different rectangles. -->
  <g class="sweep-legend">
    <line x1="98" y1="200" x2="112" y2="200" />
    <text x="118" y="204">HNSW m=16</text>
    <line class="sweep-legend-ivf" x1="98" y1="222" x2="112" y2="222" />
    <text x="118" y="226">IVF-PQ nlist=256 m=32</text>
    <path class="sweep-legend-oracle" d="M 98 244 L 112 244 M 105 240 L 105 248" />
    <text x="118" y="248">oracle · exact brute force</text>
  </g>

  <!-- the oracle: the thing the index is being compared against -->
  <g class="sweep-oracle">
    <path d="M 121.6 69.2 L 133.6 69.2 M 127.6 63.2 L 127.6 75.2" />
    <text x="138.6" y="64">oracle · 971 q/s exact · 48 vCPU</text>
  </g>

  <!-- the two strokes: solid is HNSW sweeping ef, dashed is IVF-PQ sweeping
       nprobe. Told apart by dash, never by hue. -->
  <path class="sweep-line sweep-line-ivf" d="M 153.2 79.8 L 221.6 79.8 L 284.5 79.8 L 328 94 L 379 285.5" />
  <path class="sweep-line sweep-line-hnsw" d="M 368.6 69.2 L 414 69.2 L 461.7 70.7 L 507.3 79.3 L 550.4 111.4" />

  <!-- the crosshair, defaulting to the annotated sample so the annotated state
       is the state the static HTML ships in. src/enhance.ts only moves it by
       rewriting --sweep-x / --sweep-y on the <figure>. -->
  <g class="sweep-crosshair" aria-hidden="true">
    <line class="sweep-crosshair-v" x1="0" y1="44" x2="0" y2="296" />
    <line class="sweep-crosshair-h" x1="92" y1="0" x2="596" y2="0" />
    <circle class="sweep-crosshair-dot" cx="0" cy="0" r="6.5" />
  </g>

  <!-- every sample carries its own plot coordinate and its own readout string,
       so src/enhance.ts needs no copy of this table and no arithmetic. Label
       positions are solved above and asserted collision-free. -->
  <g class="sweep-samples">
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="153.2" data-sweep-y="79.8" data-sweep-readout="nprobe=32 · recall 0.9747 · 1,229 q/s · single core">
      <circle cx="153.2" cy="79.8" r="4" />
      <text x="153.2" y="93.9">nprobe=32</text>
    </g>
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="221.6" data-sweep-y="79.8" data-sweep-readout="nprobe=16 · recall 0.9747 · 2,305 q/s · single core">
      <circle cx="221.6" cy="79.8" r="4" />
      <text x="221.6" y="105.9">nprobe=16</text>
    </g>
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="284.5" data-sweep-y="79.8" data-sweep-readout="nprobe=8 · recall 0.9748 · 4,110 q/s · single core">
      <circle cx="284.5" cy="79.8" r="4" />
      <text class="sweep-label-start" x="292.5" y="77.3">nprobe=8</text>
    </g>
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="328" data-sweep-y="94" data-sweep-readout="nprobe=4 · recall 0.9409 · 6,128 q/s · single core">
      <circle cx="328" cy="94" r="4" />
      <text class="sweep-label-start" x="336" y="93.5">nprobe=4</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw" data-sweep-x="368.6" data-sweep-y="69.2" data-sweep-readout="ef=256 · recall 1.0000 · 8,898 q/s · single core">
      <circle cx="368.6" cy="69.2" r="4" />
      <text x="368.6" y="105.8">ef=256</text>
    </g>
    <g class="sweep-sample sweep-sample-ivf" data-sweep-x="379" data-sweep-y="285.5" data-sweep-readout="nprobe=1 · recall 0.4850 · 9,797 q/s · single core">
      <circle cx="379" cy="285.5" r="4" />
      <text class="sweep-label-end" x="371" y="285">nprobe=1</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw" data-sweep-x="414" data-sweep-y="69.2" data-sweep-readout="ef=128 · recall 1.0000 · 13,514 q/s · single core">
      <circle cx="414" cy="69.2" r="4" />
      <text x="414" y="59.1">ef=128</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw" data-sweep-x="461.7" data-sweep-y="70.7" data-sweep-readout="ef=64 · recall 0.9964 · 20,946 q/s · single core">
      <circle cx="461.7" cy="70.7" r="4" />
      <text x="461.7" y="84.8">ef=64</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw sweep-sample-knee" data-sweep-x="507.3" data-sweep-y="79.3" data-sweep-readout="ef=32 · recall 0.9759 · 31,845 q/s · single core">
      <circle cx="507.3" cy="79.3" r="4" />
      <text x="507.3" y="67.7">ef=32</text>
    </g>
    <g class="sweep-sample sweep-sample-hnsw" data-sweep-x="550.4" data-sweep-y="111.4" data-sweep-readout="ef=16 · recall 0.8996 · 47,335 q/s · single core">
      <circle cx="550.4" cy="111.4" r="4" />
      <text x="550.4" y="125.5">ef=16</text>
    </g>
  </g>

  <!-- the walking cursor: CSS keyframes, 6 stops, 10s, no script -->
  <circle class="sweep-walk" cx="0" cy="0" r="7" aria-hidden="true" />

  <!-- the annotation, in the markup, so it is the figure's default state and
       not a hover reward -->
  <g class="sweep-callout">
    <circle class="sweep-callout-ring" cx="507.3" cy="79.3" r="8" />
    <path class="sweep-callout-leader" d="M 507.3 71.3 L 536 46 L 670 46" />
    <text class="sweep-callout-label" x="672" y="22">ef=32 · recall 0.9759 ·<tspan x="672" dy="16">31,845 q/s</tspan></text>
  </g>

  <!-- THE TITLE BLOCK, bottom-right, where a datasheet puts it: the conditions
       the trace was measured under, read from the source file's own run header.
       Backed by the plate colour so the grid does not read through it. -->
  <g class="sweep-block">
    <rect x="432" y="230" width="163" height="65" />
    <line class="sweep-block-rule" x1="432" y1="230" x2="595" y2="230" />
    <text class="sweep-block-key" x="440" y="245">Test conditions</text>
    <text x="440" y="259">n=50,000 · d=128</text>
    <text x="440" y="273">k=10 · 1 core</text>
    <text x="440" y="287">avx512 · Xeon 8488C</text>
  </g>
</svg>`;function qe(){return e.jsx("div",{className:"visually-hidden",children:e.jsxs("table",{className:"sweep-table",children:[e.jsx("caption",{children:"FIG. 03 DETAIL, as measured values: ten samples, ordered by throughput, at the source file's own precision."}),e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Index"}),e.jsx("th",{scope:"col",children:"Setting"}),e.jsxs("th",{scope:"col",children:["Recall at k=",A.k]}),e.jsx("th",{scope:"col",children:"Queries per second"})]})}),e.jsx("tbody",{children:ae.map(s=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:s.series}),e.jsx("td",{children:s.setting}),e.jsx("td",{children:s.recall}),e.jsx("td",{children:s.qpsDisplay})]},s.setting))}),e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:"Baseline"}),e.jsxs("td",{children:["exact brute force (",X.note,")"]}),e.jsx("td",{children:"exact"}),e.jsx("td",{children:X.qpsDisplay})]})})]})})}function Te(){return e.jsxs("figure",{className:"plate sweep",tabIndex:0,role:"group","aria-label":"FIG. 03 DETAIL, lodestone recall against throughput: ten measured samples. Move the pointer across the plot, or use the arrow keys, to read each sample.",children:[e.jsx("figcaption",{className:"plate-label",children:"FIG. 03 DETAIL · lodestone · recall vs throughput"}),e.jsx("p",{className:"sweep-gloss",children:"lodestone is a vector search engine I built in Rust. This is its benchmark: higher is more accurate, further right is faster, and each dot is one setting I measured."}),e.jsx("div",{className:"sweep-scroll",role:"group","aria-label":"lodestone plot, pannable — move across the figure with the arrow keys",dangerouslySetInnerHTML:{__html:Ce}}),e.jsx(qe,{}),e.jsxs("p",{className:"sweep-key","aria-hidden":"true",children:[e.jsx("span",{className:"sweep-key-item sweep-key-hnsw",children:"HNSW m=16"}),e.jsx("span",{className:"sweep-key-item sweep-key-ivf",children:"IVF-PQ nlist=256 m=32"}),e.jsx("span",{className:"sweep-key-item sweep-key-oracle",children:"oracle · exact"})]}),e.jsxs("p",{className:"sweep-readout",children:[e.jsx("span",{className:"sweep-readout-key",children:"reading"}),e.jsx("span",{className:"sweep-readout-value",children:Se.readout}),e.jsx("span",{className:"sweep-readout-hint sweep-readout-hint-fine",children:"drag across the plot · or press ← →"}),e.jsx("span",{className:"sweep-readout-hint sweep-readout-hint-coarse",children:"tap a point · drag to pan · or step"})]}),e.jsxs("p",{className:"sweep-step",children:[e.jsx("button",{type:"button",className:"sweep-step-btn","data-sweep-step":"-1","aria-label":"Previous sample",children:"←"}),e.jsx("button",{type:"button",className:"sweep-step-btn","data-sweep-step":"1","aria-label":"Next sample",children:"→"})]}),e.jsx("p",{className:"sweep-live visually-hidden","aria-live":"polite"}),e.jsxs("p",{className:"plate-footnote",children:[A.nDisplay," x ",A.dim,"-d · k=",A.k," · single core · Xeon 8488C ·"," ",e.jsxs("a",{className:"sweep-source",href:J.href,target:"_blank",rel:"noopener noreferrer",children:[J.name,e.jsx("span",{className:"visually-hidden",children:" (opens in new tab)"})]})]})]})}const Y=7e3;function Me(){const[s,t]=c.useState(!1),[i,x]=c.useState(0),[y,u]=c.useState(!1),[g,w]=c.useState(!1),L=c.useRef([]),k=U.length;c.useEffect(()=>{var r;t(!0),(r=window.matchMedia)!=null&&r.call(window,"(prefers-reduced-motion: reduce)").matches&&w(!0)},[]),c.useEffect(()=>{if(!s||y||g)return;const r=window.setTimeout(()=>{document.hidden?x(o=>o):x(o=>(o+1)%k)},Y);return()=>window.clearTimeout(r)},[s,y,g,i,k]);const j=c.useCallback((r,o=!1)=>{var a;w(!0),x(r),o&&((a=L.current[r])==null||a.focus())},[]),S=r=>{const o=r.key==="ArrowRight"?1:r.key==="ArrowLeft"?-1:0;o?(r.preventDefault(),j((i+o+k)%k,!0)):(r.key==="Home"||r.key==="End")&&(r.preventDefault(),j(r.key==="Home"?0:k-1,!0))},T=s&&!y&&!g;return e.jsxs("div",{className:s?"switcher switcher--live":"switcher",onMouseEnter:()=>u(!0),onMouseLeave:()=>u(!1),onFocus:()=>u(!0),onBlur:()=>u(!1),children:[s&&e.jsxs("div",{className:"switcher-keys",role:"tablist","aria-label":"Featured projects",onKeyDown:S,children:[U.map((r,o)=>e.jsxs("button",{ref:a=>{L.current[o]=a},type:"button",role:"tab",id:`switch-${r.id}`,"aria-selected":o===i,"aria-controls":`panel-${r.id}`,tabIndex:o===i?0:-1,className:o===i?"switch-key is-down":"switch-key",onClick:()=>j(o),children:[e.jsx("span",{className:"switch-key-title",children:r.title}),e.jsx("span",{className:"switch-key-sub",children:r.eyebrow}),o===i&&T&&e.jsx("span",{className:"switch-key-timer",style:{animationDuration:`${Y}ms`},"aria-hidden":"true"})]},r.id)),e.jsxs("a",{className:"switch-key switch-key--more",href:"/projects/#selected",children:[e.jsxs("span",{className:"switch-key-title",children:["+",ee.length," more"]}),e.jsx("span",{className:"switch-key-sub",children:"every project"})]})]}),e.jsx("div",{className:"system-list",children:U.map((r,o)=>e.jsx("div",{className:"switcher-panel",id:`panel-${r.id}`,role:s?"tabpanel":void 0,"aria-labelledby":s?`switch-${r.id}`:void 0,hidden:s&&o!==i,children:e.jsx(me,{project:r,index:o,variant:"preview",reveal:!s})},r.id))})]})}function De(){return e.jsxs(e.Fragment,{children:[e.jsx(ie,{active:"home"}),e.jsxs("main",{id:"main",className:"main-with-contact",children:[e.jsx("section",{className:"hero-band",children:e.jsx("div",{className:"hero container",children:e.jsxs("div",{className:"hero-layout",children:[e.jsxs("div",{className:"hero-lead",children:[e.jsx("p",{className:"kicker",children:m.kicker}),e.jsx("h1",{children:m.headline}),e.jsx("p",{className:"hero-subhead",children:m.subhead}),e.jsx("p",{className:"hero-availability",children:e.jsx(he,{label:m.availability})})]}),e.jsxs("div",{className:"hero-side",children:[e.jsx("p",{className:"hero-readout-lead",children:m.readoutLead}),e.jsx("div",{className:"hero-readout",role:"list",children:m.readout.map(s=>e.jsxs("div",{className:"hero-readout-row",role:"listitem",children:[e.jsxs("span",{className:"hero-readout-name",children:[e.jsx(oe,{className:"hero-readout-repo mono",href:s.href,children:s.repo}),e.jsx("span",{className:"hero-readout-what",children:s.what})]}),e.jsx("span",{className:"hero-readout-value mono",children:s.value}),e.jsxs("span",{className:"hero-readout-unit mono",children:[s.unit,s.plain?e.jsx("span",{className:"hero-readout-plain",children:s.plain}):null]})]},s.repo))})]}),e.jsxs("div",{className:"hero-tail",children:[e.jsxs("p",{className:"hero-aws",children:[m.awsLine.text," ",e.jsxs("a",{href:m.awsLine.href,children:[m.awsLine.linkText," ",e.jsx("span",{className:"arrow","aria-hidden":"true",children:"→"})]})]}),e.jsxs("div",{className:"cta-row",children:[e.jsx(G,{href:`mailto:${B.email}`,variant:"primary",children:"Email me"}),e.jsx(G,{href:B.github,external:!0,children:"GitHub"})]}),e.jsxs("p",{className:"hero-email-plain",children:[m.emailLine," · ",B.email]})]})]})})}),e.jsxs(F,{id:"systems",title:"Featured engineering work",rank:1,children:[e.jsx(Me,{}),e.jsx("div",{className:"systems-sweep",children:e.jsx(Te,{})}),e.jsx("p",{className:"section-exit",children:e.jsxs("a",{className:"mono",href:"/projects/#selected",children:[ee.length," more: developer tools, data systems, ML, NLP, statistics, and this site"," ",e.jsx("span",{className:"arrow","aria-hidden":"true",children:"→"})]})})]}),e.jsxs(F,{id:"open-source",title:K.title,rank:2,children:[e.jsx("p",{className:"hobby-intro",children:K.intro}),e.jsx("div",{className:"oss-list",children:K.items.map(s=>e.jsxs("div",{className:"skills-row",children:[e.jsxs("span",{className:"skills-label",children:[s.org," · ",s.project]}),e.jsxs("p",{className:"oss-line",children:[s.summary," ",e.jsx(xe,{label:s.status})," ",e.jsxs("a",{className:"mono",href:s.href,target:"_blank",rel:"noopener noreferrer",children:[s.linkText," ",e.jsx("span",{className:"arrow","aria-hidden":"true",children:"→"})]})]})]},s.href))})]}),e.jsxs(F,{id:"background",title:"Background",rank:2,children:[e.jsx("div",{id:"education",children:ce.map(s=>e.jsx(ue,{edu:s},s.school))}),e.jsx("div",{className:"skills-block",id:"skills",children:de.map(s=>e.jsxs("div",{className:"skills-row",children:[e.jsx("span",{className:"skills-label",children:s.label}),e.jsx("p",{className:"skills-line",children:s.items.join(" · ")})]},s.label))})]}),e.jsxs(F,{id:"off-hours",title:f.title,rank:2,children:[e.jsx("p",{className:"hobby-intro",children:f.intro}),e.jsxs("div",{className:"hobby-grid",children:[e.jsxs("div",{className:"hobby-cell",children:[e.jsx("h3",{className:"hobby-blurb",children:f.keyboards.blurb}),e.jsx("p",{className:"hobby-lead",children:f.keyboards.lead}),e.jsx(Ee,{})]}),e.jsxs("div",{className:"hobby-cell",children:[e.jsx("h3",{className:"hobby-blurb",children:f.climb.blurb}),e.jsx("p",{className:"hobby-lead",children:f.climb.lead}),e.jsx(ve,{})]}),e.jsxs("div",{className:"hobby-cell",children:[e.jsx("h3",{className:"hobby-blurb",children:f.tech.blurb}),e.jsx("p",{className:"hobby-lead",children:f.tech.lead}),e.jsxs("figure",{className:"plate feed-fig",children:[e.jsx("p",{className:"plate-label",children:"What I follow"}),e.jsx("dl",{className:"feed-list",children:f.tech.feed.map(s=>e.jsxs("div",{className:"feed-row",children:[e.jsx("dt",{children:s.topic}),e.jsx("dd",{children:s.note})]},s.topic))})]})]})]})]}),e.jsx(we,{id:"contact"})]}),e.jsx(pe,{})]})}le(document.getElementById("root")).render(e.jsx(c.StrictMode,{children:e.jsx(re,{children:e.jsx(De,{})})}));ne();
