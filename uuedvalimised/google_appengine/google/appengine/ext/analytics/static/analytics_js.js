/* Copyright 2008-9 Google Inc. All Rights Reserved. */ (function(){var l=void 0,m=!0,n=null,q=!1,r,s=this,t=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&
!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},u=function(a){return"string"==typeof a},v="closure_uid_"+Math.floor(2147483648*Math.random()).toString(36),w=0,aa=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=Array.prototype.slice.call(arguments);b.unshift.apply(b,c);return a.apply(this,b)}},y=function(a,b){var c=a.split("."),d=s;!(c[0]in d)&&d.execScript&&d.execScript("var "+
c[0]);for(var f;c.length&&(f=c.shift());)!c.length&&b!==l?d[f]=b:d=d[f]?d[f]:d[f]={}},z=function(a,b){function c(){}c.prototype=b.prototype;a.o=b.prototype;a.prototype=new c};var A=function(a){Error.captureStackTrace?Error.captureStackTrace(this,A):this.stack=Error().stack||"";a&&(this.message=String(a))};z(A,Error);var ba=function(a,b){for(var c=1;c<arguments.length;c++){var d=String(arguments[c]).replace(/\$/g,"$$$$");a=a.replace(/\%s/,d)}return a};var ca=function(a,b){b.unshift(a);A.call(this,ba.apply(n,b));b.shift()};z(ca,A);var B=function(a,b,c){if(!a){var d=Array.prototype.slice.call(arguments,2),f="Assertion failed";if(b)var f=f+(": "+b),e=d;throw new ca(""+f,e||[]);}};var C=Array.prototype,D=C.indexOf?function(a,b,c){B(a.length!=n);return C.indexOf.call(a,b,c)}:function(a,b,c){c=c==n?0:0>c?Math.max(0,a.length+c):c;if(u(a))return!u(b)||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},da=C.forEach?function(a,b,c){B(a.length!=n);C.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,f=u(a)?a.split(""):a,e=0;e<d;e++)e in f&&b.call(c,f[e],e,a)},ea=C.filter?function(a,b,c){B(a.length!=n);return C.filter.call(a,b,c)}:function(a,
b,c){for(var d=a.length,f=[],e=0,g=u(a)?a.split(""):a,h=0;h<d;h++)if(h in g){var i=g[h];b.call(c,i,h,a)&&(f[e++]=i)}return f},fa=function(a,b,c){B(a.length!=n);return 2>=arguments.length?C.slice.call(a,b):C.slice.call(a,b,c)};var E,F,G,H,ga=function(){return s.navigator?s.navigator.userAgent:n};H=G=F=E=q;var I;if(I=ga()){var ha=s.navigator;E=0==I.indexOf("Opera");F=!E&&-1!=I.indexOf("MSIE");G=!E&&-1!=I.indexOf("WebKit");H=!E&&!G&&"Gecko"==ha.product}var ia=E,J=F,K=H,L=G,ja=function(){var a=s.document;return a?a.documentMode:l},M;
a:{var N="",O;if(ia&&s.opera)var P=s.opera.version,N="function"==typeof P?P():P;else if(K?O=/rv\:([^\);]+)(\)|;)/:J?O=/MSIE\s+([^\);]+)(\)|;)/:L&&(O=/WebKit\/(\S+)/),O)var ka=O.exec(ga()),N=ka?ka[1]:"";if(J){var la=ja();if(la>parseFloat(N)){M=String(la);break a}}M=N}
var ma=M,na={},Q=function(a){var b;if(!(b=na[a])){b=0;for(var c=String(ma).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),d=String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g,"").split("."),f=Math.max(c.length,d.length),e=0;0==b&&e<f;e++){var g=c[e]||"",h=d[e]||"",i=RegExp("(\\d*)(\\D*)","g"),j=RegExp("(\\d*)(\\D*)","g");do{var k=i.exec(g)||["","",""],p=j.exec(h)||["","",""];if(0==k[0].length&&0==p[0].length)break;b=((0==k[1].length?0:parseInt(k[1],10))<(0==p[1].length?0:parseInt(p[1],10))?-1:(0==k[1].length?
0:parseInt(k[1],10))>(0==p[1].length?0:parseInt(p[1],10))?1:0)||((0==k[2].length)<(0==p[2].length)?-1:(0==k[2].length)>(0==p[2].length)?1:0)||(k[2]<p[2]?-1:k[2]>p[2]?1:0)}while(0==b)}b=na[a]=0<=b}return b},oa=s.document,pa=!oa||!J?l:ja()||("CSS1Compat"==oa.compatMode?parseInt(ma,10):5);!K&&!J||J&&J&&9<=pa||K&&Q("1.9.1");J&&Q("9");var qa=function(a){a=a.className;return u(a)&&a.match(/\S+/g)||[]},ra=function(a,b){for(var c=qa(a),d=fa(arguments,1),f=c,e=0;e<d.length;e++)0<=D(f,d[e])||f.push(d[e]);a.className=c.join(" ")},sa=function(a,b){var c=qa(a),d=fa(arguments,1),c=ea(c,function(a){return!(0<=D(d,a))});a.className=c.join(" ")};var R=function(a,b,c){var d=document;c=c||d;a=a&&"*"!=a?a.toUpperCase():"";if(c.querySelectorAll&&c.querySelector&&(a||b))return c.querySelectorAll(a+(b?"."+b:""));if(b&&c.getElementsByClassName){c=c.getElementsByClassName(b);if(a){for(var d={},f=0,e=0,g;g=c[e];e++)a==g.nodeName&&(d[f++]=g);d.length=f;return d}return c}c=c.getElementsByTagName(a||"*");if(b){d={};for(e=f=0;g=c[e];e++)a=g.className,"function"==typeof a.split&&0<=D(a.split(/\s+/),b)&&(d[f++]=g);d.length=f;return d}return c};var T=function(a){T[" "](a);return a};T[" "]=function(){};var ta=!J||J&&9<=pa,ua=J&&!Q("9");!L||Q("528");K&&Q("1.9b")||J&&Q("8")||ia&&Q("9.5")||L&&Q("528");K&&!Q("8")||J&&Q("9");var U=function(a,b){this.type=a;this.currentTarget=this.target=b};U.prototype.h=q;U.prototype.defaultPrevented=q;U.prototype.preventDefault=function(){this.defaultPrevented=m};var V=function(a,b){a&&this.e(a,b)};z(V,U);r=V.prototype;r.target=n;r.relatedTarget=n;r.offsetX=0;r.offsetY=0;r.clientX=0;r.clientY=0;r.screenX=0;r.screenY=0;r.button=0;r.keyCode=0;r.charCode=0;r.ctrlKey=q;r.altKey=q;r.shiftKey=q;r.metaKey=q;r.m=n;
r.e=function(a,b){var c=this.type=a.type;U.call(this,c);this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(K){var f;a:{try{T(d.nodeName);f=m;break a}catch(e){}f=q}f||(d=n)}}else"mouseover"==c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=L||a.offsetX!==l?a.offsetX:a.layerX;this.offsetY=L||a.offsetY!==l?a.offsetY:a.layerY;this.clientX=a.clientX!==l?a.clientX:a.pageX;this.clientY=a.clientY!==l?a.clientY:a.pageY;this.screenX=a.screenX||
0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.m=a;a.defaultPrevented&&this.preventDefault();delete this.h};
r.preventDefault=function(){V.o.preventDefault.call(this);var a=this.m;if(a.preventDefault)a.preventDefault();else if(a.returnValue=q,ua)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var va=function(){},wa=0;r=va.prototype;r.key=0;r.c=q;r.g=q;r.e=function(a,b,c,d,f,e){if("function"==t(a))this.l=m;else if(a&&a.handleEvent&&"function"==t(a.handleEvent))this.l=q;else throw Error("Invalid listener argument");this.d=a;this.j=b;this.src=c;this.type=d;this.capture=!!f;this.i=e;this.g=q;this.key=++wa;this.c=q};r.handleEvent=function(a){return this.l?this.d.call(this.i||this.src,a):this.d.handleEvent.call(this.d,a)};var W={},X={},Y={},Z={},xa=function(a,b,c,d,f){if("array"==t(b))for(var e=0;e<b.length;e++)xa(a,b[e],c,d,f);else a:{if(!b)throw Error("Invalid event type");d=!!d;var g=X;b in g||(g[b]={a:0,b:0});g=g[b];d in g||(g[d]={a:0,b:0},g.a++);var g=g[d],e=a[v]||(a[v]=++w),h;g.b++;if(g[e]){h=g[e];for(var i=0;i<h.length;i++)if(g=h[i],g.d==c&&g.i==f){if(g.c)break;break a}}else h=g[e]=[],g.a++;var j=ya,k=ta?function(a){return j.call(k.src,k.key,a)}:function(a){a=j.call(k.src,k.key,a);if(!a)return a},i=k;i.src=
a;g=new va;g.e(c,i,a,b,d,f);g.g=m;c=g.key;i.key=c;h.push(g);W[c]=g;Y[e]||(Y[e]=[]);Y[e].push(g);a.addEventListener?(a==s||!a.n)&&a.addEventListener(b,i,d):a.attachEvent(b in Z?Z[b]:Z[b]="on"+b,i)}},za=function(a,b,c,d){if(!d.f&&d.k){for(var f=0,e=0;f<d.length;f++)d[f].c?d[f].j.src=n:(f!=e&&(d[e]=d[f]),e++);d.length=e;d.k=q;0==e&&(delete X[a][b][c],X[a][b].a--,0==X[a][b].a&&(delete X[a][b],X[a].a--),0==X[a].a&&delete X[a])}},Ba=function(a,b,c,d,f){var e=1;b=b[v]||(b[v]=++w);if(a[b]){a.b--;a=a[b];a.f?
a.f++:a.f=1;try{for(var g=a.length,h=0;h<g;h++){var i=a[h];i&&!i.c&&(e&=Aa(i,f)!==q)}}finally{a.f--,za(c,d,b,a)}}return Boolean(e)},Aa=function(a,b){if(a.g){var c=a.key;if(W[c]){var d=W[c];if(!d.c){var f=d.src,e=d.type,g=d.j,h=d.capture;f.removeEventListener?(f==s||!f.n)&&f.removeEventListener(e,g,h):f.detachEvent&&f.detachEvent(e in Z?Z[e]:Z[e]="on"+e,g);f=f[v]||(f[v]=++w);if(Y[f]){var g=Y[f],i=D(g,d);0<=i&&(B(g.length!=n),C.splice.call(g,i,1));0==g.length&&delete Y[f]}d.c=m;if(d=X[e][h][f])d.k=
m,za(e,h,f,d);delete W[c]}}}return a.handleEvent(b)},ya=function(a,b){if(!W[a])return m;var c=W[a],d=c.type,f=X;if(!(d in f))return m;var f=f[d],e,g;if(!ta){var h;if(!(h=b))a:{h=["window","event"];for(var i=s;e=h.shift();)if(i[e]!=n)i=i[e];else{h=n;break a}h=i}e=h;h=m in f;i=q in f;if(h){if(0>e.keyCode||e.returnValue!=l)return m;a:{var j=q;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(k){j=m}if(j||e.returnValue==l)e.returnValue=m}}j=new V;j.e(e,this);e=m;try{if(h){for(var p=[],S=j.currentTarget;S;S=
S.parentNode)p.push(S);g=f[m];g.b=g.a;for(var x=p.length-1;!j.h&&0<=x&&g.b;x--)j.currentTarget=p[x],e&=Ba(g,p[x],d,m,j);if(i){g=f[q];g.b=g.a;for(x=0;!j.h&&x<p.length&&g.b;x++)j.currentTarget=p[x],e&=Ba(g,p[x],d,q,j)}}else e=Aa(c,j)}finally{p&&(p.length=0)}return e}d=new V(b,this);return e=Aa(c,d)};var $=function(){};$.p=function(){$.q||($.q=new $)};$.p();J||L&&Q("525");y("ae.init",function(){var a=u("ae-content")?document.getElementById("ae-content"):"ae-content";if(a)for(var a=R("table","ae-table-striped",a),b=0,c;c=a[b];b++){c=R("tbody",n,c);for(var d=0,f;f=c[d];d++){f=R("tr",n,f);for(var e=0,g;g=f[e];e++)e%2&&ra(g,"ae-even")}}a=R(n,"ae-noscript",l);b=a.length;if(0<b){c=Array(b);for(d=0;d<b;d++)c[d]=a[d];a=c}else a=[];da(a,function(a){sa(a,"ae-noscript")});xa(window,"load",function(){});s._gaq=s._gaq||[];s._gaq.push(function(){s._gaq._createAsyncTracker("UA-3739047-3",
"ae")._trackPageview()});a=document.createElement("script");a.src=("https:"==document.location.protocol?"https://ssl":"http://www")+".google-analytics.com/ga.js";a.setAttribute("async","true");document.documentElement.firstChild.appendChild(a)});y("ae.trackPageView",function(){s._gaq&&s._gaq._getAsyncTracker("ae")._trackPageview()});var Da=function(a){if(a==l||a==n||0==a.length)return 0;a=Math.max.apply(Math,a);return Ca(a)},Ca=function(a){var b=5;2>b&&(b=2);b-=1;return Math.ceil(a/b)*b},Ea=function(a,b,c){a=a.getSelection();1==a.length&&(a=a[0],a.row!=n&&(b.starttime!=n&&(c+="&starttime="+b.starttime),b.endtime!=n&&(c+="&endtime="+b.endtime),b.latency_lower!=n&&(c+="&latency_lower="+b.latency_lower),b.latency_upper!=n&&(c+="&latency_upper="+b.latency_upper),b=c+"&detail="+a.row,window.location.href=b))},Fa=function(a,b,c,d,
f){var e=new google.visualization.DataTable;e.addColumn("string","");e.addColumn("number","");e.addColumn({type:"string",role:"tooltip"});for(var g=0;g<b.length;g++)e.addRow(["",b[g],c[g]]);c=Math.max(10*b.length,200);b=Da(b);a=new google.visualization.ColumnChart(document.getElementById("rpctime-"+a));a.draw(e,{height:100,width:c,legend:"none",chartArea:{left:40},fontSize:11,vAxis:{minValue:0,maxValue:b,gridlines:{count:5}}});google.visualization.events.addListener(a,"select",aa(Ea,a,d,f))};
y("ae.Charts.latencyHistogram",function(a,b,c){var d=new google.visualization.DataTable;d.addColumn("string","");d.addColumn("number","");for(var f=0;f<b.length;f++)d.addRow([""+a[f],b[f]]);for(f=b.length;f<a.length;f++)d.addRow([""+a[f],0]);b=Da(b);(new google.visualization.ColumnChart(document.getElementById("latency-"+c))).draw(d,{legend:"none",width:20*a.length,height:200,vAxis:{maxValue:b,gridlines:{count:5}}})});
y("ae.Charts.latencyTimestampScatter",function(a,b,c,d,f){var e=new google.visualization.DataTable;e.addColumn("number","Time (seconds from start)");e.addColumn("number","Latency");for(var g=0;g<a.length;g++){var h=Math.round(a[g]-c);e.addRow([h,b[g]])}a=d.starttime?d.starttime:0;b=new google.visualization.ScatterChart(document.getElementById("LatencyVsTimestamp"));b.draw(e,{hAxis:{title:"Time (seconds from start of recording)",minValue:a},vAxis:{title:"Request Latency (milliseconds)",minValue:0},
tooltip:{trigger:"none"},legend:"none"});google.visualization.events.addListener(b,"select",aa(Ea,b,d,f))});
y("ae.Charts.entityCountBarChart",function(a,b,c,d){var f=new google.visualization.DataTable;f.addColumn("string","");f.addColumn("number","Reads");f.addColumn({type:"string",role:"tooltip"});f.addColumn("number","Misses");f.addColumn({type:"string",role:"tooltip"});f.addColumn("number","Writes");f.addColumn({type:"string",role:"tooltip"});var e=50;e>b.length&&(e=b.length);for(var g=0;g<e;g++)f.addRow(["",b[g][1]-b[g][3],b[g][0],b[g][3],b[g][0],b[g][2],b[g][0]]);b=20*e;e=b+130;a=new google.visualization.ColumnChart(document.getElementById(d+
"-"+a));c=Ca(c);a.draw(f,{height:100,width:e,chartArea:{width:b},fontSize:10,isStacked:m,vAxis:{minValue:0,maxValue:c,gridlines:{count:5}}})});
y("ae.Charts.rpcVariationCandlestick",function(a){var b=new google.visualization.DataTable;b.addColumn("string","");b.addColumn("number","");b.addColumn("number","");b.addColumn("number","");b.addColumn("number","");b.addRows(a);(new google.visualization.CandlestickChart(document.getElementById("rpcvariation"))).draw(b,{vAxis:{title:"RPC Latency variation (milliseconds)"},hAxis:{textPosition:"out",slantedText:m,slantedTextAngle:45,textStyle:{fontSize:13}},height:250,chartArea:{top:10,height:100},
legend:"none",tooltip:{trigger:"none"}})});y("ae.Charts.totalTimeBarChart",function(a,b,c,d){for(var f=[],e=0;e<b.length;e++)f[e]=b[e]+" milliseconds";Fa(a,b,f,c,d)});y("ae.Charts.rpcTimeBarChart",function(a,b,c,d,f){var e=[],g=[],h=c.indices,i=c.times;c=c.stats;for(var j=0;j<b;j++)e[j]=0,g[j]=n;for(j=0;j<h.length;j++){e[h[j]]=i[j];b=c[j];var k="Calls: "+b[0];if(0<b[1]||0<b[2]||0<b[3])k+=" Entities";0<b[1]&&(k+=" R:"+b[1]);0<b[2]&&(k+=" W:"+b[2]);0<b[3]&&(k+=" M:"+b[3]);g[h[j]]=k}Fa(a,e,g,d,f)});})();