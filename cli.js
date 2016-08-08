#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const process = require('process')

const cli = require('cli')
const mkdirp = require('mkdirp')

const transformFile = require('./index').transformFile

const CWD = process.cwd()

const extensions = ['js', 'es', 'es6']

cli.parse({
  in: ['i', 'The file or directory you would like to transform (required)', 'string'],
  out: ['o', 'Where to write output', 'string'],
  sourceMaps: ['s', 'Output sourceMap']
})

cli.main(function main (args, options) {
  if (!options.in) {
    throw new Error('Must provide an input file or directory')
  }

  if (isDirectory(options.in)) {
    if (!options.out) {
      throw new Error('Must provide an output directory when transforming a directory')
    }

    return transformDirectory(options.in, options.out, options.sourceMaps)
  }

  const output = transformFile(options.in) // TODO: add options

  if (!options.out) { return console.log(output.code) }

  createDirectoryForFile(options.out, () => {
    writeFile(options.out, output.code)

    if (options.sourceMaps && options.out) {
      writeFile(options.out + '.map', output.map)
    }
  })
})

function transformDirectory (inDirectory, outDirectory, sourceMaps) {
  const _in = path.join(CWD, inDirectory)
  const _out = path.join(CWD, outDirectory)
  mkdirp(_out, function (err) {
    if (err) throw err

    getAllInDirectory(inDirectory, function (file) {
      const _infile = path.join(_in, file)
      const _outfile = path.join(_out, file)

      if (isFile(_infile)) {
        const output = transformFile(_infile) // TODO add options

        writeFile(_outfile, output.code)

        if (sourceMaps) {
          writeFile(path.join(_outfile, '.map'), output.map)
        }
      }
    })
  })
}

function writeFile (filename, content) {
  fs.writeFile(filename, content, (err) => {
    if (err) throw err
  })
}

function createDirectoryForFile (filename, cb) {
  const parts = filename.split('/')
  parts.splice(-1)
  const dir = path.join(CWD, parts.join('/'))

  mkdirp(dir, (err) => {
    if (err) throw err
    cb()
  })
}

function getAllInDirectory (path, cb) {
  const files = fs.readdirSync(path)
  for (let i = 0; i < files.length; ++i) {
    const file = files[i]
    const shouldProcess = extensions.indexOf(ext(file)) > -1
    if (shouldProcess) {
      cb(file)
    }
  }
}

function isDirectory (path) {
  return fs.statSync(path).isDirectory()
}

function isFile (path) {
  return fs.statSync(path).isFile()
}

function ext (filename) {
  if (/^\..+$/.test(filename) && filename.match(/\./g).length === 1) {
    return filename.substring(1)
  }

  const parts = filename.split('.')
  if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
    return ''
  }

  return parts.pop()
}
