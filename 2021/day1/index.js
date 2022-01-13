const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const result = input
    .split('\n')
    .filter(x => x !== '')
    .map(x => parseInt(x, 10))
    .reduce((accumulator, currentValue, currentIndex, array) => {
      if (currentIndex !== 0 && array[currentIndex - 1] < currentValue) return accumulator + 1
      else return accumulator
    }, 0)
  console.log('result is', result)
}

const part2 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const result = input
    .split('\n')
    .filter(x => x !== '')
    .map(x => parseInt(x, 10))
    .reduce((accumulator, currentValue, currentIndex, array) => {
      if (currentIndex >= 2) { accumulator.push(currentValue + array[currentIndex - 1] + array[currentIndex - 2]) }
      return accumulator
    }, [])
    .reduce((accumulator, currentValue, currentIndex, array) => {
      if (currentIndex !== 0 && array[currentIndex - 1] < currentValue) return accumulator + 1
      else return accumulator
    }, 0)
  console.log('result is', result)
}


part1()
  .catch(console.error)

part2()
  .catch(console.error)
