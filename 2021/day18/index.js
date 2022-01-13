const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => JSON.parse(x))
    .reduce((acc, val) => {
      if (acc === null) return val
      const tree = BinaryTree.fromInput([acc, val])
      const treeSnapshot = BinaryTree.fromInput(tree.toString())
      // console.log('reducing', treeSnapshot.toString())
      const reducedTree = reduceTree(tree)
      console.log('reduced ', reducedTree.toString())
      return JSON.parse(reducedTree.toString())
    }, null)

  console.log(computeMagnitude(input))
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n')
    .filter(x => x !== '')
    .map(x => JSON.parse(x))

    const highestMagnitude = Math.max(...input.map((value, index, array) => Math.max(...input.map((otherValue, otherIndex) => index === otherIndex ? 0 : computeMagnitude(JSON.parse(reduceTree(BinaryTree.fromInput([value, otherValue])).toString()))))))

  console.log(highestMagnitude)
}

const computeMagnitude = tree => {
  if (tree instanceof Array) return 3 * computeMagnitude(tree[0]) + 2* computeMagnitude(tree[1])
  else return tree
}

const reduceTree = tree => {
  const deepestLeaf = tree.getDeepestLeaf()
  const leftestLeafWithValue10 = tree.getLeftestLeafWithValueAbove(10)
  if (deepestLeaf.depth > 4) {
    // console.log('for tree', tree.toString(), 'exploding at', `[${deepestLeaf.value},${deepestLeaf.leaf.parent.right.value}]`)
    const left = deepestLeaf.leaf.getFirstLeftAscending()
    const right = deepestLeaf.leaf.parent.right.getFirstRightAscending()
    if (left !== undefined && left !== deepestLeaf.leaf) left.value += deepestLeaf.leaf.value
    if (right !== undefined && right !== deepestLeaf.leaf.parent.right) right.value += deepestLeaf.leaf.parent.right.value
    deepestLeaf.leaf.parent.value = 0
    delete deepestLeaf.leaf.parent.left
    delete deepestLeaf.leaf.parent.right
    return reduceTree(tree)
  } else if (leftestLeafWithValue10 !== undefined) {
    // console.log('for tree', tree.toString(), 'splitting at', `[${leftestLeafWithValue10.value},${leftestLeafWithValue10.leaf.parent.right.value}]`)
    leftestLeafWithValue10.leaf.left = new BinaryTree({value: Math.floor(leftestLeafWithValue10.leaf.value / 2), parent: leftestLeafWithValue10.leaf})
    leftestLeafWithValue10.leaf.right = new BinaryTree({value: Math.ceil(leftestLeafWithValue10.leaf.value / 2), parent: leftestLeafWithValue10.leaf})
    delete leftestLeafWithValue10.leaf.value
    return reduceTree(tree)
  }
  return tree
}

const add = (a, b) => ([a, b])

class BinaryTree {
  constructor (options = {}) {
    this.parent = options.parent
    this.left = options.left
    this.right = options.right
    this.value = options.value
  }

  static fromInput (input) {
    const rootTree = new this()
    if (input instanceof Array) {
      rootTree.left = this.fromInput(input[0])
      rootTree.left.parent = rootTree
      rootTree.right = this.fromInput(input[1])
      rootTree.right.parent = rootTree
    } else rootTree.value = input
    return rootTree
  }

  getDeepestLeaf () {
    if (this.value !== undefined) return { leaf: this, value: this.value, depth: 0 }
    else {
      const left = this.left.getDeepestLeaf()
      const right = this.right.getDeepestLeaf()
      if (left.depth >= right.depth) return { leaf: left.leaf, value: left.value, depth: left.depth + 1}
      else return { leaf: right.leaf, value: right.value, depth: right.depth + 1}
    }
  }

  getLeftestLeafWithValueAbove (value) {
    if (this.value !== undefined && this.value >= value) return { leaf: this, value: this.value, depth: 0 }
    else if (this.value === undefined) {
      const left = this.left.getLeftestLeafWithValueAbove(value)
      if (left) return { leaf: left.leaf, value: left.value, depth: left.depth + 1}
      const right = this.right.getLeftestLeafWithValueAbove(value)
      if (right) return { leaf: right.leaf, value: right.value, depth: right.depth + 1}
    }
  }

  getFirstLeftAscending () {
    if (this.parent === undefined) return
    if (this.parent.right === this) return this.parent.left
    if (this.parent.getFirstLeftAscending()) return this.parent.getFirstLeftAscending().getFirstRightDescending()
  }

  getFirstRightAscending () {
    if (this.parent === undefined) return
    if (this.parent.left === this) return this.parent.right
    if (this.parent.getFirstRightAscending()) return this.parent.getFirstRightAscending().getFirstLeftDescending()
  }

  getFirstRightDescending () {
    if (this.right !== undefined) return this.right.getFirstRightDescending()
    else return this
  }

  getFirstLeftDescending () {
    if (this.left !== undefined) return this.left.getFirstLeftDescending()
    else return this
  }

  toString() {
    if (this.value !== undefined) return `${this.value}`
    else return `[${this.left.toString()},${this.right.toString()}]`
  }
}

const reduce = (number) => {
  if (findMaxDepth(number) >= 4) {
    // explode leftmost such pair

  }
}

part2()
  .catch(console.error)
