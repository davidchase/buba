'use strict'

const transformFileSync = require('babel-core').transformFileSync
const transform = require('buble').transform

const shouldSkip = file => file.indexOf('node_modules') > 0 || file.indexOf('/') === -1

const original = require.extensions[".js"]

const compile = (module, filename) => module._compile(transform(transformFileSync(filename).code).code, filename)

require.extensions['.js'] = (module, filename) => shouldSkip(filename) ? original(module, filename) : compile(module, filename)
