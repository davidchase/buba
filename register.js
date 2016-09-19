'use strict'

const transformFileSync = require('babel-core').transformFileSync
const transform = require('buble').transform
const babelPlugin = require('babel-plugin-transform-es2015-modules-commonjs')

const merge = (target, src) => {
  const isArray = Array.isArray(src)
  let destination = isArray && [] || {}
  if (isArray) {
    target = target || []
    destination = destination.concat(target)
    src.forEach((e, i) => {
      if (typeof destination[i] === 'undefined') {
        destination[i] = e
      } else if (typeof e === 'object') {
        destination[i] = merge(target[i], e)
      } else {
        if (target.indexOf(e) === -1) {
          destination.push(e)
        }
      }
    })
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach((key) => {
        destination[key] = target[key]
      })
    }
    Object.keys(src).forEach((key) => {
      if (typeof src[key] !== 'object' || !src[key]) {
        destination[key] = src[key]
      } else {
        if (!target[key]) {
          destination[key] = src[key]
        } else {
          destination[key] = merge(target[key], src[key])
        }
      }
    })
  }
  return destination
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

module.exports = opts => {
  options = merge(options, opts)
}
