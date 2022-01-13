const fs = require('fs/promises')
const path = require('path')
const inputPath = './input-test.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => /(?<operation>[a-z]{3}) (?<sign>[\+\-])(?<value>[0-9]+)/.exec(l))
    .map(({groups}) => ({...groups}))

  const order = new Array(input.length).fill(-1)

  let index = 0
  let i = 0
  let acc = 0

  while (true) {
    if (order[i] === -1) order[i] = index
    else break
    index++
    const res = processInstruction({ i, acc }, input[i])
    i = res.i
    acc = res.acc
  }

  console.log(acc)
}

const processInstruction = ({ i, acc }, { operation, sign, value }) => {
  if (operation === 'nop') return { i: i + 1, acc: acc }
  if (operation === 'acc') return { i: i + 1, acc: acc + value * (sign === '+' ? 1 : -1) }
  if (operation === 'jmp') return { i: i + value * (sign === '+' ? 1 : -1), acc: acc }
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => /(?<operation>[a-z]{3}) (?<sign>[\+\-])(?<value>[0-9]+)/.exec(l))
    .map(({groups}) => ({...groups}))

  for (let i = 0; i < input.length; i++) {
    const newInput = JSON.parse(JSON.stringify(input))
    if (newInput[i].operation === 'nop') newInput[i].operation = 'jmp'
    if (newInput[i].operation === 'jmp') newInput[i].operation = 'nop'
    const acc = testProgram(newInput)
    if (acc !== false) console.log(acc)
  }
}

const testProgram = input => {
  const order = new Array(input.length).fill(-1)

  let index = 0
  let i = 0
  let acc = 0

  while (true) {
    if (i === input.length) return acc
    if (order[i] === -1) order[i] = index
    else return false
    index++
    const res = processInstruction({ i, acc }, input[i])
    i = res.i
    acc = res.acc
  }
}

part2()
  .catch(console.error)
