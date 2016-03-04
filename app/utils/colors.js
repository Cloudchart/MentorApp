const Colors = {
  green: {
    start: [ 137, 59, 43 ],
    delta: [ 0, -3, 3 ],
    limit: 10
  },
  blue: {
    start: [ 0, 172, 237 ],
    delta: [ 0, -3, 3 ],
    limit: 10
  }
}

function getGradient (color, index) {
  let { start, delta, limit } = Colors[ color ]
  index = index % limit
  let parts = start.map((part, i) => {
    let suffix = i > 0 ? '%' : ''
    return `${part + delta[ i ] * index }${suffix}`
  })
  return `hsl(${parts.join(', ')})`
}


export { getGradient }
