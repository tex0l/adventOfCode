const fs = require('fs/promises')
const path = require('path')
const inputPath = './input.txt'

const part1 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .map(x => Object.fromEntries(x.replace(/\n/g, ' ').split(' ').filter(z => z !== '').map(y => y.split(':'))))

  console.log(input.filter(passport =>
    passport.hasOwnProperty('byr') &&
    passport.hasOwnProperty('iyr') &&
    passport.hasOwnProperty('eyr') &&
    passport.hasOwnProperty('hgt') &&
    passport.hasOwnProperty('hcl') &&
    passport.hasOwnProperty('ecl') &&
    passport.hasOwnProperty('pid')
  ).length)
}

const part2 = async () => {
  const input = (await fs.readFile(path.join(__dirname, inputPath), 'utf8'))
    .split('\n\n')
    .map(x => Object.fromEntries(x.replace(/\n/g, ' ').split(' ').filter(z => z !== '').map(y => y.split(':'))))

  console.log(input.filter(passport =>
    passport.hasOwnProperty('byr') && /^[0-9]{4}$/.test(passport.byr) && parseInt(passport.byr) >= 1920 && parseInt(passport.byr) <= 2002 &&
    passport.hasOwnProperty('iyr') && /^[0-9]{4}$/.test(passport.iyr) && parseInt(passport.iyr) >= 2010 && parseInt(passport.iyr) <= 2020 &&
    passport.hasOwnProperty('eyr') && /^[0-9]{4}$/.test(passport.eyr) && parseInt(passport.eyr) >= 2020 && parseInt(passport.eyr) <= 2030 &&
    passport.hasOwnProperty('hgt') && ((passport.hgt.endsWith('cm') && passport.hgt.slice(0, 3) >= 150 && passport.hgt.slice(0, 3) <= 193) || (passport.hgt.endsWith('in') && passport.hgt.slice(0, 2) >= 59 && passport.hgt.slice(0, 2) <= 76)) &&
    passport.hasOwnProperty('hcl') && /^#[0-9a-f]{6}$/.test(passport.hcl) &&
    passport.hasOwnProperty('ecl') && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(passport.ecl) &&
    passport.hasOwnProperty('pid') && /^[0-9]{9}$/.test(passport.pid)
  ).length)
}

part2()
  .catch(console.error)
