const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => parseInt(l))

  for (let i = 25; i < input.length; i++) {
    const n = input[i]
    if (!checkNIsSumOfTwoWithin(n, [...input].splice(i - 25, 25))) console.log(input[i])
  }

}

const checkNIsSumOfTwoWithin = (n, numbers) => {
  for (const n1 of numbers) {
    for (const n2 of numbers) {
      if (n1 + n2 === n) return true
    }
  }
  return false
}

const N = 14360655

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => parseInt(l))
  const res = []
  for (let i = 0; i < input.length; i++) {
    let n = 0
    while (n < N) {
      for (let j = i; j < input.length; j++) {
        n += input[j]
        if (n === N) {
          for (let k = i; k <= j; k++) {
            res.push(input[k])
          }
        } else if (n > N) break
      }
    }
    if (res.length) break
  }
  const orderedRes = res.sort((a,b) => b -a)
  console.log(res)
  console.log(orderedRes.pop() + orderedRes.shift())
}

part2()
  .catch(console.error)
