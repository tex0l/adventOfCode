const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => {
      let lastOpeningCharacters = []
      for (const character of [...l]) {
        if ('{[(<'.includes(character)) lastOpeningCharacters.push(character)
        else if (character !== matchingClosingCharacter(lastOpeningCharacters.pop())) return calculatePoints(character)
      }
      return 0
    })
    .filter(l => l !== 0)
    .reduce((acc, value) => acc + value, 0)
  console.log(input)
}

const matchingClosingCharacter = character => {
  if (character === '(') return ')'
  if (character === '{') return '}'
  if (character === '[') return ']'
  if (character === '<') return '>'
}

const calculatePoints = character => {
  if (character === ')') return 3
  if (character === ']') return 57
  if (character === '}') return 1197
  if (character === '>') return 25137
}

const calculatePoints2 = character => {
  if (character === ')') return 1
  if (character === ']') return 2
  if (character === '}') return 3
  if (character === '>') return 4
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => {
      let lastOpeningCharacters = []
      for (const character of [...l]) {
        if ('{[(<'.includes(character)) lastOpeningCharacters.push(character)
        else if (character !== matchingClosingCharacter(lastOpeningCharacters.pop())) return false
      }
      return lastOpeningCharacters.reverse().map(matchingClosingCharacter).join('')
    })
    .filter(l => l !== false)
    .map(completionString => [...completionString].reduce((acc, value) => acc * 5 + calculatePoints2(value), 0))
    .sort((a,b) => a - b)
  console.log(input[Math.floor(input.length / 2)])
}

part2()
  .catch(console.error)
