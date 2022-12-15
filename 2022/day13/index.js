const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .filter(x => x !== '')
    .map(pair => pair.split('\n').filter(x => x !== '').map(packet => JSON.parse(packet)))

  let sum = 0

  for (let i = 0; i < input.length; i++) {
    const [left, right] = input[i]
    if (compare(left, right) >= 0) {
      sum += i + 1
    }

  }

  console.log(sum)
}

const compare = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) return 1
    if (left > right) return -1
    if (left === right) return 0
  } else if (left instanceof Array && right instanceof Array) {
    for (let i = 0; i < left.length; i++) {
      if (i >= right.length) return -1
      const comparison = compare(left[i], right[i])
      if (comparison !== 0) return comparison
    }
    if (left.length < right.length) return 1
    return 0
  } else if (typeof left === 'number' && right instanceof Array) {
    return compare([left], right)
  } else if (left instanceof Array && typeof right === 'number') {
    return compare(left, [right])
  } else {
    console.error(left, right)
    throw new Error('unknown types')
  }
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  input.push('[[2]]', '[[6]]')
  const packets = input
    .map(packet => JSON.parse(packet))
    .sort((p1,p2) => compare(p2, p1))

  const divider1 = packets.findIndex(x => x.length === 1 && x[0].length === 1 && x[0][0] === 2) + 1
  const divider2 = packets.findIndex(x => x.length === 1 && x[0].length === 1 && x[0][0] === 6) + 1

  console.log('[[2]]', divider1)
  console.log('[[6]]', divider2)

  console.log(divider1 * divider2)

}

part1()
  .then(console.log, console.error)
