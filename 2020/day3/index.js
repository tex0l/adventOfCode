const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const transpose = grid => {
  const maxY = grid.length
  const maxX = grid[0].length
  const result = []
  for (let i = 0; i < maxX; i++) {
    for (let j = 0; j < maxY; j++) {
      if (!(result[i] instanceof Array)) result[i] = []
      result[i][j] = grid[j][i]
    }
  }
  return result
}

const logGrid = grid => console.log(transpose(grid).map(line => line.map(v => v === true ? '#' : '.').join('')).join('\n'))

const countForSlope = (grid, incX, incY) => {
  let x = 0
  let y = 0
  let trees = 0
  while (true) {
    if (y > grid[0].length) break
    if (grid[x % grid.length][y]) trees += 1
    x += incX
    y += incY
  }
  return trees
}

const part1 = async () => {
  const grid = transpose((await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(l => l.split('').map(x => x === '#')))

  console.log(countForSlope(grid, 3, 1))
}

const part2 = async () => {
  const grid = transpose((await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(l => l.split('').map(x => x === '#')))


  console.log(
    countForSlope(grid, 1, 1) *
    countForSlope(grid, 3, 1) *
    countForSlope(grid, 5, 1) *
    countForSlope(grid, 7, 1) *
    countForSlope(grid, 1, 2)
  )
}

part2()
  .catch(console.error)
