const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => parseInt(x, 10))

  console.log('result is', input.find(n => input.includes(2020 - n)) * (2020 - input.find(n => input.includes(2020 - n))))
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => parseInt(x, 10))

  for (const v1 of input) {
    for (const v2 of input) {
      for (const v3 of input) {
        if (v1 + v2 + v3 === 2020) {
          console.log(v1 * v2 * v3)
          return
        }
      }
    }
  }
}

part2()
  .catch(console.error)
