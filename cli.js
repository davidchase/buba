#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const process = require('process')

const cli = require('cli')
const mkdirp = require('mkdirp')

const transformFile = require('./index').transformFile

const CWD = process.cwd()

const extensions = ['.js', '.es', '.es6']

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

  if (!output) return

  if (!options.out) { return console.log(output.code) }

  createDirectoryForFile(options.out, () => {
    writeFile(options.out, output.code)

    if (options.sourceMaps && options.out) {
      writeFile(options.out + '.map', output.map)
    }
  })
})

function transformDirectory (inDirectory, outDirectory, sourceMaps) {
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

function getAllInDirectory (pathname, cb) {
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

function isDirectory (pathname) {
  try {
    return fs.statSync(pathname).isDirectory()
  } catch (e) {
    console.error('Given path:', pathname, 'could not be found')
  }
}

function isFile (pathname) {
  try {
    return fs.statSync(pathname).isFile()
  } catch (e) {
    console.error('Given path:', pathname, 'could not be found')
  }
}
