const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const monkeyRegex = /^Monkey (?<monkeyIndex>[0-9]+):$/
const attributesRegex = /^ {2}(?<attributeName>.+): (?<attributeRawValue>.+)$/
const testRegex = /^ {4}If (?<condition>[A-z]+): throw to monkey (?<throwTo>[0-9]+)$/
const functionRegex = /new = old (?<symbol>.) (?<otherSide>.+)/
const divisibleRegex = /divisible by (?<divisor>[0-9]+)/

const sum = (x,y) => x + y
const product = (x,y) => x * y
const parseFunction = str => {
  const functionLine = functionRegex.exec(str)
  if (functionLine != null) {
    const {symbol, otherSide} = functionLine.groups
    let f
    if (symbol === '+') f = sum
    else if (symbol === '*') f = product
    else throw new Error(`unknown symbol ${symbol}`)
    if (otherSide === 'old') return x => f(x,x)
    else {
      const parsed = parseInt(otherSide)
      if (Number.isNaN(parsed)) throw new Error(`Other side cannot be parsed ${otherSide}`)
      return x => f(x, parsed)
    }
  } else throw new Error(`Unparsable function ${str}`)
}

const parseDivisible = str => {
  const divisibleLine = divisibleRegex.exec(str)
  if (divisibleLine != null) {
    const { divisor } = divisibleLine.groups
    const parsed = parseInt(divisor)

    if (Number.isNaN(parsed)) throw new Error(`Divisor cannot be parsed ${divisor}`)

    return {divisor, fn: x => x % divisor === 0}
  }
}
/**
 *
 * @param {Array<{divisor: number, counter: number, items:Array<number>, operation:function(number):number, test: function(number): boolean, true:number, false: number}>} monkeys
 */
const playRound = monkeys => {
  for (let i = 0; i < monkeys.length; i++) {
    console.log('Monkey', i)
    const monkey = monkeys[i]
    while (monkey.items.length) {
      monkey.counter++
      const item = monkey.items.shift()
      console.log('Inspect item with worry level', item)
      const newItem = Math.floor(monkey.operation(item) / 3)
      console.log('Item is now at level', newItem)
      console.log(monkey.test.toString())
      if (monkey.test(newItem)) {
        console.log('test is true, sending to monkey', monkey.true)
        monkeys[monkey.true].items.push(newItem)
      } else {
        console.log('test is false, sending to monkey', monkey.false)
        monkeys[monkey.false].items.push(newItem)
      }
    }
  }
}
/**
 *
 * @return {Array<{divisor: number, counter: number, items:Array<number>, operation:function(number):number, test: function(number): boolean, true:number, false: number}>}
 */
const parseInput = input => input
  .reduce((acc, value) => {
  const monkeyLine = monkeyRegex.exec(value)
  if (monkeyLine != null) {
    const { monkeyIndex } = monkeyLine.groups
    acc.push({
      index: monkeyIndex,
      counter: 0
    })
    return acc
  }

  const testLine = testRegex.exec(value)
  if (testLine != null) {
    const {condition, throwTo} = testLine.groups
    const parsedThrowTo = parseInt(throwTo)
    if (Number.isNaN(parsedThrowTo)) throw new Error(`Unparsable monkey index ${throwTo}`)
    if (condition === 'true') {
      acc[acc.length - 1].true = parsedThrowTo
    } else if (condition === 'false') {
      acc[acc.length - 1].false = parsedThrowTo
    } else throw new Error(`Unknown condition ${condition}`)
    return acc
  }

  const attributeLine = attributesRegex.exec(value)
  if (attributeLine != null) {
    const {attributeName, attributeRawValue} = attributeLine.groups
    if (attributeName === 'Starting items') {
      acc[acc.length - 1].items = attributeRawValue.split(',').filter(x => x !== '').map(x => parseInt(x.trim()))
    } else if (attributeName === 'Operation') {
      acc[acc.length - 1].operation = parseFunction(attributeRawValue)
    } else if (attributeName === 'Test') {
      const {fn, divisor} = parseDivisible(attributeRawValue)
      acc[acc.length - 1].test = fn
      acc[acc.length - 1].divisor = divisor
    } else throw new Error(`Unknown attribute name ${attributeName}`)
    return acc
  }

  throw new Error(`Unparsable line ${value}`)
}, [])


const part1 = async () => {
  const input = parseInput((await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== ''))

  let state = input
  console.log('round 0', state.map(x => ({index: x.index, items: x.items, counter: x.counter})))

  for (let round = 1; round <= 20; round++) {
    playRound(input)
    console.log('round', round, state.map(x => ({index: x.index, items: x.items, counter: x.counter})))
  }

  input.sort((a,b) => b.counter - a.counter)
  console.log(input[0].counter * input[1].counter)
}

const part2 = async () => {
  const input = parseInput((await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== ''))

  const productOfDivisors = input.reduce((acc,val) => {
    return acc * val.divisor
  }, 1)

  let state = input
  console.log('round 0', state.map(x => ({index: x.index, items: x.items, counter: x.counter})))

  for (let round = 1; round <= 10000; round++) {
    playRound2(input, productOfDivisors)
    console.log('round', round, state.map(x => ({index: x.index, items: x.items, counter: x.counter})))
  }

  input.sort((a,b) => b.counter - a.counter)
  console.log(input[0].counter * input[1].counter)
}

const playRound2 = (monkeys, productOfDivisors) => {
  for (let i = 0; i < monkeys.length; i++) {
    console.log('Monkey', i)
    const monkey = monkeys[i]
    while (monkey.items.length) {
      monkey.counter++
      const item = monkey.items.shift()
      console.log('Inspect item with worry level', item)
      const newItem = monkey.operation(item) % productOfDivisors
      console.log('Item is now at level', newItem)
      console.log(monkey.test.toString())
      if (monkey.test(newItem)) {
        console.log('test is true, sending to monkey', monkey.true)
        monkeys[monkey.true].items.push(newItem)
      } else {
        console.log('test is false, sending to monkey', monkey.false)
        monkeys[monkey.false].items.push(newItem)
      }
    }
  }
}

part2()
  .then(console.log, console.error)
