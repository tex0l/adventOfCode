const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => {
      const row = parseInt(l.slice(0, 7).replace(/F/g,'0').replace(/B/g, '1'), 2)
      const column = parseInt(l.slice(7, 10).replace(/R/g,'1').replace(/L/g, '0'), 2)
      return row * 8 + column
    })
    .sort((a, b) => b - a)
    .shift()
  console.log(input)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => {
      const row = parseInt(l.slice(0, 7).replace(/F/g,'0').replace(/B/g, '1'), 2)
      const column = parseInt(l.slice(7, 10).replace(/R/g,'1').replace(/L/g, '0'), 2)
      return {row, column}
    })
    .filter(({ row, column }) => row !== 0 && row !== 127)
    .map(({row, column}) => row * 8 + column)
    .sort((a, b) => b - a)
    .filter((val, index, array) => {
      if (index !== 0 && array[index - 1] !== val + 1) return true
      if (index !== array.length - 1 && array[index + 1] !== val - 1) return true
    })
  console.log(input)
}

part2()
  .catch(console.error)
