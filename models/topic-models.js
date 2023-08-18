const db = require("../db/connection")

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows})=> {
        return rows; 
    })
}

exports.checkIfTopicExists = (slug) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1;`, [slug])
    .then(({rows}) => {
        if(rows.length === 0 && slug){
        return Promise.reject({ status: 404, msg: "topic doesn't exist"}) 
        }
        return rows;
    })
    
}