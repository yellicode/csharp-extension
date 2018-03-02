export default {
  input: 'dist/es6/csharp.js', // rollup requires ES input
  output: {
    format: 'umd',
    name: '@yellicode/csharp',
    file: 'dist/bundles/csharp.umd.js'
  },
  external: ['@yellicode/core', '@yellicode/model', '@yellicode/templating'] // https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
}
