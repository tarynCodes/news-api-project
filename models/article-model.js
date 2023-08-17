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
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "No article found!",
        });
      }
      return article;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT *
   FROM comments WHERE article_id = $1
   ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (newComment, article_id) => {
  const { body, username } = newComment; 
  return db.query(
    `
    INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `,
    [body, username, article_id] 
  ).then((result) => {
    return result.rows[0]
  });
};
exports.updateVotesByArticleId = (article_id, newVotes) => {
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $2
       WHERE article_id = $1
       RETURNING *`, [article_id, newVotes]
    )
    .then((result) => {
      const updatedArticle = result.rows[0];
      if (!updatedArticle) {
        return Promise.reject({
          status: 404,
          msg: "No article found!"
        });
      }
      return updatedArticle;
    });
};

exports.selectUsers = () =>{
  return db.query
  (`SELECT * FROM Users;`)
  .then((result) => {
    return result.rows
  })
}