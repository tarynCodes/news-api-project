const express = require('express');
const {getTopics} = require("../be-nc-news/controllers/topic-controllers")
const app = express();
const {readApi} = require("../be-nc-news/controllers/api-controllers");
const { getArticleByArticleId } = require("../be-nc-news/controllers/article-controllers")

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', readApi)

app.get('/api/articles/:article_id', getArticleByArticleId)

app.use((err, request, response, next) => {
  if (err.status === 404) {
    response.status(404).send({ msg: 'No article found!' });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === '22P02') {
    response.status(400).send({ msg: 'Bad request, no id found!' });
  }else{
    next(err)
  }
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;