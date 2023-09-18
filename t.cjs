const bycrypt = require('bcryptjs')

let r = "$2a$11$V1B8FlTpRPaiHnQdCb3uxeRdqnC9.T9p1HqZ5IWiAOPDQOHkLBgJW";
console.log(bycrypt.compareSync("123", r)); // true