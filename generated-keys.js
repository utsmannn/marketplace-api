var bcrypt = require('bcrypt')
var crypto = require('crypto')

const salt = bcrypt.genSaltSync(10)
const secret = crypto.randomBytes(64).toString('hex')

console.log(`salt: ${salt}`)
console.log(`secret: ${secret}`)