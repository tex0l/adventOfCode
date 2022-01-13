const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const coordinatesRegexp = /(?<x>.*),(?<y>.*),(?<z>.*)/

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .reduce((acc, val) => {
      if (val.startsWith('---')) acc.push([])
      else {
        acc[acc.length - 1].push({ ...coordinatesRegexp.exec(val).groups })
      }
      return acc
    }, [])
    .map(scanner => scanner.map(({ x, y, z }) => ({ x: parseInt(x), y: parseInt(y), z: parseInt(z) })))

  const scans = input.map((scan, i) => ({i, scan, offset: null, rotation: null, used: false, rotatedOffsetScan: null}))

  scans[0].offset =  {x:0, y:0, z:0}
  scans[0].rotation = {nx: 0, ny:0, nz:0}
  scans[0].rotatedOffsetScan = scans[0].scan

  while (scans.filter(scan => scan.used === false && scan.rotatedOffsetScan !== null).length > 0) {
    const scanIndex = scans.findIndex(scan => scan.used === false && scan.rotatedOffsetScan !== null)
    console.log('using scan', scanIndex)
    const { rotatedOffsetScan, offset } = scans[scanIndex]
    const scansToAnalyze = scans.filter(scan => scan.rotatedOffsetScan === null)
    for (const scanToAnalyze of scansToAnalyze) {
      console.log('testing scan', scanToAnalyze.i)
      const rotationAndOffset = findRotationAndOffset(scanToAnalyze.scan, rotatedOffsetScan, offset, 2000)
      if (rotationAndOffset) {
        console.log('found match for scan', scanToAnalyze.i)
        scans[scanToAnalyze.i].offset = rotationAndOffset.offset
        scans[scanToAnalyze.i].rotation = rotationAndOffset.rotation
        scans[scanToAnalyze.i].rotatedOffsetScan = offsetScan(rotateScan(scanToAnalyze.scan, rotationAndOffset.rotation), rotationAndOffset.offset)
      }
    }
    scans[scanIndex].used = true
  }
  if (scans.some(({rotatedOffsetScan}) => rotatedOffsetScan === null)) throw new Error('missing coordinates')

  const beacons = new Set([].concat(...scans.map(({rotatedOffsetScan}) => rotatedOffsetScan.map(({x,y,z}) => `${x},${y},${z}`))))
  console.log(beacons.size)
  console.log(Math.max(...scans.map(({offset}) => Math.max(...scans.map(({offset: offset2}) => Math.abs(offset.x - offset2.x) + Math.abs(offset.y - offset2.y) + Math.abs(offset.z - offset2.z))))))
}


const offsetScan = (scan, offset) => scan.map(({x,y,z}) => ({x: x+offset.x, y: y+offset.y, z: z+offset.z}))

const rotateScan = (scan, rotation) => scan.map(reading => combineRotations(reading, rotation))

const findRotationAndOffset = (scan, referenceScan, offset, deltaOffset) => {
  for (let nx = 0; nx < 4; nx++) {
    for (let ny = 0; ny < 4; ny++) {
      for (let nz = 0; nz < 4; nz++) {
        const rotatedScan = scan.map(reading => combineRotations(reading, { nx, ny, nz }))
        const foundOffset = findOffset(rotatedScan, referenceScan, offset, deltaOffset)
        if (foundOffset) return { rotation: {nx, ny, nz}, offset: foundOffset }
      }
    }
  }
}

const findOffset = (scan, referenceScan, offset, deltaOffset) => {
  for (let offsetX = offset.x - deltaOffset; offsetX <= offset.x + deltaOffset; offsetX++) {
    const offsetScanX = scan.map(({ x, y, z }) => ({ x: x + offsetX, y, z }))
    if (offsetScanX.filter(({ x }) => referenceScan.findIndex(reading => reading.x === x) !== -1).length >= 12) {
      for (let offsetY = offset.y - deltaOffset; offsetY <= offset.y + deltaOffset; offsetY++) {
        const offsetScanY = offsetScanX.map(({ x, y, z }) => ({ x, y: y + offsetY, z }))
        if (offsetScanY.filter(({ y }) => referenceScan.findIndex(reading => reading.y === y) !== -1).length >= 12) {
          for (let offsetZ = offset.z - deltaOffset; offsetZ <= offset.z + deltaOffset; offsetZ++) {
            const offsetScanZ = offsetScanY.map(({ x, y, z }) => ({ x, y, z: z + offsetZ }))
            if (offsetScanZ.filter(({ z }) => referenceScan.findIndex(reading => reading.z === z) !== -1).length >= 12) return {
              x: offsetX,
              y: offsetY,
              z: offsetZ
            }
          }
        }
      }
    }
  }
}

const rotateReading = ({ x, y, z }, axis) => {
  if (axis === 'x') return { x: x, y: -z, z: y }
  if (axis === 'y') return { x: z, y: y, z: -x }
  if (axis === 'z') return { x: -y, y: x, z: z }
}

const combineRotations = ({ x, y, z }, { nx, ny, nz }) => {
  let vec = { x, y, z }
  for (let i = 0; i < nx; i++) {
    vec = rotateReading(vec, 'x')
  }
  for (let i = 0; i < ny; i++) {
    vec = rotateReading(vec, 'y')
  }
  for (let i = 0; i < nz; i++) {
    vec = rotateReading(vec, 'z')
  }
  return vec
}

part1()
  .catch(console.error)

