
const {
  insertComment,
  selectArticle,
  fetchArticles,
  selectCommentsByArticleId,
  removeCommentById,
  updateVotesByArticleId,
  selectUsers,
} = require("../models/article-model");
const { checkIfTopicExists } = require("../models/topic-models");

exports.getArticles = (request, response, next) => {
  const {topic, sort_by, order} = request.query;
  Promise.all([fetchArticles(topic, sort_by, order),
  checkIfTopicExists(topic)])
    .then((articles) => {
      response.status(200).send({articles : articles[0]});
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

exports.changeVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
    updateVotesByArticleId(article_id, inc_votes)
      .then((updatedArticle) => {
        response.status(200).send(updatedArticle);
      })
      .catch((err) => {
        next(err);
      });
  }

exports.getUsers = (request, response, next) => {
 selectUsers().then((users) => {
  response.status(200).send({users})
 })
 .catch((err) => {
  next(err)
 })
}

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id).then(() => {
    response.status(204).send();
  }).catch((err) => {
    next(err)
  })
};

