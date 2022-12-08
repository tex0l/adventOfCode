const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  const tree = makeTree(input)

  let sum = 0

  const sumCallback = x => {
    if (x <= 100000) sum += x
  }
  console.log('/:', recursiveSum(tree, sumCallback))

  console.log(sum)
}

const recursiveSum = (tree, callback) => {
  let sum = 0
  for (const key in tree) {
    if (key !== '..') {
      if (typeof tree[key] === 'number') sum += tree[key]
      else {
        const sumForDir = recursiveSum(tree[key], callback)
        sum += sumForDir
        callback(sumForDir)
      }
    }
  }
  return sum
}

const makeTree = input => {
  const tree = {
    '/': {}
  }

  tree['/']['..'] = tree['/'] // exception, it references itself

  let currentTree
  for (let line of input) {
    if (line.startsWith('$')) {
      line = line.substring(2)
      if (line.startsWith('cd')) {
        line = line.substring(3)
        if (line.startsWith('/')) {
          currentTree = tree[line] // using tree because absolute path
        } else if (currentTree != null) {
          if (line === '..' || currentTree[line] != null) {
            currentTree = currentTree[line]
          } else {
            currentTree[line] = {}
            currentTree[line]['..'] = currentTree
            currentTree = currentTree[line]
          }
        } else {
          throw new Error('currentTree is not defined')
        }
      } else if (line.startsWith('ls')) {
        // nothing to do actually
      } else throw new Error('unknown command')
    } else {
      if (line.startsWith('dir')) {
        line = line.substring(4)
        // nothing to do actually
      } else {
        const [size, name] = line.split(' ')
        currentTree[name] = parseInt(size)
      }
    }
  }

  return tree
}


const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  const tree = makeTree(input)

  const candidates = []

  const usedSpace = recursiveSum(tree, (x) => { candidates.push(x) })

  const spaceToFree = Math.max(usedSpace - 70000000 + 30000000, 0)

  console.log(candidates.filter(x => x >= spaceToFree).sort((a,b) => a-b)[0])
}

part2()
  .then(console.log, console.error)
