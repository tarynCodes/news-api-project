const express = require('express');
const {getTopics} = require("../be-nc-news/controllers/topic-controllers")
const app = express();

app.get('/api/topics', getTopics)


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  });

module.exports = app;