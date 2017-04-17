/* eslint-disable */
/*!
 * money.js / fx() v0.3
 * Copyright 2014 Open Exchange Rates
 *
 * JavaScript library for realtime currency conversion and exchange rate calculation.
 *
 * Freely distributable under the MIT license.
 * Portions of money.js are inspired by or borrowed from underscore.js
 *
 * For details, examples and documentation:
 * http://openexchangerates.github.io/money.js/
 */
!function(t,e){var r=function(){var r=function(t){return new f(t)};r.version="0.3.0";var o=t.fxSetup||{rates:{},base:""};r.rates=o.rates,r.base=o.base,r.settings={from:o.from||r.base,to:o.to||r.base};var n=r.convert=function(t,e){if("object"==typeof t&&t.length){for(var o=0;o<t.length;o++)t[o]=n(t[o],e);return t}return e=e||{},e.from||(e.from=r.settings.from),e.to||(e.to=r.settings.to),e.rates?t*getRatesCustom(e.to,e.from,e.rates):t*s(e.to,e.from)},s=r.getRate=function(t,e){var o=r.rates;if(o[r.base]=1,!o[t]||!o[e]){var n="Cannot convert "+e+" to "+t+": ";throw o[t]||o[e]?o[t]?o[e]||(n+="exhange rate for "+e+" is missing"):n+="exhange rate for "+t+" is missing":n+="exhange rates for both currencies are missing",Error(n)}return e===r.base?o[t]:t===r.base?1/o[e]:o[t]*(1/o[e])},f=function(t){"string"==typeof t?(this._v=parseFloat(t.replace(/[^0-9-.]/g,"")),this._fx=t.replace(/([^A-Za-z])/g,"")):this._v=t},i=r.prototype=f.prototype;return i.convert=function(){var t=Array.prototype.slice.call(arguments);return e!==this._v&&t.unshift(this._v),n.apply(r,t)},i.from=function(t){var e=r(n(this._v,{from:t,to:r.base}));return e._fx=r.base,e},i.to=function(t){return n(this._v,{from:this._fx?this._fx:r.settings.from,to:t})},r};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=r()),exports.factory=r):"function"==typeof define&&define.amd?define([],function(){return r()}):(fx.noConflict=function(r){return function(){return t.fx=r,fx.noConflict=e,fx}}(t.fx),t.fx=r())}(this);