const db = require("../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `
      SELECT
          articles.author,
          title,
          articles.article_id,
          topic,
          articles.created_at,
          articles.votes,
          article_img_url,
          COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC;
  `
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      const article = result.rows[0];
      if (!article || Object.keys.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found!",
        });
      }
      return article;
    });
};
