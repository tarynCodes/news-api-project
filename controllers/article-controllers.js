
const {selectArticle} = require("../models/article-model")

exports.getArticleByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    selectArticle(article_id).then((article) => {
        response.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}