const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .filter(x => x !== '')

  const map = input[0].split('\n').filter(x => x !== '')
  const instructions = input[1].split('\n').filter(x => x !== '')

  const indexes = map.pop().trimEnd()
  const lastIndex = parseInt(indexes[indexes.length - 1])

  const fullyParsedMap = []

  for (let i = 0; i < lastIndex; i++) {
    fullyParsedMap.push([])
  }

  for (let line of map) {
    for (let i = 1; i < line.length; i+=4) {
      if (line[i] !== ' ') {
        fullyParsedMap[(i - 1) / 4].push(line[i])
      }
    }
  }
  const instructionRegexp = /move (?<qty>\d+) from (?<start>\d+) to (?<end>\d+)/
  instructions.forEach(instruction => {
    const res = instructionRegexp.exec(instruction)
    let { qty, start, end } = res.groups
    qty = parseInt(qty)
    start = parseInt(start)
    end = parseInt(end)
    for (let times = 0; times < qty; times++) {
      fullyParsedMap[end - 1].unshift(fullyParsedMap[start - 1].shift())
    }
  })

  let res = ''

  for (let col of fullyParsedMap) {
    res += col.shift()
  }

  console.log(res)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .filter(x => x !== '')

  const map = input[0].split('\n').filter(x => x !== '')
  const instructions = input[1].split('\n').filter(x => x !== '')

  const indexes = map.pop().trimEnd()
  const lastIndex = parseInt(indexes[indexes.length - 1])

  const fullyParsedMap = []

  for (let i = 0; i < lastIndex; i++) {
    fullyParsedMap.push([])
  }

  for (let line of map) {
    for (let i = 1; i < line.length; i+=4) {
      if (line[i] !== ' ') {
        fullyParsedMap[(i - 1) / 4].push(line[i])
      }
    }
  }
  const instructionRegexp = /move (?<qty>\d+) from (?<start>\d+) to (?<end>\d+)/
  instructions.forEach(instruction => {
    const res = instructionRegexp.exec(instruction)
    let { qty, start, end } = res.groups
    qty = parseInt(qty)
    start = parseInt(start)
    end = parseInt(end)

    fullyParsedMap[end - 1].splice(0, 0, ...fullyParsedMap[start - 1].splice(0, qty))
  })

  let res = ''

  for (let col of fullyParsedMap) {
    res += col.shift()
  }

  console.log(res)
}


part2()
  .then(console.log, console.error)
