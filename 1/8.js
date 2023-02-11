const fs = require('fs');

async function find() {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream('1/8.txt')
    });
    let totals = [];
    for await (const line of lineReader) {
        let map = new Map();
        let hex = Buffer.from(line, 'hex');
        for (let i = 0; i < hex.length; i += 16) {
            let cur = hex.subarray(i, i+16).toString();
            if (map.has(cur)) {
                map.set(cur, map.get(cur) + 1);
            } else {
                map.set(cur, 0);
            }
        }
        let total = 0;
        for (const [key, value] of map) {
            total += value;
        }
        totals.push(total);
    }

    for (const [index, total] of totals.entries()) {
        if (total > 0) {
            console.log(total, index);
        }
    }
}

find();