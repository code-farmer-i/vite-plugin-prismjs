const babel = require('@babel/core')
const { createFilter } = require('@rollup/pluginutils')
const babelPluginPrismjs = require('babel-plugin-prismjs')

function prismjsPlugin (options) {
  let needSourceMap = true

  return {
    name: 'prismjs',

    configResolved(config) {
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap
    },

    transform (code, id){
      const filter = createFilter(/\.[jt]s$/)

      if(filter(id)) {
        const result = babel.transformSync(code, {
          babelrc: false,
          ast: true,
          plugins: [
            [
              babelPluginPrismjs,
              options,
            ],
          ],
          sourceMaps: needSourceMap,
          sourceFileName: id,
          configFile: false
        })
  
        return {
          code: result.code,
          map: result.map
        }
      }
    }
  }
}

module.exports = prismjsPlugin
prismjsPlugin.default = prismjsPlugin