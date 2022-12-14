const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(instruction => instruction.split(' -> ').filter(x => x !== '').map(point => point.split(',').filter(x => x !== '').map(number => parseInt(number))))

  // To take into account sand source
  let minY = 0
  let minX = 500
  let maxY = 0
  let maxX = 500



  for (const instruction of input) {
    for (const point of instruction) {
      const [X, Y] = point
      if (minY > Y) minY = Y
      if (minX + 1 > X) minX = X - 1 // to allow overflow to the left
      if (maxY - 1 < Y) maxY = Y + 1 // to detect going into the void
      if (maxX - 1 < X) maxX = X + 1 // to allow overflow to the right
    }
  }

  const map = []
  for (let y = minY; y <= maxY; y++) {
    map.push([])
    for (let x = minX; x <= maxX; x++) {
      map[y - minY].push('.')
    }
  }

  for (const instruction of input) {
    for (let i = 1; i < instruction.length; i++) {
      if (instruction[i - 1][0] === instruction[i][0]) {
        // vertical
        const X = instruction[i - 1][0]
        for (let Y = Math.min(instruction[i - 1][1], instruction[i][1]); Y <= Math.max(instruction[i - 1][1], instruction[i][1]); Y++) {
          map[Y - minY][X - minX] = '#'
        }
      } else if (instruction[i - 1][1] === instruction[i][1]) {
        // horizontal
        const Y = instruction[i - 1][1]
        for (let X = Math.min(instruction[i - 1][0], instruction[i][0]); X <= Math.max(instruction[i - 1][0], instruction[i][0]); X++) {
          map[Y - minY][X - minX] = '#'
        }
      } else throw new Error('illegal line')
    }
  }

  const maxSteps = 10000
  let steps = 0
  while (steps < maxSteps) {
    steps++
    try {
      injectSand(map, [500, 0], { minY, minX, maxY, maxX })
    } catch (err) {
      if (err.message !== 'void') throw err
      break
    }
  }

  console.log(map.map(row => row.join('')).join('\n'))
  console.log('injected sand', steps - 1)
}

const inBounds = (X, Y, offset) => X - offset.minX >= 0 && X - offset.minX <= offset.maxX && Y - offset.minY >= 0 && Y - offset.minY <= offset.maxY

const injectSand = (map, source, offset) => {
  let X = source[0]
  let Y = source[1]

  const { minY, minX, maxY } = offset
  const maxSteps = 1000
  let steps = 0
  while (steps < maxSteps) {
    steps++
    if (inBounds(X, Y + 1, offset) && map[Y + 1][X - minX] === '.') {
      map[Y - minY + 1][X-minX] = 'o'
      map[Y - minY][X - minX] = '.'
      Y += 1
    } else if (inBounds(X - 1, Y + 1, offset) && map[Y + 1][X - minX - 1] === '.') {
      map[Y - minY + 1][X-minX - 1] = 'o'
      map[Y - minY][X - minX] = '.'
      Y += 1
      X -= 1
    } else if (inBounds(X + 1, Y + 1, offset) && map[Y - minY + 1][X - minX + 1] === '.') {
      map[Y - minY + 1][X-minX + 1] = 'o'
      map[Y - minY][X - minX] = '.'
      Y += 1
      X += 1
    } else if (Y === maxY) {
      map[Y - minY][X - minX] = '.' // rollback
      throw new Error('void')
    } else {
      break
    }
  }
}

const injectWithFloor = (map, source, offset) => {
  let X = source[0]
  let Y = source[1]
  const { minY, minX, maxY } = offset
  const maxSteps = 1000
  let steps = 0
  while (steps < maxSteps) {
    steps++
    if (inBounds(X, Y + 1, offset) && map[Y + 1][X - minX] === '.') {
      map[Y - minY + 1][X-minX] = 'o'
      map[Y - minY][X - minX] = '.'
      Y += 1
    } else if (inBounds(X - 1, Y + 1, offset) && map[Y + 1][X - minX - 1] === '.') {
      map[Y - minY + 1][X-minX - 1] = 'o'
      map[Y - minY][X - minX] = '.'
      Y += 1
      X -= 1
    } else if (inBounds(X + 1, Y + 1, offset) && map[Y - minY + 1][X - minX + 1] === '.') {
      map[Y - minY + 1][X-minX + 1] = 'o'
      map[Y - minY][X - minX] = '.'
      Y += 1
      X += 1
    } else if (Y === maxY) { // impossible in part 2
      map[Y - minY][X - minX] = '.' // rollback
      throw new Error('void')
    } else if (steps > 0 && X === source[0] && Y === source[1]) {
      throw new Error('FULL')
    } else {
      break
    }
  }
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(instruction => instruction.split(' -> ').filter(x => x !== '').map(point => point.split(',').filter(x => x !== '').map(number => parseInt(number))))

  // To take into account sand source
  let minY = 0
  let minX = 500
  let maxY = 0
  let maxX = 500

  for (const instruction of input) {
    for (const point of instruction) {
      const [X, Y] = point
      if (minY > Y) minY = Y
      if (minX + 1 > X) minX = X - 1 // to allow overflow to the left
      if (maxY - 1< Y) maxY = Y
      if (maxX - 1< X) maxX = X + 1 // to allow overflow to the right
    }
  }

  maxY += 2

  maxX += maxY
  minX -= maxY

  input.push([[minX, maxY], [maxX, maxY]])

  const map = []
  for (let y = minY; y <= maxY; y++) {
    map.push([])
    for (let x = minX; x <= maxX; x++) {
      map[y - minY].push('.')
    }
  }

  for (const instruction of input) {
    for (let i = 1; i < instruction.length; i++) {
      if (instruction[i - 1][0] === instruction[i][0]) {
        // vertical
        const X = instruction[i - 1][0]
        for (let Y = Math.min(instruction[i - 1][1], instruction[i][1]); Y <= Math.max(instruction[i - 1][1], instruction[i][1]); Y++) {
          map[Y - minY][X - minX] = '#'
        }
      } else if (instruction[i - 1][1] === instruction[i][1]) {
        // horizontal
        const Y = instruction[i - 1][1]
        for (let X = Math.min(instruction[i - 1][0], instruction[i][0]); X <= Math.max(instruction[i - 1][0], instruction[i][0]); X++) {
          map[Y - minY][X - minX] = '#'
        }
      } else throw new Error('illegal line')
    }
  }

  const maxSteps = 1000000
  let steps = 0
  while (steps < maxSteps) {
    steps++
    try {
      injectWithFloor(map, [500, 0], { minY, minX, maxY, maxX })
    } catch (err) {
      if (err.message !== 'FULL') throw err
      break
    }
  }

  // console.log(map.map(row => row.join('')).join('\n'))
  console.log('injected sand', steps)
}

part1()
  .then(console.log, console.error)
