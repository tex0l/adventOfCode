const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

class ScoreQueue {
  constructor () {
    this.values = []
  }

  enqueue (value, score) {
    const pivotalIndex = this.values.findIndex(({ score: s }) => s > score)
    if (pivotalIndex === -1) this.values.push({value, score})
    if (pivotalIndex === 0) this.values.unshift({value, score})
    else this.values.splice(pivotalIndex - 1, 0, { value, score })
  }

  dequeue () {
    return this.values.shift().value
  }

  has (el) {
    return this.values.filter(({value}) => value.x === el.x && value.y === el.y).length > 0
  }
}

const part1 = async () => {
  const risks = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(l => l.split('').map(x => parseInt(x)))

  const startPoint = { x: 0, y: 0 }
  const endPoint = { x: risks[0].length - 1, y: risks.length - 1 }

  const map = convertMap(risks)

  const { foundPath, score } = getShortestPath(map, startPoint, endPoint)

  console.log('map:')
  console.log(risks.map((l, y) => l.map((n, x) => foundPath.filter(point => point.x === x && point.y === y).length > 0 ? n : ' ')).map(l => l.join('')).join('\n'))
  console.log('score:', score)
}

const calculateDistance = (pointA, pointB) => Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y)

const getAdjacentPoints = (point, { x: maxX, y: maxY }) => {
  const res = [
    // { x: point.x - 1, y: point.y - 1 },
    { x: point.x - 1, y: point.y },
    // { x: point.x - 1, y: point.y + 1 },
    { x: point.x, y: point.y - 1 },

    { x: point.x, y: point.y + 1 },
    // { x: point.x + 1, y: point.y - 1 },
    { x: point.x + 1, y: point.y },
    // { x: point.x + 1, y: point.y + 1 },
  ]
  return res.filter(({ x, y }) => x >= 0 && y >= 0 && x <= maxX && y <= maxY)
}

const convertMap = map => {
  const result = {}
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      result[`${x}_${y}`] = map[y][x]
    }
  }
  return result
}

const getShortestPath = (map, startPoint, endPoint) => {
  const origin = {}
  const scoresTo = {}

  scoresTo[`${startPoint.x}_${startPoint.y}`] = 0

  const pointsToAnalyze = new ScoreQueue()

  pointsToAnalyze.enqueue(startPoint, 0)

  while (pointsToAnalyze.values.length > 0) {
    const point = pointsToAnalyze.dequeue()
    if (point.x === endPoint.x && point.y === endPoint.y) break
    const adjacentPoints = getAdjacentPoints(point, endPoint)
    for (const adjacentPoint of adjacentPoints) {
      const scoreTo = scoresTo[`${point.x}_${point.y}`] + map[`${adjacentPoint.x}_${adjacentPoint.y}`]
      if (!scoresTo.hasOwnProperty(`${adjacentPoint.x}_${adjacentPoint.y}`) || scoresTo[`${adjacentPoint.x}_${adjacentPoint.y}`] > scoreTo) {
        origin[`${adjacentPoint.x}_${adjacentPoint.y}`] = point
        scoresTo[`${adjacentPoint.x}_${adjacentPoint.y}`] = scoreTo
        if (!pointsToAnalyze.has(adjacentPoint)) pointsToAnalyze.enqueue(adjacentPoint, scoreTo + calculateDistance(adjacentPoint, endPoint))
      }
    }
  }

  let point = endPoint
  const foundPath = []
  let score = 0
  while (true) {
    foundPath.unshift(point)
    if (point.x === startPoint.x && point.y === startPoint.y) break
    score += map[`${point.x}_${point.y}`]
    point = origin[`${point.x}_${point.y}`]
    if (point === null) throw new Error('path invalid')
    if (foundPath.filter(p => p.x === point.x && p.y === point.y).length > 0) throw new Error('path looped')
  }

  return { foundPath, score }
}

const getNewRisk = (risk, offset) => (risk + offset - 1) % 9 + 1

const part2 = async () => {
  const t0 = new Date()
  const risks = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(l => l.split('').map(x => parseInt(x)))

  const startPoint = { x: 0, y: 0 }
  const endPoint = { x: risks[0].length * 5 - 1, y: risks.length * 5 - 1 }

  const map = new Proxy(risks, {
    get: function(target, prop) {
      const [X, Y] = prop.split('_').map(x => parseInt(x))
      const x = X % risks[0].length
      const y = Y % risks.length
      const XTileOffset = (X - x) / risks[0].length
      const YTileOffset = (Y - y) / risks.length
      return getNewRisk(risks[y][x], XTileOffset + YTileOffset)
    }
  })

  const { score } = getShortestPath(map, startPoint, endPoint)

  console.log('score:', score)
  const t1 = new Date()
  console.log(`computed in: ${t1 - t0} ms`)
}

part2()
  .catch(console.error)
