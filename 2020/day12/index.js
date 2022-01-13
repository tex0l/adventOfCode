const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => ({action: l[0], value: parseInt(l.slice(1))}))

  let direction = 'E'
  let x = 0
  let y = 0
  while (input.length > 0) {
    const instruction = input.shift();
    ({ direction, x, y } = processAction(direction, x, y, instruction))
  }
  console.log('direction', direction)
  console.log('x', x)
  console.log('y', y)
  console.log('manhattan distance', Math.abs(x) + Math.abs(y))
}


const directions = ['N', 'W', 'S', 'E']

const rotate = (direction, action, value) => {
  const directionIndex = directions.findIndex(d => d === direction)
  const indexIncrement = (value / 90 * (action === 'L' ? 1 : -1))
  const newIndex = (directionIndex + indexIncrement + directions.length * 100) % directions.length
  return directions[newIndex]
}

const rotate2 = (x, y, action, value) => {
  let normalizedValue = value
  if (action === 'R') normalizedValue = 360 - value
  if (normalizedValue === 90) return { x: y, y: -x }
  if (normalizedValue === 180) return { x: -x, y: -y }
  if (normalizedValue === 270) return { x: -y, y: x }
  else throw new Error('rotation unhandled')
}

const processAction = (direction, x, y, {action, value}) => {
  if (action === 'N') return {direction, x: x - value, y}
  if (action === 'S') return {direction, x: x + value, y}
  if (action === 'E') return {direction, x, y: y + value}
  if (action === 'W') return {direction, x, y: y - value}
  if (action === 'L' || action === 'R') return {direction: rotate(direction, action, value), x, y}
  if (action === 'F') return processAction(direction, x, y, {action: direction, value})
}

const processAction2 = (x, y, wx, wy, {action, value}) => {
  if (action === 'N') return { wx, wy: wy - value, x, y}
  if (action === 'W') return {wx: wx - value, wy, x, y}
  if (action === 'S') return { wx, wy: wy + value, x, y}
  if (action === 'E') return { wx: wx + value, wy, x, y}
  if (action === 'L' || action === 'R') {
    const rotation = rotate2(wx, wy, action, value)
    return { x, y, wx: rotation.x, wy: rotation.y }
  }
  if (action === 'F') return { x: x + value * wx, y: y + value * wy, wx, wy }
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => ({action: l[0], value: parseInt(l.slice(1))}))

  let x = 0
  let y = 0

  let wx = 10
  let wy = -1

  while (input.length > 0) {
    const instruction = input.shift();
    ({ x, y, wx, wy } = processAction2(x, y, wx, wy, instruction))
    console.log({ x, y, wx, wy })
  }
  console.log('x', x)
  console.log('y', y)
  console.log('wx', wx)
  console.log('wy', wy)
  console.log('manhattan distance', Math.abs(x) + Math.abs(y))
}

part2()
  .catch(console.error)
