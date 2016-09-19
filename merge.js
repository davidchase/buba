const merge = (target, src) => {
  const isArray = Array.isArray(src)
  let destination = isArray && [] || {}
  if (isArray) {
    target = target || []
    destination = destination.concat(target)
    src.forEach((e, i) => {
      if (typeof destination[i] === 'undefined') {
        destination[i] = e
      } else if (typeof e === 'object') {
        destination[i] = merge(target[i], e)
      } else {
        if (target.indexOf(e) === -1) {
          destination.push(e)
        }
      }
    })
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach((key) => {
        destination[key] = target[key]
      })
    }
    Object.keys(src).forEach((key) => {
      if (typeof src[key] !== 'object' || !src[key]) {
        destination[key] = src[key]
      } else {
        if (!target[key]) {
          destination[key] = src[key]
        } else {
          destination[key] = merge(target[key], src[key])
        }
      }
    })
  }
  return destination
}

module.exports = merge
