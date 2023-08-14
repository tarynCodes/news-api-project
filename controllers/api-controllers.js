const {readFile} = require('fs/promises')

exports.readApi = (request, response, next) => {
readFile('./endpoints.json', 'utf-8')
.then(data => {
    response.status(200).send(JSON.parse(data))
}).catch(next)
}