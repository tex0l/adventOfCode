const fs = require('fs/promises')
const path = require('path')
const inputPath = './input-test.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => [...l].map(i => parseInt(i, 10)))
  const maxX = Math.max(...input.map(v => v.length))
  const maxY = input.length
  const output = new Array(maxY).fill(0).map(() => new Array(maxX).fill(false))
  const getX = x => x === -1 || x === maxX || x
  const getY = y => y === -1 || y === maxY || y
  let riskLevel = 0
  let minima = []

  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      const culprit = input[getY(y)][getX(x)]
      if (
        (getX(x - 1) === true || input[y][getX(x - 1)] > culprit) &&
        (getX(x + 1) === true || input[y][getX(x + 1)] > culprit) &&
        (getY(y - 1) === true || input[getY(y - 1)][x] > culprit) &&
        (getY(y + 1) === true || input[getY(y + 1)][x] > culprit)
      ) {
        output[y][x] = true
        minima.push([x, y])
        riskLevel += 1 + input[y][x]
      }
    }
  }

  console.log(output.map(line => line.map(bool => bool ? 'x' : '.').join('')).join('\n'))
  // console.log('minima', minima)
  console.log('riskLevel', riskLevel)

}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => [...l].map(i => parseInt(i, 10)))
  const maxX = Math.max(...input.map(v => v.length))
  const maxY = input.length
  const output = new Array(maxY).fill(0).map(() => new Array(maxX).fill(false))
  const getX = x => x === -1 || x === maxX || x
  const getY = y => y === -1 || y === maxY || y
  const minima = []
  const basins = []

  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      const culprit = input[getY(y)][getX(x)]
      if (
        (getX(x - 1) === true || input[y][getX(x - 1)] > culprit) &&
        (getX(x + 1) === true || input[y][getX(x + 1)] > culprit) &&
        (getY(y - 1) === true || input[getY(y - 1)][x] > culprit) &&
        (getY(y + 1) === true || input[getY(y + 1)][x] > culprit)
      ) {
        // output[y][x] = true
        minima.push([x, y])
      }
    }
  }

  const findNewBasinPoints = point => {
    const x = point[0]
    const y = point[1]

    const culprit = input[y][x]
    if (culprit === 8) return [] // should not happen
    const isCandidate = (X, Y) => input[getY(Y)][getX(X)] !== 9 && input[getY(Y)][getX(X)] > culprit
    const newBasinPoints = []
    if (getX(x - 1) !== true && isCandidate(getX(x - 1), y)) newBasinPoints.push([getX(x - 1), y])
    if (getX(x + 1) !== true && isCandidate(getX(x + 1), y)) newBasinPoints.push([getX(x + 1), y])
    if (getY(y - 1) !== true && isCandidate(x, getY(y - 1))) newBasinPoints.push([x, getY(y - 1)])
    if (getY(y + 1) !== true && isCandidate(x, getY(y + 1))) newBasinPoints.push([x, getY(y + 1)])
    return newBasinPoints
  }

  for (const minimum of minima) {
    const basin = [minimum]
    const toAnalyze = [minimum]
    while (toAnalyze.length !== 0) {
      const point = toAnalyze.shift()
      output[point[1]][point[0]] = true
      const newPoints = findNewBasinPoints(point, basin)
      for (const newPoint of newPoints) {
        if (basin.findIndex(([_x, _y]) => newPoint[0] === _x && newPoint[1] === _y) === -1) basin.push(newPoint)
      }
      toAnalyze.push(...newPoints)
    }
    basins.push(basin)
  }

  console.log(output.map(line => line.map(bool => bool ? 'x' : '.').join('')).join('\n'))
  // console.log('minima', minima)
  const orderedBasinLengths = basins.map(basin => basin.length).sort((a, b) => b - a )
  console.log('result', orderedBasinLengths[0] * orderedBasinLengths[1] * orderedBasinLengths[2])

}
part2()
  .catch(console.error)
