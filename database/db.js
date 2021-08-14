require('dotenv').config()
const monk = require('monk')
const url = process.env.MONGO_URI || 'localhost:27017/ProjectDB'

var db = monk(url)


module.exports = db