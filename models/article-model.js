const db = require("../db/connection");

exports.fetchArticles = (topic, sort_by = 'created_at', order = 'desc') => {
  const valueArr = []
  let queryString =
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
  `
  if (!["article_id", "created_at", "votes", "title", "author"].includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  if(topic){
    queryString += ` WHERE topic = $1`
    valueArr.push(topic)
    
  }
    queryString +=`
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`

  return db.query(queryString, valueArr)
  .then((result) => {
    return result.rows
  })
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

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "comment does not exist",
        });
      }
    });
};
