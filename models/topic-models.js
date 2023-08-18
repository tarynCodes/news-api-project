const db = require("../db/connection")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows})=> {
        return rows; 
    })
}

exports.checkIfTopicExists = (slug) => {
    return db.query(`SELECT * FROM topics;`, [slug]).then(({rows}) => {
        console.log(rows)
        return rows 
    })
}