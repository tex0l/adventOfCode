const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(l => [...l].map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join(''))
    .map(t => parseTransmission(t))

  console.log('version sum', sum(input.map(p => sumSubversions(p))))
}

const sum = array => array.reduce((acc, val) => acc + val, 0)

const product = array => array.reduce((acc, val) => acc * val, 1)


const sumSubversions = ({ V, subpackets = [] }) =>
  V +
  sum(subpackets.map(sumSubversions))

const parseTransmission = decodedTransmission => {
  let cursor = 0
  const V = parseInt(decodedTransmission.slice(cursor, cursor + 3), 2)
  cursor += 3
  const T = parseInt(decodedTransmission.slice(cursor, cursor + 3), 2)
  cursor += 3
  if (T === 4) {
    const groups = []
    let leadingBit = '1'
    while (leadingBit === '1') {
      leadingBit = decodedTransmission[cursor]
      groups.push(decodedTransmission.slice(cursor + 1, cursor + 5))
      cursor += 5
    }
    return { V, T, value: parseInt(groups.join(''), 2), cursor }
  } else {
    const I = parseInt(decodedTransmission.slice(cursor, cursor + 1), 2)
    cursor += 1
    const subpackets = []
    if (I === 0) { // 15-bit number
      const L = parseInt(decodedTransmission.slice(cursor, cursor + 15), 2)
      cursor += 15
      const maxCursor = cursor + L
      while (cursor < maxCursor) {
        const subpacket = parseTransmission(decodedTransmission.slice(cursor))
        cursor += subpacket.cursor
        subpackets.push(subpacket)
      }
    } else { // 11-bit number
      const L = parseInt(decodedTransmission.slice(cursor, cursor + 11), 2)
      cursor += 11
      for (let i = 0; i < L; i++) {
        const subpacket = parseTransmission(decodedTransmission.slice(cursor))
        cursor += subpacket.cursor
        subpackets.push(subpacket)
      }
    }
    if (T === 0) return { V, T, I, cursor, subpackets, value: sum(subpackets.map(({value}) => value)) }
    if (T === 1) return { V, T, I, cursor, subpackets, value: product(subpackets.map(({value}) => value)) }
    if (T === 2) return { V, T, I, cursor, subpackets, value: Math.min(...subpackets.map(({value}) => value)) }
    if (T === 3) return { V, T, I, cursor, subpackets, value: Math.max(...subpackets.map(({value}) => value)) }
    if (subpackets.length !== 2) throw new Error(`Illegal number of subpackets ${subpackets.length} for packet type ${T}`)
    if (T === 5) return { V, T, I, cursor, subpackets, value: subpackets[0].value > subpackets[1].value ? 1 : 0 }
    if (T === 6) return { V, T, I, cursor, subpackets, value: subpackets[0].value < subpackets[1].value ? 1 : 0 }
    if (T === 7) return { V, T, I, cursor, subpackets, value: subpackets[0].value === subpackets[1].value ? 1 : 0 }
    else throw new Error(`Unknown packet type ${T}`)
  }
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(l => [...l].map(char => parseInt(char, 16).toString(2).padStart(4, '0')).join(''))
    .map(t => parseTransmission(t).value)

  console.log(input)
}

part2()
  .catch(console.error)
