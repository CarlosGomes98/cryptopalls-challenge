/*
An ECB/CBC detection oracle
Now that you have ECB and CBC working:

Write a function to generate a random AES key; that's just 16 random bytes.

Write a function that encrypts data under an unknown key --- that is, a function that generates a random key and encrypts under it.

The function should look like:

encryption_oracle(your-input)
=> [MEANINGLESS JIBBER JABBER]
Under the hood, have the function append 5-10 bytes (count chosen randomly) before the plaintext and 5-10 bytes after the plaintext.

Now, have the function choose to encrypt under ECB 1/2 the time, and under CBC the other half (just use random IVs each time for CBC). Use rand(2) to decide which to use.

Detect the block cipher mode the function is using each time. You should end up with a piece of code that, pointed at a block box that might be encrypting ECB or CBC, tells you which one is happening.
*/

const crypto = require('crypto');
const fs = require('fs');
const utils = require('../utils');
const encryptCBC = require('./10').encryptCBC128;

function generateRandomKey() {
    return crypto.randomBytes(16);
}

function encryptOracle(input) {
    const key = crypto.randomBytes(16);

    // do we encrypt with ECB or CBC?
    const useECB = Math.random() > 0.5;

    // append bytes
    // const bytesToPrepend = crypto.randomBytes(Math.round((Math.random() * 5)) + 5);
    // const bytesToAppend = crypto.randomBytes(Math.round((Math.random() * 5)) + 5);
    // input = Buffer.concat([bytesToPrepend, input, bytesToAppend]);
    if (useECB) {
        console.log("Encrypting with ECB");
        
        let encrypter = crypto.createCipheriv('AES-128-ECB', key, '', {blockSize: 16});
        let encrypted = encrypter.update(input);
        return Buffer.concat([encrypted, encrypter.final()]);
    } else {
        console.log("Encrypting with CBC");
        // return encryptCBC(input, key, crypto.randomBytes(16));
        let encrypter = crypto.createCipheriv('AES-128-CBC', key, crypto.randomBytes(16), {blockSize: 16});
        let encrypted = encrypter.update(input);
        return Buffer.concat([encrypted, encrypter.final()]);
    }
}

/*
The check: The main difference between these two is that, given repeated blocks, ECB will produce repeated outputs, whereas CCB will not!
Since we control what input we pass, we can just force it to deal with repeated blocks.
*/
let input = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
let encrypted = encryptOracle(Buffer.from(input));
let total = 0;
let s = new Set();
for (let i = 0; i < encrypted.length; i+= 16) {
    let block = encrypted.subarray(i, i+16).toString();
    // console.log(block)
    if (s.has(block)) {
        total += 1;
    }
    s.add(block);
}

console.log(`There were ${total} duplicates given the input ${input}`);

if (total > 0) {
    console.log(`I predict encryption was done using ECB`);
} else {
    console.log(`I predict encryption was done using CBC`);
}