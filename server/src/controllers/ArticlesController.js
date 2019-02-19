const {Post} = require('../models')

module.exports = {
  async postArticle (req, res) {
    try {
        console.log(req.body)
        const article = await Post.create(req.body)
        res.send({
            article: article
        })
    }
    catch (err) {
        res.status(400).send({
            error: 'An error has occured trying to create articles',
            details: err
        })
    }
  },
  async index (req, res) {
    try {
        const articles = await Post.findAll({
          limit: 10
        })
        res.send(articles);   
    }
    catch (err) {
      res.status(400).send({
          error: 'An error has occured trying to get articles',
          details: err
      })
    }
  },
  async preview (req, res) {
    try {
      
    }
    catch (err) {
      res.status(400).send({
        error: 'An error has occured trying to get article previews',
        details: err
    })
    }
  },
  async show (req, res) {
    try {
        const article = await Post.findById(req.params.articleId)
        res.send(article);
    }
    catch (err) {
        res.status(400).send({
            error: 'An error has occured trying to get articles',
            details: err
        })
    }
  },
  async update (req, res) {
    try {
        const article = await Post.update(req.body,{
          where: {
            id: req.params.articleId
          }
        })
        res.send({
          article: article
        });
    }
    catch (err) {
        res.status(400).send({
            error: 'An error has occured trying to update the article',
            details: err
        })
    }
  }
}