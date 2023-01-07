const crypto = require('crypto');
const fs = require('fs');

const key = "YELLOW SUBMARINE";

let decipherer = crypto.createDecipheriv('AES-128-ECB', key, '');
let data = fs.readFileSync('1/7.txt').toString();
let decrypted = decipherer.update(data, 'base64', 'utf8');
decrypted += decipherer.final('utf8');
console.log(decrypted);