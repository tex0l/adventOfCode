const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const players = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => ({.../Player (?<player>[0-9]+) starting position: (?<position>[0-9]+)/.exec(x).groups, score: 0}))
    .map(x => ({player: parseInt(x.player), position: parseInt(x.position), score: x.score}))

  while (players.every(player => player.score < 1000)) {
    playRound(players)
  }
  console.log(players)
  console.log('rolls', rolls)
  console.log('bad score', players.find(player => player.score < 1000).score)
  console.log(players.find(player => player.score < 1000).score * rolls)
}

let die = 1
let rolls = 0
const rollDie = () => {
  rolls += 1
  const result = die
  die += 1
  if (die === 101) die = 1
  return result
}

const calculatePosition = (distance, startingPosition, size = 10) => (distance + startingPosition - 1) % size + 1

const playRound = players => {
  for (const player of players) {
    const distance = rollDie() + rollDie() + rollDie()
    console.log(`go from ${player.position} to ${calculatePosition(distance, player.position)}`)
    player.position = calculatePosition(distance, player.position)
    player.score += player.position
    console.log(`score for player ${player.player} now equals ${player.score}`)
    if (player.score >= 1000) return
  }
}

const possibleDistances = new Map()

for (let i = 0; i < 27; i++) {
  const distance = i.toString(3).padStart(3, '0').split('').map(x => parseInt(x, 10) + 1).reduce((acc, val) => acc + val, 0)
  if (!possibleDistances.has(distance)) possibleDistances.set(distance, 0)
  possibleDistances.set(distance, possibleDistances.get(distance) + 1)
}

const part2 = async () => {
  const players = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => ({.../Player (?<player>[0-9]+) starting position: (?<position>[0-9]+)/.exec(x).groups, score: 0}))
    .map(x => ({player: parseInt(x.player), position: parseInt(x.position), score: x.score}))

  let quantumState = {
    [serializeGame({
      player: 'player1',
      player1: players[0],
      player2: players[1],
    })]: 1n
  }

  const count = {
    player1: 0n,
    player2: 0n
  }

  while (Object.keys(quantumState).length > 0) {
    quantumState = playQuantumRound(quantumState, count)
  }
  console.log(count)
  if (count.player1 - count.player2 > 0n) console.log(count.player1)
  else console.log(count.player2)
}

const serializePlayer = ({position, score}) => `${position}_${score}`

const deserializePlayer = player => {
  const [position, score] = player.split('_')
  return { position: parseInt(position), score: parseInt(score) }
}

const serializeGame = ({player, player1, player2}) => `${player}-${serializePlayer(player1)}-${serializePlayer(player2)}`

const deserializeGame = game => {
  let [player, player1, player2] = game.split('-')
  return {
    player: player,
    player1: deserializePlayer(player1),
    player2: deserializePlayer(player2)
  }
}



const playQuantumRound = (quantumState, count) => {
  const nextQuantumState = {}
  for (const [state, gameOccurences] of Object.entries(quantumState)) {
    const game = deserializeGame(state)
    for (const [distance, _distanceOccurences] of possibleDistances) {
      const distanceOccurences = BigInt(_distanceOccurences)
      const newPosition = calculatePosition(distance, game[game.player].position)
      const newScore = game[game.player].score + newPosition
      if (newScore >= 21) count[game.player] += distanceOccurences * gameOccurences
      else {
        const otherPlayer = game.player === 'player1' ? 'player2' : 'player1'
        const newState = serializeGame({
          player: otherPlayer,
          [game.player]: {position: newPosition, score: newScore},
          [otherPlayer]: game[otherPlayer]
        })
        if (!nextQuantumState.hasOwnProperty(newState)) nextQuantumState[newState] = 0n
        nextQuantumState[newState] += distanceOccurences * gameOccurences
      }
    }
  }
  return nextQuantumState
}
part2()
  .catch(console.error)

