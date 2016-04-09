const Colors = {
  green: {
    startColor: [136,  74,  30],
    deltas:     [  0,  -2,  +3],
    colorSpan:  10,
  },
}

const Suffixes = ['', '%', '%']

export function getColorAtIndex(space, index) {
  let { startColor, deltas, colorSpan } = Colors[space]
  let colors = startColor.map((value, ii) => { return startColor[ii] + deltas[ii] * (index % colorSpan) + Suffixes[ii] })
  return `hsl(${colors.join(',')})`
}
