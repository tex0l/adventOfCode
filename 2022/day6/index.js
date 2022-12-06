const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const findStartOfPacket = (input, length) => {
  const map = new Map()
  for (let i = 0; i < input.length; i++) {
    if (map.has(input[i])) map.set(input[i], map.get(input[i]) + 1)
    else map.set(input[i], 1)
    if (i >= length) {
      if (map.get(input[i - length]) === 1) map.delete(input[i - length])
      else map.set(input[i - length], map.get(input[i - length]) - 1)
    }
    if (map.size === length) {
      return i + 1
    }
  }
  throw new Error('No start of packet found')
}

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '').pop()

  console.log(findStartOfPacket(input, 4))
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '').pop()

  console.log(findStartOfPacket(input, 14))
}

part1()
  .then(console.log, console.error)
