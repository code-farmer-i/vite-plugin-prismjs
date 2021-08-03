"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismjsPlugin = void 0;
const core_1 = __importDefault(require("@babel/core"));
const pluginutils_1 = require("@rollup/pluginutils");
const babel_plugin_prismjs_1 = __importDefault(require("babel-plugin-prismjs"));
function stripScript(content) {
    const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
    return result && result[2] ? result[2].trim() : '';
}
function prismjsPlugin(options) {
    let needSourceMap = true;
    function transform(id, code) {
        return core_1.default.transformSync(code, {
            babelrc: false,
            ast: true,
            plugins: [[babel_plugin_prismjs_1.default, options]],
            sourceMaps: needSourceMap,
            sourceFileName: id,
            configFile: false,
        });
    }
    return {
        name: 'prismjs',
        enforce: 'pre',
        configResolved(config) {
            needSourceMap = config.command === 'serve' || !!config.build.sourcemap;
        },
        transform(code, id) {
            const filter = pluginutils_1.createFilter(/\.[jt]s$/);
            const vueFilter = pluginutils_1.createFilter(/\.vue$/);
            if (vueFilter(id)) {
                const script = stripScript(code);
                if (script) {
                    const result = transform(id, script);
                    if (result) {
                        return {
                            code: code.replace(script, result.code),
                            map: result.map,
                        };
                    }
                }
            }
            else if (filter(id)) {
                const result = transform(id, code);
                if (result) {
                    return {
                        code: result.code,
                        map: result.map,
                    };
                }
            }
        },
    };
}
exports.prismjsPlugin = prismjsPlugin;
exports.default = prismjsPlugin;
//# sourceMappingURL=index.js.map