if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise(async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()})),r.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]})},r=(r,s)=>{Promise.all(r.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(r)};self.define=(r,i,t)=>{s[r]||(s[r]=Promise.resolve().then(()=>{let s={};const c={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return s;case"module":return c;default:return e(r)}})).then(e=>{const r=t(...e);return s.default||(s.default=r),s})}))}}define("./sw.js",["./workbox-468c4d03"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"./dist/../index.html",revision:"5c89b4f9ccf4029a8dd7a52c19088cb7"},{url:"./dist/boat7.svg",revision:"7cdeed812cd36d4c6dbf8d4ce826b20f"},{url:"./dist/main.2a55d2584b284d29e83f.css",revision:"8cd39fc7a91af6d06f2dcd896fbaf8c8"},{url:"./dist/main.332095d271e2edbc6215.js",revision:"4a20d333928fa2c48efc90058862e954"}],{})}));
