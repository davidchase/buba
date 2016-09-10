'use strict'

const transformFileSync = require('babel-core').transformFileSync
const transform = require('buble').transform
const babelPlugin = require('babel-plugin-transform-es2015-modules-commonjs')

const babelOpts = {
  plugins: [ babelPlugin ]
}

const bubleOpts = {
  transforms: {
    dangerousForOf: true,
    generator: false
  }
}

const transformFile = function (filename, options) {
  options = options || {}
  const babelOptions = Object.assign({}, babelOpts, options.babel)
  const bubleOptions = Object.assign({}, bubleOpts, options.buble)

  try {
    const output = transform(transformFileSync(filename, babelOptions).code, bubleOptions)
    return output
  } catch (e) {
    console.error('Failed to transform file :', filename, e)
  }
}

module.exports = {
transformFile}
