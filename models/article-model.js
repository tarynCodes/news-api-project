const db = require('../db/connection')

exports.selectArticle = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        const article = result.rows[0];
        if (!article) {
          return Promise.reject({
            status: 404,
            msg: "No article found!",
          });
        }
        return article;
      });
  };