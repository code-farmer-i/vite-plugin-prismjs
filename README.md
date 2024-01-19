<h1 align="center">Vite Plugin Prismjs</h1>

<p align="center">
  <a href="https://npmcharts.com/compare/vite-plugin-prismjs?minimal=true"><img src="https://img.shields.io/npm/dm/vite-plugin-prismjs.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vite-plugin-prismjs"><img src="https://img.shields.io/npm/v/vite-plugin-prismjs.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vite-plugin-prismjs"><img src="https://img.shields.io/npm/l/vite-plugin-prismjs.svg?sanitize=true" alt="License"></a>
</p>

## Configuring the plugin

```js
// vite.config.js
import { defineConfig } from 'vite';
import prismjs from 'vite-plugin-prismjs';

export default defineConfig({
  plugins: [
    prismjs({
      languages: 'all',
    }),
  ],
});
```

## Options

See [babel-plugin-prismjs](https://github.com/mAAdhaTTah/babel-plugin-prismjs#configuring-the-plugin).
