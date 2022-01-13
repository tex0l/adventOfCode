const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const regx = /([0-9]) ([a-z]+ [a-z]+) bags?/

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => {
      const [type, content] = l.split(' bags contain ')
      if (content === 'no other bags.') return [type, {}]
      const res = {}
      content.split(',').forEach(rule => {
        if (regx.test(rule)) {
          const regxRes = regx.exec(rule)
          res[regxRes[2]] = parseInt(regxRes[1])
        } else {
          console.error(rule)
          throw new Error('invalid rule')
        }
      })
      return [type, res]
    })

  const result = new Set()
  const typesToCheck = ['shiny gold']

  while (typesToCheck.length > 0) {
    const type = typesToCheck.shift()
    const res = findContainers(input, type)
    for (const _res of res) {
      result.add(_res) // ensure is unique
    }
    typesToCheck.push(...res)
  }

  console.log(result.size)
}


const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(l => l !== '')
    .map(l => {
      const [type, content] = l.split(' bags contain ')
      if (content === 'no other bags.') return [type, {}]
      const res = {}
      content.split(',').forEach(rule => {
        if (regx.test(rule)) {
          const regxRes = regx.exec(rule)
          res[regxRes[2]] = parseInt(regxRes[1])
        } else {
          console.error(rule)
          throw new Error('invalid rule')
        }
      })
      return [type, res]
    })

  const contentOfShinyGold = findContent(input, 'shiny gold')
  delete contentOfShinyGold['shiny gold']
  console.log(Object.values(contentOfShinyGold).reduce((acc, val) => acc + val, 0))
}


const findContainers = (rules, type) => rules
  .filter(([, content]) => Object.keys(content).includes(type))
  .map(([key,]) => key)

const findContent = (rules, type) => {
  const content = Object.fromEntries(rules)[type]
  if (Object.keys(content).length === 0) return {[type]: 1}
  const res = {[type]: 1}
  for (const [bagType, qty] of Object.entries(content)) {
    const subContent = findContent(rules, bagType)
    for (const key in subContent) {
      if (!res.hasOwnProperty(key)) res[key] = 0
      res[key] = res[key] + subContent[key] * qty
    }
  }
  return res
}

part2()
  .catch(console.error)
