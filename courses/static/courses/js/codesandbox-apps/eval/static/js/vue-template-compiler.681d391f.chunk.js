(this.csbJsonP=this.csbJsonP||[]).push([[13],{"./src/sandbox/eval/transpilers/vue/template-compiler/loader.js":function(e,r,t){"use strict";t.r(r);var n=t("../../node_modules/vue-template-es2015-compiler/index.js"),o=t.n(n),i=t("../../node_modules/vue-template-compiler/browser.js"),s=t("../../node_modules/raw-loader/index.js!../../node_modules/vue-hot-reload-api/dist/index.js"),a=t.n(s),c=t("../../node_modules/@babel/runtime/helpers/defineProperty.js"),u=t.n(c);function l(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,n)}return t}var p={img:"src",image:"xlink:href"},d=function(e,r){var t=e?function(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?l(t,!0).forEach(function(r){u()(e,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(t).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}return e}({},p,{userOptions:e}):p;return{postTransformNode:function(e){!function(e,r,t){for(var n in r)if(e.tag===n&&e.attrs){var o=r[n];"string"===typeof o?e.attrs.some(function(e){return m(e,o,t)}):Array.isArray(o)&&o.forEach(function(r){return e.attrs.some(function(e){return m(e,r,t)})})}}(e,t,r)}}};function m(e,r,t){if(e.name===r){var n=e.value;if(!('"'===n.charAt(0)&&'"'===n.charAt(n.length-1)))return;var o=n.charAt(1);if("."===o||"~"===o){"~"===o&&(n='"'+n.slice(2)),e.value="require(".concat(n,")");var i=n.slice(1).slice(0,-1);t.addDependency(i)}return!0}}var f=t("../../node_modules/@babel/runtime/helpers/slicedToArray.js"),h=t.n(f),v=function(){return{postTransformNode:function(e){!function(e){-1!==["img","source"].indexOf(e.tag)&&e.attrs&&e.attrs.forEach(function(e){if("srcset"===e.name){var r=e.value;if(!('"'===r.charAt(0)&&'"'===r.charAt(r.length-1)))return;var t=/( |\\t|\\n|\\f|\\r)+/g,n=r.substr(1,r.length-2).split(",").map(function(e){var r=e.replace(t," ").trim().split(" ",2),n=h()(r,2),o=n[0],i=n[1];return{require:b(o),descriptor:i}}),o="";n.forEach(function(e,r,t){o+=e.require+' + " '+e.descriptor+(r<t.length-1?', " + ':'"')}),e.value=o}})}(e)}}};function b(e){var r=e.charAt(0);if("."===r||"~"===r){if("~"===r){var t=e.charAt(1);e='"'+e.slice("/"===t?2:1)}return'require("'.concat(e,'")')}}r.default=function(e,r){r.emitModule("!noop-loader!/node_modules/vue-hot-reload-api.js",a.a,"/",!1,!1);var t,n=r.options,s=n.vueOptions||{},c=[d(n.transformRequire,r),v()],u=s.compilerModules||n.compilerModules,l={preserveWhitespace:n.preserveWhitespace,modules:c.concat(u||[]),directives:s.compilerDirectives||n.compilerDirectives||{},scopeId:n.hasScoped?n.id:null,comments:n.hasComment},p=i.compile(e,l);if(p.tips&&p.tips.length&&p.tips.forEach(function(e){r.emitWarning({name:"vue-warning",message:e,fileName:r._module.module.parent?r._module.module.parent.path:r.path,lineNumber:1,columnNumber:1,source:"vue-template-compiler"})}),p.errors&&p.errors.length)r.emitError(new Error("\n  Error compiling template:\n".concat(function(e){return e.split(/\r?\n/).map(function(e){return"  ".concat(e)}).join("\n")}(e),"\n")+p.errors.map(function(e){return"  - ".concat(e)}).join("\n")+"\n")),t="module.exports={render:function(){},staticRenderFns:[]}";else{var m=n.buble,f=!1!==m.transforms.stripWith,h=m.transforms.stripWithFunctional,b=p.staticRenderFns.map(function(e){return g(e,h)});t=o()("var render = "+g(p.render,h)+"\nvar staticRenderFns = ["+b.join(",")+"]",m)+"\n",f&&(t+="render._withStripped = true\n");t+="module.exports = ".concat("{ render: render, staticRenderFns: staticRenderFns }")}var j=s.esModule?"esExports":"module.exports";return t+='\nif (module.hot) {\n  module.hot.accept()\n  if (module.hot.data) {\n    require("!noop-loader!/node_modules/vue-hot-reload-api.js")      .rerender("'+n.id+'", '+j+")\n  }\n}"};function g(e,r){return"function ("+(r?"_h,_vm":"")+") {"+e+"}"}}}]);
//# sourceMappingURL=vue-template-compiler.681d391f.chunk.js.map