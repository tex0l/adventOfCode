const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const main = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const initialFish = input.split(',').map(x => parseInt(x, 10))
  let tracker = {}
  for (const fish of initialFish) {
    if (!tracker.hasOwnProperty(fish)) tracker[fish] = 0
    tracker[fish] +=1
  }
  for (let i = 0; i < 256; i++) {
    tracker = iterate(tracker)
    console.log(`After ${i+1} days: ${countFish(tracker)}`)
  }
}

const countFish = tracker => Object.values(tracker).reduce((acc, val) => acc + val, 0)

const iterate = tracker => {
  const result = {}
  for (let [timer, qty] of Object.entries(tracker)) {
    result[timer - 1] = qty
  }

  if (!result.hasOwnProperty(-1)) result[-1] = 0
  if (!result.hasOwnProperty(6)) result[6] = 0
  if (!result.hasOwnProperty(8)) result[8] = 0


  if (result[-1] !== 0) {
    result[6] += result[-1]
    result[8] += result[-1]
  }
  delete result[-1]
  return result
}

main()
  .catch(console.error)

