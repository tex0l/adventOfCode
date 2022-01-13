const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const main = async (part2 = false) => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  let maxX = 0
  let maxY = 0
  const lines = input
    .split('\n')
    .filter(x => x !== '')
    .map(a =>
      a.split(' -> ')
        .map(b => {
          const [x, y] = b.split(',').map(_ => parseInt(_, 10))
          maxX = Math.max(x, maxX)
          maxY = Math.max(y, maxY)
          return { x, y }
        })
    )
  let grid = (new Array(maxY + 1)).fill(0).map(() => (new Array(maxX + 1)).fill(0))

  for (const line of lines) {
    grid = addLineToGrid(line, grid, part2)
  }
  // console.log(stringifyGrid(grid))
  const moreThan2 = grid.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.reduce((acc2, cur) => {
      return acc2 + (cur >= 2 ? 1 : 0)
    }, 0)
  }, 0)
  console.log('moreThan2', moreThan2)
}

const addLineToGrid = (line, grid, part2) => {
  const newGrid = JSON.parse(JSON.stringify(grid))
  const [{x: x0, y: y0}, {x: x1, y: y1}] = line
  if (x0 === x1) {
    // horizontal
    let start_y = Math.min(y0, y1)
    let end_y = Math.max(y0, y1)

    for (let temp_y = start_y; temp_y <= end_y; temp_y++) {
      newGrid[x0][temp_y] += 1
    }
  } else if (y0 === y1) {
    // vertical

    let start_x = Math.min(x0, x1)
    let end_x = Math.max(x0, x1)

    for (let temp_x = start_x; temp_x <= end_x; temp_x++) {
      newGrid[temp_x][y0] += 1
    }
  } else {
    // Diagonal
    // for part 2 only
    if (!part2) return newGrid
    const start_x = Math.min(x0, x1)
    const end_x = Math.max(x0, x1)

    const start_y = start_x === x0 ? y0 : y1
    const end_y = end_x === x0 ? y0 : y1

    if (end_y > start_y) {
      for (let i = 0; i <= end_x - start_x; i++) {
        newGrid[start_x + i][start_y + i] += 1
      }
    } else {
      for (let i = 0; i <= end_x - start_x; i++) {
        newGrid[start_x + i][start_y - i] += 1
      }
    }


    return newGrid // pass
  }
  return newGrid
}

const transpose = grid => {
  const gridSize = grid.length
  const result = JSON.parse(JSON.stringify(grid))
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      result[i][j] = grid[j][i]
    }
  }
  return result
}

const stringifyGrid = grid => {
  return transpose(grid).map(line => line.map(x => {
    if (x === 0) return '.'
    else if (x <= 9) return `${x}`
    else return '+'
  }).join('')).join('\n')
}

main()
  .catch(console.error)

main(true)
  .catch(console.error)

