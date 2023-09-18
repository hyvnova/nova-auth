const bcrypt = require('bcryptjs');

let pass = '1234';

let salt = bcrypt.genSaltSync(12);
console.log(salt);

console.log(bcrypt.hashSync(pass, salt));
console.log(bcrypt.hashSync(pass, salt));
