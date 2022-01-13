const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const entries = input.split('\n')
    .filter(x => x !== '')
    .map(entry =>
      entry.split(' | ')
        .map(x =>
          x.split(' ')
            .map(y => [...y].sort().join(''))
        )
    )
    .map(entry => entry[1].map(x => x.length))
    .map(entry => entry.filter(l => {
      return l === 2 || // segment 1
        l === 4 || // segment 4
        l === 3 || // segment 7
        l === 7 // sgement 8
    }))
    .reduce((acc, val) => acc + val.length, 0)

  console.log(entries)
}

const REFERENCE = [
  'ABCEFG',
  'CF',
  'ACDEG',
  'ACDFG',
  'BCDF',
  'ABDFG',
  'ABDEFG',
  'ACF',
  'ABCDEFG',
  'ABCDFG'
]

const REFERENCE_MAPPING = Object.fromEntries(REFERENCE.map((value, index) => [value, index]))

const ALL_SEGMENTS = new Set(REFERENCE[8])
const all_segments = new Set([...'abcdefg'])

const difference = (setA, setB) => {
  let _difference = new Set(setA)
  for (let elem of setB) {
    _difference.delete(elem)
  }
  return _difference
}

const intersect = (setA, setB) => {
  let _intersection = new Set()
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

const addConstraintToMapping = (mapping, referenceSet, intersection, exclusion) => {
  for (const referenceSegment of ALL_SEGMENTS) {
    if (referenceSet.has(referenceSegment)) mapping[referenceSegment] = intersect(mapping[referenceSegment], intersection)
    else mapping[referenceSegment] = difference(mapping[referenceSegment], exclusion)
  }
}

const findSegmentMapping = allDigits => {
  const segmentSets = allDigits.map(digits => new Set([...digits]))
  const mapping = {
    'A': new Set([...'abcdefg']),
    'B': new Set([...'abcdefg']),
    'C': new Set([...'abcdefg']),
    'D': new Set([...'abcdefg']),
    'E': new Set([...'abcdefg']),
    'F': new Set([...'abcdefg']),
    'G': new Set([...'abcdefg'])
  }
  const one = segmentSets.find(s => s.size === 2)
  const four = segmentSets.find(digit => digit.size === 4)
  const seven = segmentSets.find(digit => digit.size === 3)
  const eight = segmentSets.find(digit => digit.size === 7)

  addConstraintToMapping(mapping, new Set(REFERENCE[1]), one, one)
  addConstraintToMapping(mapping, new Set(REFERENCE[4]), four, four)
  addConstraintToMapping(mapping, new Set(REFERENCE[7]), seven, seven)
  addConstraintToMapping(mapping, new Set(REFERENCE[8]), eight, eight) // useless

  // let's compare how many times segments appear in digits
  const counts = {}
  all_segments.forEach(segment => {
    segmentSets.forEach(set => {
      if (set.has(segment)) counts[segment] = (counts[segment] || 0) + 1
    })
  })

  const COUNTS = {}
  ALL_SEGMENTS.forEach(segment => {
    REFERENCE.forEach(segments => {
      if (segments.includes(segment)) COUNTS[segment] = (COUNTS[segment] || 0) + 1
    })
  })

  Object.entries(counts).forEach(([segment, count]) => {
    addConstraintToMapping(mapping, new Set(Object.entries(COUNTS).filter(([, COUNT]) => count === COUNT).map(([SEGMENT,]) => SEGMENT)), all_segments, new Set(segment))
  })

  return mapping
}

const translateSegmentMapping = mapping => {
  // ensure all sets are of size 1
  if (Object.values(mapping).map(s => s.size).some(size => size !== 1)) throw new Error('Mapping is not complete')
  return Object.fromEntries(Object.entries(REFERENCE_MAPPING).map(([REFERENCE_DIGIT, value]) => {
    let translation = REFERENCE_DIGIT
    Object.entries(mapping).forEach(([REFERENCE_SEGMENT, set]) => {
      translation = translation.replace(REFERENCE_SEGMENT, [...set][0])
    })
    return [[...translation].sort().join(''), value]
  }))
}

const part2 = async () => {
  const input = await fs.readFile(path.join(__dirname, inputPath), 'utf8')
  const entries = input.split('\n')
    .filter(x => x !== '')
    .map(entry =>
      entry.split(' | ')
        .map(x =>
          x.split(' ')
            .map(y => [...y].sort().join(''))
        )
    )

  const result = entries.map(entry => {
    const segmentMapping = findSegmentMapping(entry[0])
    const mapping = translateSegmentMapping(segmentMapping)
    let output = ''
    for (const digit of entry[1]) {
      const sortedDigit = [...digit].sort().join('')
      output += mapping[sortedDigit]
    }
    return parseInt(output, 10)
  })
    .reduce((acc, val) => acc + val, 0)
  console.log(result)
}

part2()
  .catch(console.error)

