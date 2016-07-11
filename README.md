# buba
> Bublé transform for your esnext tests + a little bit of Babel

[![Build Status](https://travis-ci.org/davidchase/buba.svg?branch=master)](https://travis-ci.org/davidchase/buba) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://img.shields.io/npm/v/buba.svg)](https://www.npmjs.com/package/buba)

## Why?
Because a wise man once said your source code should be transpiled with same tool as your tests to avoid any hidden bugs.

The usecase would be transpiling es* source code with Bublé and have tests match as well. An alternative to using `babel-register`

The primary transformer here is [Bublé](buble.surge.sh/#) we only use [Babel](babeljs.io) for support with module import/exports.


## Install

```sh
npm install buba --save-dev
```

## Usage

```sh
mocha --require buba tests/**/*.js
# or
tape --require buba tests/**/*.js
```

With `mocha` you can also provide buba within the `mocha.opts` config file:

```sh
 --require buba
 --reporter spec
 --ui bdd
```

Currently we only plan to use Babel for modules but you can add support for something like generators by adding a `.babelrc` file.


## Todo
- [x] Add Tests
- [x] Add Bublé options
- [ ] Add CLI supoort
