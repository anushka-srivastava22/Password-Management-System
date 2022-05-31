const fs = require('fs')

let data = JSON.parse(fs.readFileSync('package.json', "utf-8"))

data.dependencies.nodemon = "^2.2.10"

console.log(data)

fs.writeFileSync('package.json', JSON.stringify(data))

