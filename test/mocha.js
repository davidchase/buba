import { strictEqual } from 'assert'
import { test, suite } from 'mocha'
import { sum } from './prelude'

suite('prelude', () => {
  test('sum should add up all values in list', () => {
    strictEqual(sum([10, 10, 10]), 30)
  })
})
