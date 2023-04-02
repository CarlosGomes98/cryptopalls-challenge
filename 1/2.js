const utils = require('../utils.js')

let firstHex = "1c0111001f010100061a024b53535009181c"
let secondHex = "686974207468652062756c6c277320657965"
const result = "746865206b696420646f6e277420706c6179"

let firstBytes = Buffer.from(firstHex, 'hex')
let secondBytes = Buffer.from(secondHex, 'hex')

let xor = utils.xor(firstBytes, secondBytes)
console.log(xor.toString('hex') == result)