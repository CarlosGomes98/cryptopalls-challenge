const utils = require('../utils')
const fs = require('fs')

let text = Buffer.from(fs.readFileSync('1/6.txt').toString(), 'base64')

// find keysize
let sizeDistance = [];
for (let keysize = 2; keysize < 41; keysize++) {
    let blocks = [];
    for (let i = 0; i < 4; i++) {
        blocks.push(text.subarray(keysize*i, keysize*(i+1)))
    }

    let total = 0;
    for (let i = 0; i < blocks.length; i++) {
        for (let j = i; j < blocks.length; j++) {
            total += utils.hammingDistance(blocks[i], blocks[j]);
        }
    }
    total = total / 4;
    let distance = total / keysize;
    sizeDistance.push({size: keysize, distance: distance})
}

sizeDistance.sort((a, b) => a.distance - b.distance);

async function decrypt(keySize) {
    // break into blocks and arange
    let blocks = [];
    for (let i = 0; i < keySize; i++) {
        blocks.push([]);
    }

    for (let i = 0; i < text.length; i++) {
        blocks[i % keySize].push(text[i]);
    }

    for (let i = 0; i < keySize; i++) {
        blocks[i] = Buffer.from(blocks[i])
    }

    // solve each one
    let solution = [];
    for (block of blocks) {
        solution.push(utils.decryptXORSingleChar(block).key);
    }
    // console.log(solution);
    let key = Buffer.from(solution).toString();
    console.log(key);
    console.log(utils.XORRepeatingKey(text, key).toString());
}

async function solve() {
    for (let index = 0; index < 1; index++) {
        let keySize = sizeDistance[index].size;
        await decrypt(keySize);
    }
}

solve();