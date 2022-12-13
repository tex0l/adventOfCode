const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  let X = 1
  let sum = 0
  let cycle = 1
  let i = 0
  const incrementCycle = () => {
    if (cycle === 20 || cycle === 60 || cycle === 100 || cycle === 140 || cycle === 180 || cycle === 220) {
      console.log('special cycle', X, X * cycle)
      sum += X * cycle
    }
    cycle += 1
  }
  while (i < input.length) {
    let instruction = input[i]
    console.log('instruction', i, instruction)
    i++
    // execution
    if (instruction === 'noop') incrementCycle()
    else if (instruction.startsWith('addx')) {
      incrementCycle()
      incrementCycle()
      instruction = instruction.substring(5)
      let sign = 1
      if (instruction.startsWith('-')) {
        instruction = instruction.substring(1)
        sign = -1
      }
      X += parseInt(instruction) * sign
    }
  }

  console.log(X, sum)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  const crt = []

  for (let row = 0; row < 6; row++) {
    crt[row] = []
    for (let col = 0; col < 40; col++) {
      crt[row][col] = '.'
    }
  }

  const printCRT = crt => {
    console.log(crt.map(row => row.join('')).join('\n'))
  }

  let X = 1
  let cycle = 1
  let i = 0

  let row = 0
  let col = 0
  const incrementCycle = () => {
    const shouldDraw = X - 1 === col || X === col || X + 1 === col
    if (shouldDraw) crt[row][col] = '#'
    row = Math.floor((cycle / 40)) % 6
    col = cycle - row * 40
    cycle += 1
  }
  while (i < input.length) {
    let instruction = input[i]
    i++
    // execution
    if (instruction === 'noop') incrementCycle()
    else if (instruction.startsWith('addx')) {
      incrementCycle()
      incrementCycle()
      instruction = instruction.substring(5)
      let sign = 1
      if (instruction.startsWith('-')) {
        instruction = instruction.substring(1)
        sign = -1
      }
      X += parseInt(instruction) * sign
    }
  }
  printCRT(crt)
}

part2()
  .then(console.log, console.error)
