/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("jquery.sap.history",false);jQuery.sap.require("jquery.sap.strings");(function($,w){var s="_skip",r=/\|id-[0-9]+-[0-9]+/,a=new RegExp(s+"[0-9]*$"),b=[],h=[],S={},c=0,d=undefined,I="|",H=[],e=false,f,g=false;$.sap.history=function(z){if(!jQuery.isPlainObject(z)){return}if(!g){var W=$(w),A=(w.location.href.split("#")[1]||"");W.bind('hashchange',k);if($.isArray(z.routes)){var i,B;for(i=0;i<z.routes.length;i++){B=z.routes[i];if(B.path&&B.handler){$.sap.history.addRoute(B.path,B.handler)}}}if(jQuery.isFunction(z.defaultHandler)){f=z.defaultHandler}h.push(A);if(A.length>1){W.trigger("hashchange",[true])}else{d=A}g=true}};$.sap.history.addHistory=function(i,z,B,V){var A,C;if(B===undefined){B=true}if(!V){C=n(i,z);A=o(C);if(A){C+=(I+A)}C+=(I+(B?"1":"0"))}else{C=m(d)}H.push(C);S[C]=true;w.location.hash=C;return C};$.sap.history.addVirtualHistory=function(){$.sap.history.addHistory("",undefined,false,true)};$.sap.history.addRoute=function(i,z,T){if(T){z=jQuery.proxy(z,T)}var R={};R.sIdentifier=i;R['action']=z;b.push(R);return this};$.sap.history.setDefaultHandler=function(i){f=i};$.sap.history.getDefaultHandler=function(){return f};$.sap.history.backToHash=function(i){i=i||"";var z;if(h.length===1){if($.isFunction(f)){f()}}else{z=j(d,i);if(z<0){w.history.go(z)}else{jQuery.sap.log.error("jQuery.sap.history.backToHash: "+i+"is not in the history stack or it's after the current hash")}}};$.sap.history.backThroughPath=function(P){P=P||"";P=w.encodeURIComponent(P);var i;if(h.length===1){if($.isFunction(f)){f()}}else{i=j(d,P,true);if(i<0){w.history.go(i)}else{jQuery.sap.log.error("jQuery.sap.history.backThroughPath: there's no history state which has the "+P+" identifier in the history stack before the current hash")}}};$.sap.history.back=function(i){if(h.length===1){if($.isFunction(f)){f($.sap.history.NavType.Back)}}else{if(!i){i=1}w.history.go(-1*i)}};$.sap.history.NavType={};$.sap.history.NavType.Back="_back";$.sap.history.NavType.Forward="_forward";$.sap.history.NavType.Bookmark="_bookmark";$.sap.history.NavType.Unknown="_unknown";function j(C,T,P){var z=$.inArray(C,h),A,i,B;if(z>0){if(P){for(i=z-1;i>=0;i--){B=h[i];if(B.indexOf(T)===0&&!t(B)){return i-z}}}else{A=$.inArray(T,h);if((A===-1)&&T.length===0){return-1*z}if((A>-1)&&(A<z)){return A-z}}}return 0}function k(E,M){var i=(w.location.href.split("#")[1]||"");i=l(i);if(M||!S[i]){H.push(i)}if(!e){e=true;if(H.length>0){var z=H.shift();if(S[z]){q(z);delete S[z]}else{v(z)}d=z}e=false}}function p(U){var i=U.indexOf("#");if(i===-1){return""}else if(i>0&&i!==U.length-1){return U.slice(i+1)}}function l(i,R){var z=i,A=i?i.indexOf("#"):-1,B,C;if(A===0){z=z.slice(A+1)}if(R){z=z.replace(r,"")}return z}function m(i){var P=i?i:"";if(t(P)){var z=P.lastIndexOf(s);P=P.slice(0,z)}return P+s+c++}function n(i,z){var E=w.encodeURIComponent(i);var A=w.encodeURIComponent(w.JSON.stringify(z));return E+I+A}function o(z){var A=$.inArray(d,h),T,i,B;if(A>-1){for(i=0;i<A+1;i++){B=h[i];if(B.slice(0,B.length-2)===z){return jQuery.sap.uid()}}}return""}function q(i){var z=$.inArray(d,h);if(!(z===-1||z===h.length-1)){h.splice(z+1,h.length-1-z)}h.push(i)}function t(i){return a.test(i)}function u(C,F){var z=$.inArray(C,h),i;if(z!==-1){if(F){for(i=z;i<h.length;i++){if(!t(h[i])){return i-z}}}else{for(i=z;i>=0;i--){if(!t(h[i])){return i-z}}return-1*(z+1)}}}function v(z){var R,A,i,P=z,B,C,N,D;if(d===undefined){C=y(z);if(!C||!C.bBookmarkable){if(jQuery.isFunction(f)){f($.sap.history.NavType.Bookmark)}return}}if(z.length===0){if(jQuery.isFunction(f)){f($.sap.history.NavType.Back)}}else{N=jQuery.inArray(z,h);if(N===0){C=y(z);if(!C||!C.bBookmarkable){if(jQuery.isFunction(f)){f($.sap.history.NavType.Back)}return}}if(t(z)){if(t(d)){A=u(z,false);w.history.go(A)}else{var E=new RegExp(jQuery.sap.escapeRegExp(d+s)+"[0-9]*$");if(E.test(z)){A=u(z,true);if(A){w.history.go(A)}else{w.history.back()}}else{A=u(z,false);w.history.go(A)}}}else{if(N===-1){D=$.sap.history.NavType.Unknown;h.push(z)}else{if(jQuery.inArray(d,h,N+1)===-1){D=$.sap.history.NavType.Forward}else{D=$.sap.history.NavType.Back}}C=y(z);if(C){R=x(C.sIdentifier);if(R){R.action.apply(null,[C.oStateData,D])}}else{jQuery.sap.log.error("hash format error! The current Hash: "+z)}}}}function x(z){var i;for(i=0;i<b.length;i++){if(b[i].sIdentifier===z){return b[i]}}}function y(z){if(t(z)){var i=z.lastIndexOf(s);z=z.slice(0,i)}var P=z.split(I),R={};if(P.length===4||P.length===3){R.sIdentifier=w.decodeURIComponent(P[0]);R.oStateData=w.JSON.parse(w.decodeURIComponent(P[1]));if(P.length===4){R.uid=P[2]}R.bBookmarkable=P[P.length-1]==="0"?false:true;return R}else{return null}}})(jQuery,this);
