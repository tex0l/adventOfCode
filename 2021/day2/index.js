const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const result = input
    .split('\n')
    .filter(x => x !== '')
    .map(x => {
      let [direction, amount] = x.split(' ')
      amount = parseInt(amount, 10)
      if (direction === 'forward') return [amount, 0]
      if (direction === 'up') return [0, -amount]
      if (direction === 'down') return [0, amount]
      else throw new Error(`Instructions unclear: ${x}`)
    })
    .reduce((accumulator, currentValue) => {
      accumulator[0] = accumulator[0] + currentValue[0]
      accumulator[1] = accumulator[1] + currentValue[1]
      return accumulator
    }, [0, 0])
  console.log('final position is', result)
  console.log('result is', result[0] * result[1])
}

const part2 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const result = input
    .split('\n')
    .filter(x => x !== '')
    .map(x => {
      let [direction, rawValue] = x.split(' ')
      return {direction, value: parseInt(rawValue, 10)}
    })
    .reduce((accumulator, currentValue) => {
      if (currentValue.direction === 'down') accumulator.aim += currentValue.value
      if (currentValue.direction === 'up') accumulator.aim -= currentValue.value
      if (currentValue.direction === 'forward') {
        accumulator.horizontal += currentValue.value
        accumulator.depth += currentValue.value * accumulator.aim
      }
      return accumulator
    }, { horizontal: 0, depth: 0, aim: 0})
  console.log('final position is', result)
  console.log('result is', result.horizontal * result.depth)
}

part1()
  .catch(console.error)

part2()
  .catch(console.error)
