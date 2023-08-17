
const {
  insertComment,
  selectVotesByArticleId,
  selectArticle,
  fetchArticles,
  selectCommentsByArticleId,
} = require("../models/article-model");

exports.getArticles = (request, response, next) => {
  fetchArticles(request.query.sort_by)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  selectArticle(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  Promise.all([
    selectArticle(article_id),
    selectCommentsByArticleId(article_id),
  ])
    .then(([article, comments]) => {
      if (!article) {
        return response.status(404).send({ msg: "No article found!" });
      }
      response.status(200).send({ article, comments });
    })
    .catch((err) => {
      next(err);
    });
};


exports.postComment = (request, response, next) => {
    const {article_id} = request.params
    const newComment = request.body;
    insertComment(newComment, article_id).then((comment) => {
    response.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.addVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  if (typeof inc_votes === 'undefined') {
    selectVotesByArticleId(article_id)
      .then((article) => {
        response.status(200).send(article);
      })
    } else if (typeof inc_votes !== 'number') {
    return response.status(400).send({ msg: "Bad Request, not a number!" });
  }
  selectVotesByArticleId(article_id)
    .then((article) => {
      const newTotalVotes = article.votes + inc_votes;
      return response.status(200).send({...article, votes: newTotalVotes });
    })
    .catch((err) => {
      next(err);
    });
}
