const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const assignmentSize = ([start, end]) => end - start + 1

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => x.split(',').filter(x => x !== '').map(y => y.split('-').filter(x => x !== '').map(z => parseInt(z))))
    .reduce((acc, [ass1, ass2]) => {
      let bigger = ass2, smaller = ass1
      if (assignmentSize(ass1) > assignmentSize(ass2)) {
        bigger = ass1
        smaller = ass2
      }
      if (bigger[0] <= smaller[0] && bigger[1] >= smaller[1]) return acc + 1
      else return acc
    }, 0)


  console.log(input)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => x.split(',').filter(x => x !== '').map(y => y.split('-').filter(x => x !== '').map(z => parseInt(z))))
    .reduce((acc, [ass1, ass2]) => {
      let bigger = ass2, smaller = ass1
      if (assignmentSize(ass1) > assignmentSize(ass2)) {
        bigger = ass1
        smaller = ass2
      }
      if (bigger[0] <= smaller[0] && bigger[1] >= smaller[1]) return acc + 1
      else if (bigger[1] >= smaller[0] && bigger[1] <= smaller[1]) return acc + 1
      else if (bigger[0] >= smaller[0] && bigger[0] <= smaller[1]) return acc + 1
      else return acc
    }, 0)


  console.log(input)
}

part2()
  .then(console.log, console.error)
