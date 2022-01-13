const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'


const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')

  const imageEnhancingAlgorithm = input[0]

  const image = decodeImage(input[1])

  let img = image
  for (let i = 0; i < 25; i++) {
    img = widenImage(img, 10)
    img = enhanceImage(enhanceImage(img, imageEnhancingAlgorithm), imageEnhancingAlgorithm)
    img.pop()
  }

  console.log(countPixels(img))
}


const countPixels = image => image.map(l => l.filter(x => x === '#').length).reduce((acc, val) => acc + val, 0)

const enhanceImage = (image, algorithm) => {
  // const widennedImage = widenImage(image, 15)
  const maxX = image[0].length - 1
  const maxY = image.length - 1

  const newImage = JSON.parse(JSON.stringify(image))

  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      const index = calculate9BitsIndex(image, {x,y})
      newImage[y][x] = algorithm[index]
    }
  }
  return newImage
}

const valueAt = (image, {x, y}) => {
  const maxX = image[0].length - 1
  const maxY = image.length - 1
  if (x < 0 || x > maxX || y < 0 || y > maxY) return '.'
  return image[y][x]
}

const calculate9BitsIndex = (image, { x, y }) => {
  const indexes = [
    {x: x - 1, y: y - 1},
    {x: x, y: y - 1},
    {x: x + 1, y: y - 1},
    {x: x - 1, y: y},
    {x: x, y: y},
    {x: x + 1, y: y},
    {x: x - 1, y: y + 1},
    {x: x, y: y + 1},
    {x: x + 1, y: y + 1}
  ]

  return parseInt(indexes.map(point => valueAt(image, point)).map(x => x === '#' ? '1' : '0').join(''),2)
}

const widenImage = (image, width = 10) => {
  const lengthX = image[0].length
  const lengthY = image.length

  const newImage = new Array(lengthY + 2 * width).fill(0).map(() => new Array(lengthX + 2 * width).fill(0))

  for (let x = 0 ; x < lengthX + 2 * width; x++) {
    for (let y = 0; y < lengthY + 2 * width; y++) {
      newImage[y][x] = valueAt(image, {x: x - width, y: y - width})
    }
  }
  return newImage
}

const decodeImage = rawImage => rawImage.split('\n').map(l => l.split(''))

const encodeImage = image => image.map(l => l.join('')).join('\n')

part1()
  .catch(console.error)

