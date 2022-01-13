const fs = require('fs/promises')
const path = require('path')
const inputPath = './input-test.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')

  const earliest = parseInt(input[0])
  const buses = input[1].split(',').filter(bus => bus !== 'x').map(bus => parseInt(bus))

  const departIn = buses.map(bus => ([bus, bus - earliest % bus])).sort(([,date1], [,date2]) => date1 - date2)

  console.log(departIn[0][0] * departIn[0][1])
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
  [1]

  const buses = input.split(',').map(bus => bus === 'x' ? 'x' : parseInt(bus)).map((value, index) => ([value, index])).filter(([value]) => value !== 'x')

  buses.map(([value, offset]) => )
}

part2()
  .catch(console.error)
