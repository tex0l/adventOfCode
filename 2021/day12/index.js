const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const START = 'start'
const END = 'end'
const SMALL = 'small'
const BIG = 'big'

const processPath = (tunnels, startAt) => tunnels.reduce((acc, [pointA, pointB]) => {
  if (pointA.val === startAt.val) acc.push(pointB)
  else if (pointB.val === startAt.val) acc.push(pointA)
  return acc
}, [])

const processPointType = val => {
  if (val === 'start') return START
  if (val === 'end') return END
  if (val.toLowerCase() === val) return SMALL
  if (val.toUpperCase() === val) return BIG
}

const part1 = async () => {
  const tunnels = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => l.split('-').map(val => ({ val, type: processPointType(val) })))

  const paths = [[{ val: 'start', type: START }]] // start at START
  let newPaths = [...paths]
  while (true) {
    const pathsToProcess = newPaths.filter(path => path[path.length - 1].type !== END)
    newPaths = [...newPaths.filter(path => path[path.length - 1].type === END)]
    if (pathsToProcess.length === 0) break
    for (const path of pathsToProcess) {
      const pathLastPoint = path[path.length - 1]
      const extensions = processPath(tunnels, pathLastPoint)
      for (const extension of extensions) {
        if (extension.type === SMALL && path.every(point => point.val !== extension.val)) newPaths.push([...path, extension])
        else if (extension.type === BIG) newPaths.push([...path, extension])
        else if (extension.type === END) newPaths.push([...path, extension])
      }
    }
  }
  console.log(newPaths.map(path => path.map(point => point.val).join(',')).length)
}

const part2 = async () => {
  const tunnels = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => l.split('-').map(val => ({ val, type: processPointType(val) })))

  const paths = [[{ val: 'start', type: START }]] // start at START
  let newPaths = [...paths]
  while (true) {
    const pathsToProcess = newPaths.filter(path => path[path.length - 1].type !== END)
    newPaths = [...newPaths.filter(path => path[path.length - 1].type === END)]
    if (pathsToProcess.length === 0) break
    for (const path of pathsToProcess) {
      const pathLastPoint = path[path.length - 1]
      const extensions = processPath(tunnels, pathLastPoint)
      for (const extension of extensions) {
        if (extension.type === SMALL) {
          const smallCaves = path.reduce((acc,val) => {
            if (val.type === SMALL) {
              if (!acc.hasOwnProperty(val.val)) acc[val.val] = 0
              acc[val.val] += 1
            }
            return acc
          }, {})
          if (!smallCaves.hasOwnProperty(extension.val) || Object.values(smallCaves).every(n => n < 2)) newPaths.push([...path, extension])
        } else if (extension.type === BIG) newPaths.push([...path, extension])
        else if (extension.type === END) newPaths.push([...path, extension])
      }
    }
  }

  const result = newPaths.map(path => path.map(point => point.val).join(','))

  console.log(result.length)
}

part2()
  .catch(console.error)
