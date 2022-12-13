const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))

  const { map, S, E } = parseMap(input)

  const score = calculateScore(S, E, map)

  console.log('optimal path', score)
}

const calculateScore = (S, E, map) => {
  const scores = map.map(row => row.map(() => Infinity))

  let steps = 0

  let X = { ...S, steps: 0 }

  const closed = new Set()
  const open = []

  while (X.row !== E.row || X.col !== E.col) {
    steps++
    const possibleMoves = [
      { row: X.row - 1, col: X.col, type: '^', steps: X.steps + 1, previous: X },
      { row: X.row + 1, col: X.col, type: 'v', steps: X.steps + 1, previous: X },
      { row: X.row, col: X.col + 1, type: '>', steps: X.steps + 1, previous: X },
      { row: X.row, col: X.col - 1, type: '<', steps: X.steps + 1, previous: X },
    ]
      .filter(to => !closed.has(`${to.row},${to.col}`))
      .filter(to => testMove(X, to, map))

    if (possibleMoves.length === 0) closed.add(`${X.row},${X.col}`)

    for (const to of possibleMoves) {
      if (scores[to.row][to.col] > to.steps) {
        scores[X.row][X.col] = to.steps
        const toIdx = open.findIndex(x => x.row === to.row && x.col === to.col)
        if (toIdx !== -1) open.splice(toIdx, 1, to)
        else open.push(to)
      }
    }
    if (open.length > 0) {
      open.sort((a, b) => scores[b.row][b.col] - scores[a.row][a.col])
      X = open.shift()
    } else X = null
    if (steps > 100000) throw new Error('too many steps')
    if (X === null) throw new Error('no open move')
  }

  // console.log('finished\n', buildPath(X, S, map), '\n')

  return scores[X.previous.row][X.previous.col]
}

const buildPath = (E, S, map) => {
  let X = E
  const finalPath = map.map(row => row.map(() => '.'))
  finalPath[X.row][X.col] = 'E'
  while (X.row !== S.row || X.col !== S.col) {
    finalPath[X.previous.row][X.previous.col] = X.type
    X = X.previous
  }
  return finalPath.map(row => row.join('')).join('\n')
}

const parseMap = rawInput => {
  const input = rawInput
    .split('\n')
    .filter(x => x !== '')
    .map(x => x.split('').filter(y => y !== ''))

  let S, E
  const map = []
  const scores = []
  const finalPath = []
  for (let row = 0; row < input.length; row++) {
    map.push([])
    scores.push([])
    finalPath.push([])
    for (let col = 0; col < input[0].length; col++) {
      scores[row].push(Infinity)
      finalPath[row].push('.')
      if (input[row][col] === 'S') {
        if (!S) S = { row, col }
        map[row][col] = 'a'.charCodeAt(0) - 'a'.charCodeAt(0)
      } else if (input[row][col] === 'E') {
        if (!E) E = { row, col }
        map[row][col] = 'z'.charCodeAt(0) - 'a'.charCodeAt(0)
      } else map[row][col] = input[row][col].charCodeAt(0) - 'a'.charCodeAt(0)
    }
  }

  if (!S || !E) throw new Error('S or E could not be found')
  return {
    map,
    S,
    E
  }
}

const testMove = (from, to, map) => {
  const rows = map.length
  const columns = map[0].length

  if (to.row < 0 || to.row >= rows) return false
  if (to.col < 0 || to.col >= columns) return false
  if (map[to.row][to.col] > map[from.row][from.col] + 1) return false
  return true
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))

  const { map, S, E } = parseMap(input)

  const As = map.reduce((acc, row, rowIdx) => {
    acc.push(...row.reduce((subAcc, val, colIdx) => {
      if (val === 0) subAcc.push({ row: rowIdx, col: colIdx })
      return subAcc
    }, []))
    return acc
  }, [])

  console.log('optimal score',
    As
      .map(a => {
        try {
          return calculateScore(a, E, map)
        } catch (error) {
          if (error.message !== 'no open move') throw error
          return Infinity
        }
      })
      .sort((a, b) => a - b)
    [0]
  )
}

part2()
  .then(console.log, console.error)
