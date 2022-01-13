const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')[0]
    const regex = /target area: x=(?<signX1>-?)(?<X1>[0-9]+)..(?<signX2>-?)(?<X2>[0-9]+), y=(?<signY1>-?)(?<Y1>[0-9]+)..(?<signY2>-?)(?<Y2>[0-9]+)/


  const {signX1, X1, signX2, X2, signY1, Y1, signY2, Y2} = regex.exec(input).groups
  const x1 = parseInt(X1) * (signX1 === '-' ? -1 : 1)
  const x2 = parseInt(X2) * (signX2 === '-' ? -1 : 1)
  const y1 = parseInt(Y1) * (signY1 === '-' ? -1 : 1)
  const y2 = parseInt(Y2) * (signY2 === '-' ? -1 : 1)

  const targetArea = {x1, y1, x2, y2}


  const maxY = {}

  for (let vx = -1000; vx <= 1000; vx ++) {
    for (let vy = -1000; vy <= 1000; vy ++) {
      const trajectory = computeTrajectory({x: vx, y: vy}, targetArea)
      if (trajectory !== undefined) {
        maxY[`${vx},${vy}`] = Math.max(...trajectory.map(({y}) => y))
      }
    }
  }

  console.log('maxY:', Math.max(...Object.entries(maxY).map(([, maxY]) => maxY)))
  console.log('trajectories:', Object.keys(maxY).length)

}

const computeTrajectory = (velocity, targetArea) => {
  let x = 0
  let y = 0

  let vx = velocity.x
  let vy = velocity.y

  const trajectory = []
  trajectory.push({ x,y })
  while (x <= targetArea.x2 && y >= targetArea.y1) {
    x += vx
    y += vy
    trajectory.push({ x,y })
    if (x >= targetArea.x1 && x <= targetArea.x2 && y >=targetArea.y1 && y <= targetArea.y2) return trajectory
    if (vx > 0) vx -= 1
    if (vx < 0) vx += 1
    vy -= 1
  }
}

const part2 = part1

part1()
  .catch(console.error)
