const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const mapAsciiCodeToPriority = asciiCode => {
  if (asciiCode < 65 || (asciiCode > 90 && asciiCode < 97) || asciiCode > 122) throw new Error('incompatible character')
  else if (asciiCode <= 90) { // uppercase
    return asciiCode - 65 + 27
  } else { // lowercase
    return asciiCode - 97 + 1
  }
}

const getPriorityMap = str => {
  const res = new Map()
  for (let i = 0; i < str.length; i++) {
    if (res.has(mapAsciiCodeToPriority(str.charCodeAt(i)))) res.set(mapAsciiCodeToPriority(str.charCodeAt(i)), res.get(mapAsciiCodeToPriority(str.charCodeAt(i))) + 1)
    else res.set(mapAsciiCodeToPriority(str.charCodeAt(i)), 1)
  }
  return res
}
const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(line => {
      const l1 = line.substring(0, line.length / 2)
      const l2 = line.substring(line.length / 2)
      if (l1.length !== l2.length) throw new Error('Split in halves failure')
      const l1Map = getPriorityMap(l1)
      const l2Map = getPriorityMap(l2)
      for (const key1 of l1Map.keys()) {
        if (l2Map.has(key1)) return key1
      }
      throw new Error('no same items exist')
    })
    .reduce((acc, curr) => acc + curr, 0)


  console.log(input)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .reduce((acc, curr) => {
      if (acc[acc.length - 1].length === 3) acc[acc.length] = [curr]
      else acc[acc.length - 1].push(curr)
      return acc
    }, [[]])
    .map(([l1, l2, l3]) => {
    const l1Map = getPriorityMap(l1)
    const l2Map = getPriorityMap(l2)
    const l3Map = getPriorityMap(l3)
      for (const key1 of l1Map.keys()) {
        if (l2Map.has(key1) && l3Map.has(key1)) return key1
      }
      throw new Error('no same items exist')
    })
    .reduce((acc, curr) => acc + curr, 0)


  console.log(input)
}

part2()
  .then(console.log, console.error)
