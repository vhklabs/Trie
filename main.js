var db = global.db;

var ethBlock = require('ethereumjs-block');
var rlp = require('rlp');

var utils = require('./libs/utils');
var trie = require('./libs/trie');

/**
 * Constants
 */
const prefix = utils.stringToHex('h');
const suffix = utils.stringToHex('n');

/**
 * Test leveldb
 */
var blockNumber = 2596315;
var hexBlockNumber = utils.padLeft(utils.decimalToHex(blockNumber), 16);
var keyString = prefix + hexBlockNumber + suffix;
var key = new Buffer(keyString, 'hex');

console.log('Block Number:', key);

db.get(key, function (er, value) {
    if (er) throw new Error(er);

    console.log('Block Hash:', value);

    value = value.toString('hex');
    var keyString = prefix + hexBlockNumber + value;
    var key = new Buffer(keyString, 'hex');

    db.get(key, function (er, value) {
        if (er) throw new Error(er);

        console.log('Raw Block Data:', value);

        var block = new ethBlock.Header(value);
        var stateRoot = block.stateRoot;
        console.log('State Root:', stateRoot);

        // Check state root in db
        trie.checkRoot(stateRoot);

        // Try a recursive function
        // var recurve = function (_root, i) {
        //     db.get(_root, function (er, value) {
        //         if (er) throw new Error(er);
        //         value = rlp.decode(value);
        //         console.log(i, value);

        //         if (value.length == 17) {
        //             recurve(value[0], ++i);
        //         } else {
        //             console.log(value[0].toString('hex').length)
        //             console.log("\n");
        //             value = rlp.decode(value[1]);
        //             console.log(value);

        //             trie.checkRoot(value[2]);
        //         }
        //     });
        // }
        // recurve(stateRoot, 0);

        var address = '0x6512b9E5ed91DbA434E19DBdeC4229bEBEa3e350';
        var keyAddress = utils.getNaked(address);
        trie.getInfoByAddress(stateRoot, keyAddress);
    });
});