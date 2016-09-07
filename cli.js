#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const process = require('process')

const program = require('commander')
const mkdirp = require('mkdirp')

const transformFile = require('./index').transformFile

const CWD = process.cwd()

const extensions = ['.js', '.es', '.es6']

const head = xs => xs[0]

const compose = (f, g) => h => f(g(h))

const isFile = function isFile (pathname) {
  try {
    return fs.statSync(pathname).isFile()
  } catch (e) {
    console.error('Given path:', pathname, 'could not be found')
  }
}

const isDirectory = function isDirectory (pathname) {
  try {
    return fs.statSync(pathname).isDirectory()
  } catch (e) {
    console.error('Given path:', pathname, 'could not be found')
  }
}

const getAllInDirectory = function getAllInDirectory (pathname, cb) {
  const files = fs.readdirSync(pathname)
  for (let i = 0; i < files.length; ++i) {
    const filename = path.basename(files[i])
    const file = path.join(pathname, filename)
    const ext = path.extname(file)
    const shouldProcess = isFile(file) && extensions.indexOf(ext) > -1 || isDirectory(file)
    if (shouldProcess) {
      cb(filename)
    }
  }
}

const createDirectoryForFile = function createDirectoryForFile (filename, cb) {
  const parts = filename.split('/')
  parts.splice(-1)
  const dir = path.join(CWD, parts.join('/'))

  mkdirp(dir, (err) => {
    if (err) throw err
    cb()
  })
}

const writeFile = function writeFile (filename, content) {
  fs.writeFile(filename, content, (err) => {
    if (err) throw err
  })
}

const transformDirectory = function transformDirectory (inDirectory, outDirectory, sourceMaps) {
  const _in = path.isAbsolute(inDirectory) ? inDirectory : path.join(CWD, inDirectory)
  const _out = path.isAbsolute(outDirectory) ? outDirectory : path.join(CWD, outDirectory)
  mkdirp(_out, function (err) {
    if (err) throw err

    getAllInDirectory(inDirectory, function (file) {
      const _infile = path.join(_in, file)
      const _outfile = path.join(_out, file)

      if (isDirectory(_infile)) {
        transformDirectory(_infile, _outfile, sourceMaps)
      }

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

const setupOptions = function (argv) {
  return program
    .version(require('./package.json').version)
    .usage('<file input> [options]')
    .option('-o --output [string]', 'Where to write the output')
    .option('-s --source-maps', 'Output source-maps')
    .parse(argv)
}

const parseOptions = function (program) {
  if (!program.args.length) {
    console.error('Oops: Must provide an input file or directory')
    program.help()
  }

  if (isDirectory(head(program.args))) {
    if (!program.output) {
      throw new Error('Must provide an output directory when transforming a directory')
    }
    return transformDirectory(head(program.args), program.output, program.sourceMap)
  }

  const output = transformFile(head(program.args))

  if (!program.output) return console.log(output.code)

  createDirectoryForFile(program.output, function () {
    writeFile(program.output, output.code)

    if (program.sourceMaps && program.output) {
      writeFile(program.output + '.map', output.map)
    }
  })
}

compose(parseOptions, setupOptions)(process.argv)
