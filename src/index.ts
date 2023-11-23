import { transformSync } from '@babel/core';
import { createFilter } from '@rollup/pluginutils';
import babelPluginPrismjs from 'babel-plugin-prismjs';
import { Plugin } from 'vite'
interface BabelPluginPrismjsOptions {
  languages?: string[] | 'all';
  plugins?: string[];
  theme?: string;
  css?: boolean;
}

function stripScript(content: string) {
  const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
  return result && result[2] ? result[2].trim() : '';
}

function prismjsPlugin(options: BabelPluginPrismjsOptions = {}): Plugin {
  let needSourceMap = true;

  function transform(id: string, code: string) {
    return transformSync(code, {
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

    enforce: 'pre',

    configResolved(config) {
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap;
    },

    transform(code, id) {
      const filter = createFilter(/\.[jt]s$/);
      const scriptFilter = createFilter(/\.vue$|\.svelte$/);

      if (scriptFilter(id)) {
        const script = stripScript(code);

        if (script) {
          const result = transform(id, script);

          if (result) {
            return {
              code: code.replace(script, result.code as string),
              map: result.map,
            };
          }
        }
      } else if (filter(id)) {
        const result = transform(id, code);

        if (result) {
          return {
            code: result.code as string,
            map: result.map,
          };
        }
      }
    },
  };
}

export {
  prismjsPlugin
}

export default prismjsPlugin
