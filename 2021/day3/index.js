const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const matrix = input
    .split('\n')
    .filter(x => x !== '')
    .map(x => Array.from(x).map(v => parseInt(v, 10)))
  const lines = matrix.length
  const length = matrix[0].length
  const result = matrix
    .reduce((accumulator, currentValue) => {
      for (let i = 0; i < length; i++) {
        accumulator[i] += currentValue[i]
      }
      return accumulator
    }, (new Array(length)).fill(0))
    .map(x => x * 2 >= lines ? 1 : 0)
  const gammaBinaryArray = result
  const epsilonBinaryArray = result.map(x => x === 0 ? 1 : 0)

  const gamma = parseInt(gammaBinaryArray.join(''), 2)
  const epsilon = parseInt(epsilonBinaryArray.join(''), 2)

  const powerConsumption = gamma * epsilon
  console.log('power consumption', powerConsumption)
}

const countBits = matrix => {
  const lines = matrix.length
  const length = matrix[0].length
  return matrix
    .reduce((accumulator, currentValue) => {
      for (let i = 0; i < length; i++) {
        accumulator[i] += currentValue[i]
      }
      return accumulator
    }, (new Array(length)).fill(0))
    .map(x => x * 2 >= lines ? 1 : 0)
}

const part2 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const matrix = input
    .split('\n')
    .filter(x => x !== '')
    .map(x => Array.from(x).map(v => parseInt(v, 10)))

  // Oxygen
  let intermediaryMatrix = JSON.parse(JSON.stringify(matrix))
  for (let i = 0; i < matrix[0].length; i++) {
    const leadingBits = countBits(intermediaryMatrix)
    intermediaryMatrix = intermediaryMatrix.filter(x => x[i] === leadingBits[i])
    if (intermediaryMatrix.length === 1) break
  }
  const oxygenBinaryArray = intermediaryMatrix[0]
  const oxygen = parseInt(oxygenBinaryArray.join(''), 2)

  // CO2
  intermediaryMatrix = JSON.parse(JSON.stringify(matrix))
  for (let i = 0; i < matrix[0].length; i++) {
    const loosingBits = countBits(intermediaryMatrix).map(x => x === 0 ? 1 : 0)
    intermediaryMatrix = intermediaryMatrix.filter(x => x[i] === loosingBits[i])
    if (intermediaryMatrix.length === 1) break
  }
  const CO2BinaryArray = intermediaryMatrix[0]
  const CO2 = parseInt(CO2BinaryArray.join(''), 2)

  console.log('oxygen', oxygen)
  console.log('CO2', CO2)

  console.log('Life support rating', CO2 * oxygen)
}

part1()
  .catch(console.error)

part2()
  .catch(console.error)
