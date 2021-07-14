const monk = require('monk')
//const url = 'localhost:27017/ProjectDB'
const url = "mongodb+srv://cinecus:12345@cluster0.yulvt.mongodb.net/ProjectDB?retryWrites=true&w=majority"
var db = monk(url)


module.exports = db