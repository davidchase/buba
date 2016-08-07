'use strict'

const { readFileSync } = require('fs')
const { chdir, cwd } = require('process')

const transformFileSync = require('babel-core').transformFileSync
const transform = require('buble').transform
const babelPlugin = require('babel-plugin-transform-es2015-modules-commonjs')

const CWD = cwd()

const babelOpts = {
  plugins: [ babelPlugin ]
}

const bubleOpts = {
  transforms: {
    dangerousForOf: true,
    generator: false
  }
}

const transformFile = function (filename, options = {}) {

  const babelOptions = options.babel ? Object.assign({}, babelOpts, options.babel) : babelOpts
  const bubleOptions = options.buble ? Objectc.assign({}, bubleOptions, options.buble) : bubleOpts

  const { code: babelCode } = transformFileSync(filename, babelOptions)

  return transform(babelCode, bubleOptions)
}


module.exports = {
  transformFile,
}