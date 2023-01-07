const { decryptXORSingleChar, scoreLikelihood } = require("../utils.js");

async function findCorrectLine() {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('1/4.txt')
    });
    let possibilities = [];
    let highestScore = 0;
    let mostLikely = ""; 
    for await (const line of lineReader) {
        let decrypted = decryptXORSingleChar(Buffer.from(line, 'hex')).decrypted;
        possibilities.push(decrypted);
        // console.log(possibilities);
        // console.log(decrypted);
        let score = scoreLikelihood(decrypted);
        // console.log(score);
        // console.log(mostLikely);
        if (score > highestScore) {
            mostLikely = decrypted;
            highestScore = score;
        }
    }
    console.log(mostLikely);
    // possibilities.map((entry) => console.log(entry));
}


findCorrectLine();
