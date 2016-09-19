'use strict'

const transformFileSync = require('babel-core').transformFileSync
const transform = require('buble').transform
const babelPlugin = require('babel-plugin-transform-es2015-modules-commonjs')
const mergeWith = require('lodash/mergeWith')

function deepMerge (dest, src) {
  if (!dest || !src) {
    return
  }
  return mergeWith(dest, src, function (a, b) {
    if (b && Array.isArray(a)) {
      let newArray = b.slice(0)
      for (let item of a) {
        if (newArray.indexOf(item) < 0) {
          newArray.push(item)
        }
      }
      return newArray
    }
  })
}

const contains = (a, b) => a.indexOf(b) > 0

const EXTENSIONS = ['.js', '.es', '.es6']

let options = {
  buble: {
    transforms: {
      dangerousForOf: true,
      generator: false
    }
  },
  babel: {
    plugins: [babelPlugin]
  }
}

const shouldSkip = file => contains(file, 'node_modules')

const original = require.extensions['.js']

const compile = function (module, filename) {
  module._compile(transform(transformFileSync(filename, options.babel).code, options.buble).code, filename)
}

const compileEachExtension = ext => require.extensions[ext] = (module, filename) => shouldSkip(filename) ? original(module, filename) : compile(module, filename) // eslint-disable-line no-return-assign

EXTENSIONS.forEach(compileEachExtension)

module.exports = opts => deepMerge(options, opts)
