(this.csbJsonP=this.csbJsonP||[]).push([[12],{"./src/sandbox/eval/transpilers/vue/style-compiler/loader.js":function(e,t,n){"use strict";n.r(t);var r=n("../../node_modules/@babel/runtime/helpers/defineProperty.js"),o=n.n(r),s=n("./node_modules/postcss/lib/postcss.js"),a=n.n(s),i=n("./node_modules/postcss/lib/postcss.js").plugin("trim",function(e){return function(e){e.walk(function(e){"rule"!==e.type&&"atrule"!==e.type||(e.raws.before=e.raws.after="\n")})}}),c=n("./node_modules/postcss/lib/postcss.js"),u=n("./node_modules/postcss-selector-parser/dist/index.js"),p=c.plugin("add-id",function(e){return function(t){var n=Object.create(null);t.each(function t(r){r.selector?r.selector=u(function(t){t.each(function(t){var n=null;t.each(function(e){if("combinator"===e.type&&">>>"===e.value)return e.value=" ",e.spaces.before=e.spaces.after="",!1;if("tag"===e.type&&"/deep/"===e.value){var t=e.next();return"combinator"===t.type&&" "===t.value&&t.remove(),e.remove(),!1}"pseudo"!==e.type&&"combinator"!==e.type&&(n=e)}),t.insertAfter(n,u.attribute({attribute:e.id}))})}).process(r.selector).result:"atrule"===r.type&&("media"===r.name?r.each(t):"keyframes"===r.name&&(n[r.params]=r.params=r.params+"-"+e.id))}),Object.keys(n).length&&t.walkDecls(function(e){/-?animation-name$/.test(e.prop)&&(e.value=e.value.split(",").map(function(e){return n[e.trim()]||e.trim()}).join(",")),/-?animation$/.test(e.prop)&&(e.value=e.value.split(",").map(function(e){var t=e.split(/\s+/),r=t[0];return n[r]?[n[r]].concat(t.slice(1)).join(" "):e}).join(","))})}});function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}t.default=function(e,t){return new Promise(function(n,r){var s=t.options,c=t.options.__vueOptions__;c||(c=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(n,!0).forEach(function(t){o()(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},t.options.vue,{},t.vue));var u=[i],f={to:t.path,from:t.path,map:!1};return s.scoped&&u.push(p({id:s.id})),t.sourceMap&&!1!==c.cssSourceMap&&!t.map&&(f.map={inline:!1,annotation:!1,prev:t.map}),a()(u).process(null===e?void 0:e,f).then(function(e){e.messages&&e.messages.forEach(function(e){"dependency"===e.type&&t.addDependency(e.file)});var r=e.map&&e.map.toJSON();return n({transpiledCode:e.css,sourceMap:r}),null}).catch(function(e){return r(e)})})}},11:function(e,t){},12:function(e,t){}}]);
//# sourceMappingURL=vue-style-compiler.33513681.chunk.js.map