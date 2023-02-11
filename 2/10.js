/*
Implement CBC mode

CBC mode is a block cipher mode that allows us to encrypt irregularly-sized messages, despite the fact that a block cipher natively only transforms individual blocks.

In CBC mode, each ciphertext block is added to the next plaintext block before the next call to the cipher core.

The first plaintext block, which has no associated previous ciphertext block, is added to a "fake 0th ciphertext block" called the initialization vector, or IV.

Implement CBC mode by hand by taking the ECB function you wrote earlier, making it encrypt instead of decrypt (verify this by decrypting whatever you encrypt to test), and using your XOR function from the previous exercise to combine them.

The file here is intelligible (somewhat) when CBC decrypted against "YELLOW SUBMARINE" with an IV of all ASCII 0 (\x00\x00\x00 &c) 
*/

const crypto = require('crypto');
const fs = require('fs');
const utils = require('../utils');

const key = "YELLOW SUBMARINE";

function encryptCBC128(input, key, iv) {
    const blockSize = 16;
    let encrypted = []
    for (let i = 0; i < input.length; i += blockSize) {
        let encrypter = crypto.createCipheriv('AES-128-ECB', key, '');
        encrypter.setAutoPadding(false);
        let block = null;
        if (input.length - i < blockSize) {
            block = utils.pad(input.subarray(i), blockSize);
        } else {
            block = input.subarray(i, i+blockSize);
        }
        if (encrypted.length == 0) {
            block = utils.xor(block, iv);
        } else {
            block = utils.xor(block, encrypted.at(-1));
        }

        let encryptedBlock = encrypter.update(block);
        encryptedBlock = Buffer.concat([encryptedBlock, encrypter.final()]);
        encrypted.push(encryptedBlock);
    }

    return Buffer.concat(encrypted);
}

function decryptCBC128(input, key, iv) {
    const blockSize = 16;
    let decrypted = []
    for (let i = 0; i < input.length; i += blockSize) {
        let decrypter = crypto.createDecipheriv('AES-128-ECB', key, '');
        decrypter.setAutoPadding(false);
        let block = input.slice(i, i+blockSize);
        let decryptedBlock = decrypter.update(block);
        
        if (decrypted.length == 0) {
            decryptedBlock = utils.xor(decryptedBlock, iv);
        } else {
            decryptedBlock = utils.xor(decryptedBlock, input.slice(i - 16, i));
        }
        decryptedBlock = Buffer.concat([decryptedBlock, decrypter.final()]);
        decrypted.push(decryptedBlock);
    }

    return Buffer.concat(decrypted);
}

// sanity check

let test = "Never gonna give you up, never gonna let you down";
console.log("Sanity check for encryption")
console.log(`Before: ${test}`);
let enc = encryptCBC128(Buffer.from(test), key, Buffer.alloc(16, 0));
console.log(`Encrypted: ${enc}`);
let dec = decryptCBC128(enc, key, Buffer.alloc(16, 0));
console.log(`Recovered: ${dec.toString()}`);


console.log("Now the real test")
let data = fs.readFileSync('2/10.txt').toString().split("\n").join('');
let decrypted = decryptCBC128(Buffer.from(data, 'base64'), key, Buffer.alloc(16, 0)).toString();
console.log(decrypted)