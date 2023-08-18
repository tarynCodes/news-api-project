const express = require('express');
const {getTopics} = require("../be-nc-news/controllers/topic-controllers.js")
const app = express();
const {readApi} = require("../be-nc-news/controllers/api-controllers.js");
const { postComment, getArticleByArticleId, getCommentsByArticleId, getArticles, changeVotes, deleteCommentById, getUsers } = require("../be-nc-news/controllers/article-controllers.js");
const { psqlErrors, handles404, customErrors } = require('./errors.js');


app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', readApi)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleByArticleId)

app.patch('/api/articles/:article_id', changeVotes)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId )

app.post('/api/articles/:article_id/comments', postComment)

app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteCommentById)


app.use(customErrors)

app.use(handles404)

app.use(psqlErrors) 

app.use((req, res) => {
  res.status(404).send({ msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;