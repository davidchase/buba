# buba
Transform your esnext tests with Bublé + a little bit of Babel


## Why?
Because a wise man once said your source code should be transpiled with same tool as your tests to avoid any hidden bugs.

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

## Todo
- [ ] Add Tests
- [ ] Add Bublé options
