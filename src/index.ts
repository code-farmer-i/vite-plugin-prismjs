import { transformSync } from '@babel/core';
import babelPluginPrismjs from 'babel-plugin-prismjs';
import { Plugin } from 'vite';
interface BabelPluginPrismjsOptions {
  languages?: string[] | 'all';
  plugins?: string[];
  theme?: string;
  css?: boolean;
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

    enforce: 'post',

    transform(code, id) {
      if (/\.(?:[jt]sx?|vue)$/.test(id) && !/node_modules/.test(id)) {
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

module.exports = prismjsPlugin;
module.exports['prismjsPlugin'] = prismjsPlugin;
module.exports['default'] = prismjsPlugin;

export { prismjsPlugin };
export default prismjsPlugin;
