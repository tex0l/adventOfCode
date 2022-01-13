const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const instructions = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => ({ .../(?<toggle>on|off) x=(?<minX>.+)\.\.(?<maxX>.*),y=(?<minY>.+)\.\.(?<maxY>.*),z=(?<minZ>.+)\.\.(?<maxZ>.*)/.exec(x).groups }))
    .map(({ toggle, minX, maxX, minY, maxY, minZ, maxZ }) => ({
      toggle,
      minX: parseInt(minX),
      maxX: parseInt(maxX),
      minY: parseInt(minY),
      maxY: parseInt(maxY),
      minZ: parseInt(minZ),
      maxZ: parseInt(maxZ),
    }))
    .filter(({ toggle, minX, maxX, minY, maxY, minZ, maxZ }) =>
      minX === minMax(minX) &&
      maxX === minMax(maxX) &&
      minY === minMax(minY) &&
      maxY === minMax(maxY) &&
      minZ === minMax(minZ) &&
      maxZ === minMax(maxZ)
    )

  const onCubes = new Set()
  for (const { toggle, minX, maxX, minY, maxY, minZ, maxZ } of instructions) {
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const serializedCoordinates = `${x},${y},${z}`
          if (toggle === 'off' && onCubes.has(serializedCoordinates)) onCubes.delete(serializedCoordinates)
          if (toggle === 'on') onCubes.add(serializedCoordinates)
        }
      }
    }
  }
  console.log(onCubes.size)
}

const minMax = (x, maxBound = 50, minBound = -50) => Math.min(Math.max(x, minBound), maxBound)

const part2 = async () => {
  const instructions = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => ({ .../(?<toggle>on|off) x=(?<minX>.+)\.\.(?<maxX>.*),y=(?<minY>.+)\.\.(?<maxY>.*),z=(?<minZ>.+)\.\.(?<maxZ>.*)/.exec(x).groups }))
    .map(({ toggle, minX, maxX, minY, maxY, minZ, maxZ }) => ({
      toggle,
      minX: parseInt(minX),
      maxX: parseInt(maxX),
      minY: parseInt(minY),
      maxY: parseInt(maxY),
      minZ: parseInt(minZ),
      maxZ: parseInt(maxZ),
    }))
    .reduce((acc, val, i, arr) => {
      console.log('handling instruction', i, 'acc is at', acc)
      if (val.toggle === 'on') {
        console.log('instruction is on')
        const initialVolume = calculateVolume(val)
        console.log('initial volume at', initialVolume)
        const volumeReduction = reduceVolume(val, arr.slice(0, i))
        console.log('volume reduction at', volumeReduction)
        return acc + initialVolume + volumeReduction
      } else if (val.toggle === 'off') {
        console.log('instruction is off')
        const volumeReduction = reduceVolume(val, arr.slice(0, i))
        console.log('volume reduction at', volumeReduction)
        return acc + volumeReduction
      }
    }, 0)
  console.log(instructions)
}


const reduceVolume = (cuboid, instructions) => {
  let volume = 0
  for (let index = instructions.length - 1; index >= 0; index--) {
    const instruction = instructions[index]
    const intersection = intersectCube(cuboid, instruction)
    if (intersection) {
      const intersectionVolume = calculateVolume(intersection.intersection)
      if (
        (cuboid.toggle === 'on' && instruction.toggle === 'on') ||
        (cuboid.toggle === 'off' && instruction.toggle === 'on')
      ) {
        volume -= intersectionVolume
      }

      intersection.intersection.toggle = instruction.toggle
      volume -= reduceVolume(intersection.intersection, instructions.slice(0, index))
    }
  }
  return volume
}


const calculateVolume = ({
                           minX,
                           maxX,
                           minY,
                           maxY,
                           minZ,
                           maxZ
                         }) => Math.abs(maxX - minX + 1) * Math.abs(maxY - minY + 1) * Math.abs(maxZ - minZ + 1)

const intersectCube = (cuboid1, cuboid2) => {
  const minX = Math.max(cuboid1.minX, cuboid2.minX)
  const maxX = Math.min(cuboid1.maxX, cuboid2.maxX)
  const minY = Math.max(cuboid1.minY, cuboid2.minY)
  const maxY = Math.min(cuboid1.maxY, cuboid2.maxY)
  const minZ = Math.max(cuboid1.minZ, cuboid2.minZ)
  const maxZ = Math.min(cuboid1.maxZ, cuboid2.maxZ)
  if (minX > maxX || minY > maxY || minZ > maxZ) return null

  return {
    intersection: { minX, maxX, minY, maxY, minZ, maxZ },
    cuboid1OtherSplits: [
      {
        minX, maxX, minY, maxY,
        minZ: cuboid1.minZ === minZ ? maxZ : cuboid1.minZ,
        maxZ: cuboid1.maxZ === maxZ ? minZ : cuboid1.maxZ
      },
      {
        minX, maxX, minZ, maxZ,
        minY: cuboid1.minY === minY ? maxY : cuboid1.minY,
        maxY: cuboid1.maxY === maxY ? minY : cuboid1.maxY
      },
      {
        minY, maxY, minZ, maxZ,
        minX: cuboid1.minX === minX ? maxX : cuboid1.minX,
        maxX: cuboid1.maxX === maxX ? minX : cuboid1.maxX
      },
      {
        minZ, maxZ,
        minX: cuboid1.minX === minX ? maxX : cuboid1.minX,
        maxX: cuboid1.maxX === maxX ? minX : cuboid1.maxX,
        minY: cuboid1.minY === minY ? maxY : cuboid1.minY,
        maxY: cuboid1.maxY === maxY ? minY : cuboid1.maxY
      },
      {
        minY, maxY,
        minX: cuboid1.minX === minX ? maxX : cuboid1.minX,
        maxX: cuboid1.maxX === maxX ? minX : cuboid1.maxX,
        minZ: cuboid1.minZ === minZ ? maxZ : cuboid1.minZ,
        maxZ: cuboid1.maxZ === maxZ ? minZ : cuboid1.maxZ
      },
      {
        minX, maxX,
        minY: cuboid1.minY === minY ? maxY : cuboid1.minY,
        maxY: cuboid1.maxY === maxY ? minY : cuboid1.maxY,
        minZ: cuboid1.minZ === minZ ? maxZ : cuboid1.minZ,
        maxZ: cuboid1.maxZ === maxZ ? minZ : cuboid1.maxZ
      },
      {
        minX: cuboid1.minX === minX ? maxX : cuboid1.minX,
        maxX: cuboid1.maxX === maxX ? minX : cuboid1.maxX,
        minY: cuboid1.minY === minY ? maxY : cuboid1.minY,
        maxY: cuboid1.maxY === maxY ? minY : cuboid1.maxY,
        minZ: cuboid1.minZ === minZ ? maxZ : cuboid1.minZ,
        maxZ: cuboid1.maxZ === maxZ ? minZ : cuboid1.maxZ
      }
    ].filter(({ minX, maxX, minY, maxY, minZ, maxZ }) => minX <= maxX && minY <= maxY && minZ <= maxZ),
    cuboid2OtherSplits: [
      {
        minX, maxX, minY, maxY,
        minZ: cuboid2.minZ === minZ ? maxZ : cuboid2.minZ,
        maxZ: cuboid2.maxZ === maxZ ? minZ : cuboid2.maxZ
      },
      {
        minX, maxX, minZ, maxZ,
        minY: cuboid2.minY === minY ? maxY : cuboid2.minY,
        maxY: cuboid2.maxY === maxY ? minY : cuboid2.maxY
      },
      {
        minY, maxY, minZ, maxZ,
        minX: cuboid2.minX === minX ? maxX : cuboid2.minX,
        maxX: cuboid2.maxX === maxX ? minX : cuboid2.maxX
      },
      {
        minZ, maxZ,
        minX: cuboid2.minX === minX ? maxX : cuboid2.minX,
        maxX: cuboid2.maxX === maxX ? minX : cuboid2.maxX,
        minY: cuboid2.minY === minY ? maxY : cuboid2.minY,
        maxY: cuboid2.maxY === maxY ? minY : cuboid2.maxY
      },
      {
        minY, maxY,
        minX: cuboid2.minX === minX ? maxX : cuboid2.minX,
        maxX: cuboid2.maxX === maxX ? minX : cuboid2.maxX,
        minZ: cuboid2.minZ === minZ ? maxZ : cuboid2.minZ,
        maxZ: cuboid2.maxZ === maxZ ? minZ : cuboid2.maxZ
      },
      {
        minX, maxX,
        minY: cuboid2.minY === minY ? maxY : cuboid2.minY,
        maxY: cuboid2.maxY === maxY ? minY : cuboid2.maxY,
        minZ: cuboid2.minZ === minZ ? maxZ : cuboid2.minZ,
        maxZ: cuboid2.maxZ === maxZ ? minZ : cuboid2.maxZ
      },
      {
        minX: cuboid2.minX === minX ? maxX : cuboid2.minX,
        maxX: cuboid2.maxX === maxX ? minX : cuboid2.maxX,
        minY: cuboid2.minY === minY ? maxY : cuboid2.minY,
        maxY: cuboid2.maxY === maxY ? minY : cuboid2.maxY,
        minZ: cuboid2.minZ === minZ ? maxZ : cuboid2.minZ,
        maxZ: cuboid2.maxZ === maxZ ? minZ : cuboid2.maxZ
      }
    ].filter(({ minX, maxX, minY, maxY, minZ, maxZ }) => minX <= maxX && minY <= maxY && minZ <= maxZ),
  }
}

// console.log(intersectCube({ minX: 0, maxX:11, minY:0, maxY:15, minZ:0, maxZ:10 },{ minX:0, maxX:10, minY:0, maxY:10, minZ:0, maxZ:10 }))

part2()
  .catch(console.error)

