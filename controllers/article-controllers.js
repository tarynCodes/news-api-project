
const {selectArticle, fetchArticles, countComments} = require("../models/article-model")

exports.getArticleByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectArticle(article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.getArticles = (request, response, next) => {
    fetchArticles(request.query.sort_by)
    .then((articles) => {
      response.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })

}
