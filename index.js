const babel = require('@babel/core');
const { createFilter } = require('@rollup/pluginutils');
const babelPluginPrismjs = require('babel-plugin-prismjs');

function stripScript(content) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

function prismjsPlugin(options) {
  let needSourceMap = true;

  function transform(id, code) {
    return babel.transformSync(code, {
      babelrc: false,
      ast: true,
      plugins: [[babelPluginPrismjs, options]],
      sourceMaps: needSourceMap,
      sourceFileName: id,
      configFile: false,
    });
  }

  return {
    name: 'prismjs',

    enforce: 'post',

    configResolved(config) {
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap;
    },

    transform(code, id) {
      const filter = createFilter(/\.[jt]s$/);
      const vueFilter = createFilter(/\.vue$/);

      if (vueFilter(id)) {
        const script = stripScript(code);

        if (script) {
          const result = transform(id, script);

          return {
            code: code.replace(script, result.code),
            map: result.map,
          };
        }
      } else if (filter(id)) {
        const result = transform(id, code);

        return {
          code: result.code,
          map: result.map,
        };
      }
    },
  };
}

module.exports = prismjsPlugin;
prismjsPlugin.default = prismjsPlugin;
