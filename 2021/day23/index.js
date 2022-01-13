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
    return this.values.filter(({value}) => value.map === el && value.map === el).length > 0
  }

  del (el) {
    const elIdx = this.values.findIndex(({value}) => value.map === el && value.map === el)
    if (elIdx !== -1) this.values.splice(elIdx, 1)
  }
}

const part1 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')

  const moves = new ScoreQueue()

  console.log(formatMap(parseMap(input)))

  moves.enqueue({ cost: 0, map: input, path: [input] }, howBadEstimate(input))

  const finishedMaps = []
  const costs = { [input]: 0 }
  while (moves.values.length > 0) {
    const { map, cost, path } = moves.dequeue()
    if (isMapDone(map)) {
      console.log('finished')
      path.forEach(subMap => console.log(subMap))
      finishedMaps.push(cost)
      break
    }
    findAvailableMoves(map).forEach(({cost: extraCost, map: newMap}) => {
      const newCost = extraCost + cost
      const newPath = JSON.parse(JSON.stringify(path))
      newPath.push(newMap)
      if (!costs.hasOwnProperty(newMap) || costs[newMap] > newCost) {

        if (moves.has(newMap)) moves.del(newMap)
        costs[newMap] = newCost

        moves.enqueue({ map: newMap, cost: newCost, path: newPath }, newCost + howBadEstimate(newMap))
      }
    })
  }
  console.log(finishedMaps.sort((a, b) => b - a))
}

const howBadEstimate = input => {
  const {hallway, rooms} = parseMap(input)
  let estimate = 0
  hallway.forEach((spot, spotIndex) => {
    if (spot !== '.') estimate += costFactor(spot) * Math.abs(spotIndex - roomIndexForSpot(spot) * 2 - 2) + 2
  })

  rooms[0].filter(x => x !== 'A').forEach(spot => {
    if (spot !== '.') estimate += costFactor(spot) * Math.abs(0 + 2 - roomIndexForSpot(spot) * 2 - 2) + 4
  })

  rooms[1].filter(x => x !== 'B').forEach(spot => {
    if (spot !== '.') estimate += costFactor(spot) * Math.abs(2 * 2 + 2 - roomIndexForSpot(spot) * 2 - 2) + 4
  })

  rooms[2].filter(x => x !== 'C').forEach(spot => {
    if (spot !== '.') estimate += costFactor(spot) * Math.abs(4 * 2 + 2 - roomIndexForSpot(spot) * 2 - 2) + 4
  })

  rooms[3].filter(x => x !== 'D').forEach(spot => {
    if (spot !== '.') estimate += costFactor(spot) * Math.abs(6 * 2 + 2 - roomIndexForSpot(spot) * 2 - 2) + 4
  })

  return estimate
}

const costFactor = spot => ({A: 1, B: 10, C: 100, D: 1000}[spot])

const roomIndexForSpot = spot => ({A: 0, B: 1, C: 2, D: 3}[spot])

const isMapDone = input => {
  const {hallway, rooms} = parseMap(input)
  if (hallway.some(x => x !== '.')) return false
  if (rooms[0].some(x => x !== 'A')) return false
  if (rooms[1].some(x => x !== 'B')) return false
  if (rooms[2].some(x => x !== 'C')) return false
  if (rooms[3].some(x => x !== 'D')) return false
  return true
}

const findEmptyDepthForRoom = room => {
  const emptyDepth = room.findIndex(x => x !== '.')
  if (emptyDepth === 0) return
  if (emptyDepth === -1) return room.length - 1
  else return emptyDepth - 1
}

const findMovesToRoom = (input, {spot, room, spotIndex, roomIndex}) => {
  const moves = []
  if (roomIndexForSpot(spot) !== roomIndex) return moves
  if (room.filter(x => x !== '.').some(x => x !== spot)) return moves
  const emptyDepth = findEmptyDepthForRoom(room)
  const { hallway: newHallway, rooms } = parseMap(input)
  const roomIndexInHallway = roomIndex * 2 + 2
  let start, end
  if (spotIndex > roomIndexInHallway) {
    start = roomIndexInHallway
    end = spotIndex
  } else {
    start = spotIndex + 1
    end = roomIndexInHallway
  }
  if (newHallway.slice(start, end).every(x => x === '.')) {
    newHallway[spotIndex] = '.'
    rooms[roomIndex][emptyDepth] = spot
    moves.push({
      cost: costFactor(spot) * (Math.abs(spotIndex - roomIndex * 2 - 2) + 1 + emptyDepth),
      map: formatMap({ hallway: newHallway, rooms })
    })
  }
  return moves
}

const HALLWAY_ALLOWED_INDEXES = [0, 1, 3, 5, 7, 9, 10]

const findMovesToHallway = (input, {room, roomIndex, hallway}) => {
  const moves = []
  if (room.filter(x => x !== '.').every(x => roomIndexForSpot(x) === roomIndex)) return moves // do not empty room if spots are in the right place
  const emptyDepth = findEmptyDepthForRoom(room)
  if (emptyDepth === room.length - 1) return moves
  const firstElIndex = emptyDepth === undefined ? 0 : emptyDepth + 1
  const spot = room[firstElIndex]
  HALLWAY_ALLOWED_INDEXES
    .filter(index => hallway[index] === '.')
    .forEach(index => {
      const { hallway: newHallway, rooms } = parseMap(input)
      if (hallway.slice(Math.min(index, roomIndex * 2 + 2), Math.max(index, roomIndex * 2 + 2) + 1).every(x => x === '.')) {
        newHallway[index] = spot
        rooms[roomIndex][firstElIndex] = '.'
        moves.push({
          cost: costFactor(spot) * (Math.abs(index - roomIndex * 2 - 2) + 1 + firstElIndex),
          map: formatMap({ hallway: newHallway, rooms })
        })
      }
    })
  return moves
}

const findAvailableMoves = input => {
  const moves = []
  const { hallway, rooms } = parseMap(input)
  // from hallway to room
  hallway.forEach((spot, spotIndex) => {
    if (spot !== '.') {
      moves.push(...findMovesToRoom(input, {roomIndex: 0, room: rooms[0], spotIndex, spot}))
      moves.push(...findMovesToRoom(input, {roomIndex: 1, room: rooms[1], spotIndex, spot}))
      moves.push(...findMovesToRoom(input, {roomIndex: 2, room: rooms[2], spotIndex, spot}))
      moves.push(...findMovesToRoom(input, {roomIndex: 3, room: rooms[3], spotIndex, spot}))
    }
  })
  // from rooms to hallway
  rooms.forEach((room, roomIndex) => {
    moves.push(...findMovesToHallway(input, {room, roomIndex, hallway}))
  })
  // moves.forEach(x => console.log(`${x.cost}\n${x.map}`))
  return moves
}

const parseMap = rawInput => {
  const input = rawInput.split('\n')
    .filter(x => x !== '')
    .map(line => line.split(''))
  const hallway = input[1].slice(1, input[1].length - 1)

  const rooms = [[], [], [], []]

  const roomDepth = input.length - 3
  for (let i = 0; i < roomDepth; i++) {
    rooms[0].push(input[i + 2][3])
    rooms[1].push(input[i + 2][5])
    rooms[2].push(input[i + 2][7])
    rooms[3].push(input[i + 2][9])
  }


  return { hallway, rooms }
}

const formatMap = ({ hallway, rooms }) => {
  let res = `#############
#${hallway.join('')}#
###${rooms[0][0]}#${rooms[1][0]}#${rooms[2][0]}#${rooms[3][0]}###
`
  for (let i = 1; i < rooms[0].length; i++) {
    res += `  #${rooms[0][i]}#${rooms[1][i]}#${rooms[2][i]}#${rooms[3][i]}#
`
  }
  res += `  #########`
  return res
}

part1()
  .catch(console.error)

