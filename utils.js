CHARACTER_FREQ = {
    'a': 0.0651738, 'b': 0.0124248, 'c': 0.0217339, 'd': 0.0349835, 'e': 0.1041442, 'f': 0.0197881, 'g': 0.0158610,
    'h': 0.0492888, 'i': 0.0558094, 'j': 0.0009033, 'k': 0.0050529, 'l': 0.0331490, 'm': 0.0202124, 'n': 0.0564513,
    'o': 0.0596302, 'p': 0.0137645, 'q': 0.0008606, 'r': 0.0497563, 's': 0.0515760, 't': 0.0729357, 'u': 0.0225134,
    'v': 0.0082903, 'w': 0.0171272, 'x': 0.0013692, 'y': 0.0145984, 'z': 0.0007836, ' ': 0.1918182
}

function hexToBase64(hex) {
    return Buffer.from(hex, 'hex').toString('base64');
}

function xor(first, second) {
    // returns xor of first array with second array, element-wise
    return first.map((b, i) => b ^ second[i]);
}

function XORSingleChar(encrypted, char) {
    return xor(encrypted, Buffer.alloc(encrypted.length, char));
}

function XORRepeatingKey(input, key) {
    let numberOfTimesToRepeat = Math.ceil(input.length / key.length);
    let fullKey = Buffer.from(key.repeat(numberOfTimesToRepeat).substring(0, input.length));
    return xor(input, fullKey);
}

function hammingDistance(first, second) {
    // first make them have the same length
    let distance = 0;
    if (first.length > second.length) {
        distance = first.length - second.length;
        first = first.slice(0, second.length);
    } else {
        distance = second.length - first.length;
        second = second.slice(0, first.length);
    }
    let bitDiff = xor(first, second);
    for (byte of bitDiff) {
        while (byte > 0) {
            distance += byte & 1;
            byte = byte >> 1;
        }
    }

    return distance;
}

function scoreLikelihood(str) {
    // console.log(str);
    let res = Array.from(str).reduce((acc, cur) => acc + getScore(cur), 0.);
    // console.log(res);
    // console.log(res);
    res = res / str.length;
    return res;
}

function getScore(letter) {
    letter = letter.toLowerCase();
    // console.log(letter);
    // console.log(letter);
    if (!(letter in CHARACTER_FREQ)) {
        return 0;
    }
    // console.log(CHARACTER_FREQ[letter])
    return CHARACTER_FREQ[letter];
}

function decryptXORSingleChar(encryptedBytes) {
    let mostLikely = "";
    let highScore = 0;
    let key = 0;
    // loop through possible chars
    for (let i = 0; i < 256; i++) {
        let decrypted = XORSingleChar(encryptedBytes, i).toString();
        let score = scoreLikelihood(decrypted);
        if (score > highScore) {
            highScore = score;
            mostLikely = decrypted;
            key = i;
            console.log(key);
        }
    }
    return {decrypted: mostLikely, key: key};
}

function pad(input, bytelength) {
    let bytes = Buffer.from(input);
    let missing = bytelength - bytes.length;
    if (missing < 0) {
        throw new Error("Input longer than bytelength");
    }
    let toInsert = Buffer.alloc(missing).fill(0x04);
    return Buffer.concat([bytes, toInsert]);
}

function padPlain(input, bytelength) {
    let missing = bytelength - input.length;
    if (missing < 0) {
        throw new Error("Input longer than bytelength");
    }
    let toInsert = "\x04".repeat(missing);
    return input + toInsert;
}

module.exports = {hexToBase64: hexToBase64,
                  xor: xor,
                  decryptXORSingleChar: decryptXORSingleChar,
                  XORRepeatingKey: XORRepeatingKey,
                  scoreLikelihood: scoreLikelihood,
                  hammingDistance: hammingDistance,
                  pad: pad,
                  padPlain: padPlain
                }