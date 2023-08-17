const express = require('express');
const {getTopics} = require("../be-nc-news/controllers/topic-controllers")
const app = express();
const {readApi} = require("../be-nc-news/controllers/api-controllers");
const { postComment, getArticleByArticleId, getCommentsByArticleId, getArticles } = require("../be-nc-news/controllers/article-controllers");
const { psqlErrors, handles404, customErrors } = require('./errors');




app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', readApi)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleByArticleId)
app.patch('/api/articles/:article_id', addVotes)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId )

app.post('/api/articles/:article_id/comments', postComment)



app.use(customErrors)

app.use(handles404)

app.use(psqlErrors) 


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;