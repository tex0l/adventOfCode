const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => l.split('').map(n => parseInt(n)))

  let grid = input

  for (let i = 0; i < 100; i++) {
    grid = processGrid(grid)
  }
  console.log(grid.map(l => l.map(x => x > 9 ? 'x': x).join('')).join('\n'))
  console.log('flashes', flashes)
}
let flashes = 0
const processGrid = input => {
  let grid = JSON.parse(JSON.stringify(input))
  const sizeX = grid.length
  const sizeY = grid[0].length
  // First, the energy level of each octopus increases by 1.
  for (let i = 0; i < sizeX; i++) {
    for (let j = 0; j < sizeY; j++) {
      grid[i][j] += 1
    }
  }

  // Then, any octopus with an energy level greater than 9 flashes. This increases the energy level of all adjacent
  // octopuses by 1, including octopuses that are diagonally adjacent. If this causes an octopus to have an energy level
  // greater than 9, it also flashes. This process continues as long as new octopuses keep having their energy level
  // increased beyond 9. (An octopus can only flash at most once per step.)
  const alreadyFlashedOctopuses = []
  while (true) {
    let noOctopusFlashed = true
    for (let i = 0; i < sizeX; i++) {
      for (let j = 0; j < sizeY; j++) {
        if (grid[i][j] > 9 && alreadyFlashedOctopuses.findIndex(octopus => octopus.x === i && octopus.y === j) === -1) {
          noOctopusFlashed = false
          alreadyFlashedOctopuses.push({ x: i, y: j })
          grid[i][j] = 0
          flashes += 1
          incrementIfNotOutOfBoundsAndHasNotFlashed(grid, alreadyFlashedOctopuses, i - 1, j - 1)
          incrementIfNotOutOfBoundsAndHasNotFlashed(grid, alreadyFlashedOctopuses, i, j - 1)
          incrementIfNotOutOfBoundsAndHasNotFlashed(grid, alreadyFlashedOctopuses,  i + 1, j - 1)
          incrementIfNotOutOfBoundsAndHasNotFlashed(grid, alreadyFlashedOctopuses, i - 1, j)
          incrementIfNotOutOfBoundsAndHasNotFlashed(grid, alreadyFlashedOctopuses, i + 1, j)
          incrementIfNotOutOfBoundsAndHasNotFlashed(grid, alreadyFlashedOctopuses, i - 1, j + 1)
          incrementIfNotOutOfBoundsAndHasNotFlashed(grid, alreadyFlashedOctopuses, i, j + 1)
          incrementIfNotOutOfBoundsAndHasNotFlashed(grid, alreadyFlashedOctopuses, i + 1, j + 1)
        }
      }
    }
    if (noOctopusFlashed) break
  }
  return grid
}

const incrementIfNotOutOfBoundsAndHasNotFlashed = (grid, alreadyFlashedOctopuses, x, y) => {
  const sizeX = grid.length
  const sizeY = grid[0].length
  if (alreadyFlashedOctopuses.findIndex(octopus => octopus.x === x && octopus.y === y) === -1 && x >=0 && x < sizeX && y >=0 && y < sizeY) grid[x][y] += 1
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => l.split('').map(n => parseInt(n)))

  let grid = input

  const sizeX = grid.length
  const sizeY = grid[0].length

  let synchronizedFlashIndex

  for (let i = 0; i < 2000; i++) {
    flashes = 0
    grid = processGrid(grid)
    if (flashes === sizeX * sizeY) {
      synchronizedFlashIndex = i
      break
    }
  }
  console.log(grid.map(l => l.map(x => x > 9 ? 'x': x).join('')).join('\n'))
  console.log('synchronizedFlashIndex', synchronizedFlashIndex + 1)
}

part2()
  .catch(console.error)
