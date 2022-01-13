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

const logGrid = grid => console.log(transpose(grid).map(line => line.map(v => v === true ? '#' : ' ').join('')).join('\n'))

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .map(x => x.split('\n').filter(y => y !== ''))

  const firstSection = input[0]
    .map(x => x.split(',').map(y => parseInt(y)))

  const maxX = firstSection.reduce((acc, val) => val[0] > acc ? val[0] : acc, -1)
  const maxY = firstSection.reduce((acc, val) => val[1] > acc ? val[1] : acc, -1)

  const secondSection = input[1].map(l => l.slice('fold along '.length)).map(x => x.split('=')).map(([coordinate, value]) => ([coordinate, parseInt(value)]))

  const grid = new Array(maxX + 1).fill(0).map(() => new Array(maxY + 1).fill(false))

  for (const [x, y] of firstSection) {
    grid[x][y] = true
  }

  // logGrid(grid)

  let result = grid
  for (const [coordinate, value] of secondSection.splice(0, 1)) {
    if (coordinate === 'y') { // horizontal fold
      const newGrid = new Array(result.length).fill(0).map(() => new Array(value).fill(false))
      for (let i = 0; i< result.length; i++) {
        for (let j = 0; j < result[0].length; j++) {
          if (j < value) newGrid[i][j] = result[i][j] || newGrid[i][j]
          if (j > value) newGrid[i][2 * value - j] = result[i][j] || newGrid[i][2 * value - j]
        }
      }
      result = newGrid
    }
    if (coordinate === 'x') { // horizontal fold
      const newGrid = new Array(value).fill(0).map(() => new Array(result[0].length).fill(false))
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[0].length; j++) {
          if (i < value) newGrid[i][j] = result[i][j] || newGrid[i][j]
          if (i > value) newGrid[2 * value - i][j] = result[i][j] || newGrid[2 * value - i][j]
        }
      }
      result = newGrid
    }
  }
  logGrid(result)

  // count dots
  let count = 0
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[0].length; j++) {
      if (result[i][j]) count += 1
    }
  }
  console.log('count', count)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .map(x => x.split('\n').filter(y => y !== ''))

  const firstSection = input[0]
    .map(x => x.split(',').map(y => parseInt(y)))

  const maxX = firstSection.reduce((acc, val) => val[0] > acc ? val[0] : acc, -1)
  const maxY = firstSection.reduce((acc, val) => val[1] > acc ? val[1] : acc, -1)

  const secondSection = input[1].map(l => l.slice('fold along '.length)).map(x => x.split('=')).map(([coordinate, value]) => ([coordinate, parseInt(value)]))

  const grid = new Array(maxX + 1).fill(0).map(() => new Array(maxY + 1).fill(false))

  for (const [x, y] of firstSection) {
    grid[x][y] = true
  }

  // logGrid(grid)

  let result = grid
  for (const [coordinate, value] of secondSection) {
    if (coordinate === 'y') { // horizontal fold
      const newGrid = new Array(result.length).fill(0).map(() => new Array(value).fill(false))
      for (let i = 0; i< result.length; i++) {
        for (let j = 0; j < result[0].length; j++) {
          if (j < value) newGrid[i][j] = result[i][j] || newGrid[i][j]
          if (j > value) newGrid[i][2 * value - j] = result[i][j] || newGrid[i][2 * value - j]
        }
      }
      result = newGrid
    }
    if (coordinate === 'x') { // horizontal fold
      const newGrid = new Array(value).fill(0).map(() => new Array(result[0].length).fill(false))
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[0].length; j++) {
          if (i < value) newGrid[i][j] = result[i][j] || newGrid[i][j]
          if (i > value) newGrid[2 * value - i][j] = result[i][j] || newGrid[2 * value - i][j]
        }
      }
      result = newGrid
    }
  }
  logGrid(result)
}

part2()
  .catch(console.error)
