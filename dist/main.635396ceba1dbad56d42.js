!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="./dist/",n(n.s=1)}([function(e,t,n){},function(e,t,n){"use strict";n.r(t);n(0);var o="net",r=8088,i=3;const s=0,a=1,l=2,c=3,u=4,f=5,d="абвгдежзиклмнопрст",h={0:{len:3,count:1},1:{len:2,count:2},2:{len:1,count:3}};function g(e){return e===s||e>=u?0:1}function p(e,t){return w(e,t,()=>{})}function m(e,t,n){if(!e[n])return u;const o=p(e,n),r=p(t,n);if(r===o)return function(e,t,n){if(e.length!==t.length)throw"Illegal state";for(let o=0;o<e.length;++o)if(o!==n&&e[o]!==g(t[o]))return!1;return!0}(e,t,n)?c:l;if(r<o)return a;throw"Illegal state"}function v(e,t,n,o){let r=t+n,i=0;for(;r<e.length&&r>=0;){if(!g(e[r])){e[r]===s&&o(r);break}r+=n,++i}return i}function w(e,t,n){let o=1;return o+=v(e,t,1,n),o+=v(e,t,-1,n),o}const y=["blue","red"];function E(e){for(const t of y)if(e!==t)return t;return""}function L(e){return Math.floor((e.offsetX+1)/20)}function b(e,t){t(L(e))}function C(e){return document.querySelector(e)}function D(e){e&&e.remove()}function M(e){const t=C("#field-template").content.cloneNode(!0),n=t.firstElementChild,o=n.querySelector(".frame-text");for(const e of d){const t=document.createElement("span");t.textContent=e,o.appendChild(t)}return e.appendChild(t).firstElementChild,n}function k(){let e,t;const n=new Promise((n,o)=>{e=n,t=o});return n.resolve=e,n.reject=t,n}let B=null;function A(e,t,n,o){let r=0;const i=document.querySelector(".message");n?i.classList.add("enemy"):i.classList.remove("enemy"),B&&(i.innerHTML="",clearInterval(B)),B=setInterval((function(){r<e.length?(i.innerHTML+=e.charAt(r),++r):(clearInterval(B),B=setTimeout(()=>{i.innerHTML=""},o))}),t)}function P(e){A(e,70,!1,2e3)}const T=e=>new Promise(t=>setTimeout(t,e));function _(e){const t=k();let n=null,o=0;const r=new Array(d.length).fill(0);const i=[],s=e.querySelector(".grid"),a=M(s);a.classList.add("adjust-first");const l=function(e,t){const n=e.createElement("div");return n.classList.add("shipyard"),t.appendChild(n),n}(e,s);function c(t){i.push(function(t){const n=e.createElement("div");return n.classList.add("ship"),n.style.width=20*t+"px",l.appendChild(n),{length:t,html:n}}(t)),++o}for(let[e,t]of Object.entries(h))for(let e=0;e<t.count;e++)c(t.len);function u(e,t){n={s:e,n:t};for(const e of i)e.html.classList.remove("choosen");e.html.classList.add("choosen")}for(const e of i)e.html.addEventListener("click",t=>{const n=L(t);u(e,n)});const f=a.querySelector(".river");function g(){a.classList.remove("adjust-first"),a.classList.add("adjust-third"),f.removeEventListener("click",m)}function p(i){if(null==n)return P("Выберите корабль"),!1;const s=i-n.n;if(!function(e,t,n){if(!function(e,t,n){if(t<0)return!1;const o=t-1;if(o>=0&&e[o]>0)return!1;for(let o=0;o<n;o++){const n=t+o;if(n>e.length-1)return!1;if(e[n]>0)return!1}const r=t+n;return!(r<e.length&&e[r]>0)}(e,t,n))return!1;for(let o=0;o<n;o++)e[t+o]=1;return--o,!0}(r,s,n.s.length))return P("Тесно!"),!1;const a=e.createElement("div");return a.classList.add("ship_river"),a.classList.add("diagonal-line"),a.style.width=n.s.html.style.width,a.style.left=20*s+"px",f.appendChild(a),n.s.html.classList.add("disabled"),n=null,0===o&&t.resolve({field:r,onOpponentReady:g}),!0}function m(e){b(e,p)}return f.addEventListener("click",m),{myFieldPromise:t,onOpponentReady:g,putShip:p,ships:i,choose:u}}function S(e){return function(e,t){let n=e+Math.random()*(t-e);return Math.floor(n)}(0,e)}function O(e){let t=function(e){let t=0;for(let n=0;n<e.length;n++)e[n]===s&&++t;return S(t)}(e),n=0;for(;n<e.length&&(e[n]===s&&--t,!(t<0));n++);return n}function N(e){const t=[[0,1,0,0,0,1,0,1,1,0,1,0,1,1,0,1,1,1],[0,1,0,0,1,0,1,0,1,1,0,1,1,0,1,1,1,0],[0,0,0,1,0,1,0,1,0,1,1,1,0,1,1,0,1,1],[1,0,1,0,0,0,1,0,0,1,1,0,1,1,1,0,1,1],[1,0,1,0,0,0,1,1,1,0,1,1,0,1,1,0,0,1],[1,1,1,0,1,1,0,1,1,0,1,0,1,0,0,0,0,1]];return e<0&&(e=S(t.length)),t[e]}function R(e){const t=new Array(e).fill(s);let n=-1,o=0;function r(e,t){if(n<0)return O(e);if(e[n]=t,t===a){0===o&&(o=0===S(2)?-1:1);let r=-1;return v(e,n,o,e=>{r=e}),r>=0?r:(o*=-1,v(e,n,o,e=>{r=e}),r>=0?r:(console.table("Err1",t,o,n,e),O(e)))}if(t===l)return w(e,n,t=>{e[t]=f}),o=0,O(e);if(t===u){if(0!==o){o*=-1;let r=-1;return v(e,n,o,e=>{r=e}),r>=0?r:(console.table("Err",t,o,n,e),O(e))}return O(e)}return O(e)}return{guess:function(e){return n=r(t,e),n}}}function x(){}function I(e,t,n,o,r){console.log("game begin!"),A("Игра началась",70,!1,2e3);const i={playerMove:x,enemyMove:x,meMove:x,aiMove:x,gameover:x};function f(t,n){const o=e.getElementsByClassName("overlay")[0];e.getElementsByClassName("close")[0].addEventListener("click",(function(e){e.preventDefault(),o.classList.remove("show")}),!1);o.querySelectorAll("h2")[0].textContent=t;const r=o.querySelectorAll(".content")[0];r.textContent="",n&&(r.textContent=n),o.classList.add("show")}function d(e){return i.aiMove(e)}function h(e){return i.meMove(e)}let g="blue"!==r;const p=function(e){const t=M(e);return t.classList.add("adjust-second"),t.querySelector(".river")}(e.querySelector(".grid")),v=e.querySelector(".river"),y={realField:n,guessedField:new Array(n.length).fill(s),htmlRiver:v,onOpponentMiss:h,onOpponentHit:d,isEnemy:!1},E={realField:o,guessedField:new Array(n.length).fill(s),htmlRiver:p,onOpponentMiss:d,onOpponentHit:h,isEnemy:!0};function L(e){e>=n.length?e=n.length-1:e<0&&(e=0);const t=g?y:E,o=function(e,t,n,o,r){let i=n[e];o[e]=i;const s=m(n,o,e);let a;o[e]=s,a=C(i?"#ship-template":"#dot-template2");const l=a.content.cloneNode(!0),c=l.firstElementChild;return i?t?c.classList.add("diagonal-line-enemy"):c.classList.add("diagonal-line"):t&&c.classList.add("enemy"),r.appendChild(l),c.style.left=20*e+"px",c.style.width="20px",{html:c,res:i,verdict:s}}(e,g,t.realField,t.guessedField,t.htmlRiver);var r;A(((r=o.verdict)===a?"Ранил":r===l?"Убил":r===u?"Мимо":r===c?"Победа":void 0)+"!",70,g,2e3),o.verdict===u?(g=!g,t.onOpponentMiss(o.verdict)):o.verdict===c?g?(i.gameover(!1),f("Ты проиграл","В другой раз повезет")):(i.gameover(!0),f("Победа","А ты хорош!")):(t.onOpponentHit(o.verdict),o.verdict===l&&w(t.guessedField,e,e=>{!function(e,t,n){const o=C("#dot-template").content.cloneNode(!0),r=o.firstElementChild;n&&r.classList.add("enemy"),t.appendChild(o),r.style.left=20*e+"px",r.style.width="20px"}(e,t.htmlRiver,g)}))}function D(e){g&&(L(e),i.enemyMove(e))}function k(e){g||(L(e),i.playerMove(e))}function B(e){g&&b(e,D)}return p.addEventListener("click",(function(e){g||b(e,k)})),{fireEnemy:D,firePlayer:k,on:function(e,t){i[e]=t},enableHotSeat:function(){v.addEventListener("click",B)}}}function H(e,t,n){t&&t.onOpponentReady();const o=N(-1),r=R(e.length),i=I(document,window,e,o,n||"blue");function s(e){const t=r.guess(e);setTimeout(()=>{i.fireEnemy(t)},700)}return i.on("aiMove",s),s(u),i}let F=null,q="",j="";function U(e){console.log("Stub "+e)}const G={recv:U,open:U,socket_open:U,socket_close:U};let K=null,J=!1;function X(e){const t=new RTCPeerConnection;return t.onicecandidate=function(n){t&&n&&n.candidate&&W("candidate",n.candidate,e)},K=t.createDataChannel("my channel",{negotiated:!0,id:i}),K.onmessage=function(e){G.recv(e.data)},K.onopen=function(){console.log("------ DATACHANNEL OPENED ------"),J=!0,e.close(),G.open()},K.onclose=function(){console.log("------ DC closed! ------"),J=!1},K.onerror=function(){console.log("DC ERROR!!!")},t}function W(e,t,n){const o={from:q,to:j,action:e,data:t};return console.log("Sending ["+q+"] to ["+j+"]: "+JSON.stringify(t)),n.send(JSON.stringify(o))}var Y={connect:function(e,t){F=new WebSocket(e);let n=null;F.onopen=function(e){console.log("Websocket opened"),G.socket_open(),q=t,j=E(t),W("connected",{color:q},F)},F.onclose=function(e){console.log("Websocket closed"),G.socket_close()},F.onmessage=function(e){const t=JSON.parse(e.data);t.from!==q&&(console.log("Websocket message received: "+e.data),"candidate"===t.action?function(e,t){console.log("------ PROCESSED ISE ------",e),t.addIceCandidate(new RTCIceCandidate(e)).catch(e=>{console.log(e)})}(t.data,n):"offer"===t.action?(j=t.from,n=function(e){const t=X(F);return console.log("------ PROCESSED OFFER ------"),t.setRemoteDescription(e).then(()=>t.createAnswer()).then(e=>t.setLocalDescription(e)).then(()=>(console.log("------ TRY SEND ANSWER ------"),W("answer",t.localDescription,F))).catch(e=>console.log(e)),t}(t.data)):"answer"===t.action?function(e,t){console.log("------ PROCESSED ANSWER ------"),t.setRemoteDescription(new RTCSessionDescription(e))}(t.data,n):"connected"===t.action?n=function(){const e=X(F);return e.createOffer({offerToReceiveAudio:!1,offerToReceiveVideo:!1}).then(t=>e.setLocalDescription(t)).then(()=>{console.log("------ SEND OFFER ------"),W("offer",e.localDescription,F)}).catch(e=>console.log(e)),e}():console.log("Unknown type "+t.action))},F.onerror=function(e){console.log("Websocket error")}},sendMessage:function(e){return!!K&&(J?(K.send(e),J):(console.log("Not connected"),!1))},on:function(e,t){G[e]=t}};function V(e){this.mode=Q.MODE_8BIT_BYTE,this.data=e,this.parsedData=[];for(var t=0,n=this.data.length;t<n;t++){var o=[],r=this.data.charCodeAt(t);r>65536?(o[0]=240|(1835008&r)>>>18,o[1]=128|(258048&r)>>>12,o[2]=128|(4032&r)>>>6,o[3]=128|63&r):r>2048?(o[0]=224|(61440&r)>>>12,o[1]=128|(4032&r)>>>6,o[2]=128|63&r):r>128?(o[0]=192|(1984&r)>>>6,o[1]=128|63&r):o[0]=r,this.parsedData.push(o)}this.parsedData=Array.prototype.concat.apply([],this.parsedData),this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function z(e,t){this.typeNumber=e,this.errorCorrectLevel=t,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}V.prototype={getLength:function(e){return this.parsedData.length},write:function(e){for(var t=0,n=this.parsedData.length;t<n;t++)e.put(this.parsedData[t],8)}},z.prototype={addData:function(e){var t=new V(e);this.dataList.push(t),this.dataCache=null},isDark:function(e,t){if(e<0||this.moduleCount<=e||t<0||this.moduleCount<=t)throw new Error(e+","+t);return this.modules[e][t]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(e,t){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var n=0;n<this.moduleCount;n++){this.modules[n]=new Array(this.moduleCount);for(var o=0;o<this.moduleCount;o++)this.modules[n][o]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(e,t),this.typeNumber>=7&&this.setupTypeNumber(e),null==this.dataCache&&(this.dataCache=z.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,t)},setupPositionProbePattern:function(e,t){for(var n=-1;n<=7;n++)if(!(e+n<=-1||this.moduleCount<=e+n))for(var o=-1;o<=7;o++)t+o<=-1||this.moduleCount<=t+o||(this.modules[e+n][t+o]=0<=n&&n<=6&&(0==o||6==o)||0<=o&&o<=6&&(0==n||6==n)||2<=n&&n<=4&&2<=o&&o<=4)},getBestMaskPattern:function(){for(var e=0,t=0,n=0;n<8;n++){this.makeImpl(!0,n);var o=ue.getLostPoint(this);(0==n||e>o)&&(e=o,t=n)}return t},createMovieClip:function(e,t,n){var o=e.createEmptyMovieClip(t,n);this.make();for(var r=0;r<this.modules.length;r++)for(var i=1*r,s=0;s<this.modules[r].length;s++){var a=1*s;this.modules[r][s]&&(o.beginFill(0,100),o.moveTo(a,i),o.lineTo(a+1,i),o.lineTo(a+1,i+1),o.lineTo(a,i+1),o.endFill())}return o},setupTimingPattern:function(){for(var e=8;e<this.moduleCount-8;e++)null==this.modules[e][6]&&(this.modules[e][6]=e%2==0);for(var t=8;t<this.moduleCount-8;t++)null==this.modules[6][t]&&(this.modules[6][t]=t%2==0)},setupPositionAdjustPattern:function(){for(var e=ue.getPatternPosition(this.typeNumber),t=0;t<e.length;t++)for(var n=0;n<e.length;n++){var o=e[t],r=e[n];if(null==this.modules[o][r])for(var i=-2;i<=2;i++)for(var s=-2;s<=2;s++)this.modules[o+i][r+s]=-2==i||2==i||-2==s||2==s||0==i&&0==s}},setupTypeNumber:function(e){for(var t=ue.getBCHTypeNumber(this.typeNumber),n=0;n<18;n++){var o=!e&&1==(t>>n&1);this.modules[Math.floor(n/3)][n%3+this.moduleCount-8-3]=o}for(n=0;n<18;n++){o=!e&&1==(t>>n&1);this.modules[n%3+this.moduleCount-8-3][Math.floor(n/3)]=o}},setupTypeInfo:function(e,t){for(var n=this.errorCorrectLevel<<3|t,o=ue.getBCHTypeInfo(n),r=0;r<15;r++){var i=!e&&1==(o>>r&1);r<6?this.modules[r][8]=i:r<8?this.modules[r+1][8]=i:this.modules[this.moduleCount-15+r][8]=i}for(r=0;r<15;r++){i=!e&&1==(o>>r&1);r<8?this.modules[8][this.moduleCount-r-1]=i:r<9?this.modules[8][15-r-1+1]=i:this.modules[8][15-r-1]=i}this.modules[this.moduleCount-8][8]=!e},mapData:function(e,t){for(var n=-1,o=this.moduleCount-1,r=7,i=0,s=this.moduleCount-1;s>0;s-=2)for(6==s&&s--;;){for(var a=0;a<2;a++)if(null==this.modules[o][s-a]){var l=!1;i<e.length&&(l=1==(e[i]>>>r&1)),ue.getMask(t,o,s-a)&&(l=!l),this.modules[o][s-a]=l,-1==--r&&(i++,r=7)}if((o+=n)<0||this.moduleCount<=o){o-=n,n=-n;break}}}},z.PAD0=236,z.PAD1=17,z.createData=function(e,t,n){for(var o=ge.getRSBlocks(e,t),r=new pe,i=0;i<n.length;i++){var s=n[i];r.put(s.mode,4),r.put(s.getLength(),ue.getLengthInBits(s.mode,e)),s.write(r)}var a=0;for(i=0;i<o.length;i++)a+=o[i].dataCount;if(r.getLengthInBits()>8*a)throw new Error("code length overflow. ("+r.getLengthInBits()+">"+8*a+")");for(r.getLengthInBits()+4<=8*a&&r.put(0,4);r.getLengthInBits()%8!=0;)r.putBit(!1);for(;!(r.getLengthInBits()>=8*a||(r.put(z.PAD0,8),r.getLengthInBits()>=8*a));)r.put(z.PAD1,8);return z.createBytes(r,o)},z.createBytes=function(e,t){for(var n=0,o=0,r=0,i=new Array(t.length),s=new Array(t.length),a=0;a<t.length;a++){var l=t[a].dataCount,c=t[a].totalCount-l;o=Math.max(o,l),r=Math.max(r,c),i[a]=new Array(l);for(var u=0;u<i[a].length;u++)i[a][u]=255&e.buffer[u+n];n+=l;var f=ue.getErrorCorrectPolynomial(c),d=new he(i[a],f.getLength()-1).mod(f);s[a]=new Array(f.getLength()-1);for(u=0;u<s[a].length;u++){var h=u+d.getLength()-s[a].length;s[a][u]=h>=0?d.get(h):0}}var g=0;for(u=0;u<t.length;u++)g+=t[u].totalCount;var p=new Array(g),m=0;for(u=0;u<o;u++)for(a=0;a<t.length;a++)u<i[a].length&&(p[m++]=i[a][u]);for(u=0;u<r;u++)for(a=0;a<t.length;a++)u<s[a].length&&(p[m++]=s[a][u]);return p};for(var Q={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},Z=1,$=0,ee=3,te=2,ne=0,oe=1,re=2,ie=3,se=4,ae=5,le=6,ce=7,ue={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(e){for(var t=e<<10;ue.getBCHDigit(t)-ue.getBCHDigit(ue.G15)>=0;)t^=ue.G15<<ue.getBCHDigit(t)-ue.getBCHDigit(ue.G15);return(e<<10|t)^ue.G15_MASK},getBCHTypeNumber:function(e){for(var t=e<<12;ue.getBCHDigit(t)-ue.getBCHDigit(ue.G18)>=0;)t^=ue.G18<<ue.getBCHDigit(t)-ue.getBCHDigit(ue.G18);return e<<12|t},getBCHDigit:function(e){for(var t=0;0!=e;)t++,e>>>=1;return t},getPatternPosition:function(e){return ue.PATTERN_POSITION_TABLE[e-1]},getMask:function(e,t,n){switch(e){case ne:return(t+n)%2==0;case oe:return t%2==0;case re:return n%3==0;case ie:return(t+n)%3==0;case se:return(Math.floor(t/2)+Math.floor(n/3))%2==0;case ae:return t*n%2+t*n%3==0;case le:return(t*n%2+t*n%3)%2==0;case ce:return(t*n%3+(t+n)%2)%2==0;default:throw new Error("bad maskPattern:"+e)}},getErrorCorrectPolynomial:function(e){for(var t=new he([1],0),n=0;n<e;n++)t=t.multiply(new he([1,fe.gexp(n)],0));return t},getLengthInBits:function(e,t){if(1<=t&&t<10)switch(e){case Q.MODE_NUMBER:return 10;case Q.MODE_ALPHA_NUM:return 9;case Q.MODE_8BIT_BYTE:case Q.MODE_KANJI:return 8;default:throw new Error("mode:"+e)}else if(t<27)switch(e){case Q.MODE_NUMBER:return 12;case Q.MODE_ALPHA_NUM:return 11;case Q.MODE_8BIT_BYTE:return 16;case Q.MODE_KANJI:return 10;default:throw new Error("mode:"+e)}else{if(!(t<41))throw new Error("type:"+t);switch(e){case Q.MODE_NUMBER:return 14;case Q.MODE_ALPHA_NUM:return 13;case Q.MODE_8BIT_BYTE:return 16;case Q.MODE_KANJI:return 12;default:throw new Error("mode:"+e)}}},getLostPoint:function(e){for(var t=e.getModuleCount(),n=0,o=0;o<t;o++)for(var r=0;r<t;r++){for(var i=0,s=e.isDark(o,r),a=-1;a<=1;a++)if(!(o+a<0||t<=o+a))for(var l=-1;l<=1;l++)r+l<0||t<=r+l||0==a&&0==l||s==e.isDark(o+a,r+l)&&i++;i>5&&(n+=3+i-5)}for(o=0;o<t-1;o++)for(r=0;r<t-1;r++){var c=0;e.isDark(o,r)&&c++,e.isDark(o+1,r)&&c++,e.isDark(o,r+1)&&c++,e.isDark(o+1,r+1)&&c++,0!=c&&4!=c||(n+=3)}for(o=0;o<t;o++)for(r=0;r<t-6;r++)e.isDark(o,r)&&!e.isDark(o,r+1)&&e.isDark(o,r+2)&&e.isDark(o,r+3)&&e.isDark(o,r+4)&&!e.isDark(o,r+5)&&e.isDark(o,r+6)&&(n+=40);for(r=0;r<t;r++)for(o=0;o<t-6;o++)e.isDark(o,r)&&!e.isDark(o+1,r)&&e.isDark(o+2,r)&&e.isDark(o+3,r)&&e.isDark(o+4,r)&&!e.isDark(o+5,r)&&e.isDark(o+6,r)&&(n+=40);var u=0;for(r=0;r<t;r++)for(o=0;o<t;o++)e.isDark(o,r)&&u++;return n+=10*(Math.abs(100*u/t/t-50)/5)}},fe={glog:function(e){if(e<1)throw new Error("glog("+e+")");return fe.LOG_TABLE[e]},gexp:function(e){for(;e<0;)e+=255;for(;e>=256;)e-=255;return fe.EXP_TABLE[e]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},de=0;de<8;de++)fe.EXP_TABLE[de]=1<<de;for(de=8;de<256;de++)fe.EXP_TABLE[de]=fe.EXP_TABLE[de-4]^fe.EXP_TABLE[de-5]^fe.EXP_TABLE[de-6]^fe.EXP_TABLE[de-8];for(de=0;de<255;de++)fe.LOG_TABLE[fe.EXP_TABLE[de]]=de;function he(e,t){if(null==e.length)throw new Error(e.length+"/"+t);for(var n=0;n<e.length&&0==e[n];)n++;this.num=new Array(e.length-n+t);for(var o=0;o<e.length-n;o++)this.num[o]=e[o+n]}function ge(e,t){this.totalCount=e,this.dataCount=t}function pe(){this.buffer=[],this.length=0}he.prototype={get:function(e){return this.num[e]},getLength:function(){return this.num.length},multiply:function(e){for(var t=new Array(this.getLength()+e.getLength()-1),n=0;n<this.getLength();n++)for(var o=0;o<e.getLength();o++)t[n+o]^=fe.gexp(fe.glog(this.get(n))+fe.glog(e.get(o)));return new he(t,0)},mod:function(e){if(this.getLength()-e.getLength()<0)return this;for(var t=fe.glog(this.get(0))-fe.glog(e.get(0)),n=new Array(this.getLength()),o=0;o<this.getLength();o++)n[o]=this.get(o);for(o=0;o<e.getLength();o++)n[o]^=fe.gexp(fe.glog(e.get(o))+t);return new he(n,0).mod(e)}},ge.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],ge.getRSBlocks=function(e,t){var n=ge.getRsBlockTable(e,t);if(null==n)throw new Error("bad rs block @ typeNumber:"+e+"/errorCorrectLevel:"+t);for(var o=n.length/3,r=[],i=0;i<o;i++)for(var s=n[3*i+0],a=n[3*i+1],l=n[3*i+2],c=0;c<s;c++)r.push(new ge(a,l));return r},ge.getRsBlockTable=function(e,t){switch(t){case Z:return ge.RS_BLOCK_TABLE[4*(e-1)+0];case $:return ge.RS_BLOCK_TABLE[4*(e-1)+1];case ee:return ge.RS_BLOCK_TABLE[4*(e-1)+2];case te:return ge.RS_BLOCK_TABLE[4*(e-1)+3];default:return}},pe.prototype={get:function(e){var t=Math.floor(e/8);return 1==(this.buffer[t]>>>7-e%8&1)},put:function(e,t){for(var n=0;n<t;n++)this.putBit(1==(e>>>t-n-1&1))},getLengthInBits:function(){return this.length},putBit:function(e){var t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var me=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];function ve(e){if(this.options={padding:4,width:256,height:256,typeNumber:4,color:"#000000",background:"#ffffff",ecl:"M"},"string"==typeof e&&(e={content:e}),e)for(var t in e)this.options[t]=e[t];if("string"!=typeof this.options.content)throw new Error("Expected 'content' as string!");if(0===this.options.content.length)throw new Error("Expected 'content' to be non-empty!");if(!(this.options.padding>=0))throw new Error("Expected 'padding' value to be non-negative!");if(!(this.options.width>0&&this.options.height>0))throw new Error("Expected 'width' or 'height' value to be higher than zero!");var n=this.options.content,o=function(e,t){for(var n=function(e){var t=encodeURI(e).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return t.length+(t.length!=e?3:0)}(e),o=1,r=0,i=0,s=me.length;i<=s;i++){var a=me[i];if(!a)throw new Error("Content too long: expected "+r+" but got "+n);switch(t){case"L":r=a[0];break;case"M":r=a[1];break;case"Q":r=a[2];break;case"H":r=a[3];break;default:throw new Error("Unknwon error correction level: "+t)}if(n<=r)break;o++}if(o>me.length)throw new Error("Content too long");return o}(n,this.options.ecl),r=function(e){switch(e){case"L":return Z;case"M":return $;case"Q":return ee;case"H":return te;default:throw new Error("Unknwon error correction level: "+e)}}(this.options.ecl);this.qrcode=new z(o,r),this.qrcode.addData(n),this.qrcode.make()}ve.prototype.svg=function(e){var t=this.options||{},n=this.qrcode.modules;void 0===e&&(e={container:t.container||"svg"});for(var o=void 0===t.pretty||!!t.pretty,r=o?"  ":"",i=o?"\r\n":"",s=t.width,a=t.height,l=n.length,c=s/(l+2*t.padding),u=a/(l+2*t.padding),f=void 0!==t.join&&!!t.join,d=void 0!==t.swap&&!!t.swap,h=void 0===t.xmlDeclaration||!!t.xmlDeclaration,g=void 0!==t.predefined&&!!t.predefined,p=g?r+'<defs><path id="qrmodule" d="M0 0 h'+u+" v"+c+' H0 z" style="fill:'+t.color+';shape-rendering:crispEdges;" /></defs>'+i:"",m=r+'<rect x="0" y="0" width="'+s+'" height="'+a+'" style="fill:'+t.background+';shape-rendering:crispEdges;"/>'+i,v="",w="",y=0;y<l;y++)for(var E=0;E<l;E++){if(n[E][y]){var L=E*c+t.padding*c,b=y*u+t.padding*u;if(d){var C=L;L=b,b=C}if(f){var D=c+L,M=u+b;L=Number.isInteger(L)?Number(L):L.toFixed(2),b=Number.isInteger(b)?Number(b):b.toFixed(2),D=Number.isInteger(D)?Number(D):D.toFixed(2),w+="M"+L+","+b+" V"+(M=Number.isInteger(M)?Number(M):M.toFixed(2))+" H"+D+" V"+b+" H"+L+" Z "}else v+=g?r+'<use x="'+L.toString()+'" y="'+b.toString()+'" href="#qrmodule" />'+i:r+'<rect x="'+L.toString()+'" y="'+b.toString()+'" width="'+c+'" height="'+u+'" style="fill:'+t.color+';shape-rendering:crispEdges;"/>'+i}}f&&(v=r+'<path x="0" y="0" style="fill:'+t.color+';shape-rendering:crispEdges;" d="'+w+'" />');var k="";switch(e.container){case"svg":h&&(k+='<?xml version="1.0" standalone="yes"?>'+i),k+='<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+s+'" height="'+a+'">'+i,k+=p+m+v,k+="</svg>";break;case"svg-viewbox":h&&(k+='<?xml version="1.0" standalone="yes"?>'+i),k+='<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 '+s+" "+a+'">'+i,k+=p+m+v,k+="</svg>";break;case"g":k+='<g width="'+s+'" height="'+a+'">'+i,k+=p+m+v,k+="</g>";break;default:k+=(p+m+v).replace(/^\s+/,"")}return k};var we={render:function(e){const t=new ve({content:e,container:"svg-viewbox",join:!0}).svg(),n=document.querySelector(".qrcode");return n.innerHTML=t,function(e){let t=!1;e.addEventListener("click",(function(){t=!t,t?e.classList.add("big"):e.classList.remove("big")}))}(n),n}};function ye(e,t){const n={method:t};return n[t]=e,JSON.stringify(n)}var Ee={parser:function(e,t,n){const o=JSON.parse(e),r=o[o.method];return o.method===t&&n(r),r},toMove:function(e){return ye(e,"move")},toField:function(e){return ye(e,"field")}};function Le(){const e=window.location.hostname,t=window.location.search,n=new URLSearchParams(t),o=n.get("color")||"blue",i=!!n.get("forceAi");let s=!n.get("color")||"red"===n.get("color")||i;const a=function(e,t){return"https:"===window.location.protocol?null:e?"ws://"+e:"ws://"+t+":"+r}(n.get("wh"),e);let l=n.get("sh")||window.location.href,c=null,u=!1,f=null;const d=k(),h=k(),g=_(document);if(!i&&!!a){Y.on("socket_open",()=>{const e=new URL(l);e.searchParams.set("color",E(o)),c=we.render(e.toString())}),Y.on("socket_close",()=>{D(c)});try{Y.connect(a,o)}catch(e){s=!0,console.log(e)}Y.on("open",()=>{s=!1}),Y.on("recv",e=>{Ee.parser(e,"field",e=>{console.log("enemy field ready"),u||d.resolve(e),u=!0}),Ee.parser(e,"move",e=>{console.log("Enemy try to move "+e),f.fireEnemy(e)})})}return g.myFieldPromise.then(e=>{const t=e.field;if(s)D(c),f=H(t,e,o),h.resolve(f);else{A("Ждем оппонента",70,!1,1e5);const n=Y.sendMessage(Ee.toField(t));d.then(r=>{if(!n){Y.sendMessage(Ee.toField(t))&&console.log("Smth strange")}e.onOpponentReady(),f=I(document,window,t,r,o),f.on("playerMove",e=>Y.sendMessage(Ee.toMove(e))),h.resolve(f)})}}),{myField:g,getBattle:function(){return h}}}function be(){const e=N(1),t=R(e.length),n=window.location.hostname,o=window.location.search,i=new URLSearchParams(o).get("color")||"blue",s=I(document,window,e,e,i);console.log(n),Y.connect(function(e){let t="ws://";return"https:"===window.location.protocol&&(t="wss://"),t+e}(n+":"+r),i),s.on("aiMove",(function(e){const n=t.guess(e);console.log("ai move "+n)})),Y.on("recv",e=>{console.log("recieved",e),Ee.parser(e,"move",e=>{s.fireEnemy(e)})}),s.on("playerMove",e=>Y.sendMessage(Ee.toMove(e)))}function Ce(){const e=_(document),t=k();return e.myFieldPromise.then(e=>{const n=H(e.field,e,"blue");t.resolve(n)}),{myField:e,getBattle:function(){return t}}}function De(e,t){let n=-1,o=-1;for(let r=0;r<e.length;r++)if(1===e[r]&&(n<0&&(n=r),o=-1),0===e[r])if(o<0){if(o=r,n>=0&&o-n===t)return n;n=-1}else o=-1,n=-1;return n}function Me(e,t,n){for(let o=t;o<t+n+1;o++)e[o]=0}const ke=function(e){let t=null;switch(e){case"ai":t=Ce();break;case"fake":be();break;case"net":t=Le();break;case"hostseat":t=Ce(),t.getBattle().then(e=>e.enableHotSeat())}return t}(o);!function(e){const t=document.querySelector(".secret-code2");let n=0;t.addEventListener("click",(async function(e){++n,n>=3&&(window.location.href="https://asavan.github.io/")}))}(),ke&&ke.myField&&function(e){const t=document.querySelector(".secret-code");let n=0,o=!1,r=!1;const i=N(-1);t.addEventListener("click",(async function(t){if(++n,n>=3&&(n=0,o?r=!0:(await async function(e,t){const n=e.ships;for(const o of n){e.choose(o,0),await T(500);const n=De(t,o.length);e.putShip(n)?Me(t,n,o.length):console.log(t,n,o.length),await T(200)}}(e,i),o=!0)),r){R(i.length)}}))}(ke.myField),ke.getBattle().then(e=>{e.on("gameover",e=>{document.querySelector(".butInstall").classList.remove("hidden2")})}),"serviceWorker"in navigator&&(navigator.serviceWorker.register("./sw.js",{scope:"./"}),function(e,t){const n=t.querySelector(".butInstall");let o;n.addEventListener("click",e=>{n.classList.add("hidden"),o.prompt(),o.userChoice.then(e=>{console.log(JSON.stringify(e))})}),e.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),o=e,n.classList.remove("hidden")})}(window,document))}]);