const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .filter(x => x !== '')
    .map(elf => elf.split('\n').filter(x => x !== '').map(x => parseInt(x, 10)).reduce((prev, curr) => prev + curr, 0)).sort((a,b) => b-a)

  console.log(input[0])
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .filter(x => x !== '')
    .map(elf => elf.split('\n').filter(x => x !== '').map(x => parseInt(x, 10)).reduce((prev, curr) => prev + curr, 0)).sort((a,b) => b-a)

  console.log(input[0] + input[1] + input[2])
}

part2()
  .then(console.log, console.error)
