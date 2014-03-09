/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
jQuery.sap.declare("jquery.sap.resources",false);jQuery.sap.require("jquery.sap.properties");jQuery.sap.require("jquery.sap.strings");(function(){var r=/^((?:[A-Z]{2,3}(?:-[A-Z]{3}){0,3})|[A-Z]{4}|[A-Z]{5,8})(?:-([A-Z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?(-[0-9A-Z]{5,8}|(?:[0-9][0-9A-Z]{3}))*(?:-([0-9A-WYZ](?:-[0-9A-Z]{2,8})+))*(?:-(X(?:-[0-9A-Z]{1,8})+))?$/i;var M={"he":"iw","yi":"ji","id":"in","sr":"sh"};var a={"iw":"he","ji":"yi","in":"id","sn":"sr"};var b=/-(saptrc|sappsd)(?:-|$)/i;function n(L){var m;if(typeof L==='string'&&(m=r.exec(L.replace(/_/g,'-')))){var g=m[1].toLowerCase();g=M[g]||g;var S=m[2]?m[2].toLowerCase():undefined;var R=m[3]?m[3].toUpperCase():undefined;var V=m[4];var p=m[6];if((p&&(m=b.exec(p)))||(V&&(m=b.exec(V)))){return"en_US_"+m[1].toLowerCase()}if(g==="zh"&&!R){if(S==="hans"){R="CN"}else if(S==="hant"){R="TW"}}return g+(R?"_"+R+(V?"_"+V.slice(1).replace("-","_"):""):"")}}function d(){var L;if(window.sap&&sap.ui&&sap.ui.getCore){L=sap.ui.getCore().getConfiguration().getLanguage();L=n(L)}return L||"en"}function c(L){var m;if(typeof L==='string'&&(m=r.exec(L.replace(/_/g,'-')))){var g=m[1].toLowerCase();g=a[g]||g;return g+(m[3]?"-"+m[3].toUpperCase()+(m[4]?"-"+m[4].slice(1).replace("_","-"):""):"")}}var e=/^((?:[^?#]*\/)?[^\/?#]*)(\.[^.\/?#]+)((?:\?([^#]*))?(?:#(.*))?)$/;var v=[".properties",".hdbtextbundle"];function s(u){var m=e.exec(u);return m&&{url:u,prefix:m[1],ext:m[2],query:m[4],hash:(m[5]||""),suffix:m[2]+(m[3]||"")}}var B=function(u,L,i){this.sLocale=n(L)||d();this.oUrlInfo=s(u);if(!this.oUrlInfo||jQuery.inArray(this.oUrlInfo.ext,v)<0){throw new Error("resource URL '"+u+"' has unknown type (should be one of "+v.join(",")+")")}this.bIncludeInfo=i;this.aCustomBundles=[];this.aPropertyFiles=[];this.aLocales=[];l(this,this.sLocale)};B.prototype={};B.prototype._enhance=function(C){if(C&&C instanceof B){this.aCustomBundles.push(C)}else{jQuery.sap.log.error("Custom ResourceBundle is either undefined or not an instanceof jQuery.sap.util.ResourceBundle. Therefore this custom ResourceBundle will be ignored!")}};B.prototype.getText=function(k,A){var V=null;for(var i=this.aCustomBundles.length-1;i>=0;i--){V=this.aCustomBundles[i].getText(k,A);if(V&&V.toString()!==k){return V}else{V=null}}for(var i=0;i<this.aPropertyFiles.length;i++){V=this.aPropertyFiles[i].getProperty(k);if(typeof(V)==="string"){break}}if(typeof(V)!=="string"){var t=this.aLocales[0];while(t.length>0){if(t=="zh_HK"){t="zh_TW"}else{var p=t.lastIndexOf('_');if(p>=0){t=t.substring(0,p)}else if(t!="en"){t="en"}else{t=""}}var P=l(this,t);if(P==null){continue}V=P.getProperty(k);if(typeof(V)==="string"){break}}}if(typeof(V)!=="string"){V=k}if(A){V=jQuery.sap.formatMessage(V,A)}if(this.bIncludeInfo){V=new String(V);V.originInfo={source:"Resource Bundle",url:this.oUrlInfo.url,locale:this.sLocale,key:k}}return V};function l(o,L){var u=o.oUrlInfo,R,p;if(jQuery.inArray(L,o.aLocales)==-1){if(f(L)){switch(u.ext){case'.hdbtextbundle':R={url:u.url,headers:{"Accept-Language":c(L)||""}};break;default:R={url:u.prefix+(L?"_"+L:"")+u.suffix};break}p=jQuery.sap.properties(R)}else{p={getProperty:function(){return undefined}}}o.aPropertyFiles.push(p);o.aLocales.push(L);return p}return null}function f(L){var g=window.sap&&sap.ui&&sap.ui.getCore&&sap.ui.getCore().getConfiguration().getSupportedLanguages();if(g&&g.length>0){return jQuery.inArray(L,g)>=0}return true}jQuery.sap.resources=function resources(p){p=jQuery.extend({url:"",locale:undefined,includeInfo:false},p);var o=new B(p.url,p.locale,p.includeInfo);return o}}());
