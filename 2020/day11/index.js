const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => l.split(''))

  let seats = input

  let i = 0
  while (true) {
    const newSeats = process(seats)
    if (JSON.stringify(newSeats) === JSON.stringify(seats)) break
    i++
    seats = newSeats
  }

  // logSeats(seats)
  console.log(seats.flat().filter(char => char === '#').length)
}

const logSeats = seats => console.log(seats.map(l => l.join('')).join('\n'))

const getAdjacentSeats = (seat, { x: maxX, y: maxY }) => {
  const res = [
    { x: seat.x - 1, y: seat.y - 1 },
    { x: seat.x - 1, y: seat.y },
    { x: seat.x - 1, y: seat.y + 1 },
    { x: seat.x, y: seat.y - 1 },

    { x: seat.x, y: seat.y + 1 },
    { x: seat.x + 1, y: seat.y - 1 },
    { x: seat.x + 1, y: seat.y },
    { x: seat.x + 1, y: seat.y + 1 },
  ]
  return res.filter(({ x, y }) => x >= 0 && y >= 0 && x <= maxX && y <= maxY)
}

const getSeatsInSight = ({ x, y }, seats) => {
  const seatsInSight = []
  // vertical up
  for (let Y = y - 1; Y >= 0; Y--) {
    if (x === 0 && y === 0) console.log(Y)
    if (seats[Y][x] !== '.') {
      seatsInSight.push({ x: x, y: Y })
      break
    }
  }
  // vertical down
  for (let Y = y + 1; Y < seats.length; Y++) {
    if (seats[Y][x] !== '.') {
      seatsInSight.push({ x: x, y: Y })
      break
    }
  }
  // horizontal left
  for (let X = x - 1; X >= 0; X--) {
    if (seats[y][X] !== '.') {
      seatsInSight.push({ x: X, y: y })
      break
    }
  }
  // horizontal right
  for (let X = x + 1; X < seats[0].length; X++) {
    if (seats[y][X] !== '.') {
      seatsInSight.push({ x: X, y: y })
      break
    }
  }
  // diagonal top-left
  for (let i = 1;
       x - i >= 0 &&
       x - i < seats[0].length &&
       y - i >= 0 &&
       y - i < seats.length;
       i++) {
    if (seats[y - i][x - i] !== '.') {
      seatsInSight.push({ x: x - i, y: y - i })
      break
    }
  }
  // diagonal top-right
  for (let i = 1;
       x + i >= 0 &&
       x + i < seats[0].length &&
       y - i >= 0 &&
       y - i < seats.length;
       i++) {
    if (seats[y - i][x + i] !== '.') {
      seatsInSight.push({ x: x + i, y: y - i })
      break
    }
  }
  // diagonal bottom-right
  for (let i = 1;
       x + i >= 0 &&
       x + i < seats[0].length &&
       y + i >= 0 &&
       y + i < seats.length;
       i++) {
    if (seats[y + i][x + i] !== '.') {
      seatsInSight.push({ x: x + i, y: y + i })
      break
    }
  }
  // diagonal bottom-left
  for (let i = 1;
       x - i >= 0 &&
       x - i < seats[0].length &&
       y + i >= 0 &&
       y + i < seats.length;
       i++) {
    if (seats[y + i][x - i] !== '.') {
      seatsInSight.push({ x: x - i, y: y + i })
      break
    }
  }
  return seatsInSight
}

const process = seats => {
  const newSeats = JSON.parse(JSON.stringify(seats))
  for (let y = 0; y < seats.length; y++) {
    for (let x = 0; x < seats[0].length; x++) {
      if (seats[y][x] === '.') continue
      const adjSeats = getAdjacentSeats({ x, y }, { x: seats[0].length - 1, y: seats.length - 1 })
      if (seats[y][x] === 'L' && adjSeats.map(({
                                                 x,
                                                 y
                                               }) => seats[y][x]).every(seat => seat === 'L' || seat === '.')) newSeats[y][x] = '#'
      if (seats[y][x] === '#' && adjSeats.map(({
                                                 x,
                                                 y
                                               }) => seats[y][x]).filter(seat => seat === '#').length >= 4) newSeats[y][x] = 'L'
    }
  }
  return newSeats
}

const processPart2 = seats => {
  const newSeats = JSON.parse(JSON.stringify(seats))
  for (let y = 0; y < seats.length; y++) {
    for (let x = 0; x < seats[0].length; x++) {
      if (seats[y][x] === '.') continue
      const adjSeats = getSeatsInSight({ x, y }, seats)
      if (seats[y][x] === 'L' && adjSeats.map(({ x, y }) => seats[y][x]).every(seat => seat === 'L' || seat === '.')) newSeats[y][x] = '#'
      if (seats[y][x] === '#' && adjSeats.map(({ x, y }) => seats[y][x]).filter(seat => seat === '#').length >= 5) newSeats[y][x] = 'L'
    }
  }
  return newSeats
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => l.split(''))

  let seats = input

  let i = 0
  while (true) {
    const newSeats = processPart2(seats)
    if (JSON.stringify(newSeats) === JSON.stringify(seats)) break
    i++
    seats = newSeats
  }

  // logSeats(seats)
  console.log(seats.flat().filter(char => char === '#').length)
}

part2()
  .catch(console.error)
