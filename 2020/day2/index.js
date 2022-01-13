const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const countChar = (char, password) => [...password].filter(x => x === char).length


const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => x.split(': '))
    .map(([rule, password]) => {
      const [minMax, char] = rule.split(' ')
      const [min, max] = minMax.split('-')
      return min <= countChar(char, password) && countChar(char, password) <= max
    })
  console.log(input.filter(x => x === true).length)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => x.split(': '))
    .map(([rule, password]) => {
      const [positions, char] = rule.split(' ')
      const [pos1, pos2] = positions.split('-').map(x => parseInt(x) - 1)
      return (password[pos1] === char && password[pos2] !== char) || (password[pos1] !== char && password[pos2] === char)
    })
  console.log(input.filter(x => x === true).length)
}

part2()
  .catch(console.error)
