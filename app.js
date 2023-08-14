const express = require('express');
const {getTopics} = require("../be-nc-news/controllers/topic-controllers")
const app = express();
const {readApi} = require("../be-nc-news/controllers/api-controllers")

app.get('/api/topics', getTopics)

app.get('/api', readApi)

app.get('/api/articles/:article_id')

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;