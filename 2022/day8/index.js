const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const isVisible = (Line, Column, map) => {
  // T->B
  let values = []
  for (let line = 0; line < Line; line++) {
    values.push(map[line][Column])
  }
  if (values.every(x => x < map[Line][Column])) return true
  // B->T
  values = []
  for (let line = map.length - 1; line > Line; line--) {
    values.push(map[line][Column])
  }
  if (values.every(x => x < map[Line][Column])) return true
  // L->R
  values = []
  for (let column = 0; column < Column; column++) {
    values.push(map[Line][column])
  }
  if (values.every(x => x < map[Line][Column])) return true
  // R->L
  values = []
  for (let column = map[0].length - 1; column > Column; column--) {
    values.push(map[Line][column])
  }
  if (values.every(x => x < map[Line][Column])) return true
  return false
}

const scenicScore = (Line, Column, map) => {
  // TOP
  let top = 0
  if (Line > 0) {
    for (let line = Line - 1; line >= 0; line--) {
      top++
      if (!(map[line][Column] < map[Line][Column])) break
    }
  }
  // BOTTOM
  let bottom = 0
  if (Line < map.length - 1) {
    for (let line = Line + 1; line < map.length; line++) {
      bottom++
      if (!(map[line][Column] < map[Line][Column])) break
    }
  }

  // LEFT
  let left = 0
  if (Column > 0) {
    for (let column = Column - 1; column >= 0; column--) {
      left++
      if (!(map[Line][column] < map[Line][Column])) break
    }
  }

  // RIGHT
  let right = 0
  if (Column < map[0].length - 1) {
    for (let column = Column + 1; column < map[0].length; column++) {
      right++
      if (!(map[Line][column] < map[Line][Column])) break
    }
  }

  return left * right * top * bottom
}
const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => x.split('').filter(x => x !== '').map(y => parseInt(y)))

  let trees = 0

  for (let line = 0; line < input.length; line++) {
    for (let column = 0; column < input[0].length; column++) {
      if (isVisible(line, column, input)) trees++
    }
  }
  console.log(trees)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => x.split('').filter(x => x !== '').map(y => parseInt(y)))

  let score = 0

  for (let line = 0; line < input.length; line++) {
    for (let column = 0; column < input[0].length; column++) {
      const _score = scenicScore(line, column, input)
      if (_score > score) score = _score
    }
  }

  console.log(score)
}

part2()
  .then(console.log, console.error)
