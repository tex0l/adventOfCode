const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const [template, rawPairs] = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')

  const pairs = Object.fromEntries(rawPairs
    .split('\n')
    .filter(x => x !== '')
    .map(l => l.split(' -> ')))

  let input = template

  for (let step = 0; step < 10; step++) {
    input = polymerize(input, pairs)
  }
  const resultCount = count(input)
  const orderedCount = Object.entries(resultCount).sort((a, b) => b[1] - a[1])

  console.log(orderedCount[0][1] - orderedCount[orderedCount.length - 1][1])
}

const polymerize = (input, rules) => {
  let result = '';
  for (let i = 0; i < input.length - 1 ; i++) {
    const pair = `${input[i]}${input[i+1]}`
    if (rules.hasOwnProperty(pair)) result += `${input[i]}${rules[pair]}`
    else result += input[i]
  }
  result += input[input.length -1]
  return result
}

const count = input => {
  const result = {}
  for (let i = 0; i < input.length; i++) {
    if (!result.hasOwnProperty(input[i])) result[input[i]] = 1
    else result[input[i]] += 1
  }
  return result
}

const part2 = async () => {
  const [template, rawPairs] = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')

  const pairs = Object.fromEntries(rawPairs
    .split('\n')
    .filter(x => x !== '')
    .map(l => l.split(' -> ')))

  let input = convertStringToObject(template)

  for (let step = 0; step < 40; step++) {
    input = polymerizeObject(input, pairs)
  }

  const resultCount = countObject(input) // it counts twice every character, except the first and the last (I think)
  const orderedCount = Object.entries(resultCount).sort((a, b) => b[1] - a[1])

  console.log(Math.ceil(orderedCount[0][1] / 2 - orderedCount[orderedCount.length - 1][1] / 2))
}

const convertStringToObject = string => {
  const result = {}
  for (let i = 0; i < string.length - 1 ; i++) {
    const pair = `${string[i]}${string[i+1]}`
    if (!result.hasOwnProperty(pair)) result[pair] = 1
    else result[pair] += 1
  }
  return result
}

const polymerizeObject = (input, rules) => {
  const result = {}
  for (const [pair, qty] of Object.entries(input)) {
    if (rules.hasOwnProperty(pair)) {
      const pair1 = pair[0] + rules[pair]
      const pair2 = rules[pair] + pair[1]
      if (!result.hasOwnProperty(pair1)) result[pair1] = qty
      else result[pair1] += qty
      if (!result.hasOwnProperty(pair2)) result[pair2] = qty
      else result[pair2] += qty
    } else {
      if (!result.hasOwnProperty(pair)) result[pair] = qty
      else result[pair] += qty
    }
  }
  return result
}

const countObject = input => {
  const result = {}
  for (const [pair, qty] of Object.entries(input)) {
    const char1 = pair[0]
    const char2 = pair[1]
    if (!result.hasOwnProperty(char1)) result[char1] = qty
    else result[char1] += qty
    if (!result.hasOwnProperty(char2)) result[char2] = qty
    else result[char2] += qty
  }
  return result
}

part2()
  .catch(console.error)
