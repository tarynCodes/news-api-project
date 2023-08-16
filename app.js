const express = require('express');
const {getTopics} = require("../be-nc-news/controllers/topic-controllers")
const app = express();
const {readApi} = require("../be-nc-news/controllers/api-controllers");
const { postComment, getArticleByArticleId, getCommentsByArticleId, getArticles } = require("../be-nc-news/controllers/article-controllers")


app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', readApi)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleByArticleId)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId )

app.post('/api/articles/:article_id/comments', postComment)

app.use((err, request, response, next) => {
  if (err.status === 404 || err.code === '23503') {
    response.status(404).send({ msg: 'No article found!' });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === '22P02'||err.code === '23502'){
    response.status(400).send({ msg: 'Bad Request!' });
  // } if (){
  //   response.status(400).send({ msg: 'Bad Request!'})
  }else{
    next(err)
  }
})

app.use((err, req, res, next) => {
  if(err.status && err.msg) {
    res.status(err.status).send({msg: err.msg})
  }else{
    next(err)
  }
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;