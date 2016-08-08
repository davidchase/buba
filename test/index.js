import test from 'tape'
import { sum, head } from './prelude'
import { add, Circle, sum as sampleSum } from './sample'
import { transformFile } from '../index'

test('sum should add up the list', t => {
  t.plan(2)
  t.equal(sum([1, 2, 3]), 6)
  t.equal(sum([4, 5, 6]), 15)
})

test('head should get 1st item in list', t => {
  t.plan(1)
  t.equal(head([10, 100, 200, 400]), 10)
})

test('add should add two values', t => {
  t.plan(1)
  t.equal(add(33, 11), 44)
})

test('Circle should have properties on the prototype', t => {
  const circle = new Circle()
  t.plan(2)
  t.equal(typeof Circle.prototype.area, 'function')
  t.ok(circle.area)
})

test('sampleSum should be the same as sum', t => {
  t.plan(1)
  t.equal(sampleSum([5, 5, 7]), 17)
})

test('transformFile should convert files to ES5/commonjs', t => {
  t.plan(1)

  const { code } = transformFile('test/sample.js')

  function standardizeString (str) {
    return str.replace(/\s/g, '')
  }

  /* eslint-disable */
  const expected = `'use strict';                                                                                                                                             
                                                                                                                                                          
Object.defineProperty(exports, "__esModule", {                                                                                                            
  value: true                                                                                                                                             
});                                                                                                                                                       
exports.sum = exports.Circle = exports.add = undefined;                                                                                                   
                                                                                                                                                          
var _prelude = require('./prelude');                                                                                                                      
                                                                                                                                                          
var add = function (a, b) { return a + b; };                                                                                                              
                                                                                                                                                          
var Circle = function Circle(radius) {                                                                                                                    
  this.radius = this;                                                                                                                                     
};                                                                                                                                                        
                                                                                                                                                          
Circle.prototype.area = function area () {                                                                                                                
  return Math.PI * Math.pow(this.radius, 2);                                                                                                              
};                                                                                                                                                        
                                                                                                                                                          
exports.add = add;                                                                                                                                        
exports.Circle = Circle;                                                                                                                                  
exports.sum = _prelude.sum;`
  /* eslint-enable */

  t.equal(standardizeString(code), standardizeString(expected))
})
