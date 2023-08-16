
const {selectArticle, fetchArticles, selectCommentsByArticleId} = require("../models/article-model")

exports.getArticles = (request, response, next) => {
    fetchArticles(request.query.sort_by)
    .then((articles) => {
      response.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })

}

exports.getArticleByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectArticle(article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

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

}

