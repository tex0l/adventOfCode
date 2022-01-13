const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  // input.push('eql z 0')
  let done = false
  let serialNumber = '00000000000000'
  const alreadyTested = new Set()
  while (!done) {
    let z
    if (alreadyTested.has(serialNumber)) {
      z = { min: 1, max: 1 }
    } else {
      const ranges = serialNumber.split('').map(x => parseInt(x)).map(x => x !== 0 ? ({
        type: 'int',
        value: x
      }) : null);
      ({ z } = computeInstructionsFormal(input, { ranges }))
      alreadyTested.add(serialNumber)
    }
    if (z.min <= 0 && z.max >= 0) {
      console.log(serialNumber, 'has 0')
      const idx = [...serialNumber].findIndex(x => x === '0')
      if (idx === -1) done = true
      else {
        serialNumber = [...serialNumber]
        serialNumber[idx] = '9'
        serialNumber = serialNumber.join('')
      }
    } else {
      console.log(serialNumber, 'does not have 0')
      let idx = [...serialNumber].findIndex(x => x === '0')
      if (idx === -1) idx = serialNumber.length - 1
      else idx--
      if (idx === -1) throw new Error('no possible match')
      serialNumber = [...serialNumber]
      serialNumber[idx] = parseInt(serialNumber[idx]) - 1
      serialNumber = serialNumber.join('')
    }
  }

  console.log(serialNumber)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  // input.push('eql z 0')
  let done = false
  let serialNumber = '00000000000000'
  const alreadyTested = new Set()
  while (!done) {
    let z
    if (alreadyTested.has(serialNumber)) {
      throw new Error('somethings wrong')
      z = { min: 1, max: 1 }
    } else {
      const ranges = serialNumber.split('').map(x => parseInt(x)).map(x => x !== 0 ? ({
        type: 'int',
        value: x
      }) : null);
      ({ z } = computeInstructionsFormal(input, { ranges }))
      alreadyTested.add(serialNumber)
    }
    if (z.min <= 0 && z.max >= 0) {
      console.log(serialNumber, 'has 0')
      const newSerialNumber = [...serialNumber]
      const idx = newSerialNumber.findIndex(digit => digit === '0')
      if (idx === -1) done = true
      else newSerialNumber[idx] = '1'
      serialNumber = newSerialNumber.join('')
    } else {
      console.log(serialNumber, 'does not have 0')
      const n0 = [...serialNumber].filter(x => x === '0').length
      serialNumber = (parseInt(serialNumber.replaceAll('0', ' ').trimRight()) + 1).toString().padEnd(14, '0')
      // if ([...serialNumber].filter(x => x === '0').length > n0) throw new Error('wtf')
    }
  }

  console.log(serialNumber)
}

const part1bis = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')

  const serialNumber = '11171181190000'

  const ranges = serialNumber.split('').map(x => parseInt(x)).map(x => x !== 0 ? ({
    type: 'int',
    value: x
  }) : null)

  const { w, x, y, z } = computeInstructionsFormal(input, {
    breakAt: 193,
    ranges
  })
  console.log(y, z)
}

const countDepth = ({ a, b }) => {
  const aDepth = a !== undefined ? 1 + countDepth(a) : 1
  const bDepth = b !== undefined ? 1 + countDepth(b) : 1
  return Math.max(aDepth, bDepth)
}

const computeInstructions = (instructions, inputValue) => {
  const variables = {
    w: 0,
    x: 0,
    y: 0,
    z: 0
  }

  let idx = -1
  const getInputValue = () => {
    idx++
    return parseInt(inputValue[idx])
  }

  const getVariableOrExpression = b => ['w', 'x', 'y', 'z'].includes(b) ? variables[b] : parseInt(b)
  for (const instruction of instructions) {
    const [type, a, b] = instruction.split(' ')
    if (type === 'inp') variables[a] = getInputValue()
    else if (type === 'add') variables[a] = variables[a] + getVariableOrExpression(b)
    else if (type === 'mul') variables[a] = variables[a] * getVariableOrExpression(b)
    else if (type === 'div') {
      if (variables[a] / getVariableOrExpression(b) > 0) variables[a] = Math.floor(variables[a] / getVariableOrExpression(b))
      else variables[a] = Math.ceil(variables[a] / getVariableOrExpression(b))
    } else if (type === 'mod') variables[a] = variables[a] % getVariableOrExpression(b)
    else if (type === 'eql') variables[a] = variables[a] === getVariableOrExpression(b) ? 1 : 0
    else throw new Error('Unknown instruction')
  }
  return variables
}

const getMin = ({ value, type, min }) => {
  if (type === 'int') return value
  if (min !== undefined) return min
}

const getMax = ({ value, type, max }) => {
  if (type === 'int') return value
  if (max !== undefined) return max
}

const computeSum = (...terms) => {
  const flatTerms = []
  for (const term of terms) {
    if (term.type === 'sum') flatTerms.push(...term.terms)
    else flatTerms.push(term)
  }
  const newTerms = flatTerms.filter(({ type }) => type !== 'int')
  const sum = flatTerms.filter(({ type }) => type === 'int').reduce((acc, { value }) => acc + value, 0)
  if (sum !== 0) newTerms.push({ type: 'int', value: sum })

  if (newTerms.length === 1) return newTerms[0]

  const min = newTerms.reduce((acc, value) => acc + getMin(value), 0)
  const max = newTerms.reduce((acc, value) => acc + getMax(value), 0)

  return { type: 'sum', terms: newTerms, min, max }
}

const computeProduct = (...factors) => {
  const flatFactors = []
  for (const factor of factors) {
    if (factor.type === 'mul') flatFactors.push(...factor.factors)
    else flatFactors.push(factor)
  }
  const newFactors = flatFactors.filter(({ type }) => type !== 'int')
  const product = flatFactors.filter(({ type }) => type === 'int').reduce((acc, { value }) => acc * value, 1)
  if (product === 0) return { type: 'int', value: 0 }
  if (product !== 1) newFactors.push({ type: 'int', value: product })

  if (newFactors.length === 1) return newFactors[0]

  if (newFactors.some(factor => factor.type === 'sum')) {
    const sumIndex = newFactors.findIndex(factor => factor.type === 'sum')
    const sum = newFactors.splice(sumIndex, 1)[0]
    return computeSum(...sum.terms.map(term => computeProduct(term, ...newFactors)))
  }

  /* let's assume a number can either be positive or negative */
  newFactors.forEach(factor => {
    if (factor.type !== 'int' && Math.sign(factor.min) + Math.sign(factor.max) === 0) throw new Error('unhandled')
  })

  const sign = newFactors.map(({ type, value, min, max }) =>
    type === 'int'
      ? value
      : Math.sign(min + max)).reduce((acc, val) => acc * val, 1)

  const min = newFactors.map(factor => factor.type === 'int' ? Math.abs(factor.value) : Math.min(Math.abs(factor.min), Math.abs(factor.max))).reduce((acc, val) => acc * val, 1)
  const max = newFactors.map(factor => factor.type === 'int' ? Math.abs(factor.value) : Math.max(Math.abs(factor.min), Math.abs(factor.max))).reduce((acc, val) => acc * val, 1)
  return { type: 'mul', factors, min: sign > 0 ? min : -max, max: sign > 0 ? max : -min }
}

const computeDivision = (a, b) => {
  if (b.type === 'int') {
    if (b.value === 1) return a
    if (a.type === 'int') {
      if (Math.sign(a.value) + Math.sign(b.value) > 0) {
        return {
          type: 'int',
          value: Math.floor(a.value / b.value)
        }
      } else {
        return {
          type: 'int',
          value: Math.ceil(a.value / b.value)
        }
      }
    }
    if (a.type === 'sum') return computeSum(...a.terms.map(term => computeDivision(term, b)))
    if (a.type === 'mul') {
      if (a.factors.some(factor => factor.type === 'int' && factor.value % b.value === 0)) {
        const newFactors = [...a.factors]
        const factorIndex = newFactors.findIndex(factor => factor.type === 'int' && factor.value % b.value === 0)
        newFactors.splice(factorIndex, 1, { type: 'int', value: newFactors[factorIndex].value / b.value })
        return computeProduct(...newFactors)
      }
    }

    const minA = getMin(a)
    const maxA = getMax(a)
    const minB = getMin(b)
    const maxB = getMax(b)

    let min, max

    if (minA * maxA < 0) {
      throw new Error('unhandled')
    }

    if (minB * maxB < 0) {
      throw new Error('unhandled')
    }

    if (minA * minB < 0) {
      min = Math.ceil(maxA / minB)
      max = Math.ceil(minA / maxB)
    } else {
      max = Math.floor(maxA / minB)
      min = Math.floor(minA / maxB)
    }
    if (min === max) return { type: 'int', value: min }
    return { type: 'div', a, b, min, max }
  } else throw new Error('unhandled')
}

const computeModulo = (a, b) => {
  if (b.type === 'int') {
    if (a.type === 'int') return { type: 'int', value: a.value % b.value }
    if (a.type === 'input') return a
    if (a.type === 'eql') return a
    if (a.type === 'mul' && a.factors.some(factor => factor.type === 'int' && factor.value % b.value === 0)) return {
      type: 'int',
      value: 0
    }
    if (a.type === 'sum') return computeSum(...a.terms.map(term => computeModulo(term, b)))

    const minA = getMin(a)
    const maxA = getMax(a)

    if (minA < 0 || maxA < 0) throw new Error('unhandled')

    let min, max

    if (maxA - minA >= b.value || minA % b.value > maxA % b.value) { // TODO: can be optimized, it is actually from 0 to maxA % B.value and from minA % b.value to b.value - 1
      min = 0
      max = b.value - 1
    } else {
      // we know how to convert mod to sum
      return computeSum(a, computeDivision({ type: 'int', value: -(minA % b.value) }, b))
    }
    return { type: 'mod', a, b, min, max }
  } else throw new Error('unhandled')
}

const computeEqual = (a, b) => {
  if (a.type === 'int' && b.type === 'int') return { type: 'int', value: a.value === b.value ? 1 : 0 }

  const minA = getMin(a)
  const maxA = getMax(a)
  const minB = getMin(b)
  const maxB = getMax(b)

  if (minA > maxB || minB > maxA) return { type: 'int', value: 0 }

  return { type: 'eql', a, b, min: 0, max: 1 }
}

const computeInstructionsFormal = (instructions, { breakAt = -1, ranges = {} } = {}) => {
  const variables = {
    w: { type: 'int', value: 0 },
    x: { type: 'int', value: 0 },
    y: { type: 'int', value: 0 },
    z: { type: 'int', value: 0 }
  }

  let idx = -1
  const getInputValue = () => {
    idx++
    if (ranges.hasOwnProperty(idx) && ranges[idx] !== null) return ranges[idx]
    return { type: 'input', value: idx, min: 1, max: 9 }
  }

  const getVariableOrExpression = b => ['w', 'x', 'y', 'z'].includes(b) ? variables[b] : {
    type: 'int',
    value: parseInt(b)
  }
  let i = 0
  for (const instruction of instructions) {
    try {
      i++
      const [type, a, b] = instruction.split(' ')
      if (type === 'inp') variables[a] = getInputValue()
      else if (type === 'add') variables[a] = computeSum(variables[a], getVariableOrExpression(b))
      else if (type === 'mul') variables[a] = computeProduct(variables[a], getVariableOrExpression(b))
      else if (type === 'div') variables[a] = computeDivision(variables[a], getVariableOrExpression(b))
      else if (type === 'mod') variables[a] = computeModulo(variables[a], getVariableOrExpression(b))
      else if (type === 'eql') variables[a] = computeEqual(variables[a], getVariableOrExpression(b))
      else throw new Error('Unknown instruction')
      if (i === breakAt) break

    } catch (error) {
      console.error('at instruction', i)
      console.error(error)
      throw error
    }
  }
  return variables
}

part2()
  .catch(console.error)

