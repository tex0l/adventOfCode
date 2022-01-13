const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(line => line.split(''))

  let map = JSON.parse(JSON.stringify(input))
  let mapSave = null
  let i = 0
  while (JSON.stringify(map) !== mapSave) {
    mapSave = JSON.stringify(map)
    map = moveEast(map)
    map = moveSouth(map)
    i++
  }
  console.log(i)
  // console.log(formatMap(map))
}

const wait = delay => new Promise(resolve => setTimeout(resolve, delay))

const formatMap = input => input.map(l => l.join('')).join('\n')

const moveEast = input => {
  const output = JSON.parse(JSON.stringify(input))
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === '>' && input[y][(x + 1) % input[0].length] === '.') {
        output[y][x] = '.'
        output[y][(x + 1) % input[0].length] = '>'
      }
    }
  }
  return output
}

const moveSouth = input => {
  const output = JSON.parse(JSON.stringify(input))
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === 'v' && input[(y + 1) % input.length][x] === '.') {
        output[y][x] = '.'
        output[(y + 1) % input.length][x] = 'v'
      }
    }
  }
  return output
}

part1()
  .catch(console.error)

