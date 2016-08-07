require('../register/index')({
  arrow: false
})
const test = require('tape')

test('accepts options', function (t) {
  t.plan(1)
  t.equals(require('./prelude').sum.toString(), 'xs => xs.reduce((x, y) => x + y, 0)')
})
