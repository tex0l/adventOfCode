const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const matrix = input
    .split('\n\n')

  const numbers = matrix.shift().split(',').map(a => parseInt(a, 10))
  const rawGrids = matrix

  const grids = rawGrids
    .map(x =>
      x.split('\n')
        .filter(_ => _ !== '') // for the last line
        .map(y =>
          y
            .replace(/^ /g, '') // to remove leading spaces
            .replace(/ {2}/g, ' ') // to replace double spaces with simple spaces
            .split(' ') // split on spaces
            .map(a => parseInt(a, 10))
        )
    )
  const marks = JSON.parse(JSON.stringify(grids)).map(grid => grid.map(line => line.map(() => false)))
  let number, markMatch
  while (true) {
    number = numbers.shift()
    drawNumber(number, grids, marks)
    markMatch = marks.findIndex(checkMark)
    if (markMatch !== -1) break
  }
  const unmarkedSum = sumUnmarked(grids[markMatch], marks[markMatch])
  console.log('part1 product', unmarkedSum * number)
}

const part2 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const matrix = input
    .split('\n\n')

  const numbers = matrix.shift().split(',').map(a => parseInt(a, 10))
  const rawGrids = matrix

  const grids = rawGrids
    .map(x =>
      x.split('\n')
        .filter(_ => _ !== '') // for the last line
        .map(y =>
          y
            .replace(/^ /g, '') // to remove leading spaces
            .replace(/ {2}/g, ' ') // to replace double spaces with simple spaces
            .split(' ') // split on spaces
            .map(a => parseInt(a, 10))
        )
    )
  const marks = JSON.parse(JSON.stringify(grids)).map(grid => grid.map(line => line.map(() => false)))
  let number, markMatch, previousMarks
  while (true) {
    number = numbers.shift()
    previousMarks = JSON.parse(JSON.stringify(marks))
    drawNumber(number, grids, marks)
    if (marks.every(checkMark)) break
  }
  markMatch = previousMarks.findIndex(mark => !checkMark(mark))
  const unmarkedSum = sumUnmarked(grids[markMatch], marks[markMatch])
  console.log('part2 product', unmarkedSum * number)
}


const drawNumber = (number, grids, marks) => {
  const gridsLength = grids.length
  const gridSize = grids[0].length
  for (let i = 0; i < gridsLength; i++) {
    const grid = grids[i]
    for (let j = 0; j < gridSize; j++) {
      for (let k = 0; k < gridSize; k++) {
        if (grid[j][k] === number) marks[i][j][k] = true
      }
    }
  }
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

const checkMark = mark => {
  // lines
  if (mark.some(line => line.every(v => v === true))) return true
  // columns
  const transposition = transpose(mark)
  if (transposition.some(line => line.every(v => v === true))) return true
}

const sumUnmarked = (grid, mark) => {
  let res = 0
  const gridSize = grid.length
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!mark[i][j]) res+= grid[i][j]
    }
  }
  return res
}


part1()
  .catch(console.error)

part2()
  .catch(console.error)

