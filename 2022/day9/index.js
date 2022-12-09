const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  let T = { x: 0, y: 0 }
  let H = { x: 0, y: 0 }

  const tailSet = new Set()

  tailSet.add(`${T.x},${T.y}`)

  console.log(T, H)

  for (const instruction of input) {
    let [direction, distance] = instruction.split(' ')
    distance = parseInt(distance)
    let move

    if (direction === 'U') move = moveUp
    else if (direction === 'D') move = moveDown
    else if (direction === 'L') move = moveLeft
    else if (direction === 'R') move = moveRight
    else throw new Error('direction unknown')


    while (distance > 0) {
      ({ T, H } = move(T, H));
      tailSet.add(`${T.x},${T.y}`)
      distance--
    }
    console.log(T, H)
  }
  console.log(tailSet.size)
}

const moveUp = (T,H) => {
  const newH = {
    x: H.x,
    y: H.y + 1
  }

  const newT = {
    x: T.x,
    y: T.y
  }

  if (T.y === H.y - 1) {
    if (T.x === H.x) newT.y++ // straight
    else { // diagonal
      newT.y++
      newT.x = newH.x
    }
  }

  return {
    H: newH,
    T: newT
  }
}

const moveDown = (T,H) => {
  const newH = {
    x: H.x,
    y: H.y - 1
  }

  const newT = {
    x: T.x,
    y: T.y
  }

  if (T.y === H.y + 1) {
    if (T.x === H.x) newT.y-- // straight
    else { // diagonal
      newT.y--
      newT.x = newH.x
    }
  }

  return {
    H: newH,
    T: newT
  }
}

const moveRight = (T,H) => {
  const newH = {
    x: H.x + 1,
    y: H.y
  }

  const newT = {
    x: T.x,
    y: T.y
  }

  if (T.x === H.x - 1) {
    if (T.y === H.y) newT.x++ // straight
    else { // diagonal
      newT.x++
      newT.y = newH.y
    }
  }

  return {
    H: newH,
    T: newT
  }
}

const moveLeft = (T,H) => {
  const newH = {
    x: H.x - 1,
    y: H.y
  }

  const newT = {
    x: T.x,
    y: T.y
  }

  if (T.x === H.x + 1) {
    if (T.y === H.y) newT.x-- // straight
    else { // diagonal
      newT.x--
      newT.y = newH.y
    }
  }

  return {
    H: newH,
    T: newT
  }
}

const followKnot = (H, T) => {
  const deltaX = H.x - T.x
  const deltaY = H.y - T.y

  if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) throw new Error('Corrupted position')

  if (deltaX === 0) { // same column
    if (deltaY === 2) { // tail needs to be moved to the top
      return {x: T.x, y: T.y + 1}
    }
    if (deltaY === -2) { // tail needs to be moved to the bottom
      return {x: T.x, y: T.y - 1}
    }
  }

  if (deltaY === 0) { // same row
    if (deltaX === 2) { // tail needs to be moved to the top
      return {x: T.x + 1, y: T.y}
    }
    if (deltaX === -2) { // tail needs to be moved to the bottom
      return {x: T.x - 1, y: T.y}
    }
  }

  if (deltaY === 1) { // tail is one row down
    if (deltaX === 2) { // tail needs to be moved to the top right
      return {x: T.x + 1, y: T.y + 1}
    }
    if (deltaX === -2) { // tail needs to be moved to the bottom left
      return {x: T.x - 1, y: T.y + 1}
    }
  }

  if (deltaY === -1) { // tail is one row up
    if (deltaX === 2) { // tail needs to be moved to the top right
      return {x: T.x + 1, y: T.y - 1}
    }
    if (deltaX === -2) { // tail needs to be moved to the bottom left
      return {x: T.x - 1, y: T.y - 1}
    }
  }

  if (deltaY === 2) { // tail is two row up
    if (deltaX === 0) { // tail needs to go up
      return {x: T.x, y: T.y + 1}
    }
    if (deltaX === 1) { // tail needs to go up right
      return {x: T.x + 1, y: T.y + 1}
    }
    if (deltaX === -1) { // tail needs to go up left
      return {x: T.x - 1, y: T.y + 1}
    }
    if (deltaX === 2) { // tail needs to go up right
      return {x: T.x + 1, y: T.y + 1}
    }
    if (deltaX === -2) { // tail needs to go up left
      return {x: T.x - 1, y: T.y + 1}
    }
  }

  if (deltaY === -2) { // tail is two row down
    if (deltaX === 0) { // tail needs to go down
      return {x: T.x, y: T.y - 1}
    }
    if (deltaX === 1) { // tail needs to go down right
      return {x: T.x + 1, y: T.y - 1}
    }
    if (deltaX === -1) { // tail needs to go down left
      return {x: T.x - 1, y: T.y - 1}
    }
    if (deltaX === 2) { // tail needs to go down right
      return {x: T.x + 1, y: T.y - 1}
    }
    if (deltaX === -2) { // tail needs to go down left
      return {x: T.x - 1, y: T.y - 1}
    }
  }

  return T
}

const moveRope = (direction, rope) => {
  const newRope = []

  if (direction === 'U') newRope.push({ x: rope[0].x, y: rope[0].y + 1 })
  else if (direction === 'D') newRope.push({ x: rope[0].x, y: rope[0].y - 1 })
  else if (direction === 'L') newRope.push({ x: rope[0].x - 1, y: rope[0].y })
  else if (direction === 'R') newRope.push({ x: rope[0].x + 1, y: rope[0].y })
  else throw new Error('Unknown move')

  for (let i = 1; i < rope.length; i++) {
    newRope[i] = followKnot(newRope[i - 1], rope[i])
  }
  return newRope
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  let rope = []
  const ropeLength = 10
  for (let i = 0; i< ropeLength; i++) {
    rope.push({ x: 0, y: 0 })
  }

  const tailSet = new Set()

  tailSet.add(`${rope[rope.length - 1].x},${rope[rope.length - 1].y}`)

  for (const instruction of input) {
    let [direction, distance] = instruction.split(' ')
    distance = parseInt(distance)

    while (distance > 0) {
      rope = moveRope(direction, rope)
      tailSet.add(`${rope[rope.length - 1].x},${rope[rope.length - 1].y}`)
      distance--
    }
    if (rope.length !== ropeLength) throw new Error('rope has shortened')
  }
  console.log(tailSet.size)
}

part2()
  .then(console.log, console.error)
