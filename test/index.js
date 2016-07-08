import test from 'tape'
import {sum, head} from './prelude'
import {add, Circle, sum as sampleSum} from './sample'

test('sum should add up the list', function(t) {
    t.plan(2)
    t.equal(sum([1, 2, 3]), 6)
    t.equal(sum([4, 5, 6]), 15)
})

test('head should get 1st item in list', function(t) {
   t.plan(1)
   t.equal(head([10, 100, 200, 400]), 10)
})

test('add should add two values', function(t) {
  t.plan(1)
  t.equal(add(33, 11), 44)
})

test('Circle should have properties on the prototype', function(t) {
    const circle = new Circle()
    t.plan(2)
    t.equal(typeof Circle.prototype.area, 'function')
    t.ok(circle.area)
})

test('sampleSum should be the same as sum', function(t){
  t.plan(1)
  t.equal(sampleSum([5, 5, 7]), 17)
})
