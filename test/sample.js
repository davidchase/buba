import { sum } from './prelude'

const add = (a, b) => a + b

class Circle {
  constructor (radius) {
    this.radius = this
  }

  area () {
    return Math.PI * Math.pow(this.radius, 2)
  }
}

export { add, Circle, sum }
