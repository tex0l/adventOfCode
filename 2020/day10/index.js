const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => parseInt(l))
    .sort((a,b) => a - b)

  const highestRated = Math.max(...input)
  const builtInAdapter = highestRated + 3

  input.push(builtInAdapter)

  let joltLevel = 0

  const differences = {
    1: 0,
    2: 0,
    3: 0
  }

  while (input.length > 0) {
    const adapter = input.shift()
    const difference = adapter - joltLevel
    if (difference <= 0) throw new Error('Unsorted input')
    if (difference > 3) throw new Error(`Difference of ${difference} is too high`)
    differences[difference] += 1
    joltLevel = adapter
  }
  console.log(differences[3] * differences[1])
}


const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => parseInt(l))
    .sort((a,b) => a - b)

  const highestRated = Math.max(...input)
  const builtInAdapter = highestRated + 3

  input.push(builtInAdapter)
  input.unshift(0)

  const adaptersCombinations = input.map(adapter => findCandidateAdapter(input, adapter).length)

  console.log(countCombinations(adaptersCombinations))
}

const cache = {}

const countCombinations = (array) => {
  if (array.length === 0 || array[0] === 0) return 1
  if (array[0] === 1) {
    const key = array.slice(1).join(',')
    if (!cache.hasOwnProperty(key)) cache[key] = countCombinations(array.slice(1))
    return cache[key]
  }
  if (array[0] === 2) {
    const key1 = array.slice(1).join(',')
    if (!cache.hasOwnProperty(key1)) cache[key1] = countCombinations(array.slice(1))
    const key2  = array.slice(2).join(',')
    if (!cache.hasOwnProperty(key2)) cache[key2] = countCombinations(array.slice(2))
    return cache[key1] +  cache[key2]
  }
  if (array[0] === 3) {
    const key1 = array.slice(1).join(',')
    if (!cache.hasOwnProperty(key1)) cache[key1] = countCombinations(array.slice(1))
    const key2  = array.slice(2).join(',')
    if (!cache.hasOwnProperty(key2)) cache[key2] = countCombinations(array.slice(2))
    const key3  = array.slice(3).join(',')
    if (!cache.hasOwnProperty(key3)) cache[key3] = countCombinations(array.slice(3))
    return cache[key1] + cache[key2] + cache[key3]
  }
}

const findCandidateAdapter = (adapters, joltLevel) => adapters.filter(adapter => joltLevel < adapter && joltLevel + 3 >= adapter)

part2()
  .catch(console.error)
