const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const parseReportLine = /Sensor at x=(?<sensor_x>-?[0-9]+), y=(?<sensor_y>-?[0-9]+): closest beacon is at x=(?<beacon_x>-?[0-9]+), y=(?<beacon_y>-?[0-9]+)/
const parseNumber = str => str.startsWith('-') ? -1 * parseInt(str.substring(1)) : parseInt(str)
const part1Failed = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(line => {
      const res = parseReportLine.exec(line)
      if (res == null) throw new Error('Parsing error')
      return res.groups
    })
    .map(({ sensor_x, sensor_y, beacon_x, beacon_y }) => ({
      sensor_x: parseNumber(sensor_x),
      sensor_y: parseNumber(sensor_y),
      beacon_x: parseNumber(beacon_x),
      beacon_y: parseNumber(beacon_y)
    }))

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let longestRadius = 0
  for (const line of input) {
    let { sensor_x, sensor_y, beacon_x, beacon_y } = line
    if (sensor_x < minX) minX = sensor_x
    if (sensor_x > maxX) maxX = sensor_x
    if (beacon_x < minX) minX = beacon_x
    if (beacon_x > maxX) maxX = beacon_x

    if (sensor_y < minY) minY = sensor_y
    if (sensor_y > maxY) maxY = sensor_y
    if (beacon_y < minY) minY = beacon_y
    if (beacon_y > maxY) maxY = beacon_y
    const distance = Math.abs(sensor_y - beacon_y) + Math.abs(sensor_x - beacon_x)
    if (longestRadius < distance) longestRadius = distance
  }

  minY -= longestRadius
  maxY += longestRadius
  minX -= longestRadius
  maxX += longestRadius

  console.log(minX, maxX, minY, maxY)

  const map = []
  for (let y = minY; y <= maxY; y++) {
    map.push([])
    for (let x = minX; x <= maxX; x++) {
      map[map.length - 1].push('.')
    }
  }

  for (const line of input) {
    const { sensor_x, sensor_y, beacon_x, beacon_y } = line
    map[sensor_y - minY][sensor_x - minX] = 'S'
    map[beacon_y - minY][beacon_x - minX] = 'B'

    const distance = Math.abs(sensor_y - beacon_y) + Math.abs(sensor_x - beacon_x)
    for (let radius = distance; radius > 0; radius--) {
      writeCircle(sensor_x - minX, sensor_y - minY, radius, map)
    }
  }
  console.log(map.map(line => line.join('')).join('\n'))
  console.log(map[2000000 - minY].filter(x => x === '#').length)
}

const writeCircle = (center_X, center_Y, radius, map) => {
  for (let i = 0; i <= radius; i++) {
    const X = center_X + i
    const Y = center_Y - radius + i
    if (map[Y][X] === '.') map[Y][X] = '#'
  }
  for (let i = 0; i <= radius; i++) {
    const X = center_X - i
    const Y = center_Y - radius + i
    if (map[Y][X] === '.') map[Y][X] = '#'
  }
  for (let i = 0; i <= radius; i++) {
    const X = center_X + i
    const Y = center_Y + radius - i
    if (map[Y][X] === '.') map[Y][X] = '#'
  }
  for (let i = 0; i <= radius; i++) {
    const X = center_X - i
    const Y = center_Y + radius - i
    if (map[Y][X] === '.') map[Y][X] = '#'
  }
}
const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(line => {
      const res = parseReportLine.exec(line)
      if (res == null) throw new Error('Parsing error')
      return res.groups
    })
    .map(({ sensor_x, sensor_y, beacon_x, beacon_y }) => ({
      sensor_x: parseNumber(sensor_x),
      sensor_y: parseNumber(sensor_y),
      beacon_x: parseNumber(beacon_x),
      beacon_y: parseNumber(beacon_y)
    }))

  const sensors = new Map()
  const beacons = new Map()

  const YToStudy = 2000000

  for (const { sensor_x, sensor_y, beacon_x, beacon_y } of input) {
    sensors.set(`${sensor_x},${sensor_y}`, {x: sensor_x, y: sensor_y})
    beacons.set(`${beacon_x},${beacon_y}`, {x: beacon_x, y: beacon_y})
  }

  const segments = findSegments(YToStudy, input)

  let width = segments.reduce((acc, val) => {
    acc += val[1] - val[0]
    return acc
  }, 0)

  for (const { y } of sensors) {
    if (y === YToStudy) width--
  }

  for (const { y } of beacons) {
    if (y === YToStudy) width--
  }

  console.log(width)
}

const lineIntersectionWithCircle = (Y0, X, Y, radius) => {
  const distanceFromCenterToLine = Math.abs(Y - Y0)
  const halfWidth = radius - distanceFromCenterToLine
  if (halfWidth >= 0) return [X-halfWidth, X+halfWidth]
  else return null
}

const findSegments = (y, input) => {
  const coordinates = []

  for (const reading of input) {
    const { sensor_x, sensor_y, beacon_x, beacon_y } = reading
    const radius = Math.abs(sensor_x - beacon_x) + Math.abs(sensor_y - beacon_y)
    const intersection = lineIntersectionWithCircle(y, sensor_x, sensor_y, radius)
    if (intersection) coordinates.push(intersection)
  }

  coordinates.sort((a,b) => a[0] - b[0])

  return coordinates.reduce((acc, val) => {
    if (acc.length && acc[acc.length - 1][1] >= val[0]) {
      if (acc[acc.length - 1][1] < val[1]) acc[acc.length - 1][1] = val[1]
    } else acc.push(val)
    return acc
  }, [])
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(line => {
      const res = parseReportLine.exec(line)
      if (res == null) throw new Error('Parsing error')
      return res.groups
    })
    .map(({ sensor_x, sensor_y, beacon_x, beacon_y }) => ({
      sensor_x: parseNumber(sensor_x),
      sensor_y: parseNumber(sensor_y),
      beacon_x: parseNumber(beacon_x),
      beacon_y: parseNumber(beacon_y)
    }))

  const sensors = new Map()
  const beacons = new Map()


  for (const { sensor_x, sensor_y, beacon_x, beacon_y } of input) {
    sensors.set(`${sensor_x},${sensor_y}`, {x: sensor_x, y: sensor_y})
    beacons.set(`${beacon_x},${beacon_y}`, {x: beacon_x, y: beacon_y})
  }

  for (let y = 0; y <= 4000000; y++) {
    const segments = findSegments(y, input)
    if (segments.length === 2 && segments[0][1] === segments[1][0] - 2) {
      const x = segments[1][0] - 1
      console.log(x, y, x * 4000000 + y)
    }
  }
}

part2()
  .then(console.log, console.error)
