const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .map(groups =>
      new Set([...groups
        .split('\n')
        .filter(l => l !== '')
        .join('')
      ]).size
    )
    .reduce((acc, val) => acc + val, 0)
  console.log(input)
}

const intersect = (setA, setB) => {
  let _intersection = new Set()
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}


const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .map(groups =>
      groups
        .split('\n')
        .filter(l => l !== '')
        .reduce((acc, val) => intersect(new Set([...val]), acc), new Set([...groups
          .split('\n')
          .filter(l => l !== '')
          .join('')
        ]))
        .size
    )
    .reduce((acc, val) => acc + val, 0)
  console.log(input)
}

part2()
  .catch(console.error)
