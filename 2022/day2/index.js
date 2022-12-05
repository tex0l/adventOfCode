const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const play = (opponentMove, yourMove) => {
  if (opponentMove === 'A') {
    if (yourMove === 'X') return 0
    else if (yourMove === 'Y') return 1
    else if (yourMove === 'Z') return -1
    else throw new Error('Unknown move' + yourMove)
  } else if (opponentMove === 'B') {
    if (yourMove === 'X') return -1
    else if (yourMove === 'Y') return 0
    else if (yourMove === 'Z') return 1
    else throw new Error('Unknown move' + yourMove)
  } else if (opponentMove === 'C') {
    if (yourMove === 'X') return 1
    else if (yourMove === 'Y') return -1
    else if (yourMove === 'Z') return 0
    else throw new Error('Unknown move' + yourMove)
  } else throw new Error('Unknown move' + opponentMove)
}

const scoreForYourMove = yourMove => {
  if (yourMove === 'X') return 1
  else if (yourMove === 'Y') return 2
  else if (yourMove === 'Z') return 3
  else throw new Error('Unknown move' + yourMove)
}

const scoreForGame = result => {
  if (result === 0) return 3
  else if (result === -1) return 0
  else if (result === 1) return 6
  else throw new Error('Unknown result' + result)
}

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(round => round.split(' ').filter(x => x !== ''))
    .reduce((acc, curr) => {
      return acc + scoreForGame(play(curr[0], curr[1])) + scoreForYourMove(curr[1])
    }, 0)

  console.log(input)
}

const findMove = (opponentMove, instruction) => {
  if (opponentMove === 'A') { // rock
    if (instruction === 'X') return 'C' // rock + scissors = lose
    else if (instruction === 'Y') return 'A' // rock + rock = draw
    else if (instruction === 'Z') return 'B' // rock + paper = win
    else throw new Error('Unknown instruction' + instruction)
  } else if (opponentMove === 'B') { // paper
    if (instruction === 'X') return 'A' // paper + rock = lose
    else if (instruction === 'Y') return 'B' // paper + paper = draw
    else if (instruction === 'Z') return 'C' // paper + scissors = win
    else throw new Error('Unknown instruction' + instruction)
  } else if (opponentMove === 'C') { // scissors
    if (instruction === 'X') return 'B' // scissors + paper = lose
    else if (instruction === 'Y') return 'C' // scissors + scissors = draw
    else if (instruction === 'Z') return 'A'  // scissors + rock = win
    else throw new Error('Unknown instruction' + instruction)
  } else throw new Error('Unknown move' + opponentMove)
}

const mapMove = newSystemMove => {
  if (newSystemMove === 'A') return 'X'
  else if (newSystemMove === 'B') return 'Y'
  else if (newSystemMove === 'C') return 'Z'
  else throw new Error('Unknown move', newSystemMove)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(round => round.split(' ').filter(x => x !== ''))
    .map(([opponentMove, instruction]) => {
      return [opponentMove, mapMove(findMove(opponentMove, instruction))]
    })
    .reduce((acc, curr) => {
      return acc + scoreForGame(play(curr[0], curr[1])) + scoreForYourMove(curr[1])
    }, 0)

  console.log(input)
}


part2()
  .then(console.log, console.error)
