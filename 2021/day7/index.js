const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const main = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const initialPositions = input.split(',').map(x => parseInt(x, 10))
  const min = Math.min(...initialPositions)
  const max = Math.max(...initialPositions)

  let minCost = Number.MAX_SAFE_INTEGER
  let minPosition = -1
  for (let i = min; i<= max; i++) {
    const cost = initialPositions.reduce((acc, val) => acc + sum1ToN(Math.abs(i - val)), 0)
    if (cost < minCost) {
      minCost = cost
      minPosition = i
    }
  }

  console.log(minCost, 'at', minPosition)
}

const sum1ToN = N => N * (N + 1) / 2

main()
  .catch(console.error)

